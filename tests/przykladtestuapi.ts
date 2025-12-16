// api.get-lists.smoke.test.ts
// Node 18+ (global fetch). Uruchom: BASE_URL="https://api.aquatracker.com/api/v1" JWT="..." npx tsx api.get-lists.smoke.test.ts
// albo: npx ts-node api.get-lists.smoke.test.ts

type TestResult = {
    name: string;
    ok: boolean;
    status?: number;
    error?: string;
};

const BASE_URL = (process.env.BASE_URL ?? "http://localhost:3001/api/v1").replace(/\/+$/, "");
const JWT = process.env.JWT; // wymagane dla endpointów chronionych
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS ?? 15000);

function url(path: string) {
    if (!path.startsWith("/")) path = "/" + path;
    return `${BASE_URL}${path}`;
}

function authHeaders(): Record<string, string> {
    return JWT ? { Authorization: `Bearer ${JWT}` } : {};
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), ms);
    (p as any).abortController = ac;
    return Promise.race([
        p,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
        ),
    ]).finally(() => clearTimeout(t));
}

async function getJson(path: string, opts?: { auth?: boolean; query?: Record<string, string> }) {
    const qs =
        opts?.query && Object.keys(opts.query).length
            ? "?" + new URLSearchParams(opts.query).toString()
            : "";

    const headers: Record<string, string> = {
        Accept: "application/json",
        ...(opts?.auth ? authHeaders() : {}),
    };

    const p = fetch(url(path + qs), { method: "GET", headers });
    const res = await withTimeout(p, TIMEOUT_MS);
    const ct = res.headers.get("content-type") ?? "";

    let body: any = null;
    if (ct.includes("application/json")) {
        body = await res.json().catch(() => null);
    } else {
        const text = await res.text().catch(() => "");
        body = text;
    }

    return { res, body, ct };
}

function assert(condition: any, message: string) {
    if (!condition) throw new Error(message);
}

async function test(name: string, fn: () => Promise<void>): Promise<TestResult> {
    try {
        await fn();
        return { name, ok: true };
    } catch (e: any) {
        return { name, ok: false, error: e?.message ?? String(e) };
    }
}

async function main() {
    const results: TestResult[] = [];

    // Public list endpoints
    results.push(
        await test("GET /fish (list)", async () => {
            const { res, body, ct } = await getJson("/fish", {
                query: { limit: "5", offset: "0" },
            });
            assert(res.status === 200, `Expected 200, got ${res.status}`);
            assert(ct.includes("application/json"), `Expected JSON, got ${ct}`);
            assert(Array.isArray(body), "Expected array response");
            if (body.length > 0) {
                const item = body[0];
                assert(typeof item?.id === "string", "fish[0].id should be string");
                assert(typeof item?.name === "string", "fish[0].name should be string");
            }
        })
    );

    results.push(
        await test("GET /plants (list)", async () => {
            const { res, body, ct } = await getJson("/plants", {
                query: { limit: "5", offset: "0" },
            });
            assert(res.status === 200, `Expected 200, got ${res.status}`);
            assert(ct.includes("application/json"), `Expected JSON, got ${ct}`);
            assert(Array.isArray(body), "Expected array response");
            if (body.length > 0) {
                const item = body[0];
                assert(typeof item?.id === "string", "plants[0].id should be string");
                assert(typeof item?.name === "string", "plants[0].name should be string");
            }
        })
    );

    // Auth list endpoints (skip if no JWT)
    const authListEndpoints: Array<{
        name: string;
        path: string;
        validate: (body: any) => void;
    }> = [
        {
            name: "GET /aquariums (list my aquariums)",
            path: "/aquariums",
            validate: (body) => {
                assert(Array.isArray(body), "Expected array response");
                if (body.length > 0) {
                    assert(typeof body[0]?.id === "string", "aquariums[0].id should be string");
                    assert(typeof body[0]?.name === "string", "aquariums[0].name should be string");
                }
            },
        },
        {
            name: "GET /aquariums/stats (global stats)",
            path: "/aquariums/stats",
            validate: (body) => {
                assert(body && typeof body === "object" && !Array.isArray(body), "Expected object response");
                assert(typeof body?.totalAquariums === "number", "totalAquariums should be number");
            },
        },
        {
            name: "GET /logs (list logs)",
            path: "/logs",
            validate: (body) => {
                assert(Array.isArray(body), "Expected array response");
                if (body.length > 0) {
                    assert(typeof body[0]?.id === "string", "logs[0].id should be string");
                    assert(typeof body[0]?.actionType === "string", "logs[0].actionType should be string");
                }
            },
        },
        {
            name: "GET /contacts (friends + invitations)",
            path: "/contacts",
            validate: (body) => {
                assert(body && typeof body === "object" && !Array.isArray(body), "Expected object response");
                assert(Array.isArray(body?.friends), "contacts.friends should be array");
                assert(Array.isArray(body?.invitations), "contacts.invitations should be array");
            },
        },
        {
            name: "GET /settings (get settings)",
            path: "/settings",
            validate: (body) => {
                assert(body && typeof body === "object" && !Array.isArray(body), "Expected object response");
                assert(typeof body?.language === "string", "settings.language should be string");
                assert(typeof body?.theme === "string", "settings.theme should be string");
            },
        },
    ];

    if (!JWT) {
        results.push({
            name: "Auth endpoints",
            ok: true,
            error: "Skipped (JWT env var not set) — ustaw JWT aby testować endpointy chronione",
        });
    } else {
        for (const ep of authListEndpoints) {
            results.push(
                await test(ep.name, async () => {
                    const { res, body, ct } = await getJson(ep.path, { auth: true });
                    assert(res.status === 200, `Expected 200, got ${res.status}`);
                    assert(ct.includes("application/json"), `Expected JSON, got ${ct}`);
                    ep.validate(body);
                })
            );
        }
    }

    // Report
    const failed = results.filter((r) => !r.ok);
    const lines: string[] = [];
    lines.push(`BASE_URL=${BASE_URL}`);
    lines.push("");

    for (const r of results) {
        if (r.ok && !r.error) lines.push(`✅ ${r.name}`);
        else if (r.ok && r.error) lines.push(`🟡 ${r.name} — ${r.error}`);
        else lines.push(`❌ ${r.name} — ${r.error ?? "Unknown error"}`);
    }

    console.log(lines.join("\n"));

    if (failed.length > 0) process.exit(1);
}

main().catch((e) => {
    console.error("Fatal:", e);
    process.exit(1);
});
