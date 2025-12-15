"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";

const Navbar = () => {
    const { data: session } = useSession();

    const user: User = session?.user as User;

    return (
        <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <Link href="/" className="text-xl font-bold mb-4 md:mb-0">
                    True Feedback
                </Link>
                {session ? (
                    <>
                        <span className="mr-4">
                            Welcome, {session.user?.username}
                        </span>
                        <button
                            onClick={() => signOut()}
                            className="w-full md:w-auto bg-slate-100 text-black px-6 py-2 rounded-md font-bold hover:bg-slate-200 transition-colors"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link href="/sign-in">
                        <button className="w-full md:w-auto bg-slate-100 text-black px-6 py-2 rounded-md font-bold hover:bg-slate-200 transition-colors">
                            Login
                        </button>
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
