"use client";

import dynamic from "next/dynamic";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useRef } from "react";

const centerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
};

const Dashboard = dynamic(() => import("./components/Dashboard"), {
    ssr: false,
    loading: () => <div style={centerStyle}>Loading...</div>,
});

function AuthGate() {
    const { status } = useSession();
    const redirected = useRef(false);

    useEffect(() => {
        if (status === "unauthenticated" && !redirected.current) {
            redirected.current = true;
            void signIn("cognito");
        }
    }, [status]);

    if (status === "loading") return <div style={centerStyle}>Checking session...</div>;
    if (status !== "authenticated") return <div style={centerStyle}>Redirecting...</div>;

    return <Dashboard />;
}

export default function Home() {
    return <AuthGate />;
}
