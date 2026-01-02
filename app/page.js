"use client";

import dynamic from "next/dynamic";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";


const AccessibleLoading = () => (
    <div

        className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-900 text-white p-4"

        role="status"
        aria-live="polite"
    >

        <div className="w-12 h-12 mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />


        <span className="text-lg font-medium text-center">
      Weryfikacja uprawnień administratora...
    </span>

        <span className="sr-only">Proszę czekać. Trwa ładowanie panelu.</span>
    </div>
);


const AccessDenied = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Brak Dostępu</h1>
        <p className="mb-6">Twoje konto nie posiada uprawnień administratora.</p>
        <button
            onClick={() => signIn("cognito")} // Lub wylogowanie signOut()
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-300"
        >
            Przełącz konto
        </button>
    </div>
);


const Dashboard = dynamic(() => import("./components/Dashboard"), {
    loading: () => <AccessibleLoading />,
    ssr: false,
});

function AuthGate() {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {

            void signIn("cognito", { callbackUrl: window.location.href });
        }
    }, [status]);

    // 1. Stan ładowania sesji
    if (status === "loading") {
        return <AccessibleLoading />;
    }

    if (status === "unauthenticated") {
        return <AccessibleLoading />;
    }

    return <Dashboard />;
}

export default function Home() {
    return (
        <main className="antialiased">
            <AuthGate />
        </main>
    );
}