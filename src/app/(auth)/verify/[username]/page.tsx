"use client";
import React, { useRef, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { verifySchema } from "@/schemas/verifySchema";

export default function Verify() {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const username = params.username;
    const [issubmitting, setIsSubmitting] = useState(false);

    // State to hold the 6 digits locally before syncing with react-hook-form
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: "",
        },
    });

    // Update the form value whenever otp state changes
    useEffect(() => {
        form.setValue("code", otp.join(""));
    }, [otp, form]);

    const handleChange = (index: number, value: string) => {
        if (/^\d*$/.test(value)) { // Only allow digits
            const newOtp = [...otp];
            // Take the last character if multiple characters are entered (unless pasting handled separately)
            newOtp[index] = value.substring(value.length - 1);
            setOtp(newOtp);

            // Move focus to next input if value is entered
            if (value && index < 5 && inputRefs.current[index + 1]) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            // Move focus to previous input if backspace is pressed on empty input
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
        if (pastedData.every(char => /^\d$/.test(char))) {
            const newOtp = [...otp];
            pastedData.forEach((char, index) => {
                if (index < 6) newOtp[index] = char;
            });
            setOtp(newOtp);
            inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
        }
    };

    const handleSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsSubmitting(true);
        try {
            await axios.post(`/api/verify-code/`, {
                username: username,
                code: data.code,
            });
            toast.success("Verification successful");
            router.replace(`/sign-in`);
        } catch (error) {
            console.error(error);
            toast.error("Verification failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-100 dark:bg-zinc-900">
            <div className="shadow-input w-full max-w-md rounded-none bg-black p-4 md:rounded-2xl md:p-8 dark:bg-black text-white">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 text-white text-center">
                    Verify Your Account
                </h2>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300 text-white text-center mb-2">
                    Enter the 6-digit code sent to your email
                </p>
                <p className="text-[10px] text-neutral-400 dark:text-neutral-500 text-center mb-8 italic">
                    (If you don't see it, please check your spam folder)
                </p>

                <form onSubmit={form.handleSubmit(handleSubmit)} className="my-8">
                    <div className="flex justify-center gap-2 mb-8">
                        {otp.map((digit, index) => (
                            <Input
                                key={index}
                                ref={(el) => { if (el) inputRefs.current[index] = el }}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className="w-12 h-12 text-center text-lg font-bold border-2 focus:border-indigo-500 rounded-md bg-zinc-800 text-white"
                                disabled={issubmitting}
                            />
                        ))}
                    </div>
                    {form.formState.errors.code && (
                        <p className="text-red-500 text-sm text-center -mt-4 mb-4">{form.formState.errors.code.message}</p>
                    )}

                    <button
                        className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
                        type="submit"
                        disabled={issubmitting}
                    >
                        {issubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                                Verifying...
                            </>
                        ) : (
                            "Verify &rarr;"
                        )}
                        <BottomGradient />
                    </button>
                </form>
            </div>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
            <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
        </>
    );
};