"use client";

import React from "react";
import axios, { AxiosError } from "axios";
import { X } from "lucide-react";
import { Message } from "@/models/user";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageID: string) => void;
};

export default function MessageCard({ message, onMessageDelete }: MessageCardProps) {
    const handleDelete = async () => {
        try {
            const response = await axios.delete(`/api/delete-message/${message._id}`);
            toast.success(response.data.message || "Message deleted successfully");
            onMessageDelete(message._id as unknown as string);
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            toast.error(axiosError.response?.data.message || "Failed to delete message");
        }
    };

    return (
        <div className="group/card relative h-auto w-full rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-6 shadow-sm transition-all hover:shadow-md hover:border-zinc-700">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-3">
                    <p className="text-lg font-medium leading-relaxed text-neutral-200">
                        {message.content}
                    </p>
                    <p className="text-xs text-neutral-500 font-mono">
                        {new Date(message.createdAt).toLocaleString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true
                        })}
                    </p>
                </div>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-neutral-400 hover:bg-red-900/20 hover:text-red-400 transition-colors"
                        >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Delete message</span>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-zinc-950 border-zinc-800">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-zinc-100">Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription className="text-zinc-400">
                                This action cannot be undone. This will permanently delete this message
                                from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="bg-zinc-900 text-zinc-300 hover:bg-zinc-800">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-red-600 text-white hover:bg-red-700"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}