"use client";

import { useParams } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function SendMessagePage() {
    const params = useParams();
    const username = params.username as string;

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAllowed, setIsAllowed] = useState(false);


    const fetchUser = async () => {
        try {
            const res = await axios.get(`/api/send-message?username=${username}`);
            setIsAllowed(true);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "User not available");
            setIsAllowed(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (username) fetchUser();
    }, [username]);

    const validateMessage = (content: string) => {
        if (!content || content.trim().length === 0) {
            toast.error("Message cannot be empty");
            return false;
        }

        if (content.length > 500) {
            toast.error("Message is too long (max 500 characters)");
            return false;
        }

        return true;
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget; // Store form reference before async operation
        const formData = new FormData(form);
        const content = formData.get("content") as string;

        if (!validateMessage(content)) return;

        setIsSubmitting(true);

        try {
            await axios.post("/api/send-message", {
                username,
                content,
            });

            toast.success("Message sent successfully 🎉");
            form.reset(); // Use stored reference instead of e.currentTarget
        } catch (error: any) {

            toast.error(error?.response?.data?.message || "Failed to send message");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        );
    }

    if (!isAllowed) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-black p-4 md:rounded-2xl md:p-8 dark:bg-black text-white">
                    <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 text-white">
                        User Not Available
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300 text-white">
                        This user is not accepting messages at the moment.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center py-12">
            <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-black p-4 md:rounded-2xl md:p-8 dark:bg-black text-white">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 text-white">
                    Send Anonymous Message
                </h2>
                <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 text-white">
                    Send an anonymous message to @{username}
                </p>

                <form onSubmit={handleSubmit} className="my-8">
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="content">Your Message</Label>
                        <Textarea
                            name="content"
                            id="content"
                            placeholder="Write your anonymous message here... (max 500 characters)"
                            required
                            maxLength={500}
                        />
                    </LabelInputContainer>

                    <button
                        className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                                Sending...
                            </>
                        ) : (
                            "Send Message"
                        )}
                        <BottomGradient />
                    </button>

                    <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

                    <p className="text-center text-xs text-neutral-600 dark:text-neutral-400">
                        Your message will be sent anonymously
                    </p>
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
