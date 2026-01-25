import NextAuth from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

function getSubFromIdToken(idToken) {
    if (!idToken) return undefined;
    const payload = idToken.split(".")[1];
    if (!payload) return undefined;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(Buffer.from(base64, "base64").toString("utf8"));
    return json?.sub;
}

const handler = NextAuth({
    providers: [
        CognitoProvider({
            clientId: process.env.COGNITO_CLIENT_ID,
            clientSecret: process.env.COGNITO_CLIENT_SECRET,
            issuer: process.env.COGNITO_ISSUER,
            checks: ["nonce"],
        }),
    ],
    session: { strategy: "jwt" },
    debug: true, // Włącz debugowanie aby zobaczyć szczegółowe błędy w terminalu
    pages: {
        signIn: '/',
        error: '/', // Przekieruj błędy na stronę główną
    },
    callbacks: {
        async jwt({ token, account, profile }) {
            console.log('[NextAuth JWT Callback]', { 
                hasAccount: !!account, 
                hasProfile: !!profile, 
                profileSub: profile?.sub,
                hasIdToken: !!account?.id_token 
            });
            
            if (profile?.sub) {
                token.sub = profile.sub;
            }
            if (!token.sub && account?.id_token) {
                const sub = getSubFromIdToken(account.id_token);
                if (sub) {
                    token.sub = sub;
                }
            }

            return token;
        },
        async session({ session, token }) {
            console.log('[NextAuth Session Callback]', { 
                hasSession: !!session, 
                hasToken: !!token, 
                tokenSub: token?.sub 
            });
            
            session.user = session.user || {};
            session.user.id = token.sub || null;
            return session;
        },
        async signIn({ user, account, profile }) {
            console.log('[NextAuth SignIn Callback]', { 
                hasUser: !!user, 
                hasAccount: !!account, 
                hasProfile: !!profile 
            });
            return true;
        },
    },
});

export { handler as GET, handler as POST };
