"use client";
import React from "react";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { cn } from "../../../lib/utils";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signupSchema } from "../../../schemas/signupSchema";
import axios from "axios";
import { Loader2 } from "lucide-react";
// import {
//   IconBrandGithub,
//   IconBrandGoogle,
//   IconBrandOnlyfans,
// } from "@tabler/icons-react";

export default function SignupFormDemo() {
    const [username, setUsername] = useState("")
    const [usernamemessage, setUsernameMessage] = useState("")
    const [ischeckingusername, setIsCheckingUsername] = useState(false)
    const [issubmitting, setIsSubmitting] = useState(false)

    const debounced = useDebounceCallback(setUsername, 1000)
    const router = useRouter()

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    })
    useEffect(() => {
        const checkUsername = async () => {
            if (username) {
                setIsCheckingUsername(true)
                setUsernameMessage("")
                try {
                    const res = await axios.get(`/api/user-name-validation?username=${username}`)
                    {
                        setUsernameMessage(res.data.message)
                        setIsCheckingUsername(false)
                    }
                } catch (error) {
                    console.log(error)
                    setUsernameMessage("username not available")
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUsername()
    }, [username])

    const handleSubmit = async (data: z.infer<typeof signupSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post('/api/sign-up', data)
            toast.success("Signup successful")
            router.replace(`/verify/${username}`)
        } catch (error) {
            console.log(error)
            toast.error("Signup failed")
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
        <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-black p-4 md:rounded-2xl md:p-8 dark:bg-black text-white my-3 min-h-[calc(87vh-80px)]">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 text-white">
                Welcome to True Feedback
            </h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 text-white">
                Login to True Feedback if you can because we don&apos;t have a login flow
                yet
            </p>


            <form {...form} onSubmit={form.handleSubmit(handleSubmit)} className="my-8">
                <div className="mb-4">
                    <LabelInputContainer>
                        <div className="flex justify-between items-center">
                            <Label htmlFor="username">Username</Label>
                            {ischeckingusername && <Loader2 className="h-4 w-4 animate-spin text-neutral-500" />}
                            {!ischeckingusername && usernamemessage && (
                                <p
                                    className={`text-sm ${usernamemessage === "Username is available"
                                        ? "text-green-500"
                                        : "text-red-500"
                                        }`}
                                >
                                    {usernamemessage}
                                </p>
                            )}
                        </div>
                        <Controller
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        debounced(e.target.value);
                                    }}
                                    placeholder="projectmayhem"
                                />
                            )}
                        />
                    </LabelInputContainer>
                </div>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Email Address</Label>
                    <Controller
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="projectmayhem@fc.com"
                            />
                        )}
                    />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Controller
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="••••••••"
                                type="password"
                            />
                        )}
                    />

                </LabelInputContainer>

                <button
                    className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
                    type="submit"
                    disabled={issubmitting}
                >
                    {
                        issubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait...
                            </>) : (
                            "Sign up;"
                        )
                    }
                    <BottomGradient />
                </button>

                <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

                {/* <div className="flex flex-col space-y-4">
          <button
            className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
            type="submit"
          >
            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              GitHub
            </span>
            <BottomGradient />
          </button>
          <button
            className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
            type="submit"
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Google
            </span>
            <BottomGradient />
          </button>
          <button
            className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
            type="submit"
          >
            <IconBrandOnlyfans className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              OnlyFans
            </span>
            <BottomGradient />
          </button> */}
                {/* </div> */}
            </form>
            <div className="mt-4 text-center text-sm text-neutral-600 dark:text-neutral-300">
                Already have an account?{" "}
                <Link href="/sign-in" className="font-medium text-white dark:text-neutral-200">
                    Sign in
                </Link>
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

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex w-full flex-col space-y-2", className)}>
            {children}
        </div>
    );
};