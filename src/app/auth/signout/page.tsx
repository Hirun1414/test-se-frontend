'use client';

import { signOut } from 'next-auth/react';

export default function SignoutPage() {
    return (
        <main className="flex min-h-screen items-center justify-center">
            <div className="bg-[#2d2d2d] rounded-3xl px-12 py-10 flex flex-col items-center gap-5 w-96">
                <h1 className="text-white text-3xl font-semibold">Signout</h1>
                <p className="text-gray-400 text-base text-center">Are you sure you want to sign out?</p>
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl text-lg font-medium transition-colors"
                >
                    Sign out
                </button>
            </div>
        </main>
    );
}