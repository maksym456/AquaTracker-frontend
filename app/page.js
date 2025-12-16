"use client";

import dynamic from "next/dynamic";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";

const Dashboard = dynamic(() => import("./components/Dashboard"), {
    loading: () => (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
            }}
        >
            Loading...
        </div>
    ),
    ssr: false,
});

function AuthGate() {
    const { status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            void signIn("cognito");
        }
    }, [status]);

    if (status !== "authenticated") {
        return null;
    }

    return <Dashboard />;
}


export default function Home() {
    return <AuthGate />;
}
