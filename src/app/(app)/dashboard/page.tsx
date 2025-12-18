"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { Message } from "@/models/user";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessageSchema } from "@/schemas/acceptMessage";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/message-card";

export default function Dashboard() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);

    const handleDeleteMessages = async (messageID: string) => {
        setMessages(messages.filter((message) => String(message._id) !== messageID))
    }

    const { data: session } = useSession()


    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
        defaultValues: {
            acceptMessages: false
        }
    })

    const { register, setValue, watch } = form

    const acceptMessages = watch('acceptMessages')

    const fetchacceptmessages = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const response = await axios.get('/api/accept-messages')
            setValue('acceptMessages', response.data.isReceivingMessages ?? false)
        } catch (error) {
            console.error('Error fetching message acceptance status:', error)
            toast.error('Failed to fetch message acceptance status')
        } finally {
            setIsSwitchLoading(false)
        }
    }, [setValue])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setLoading(true)
        try {
            const response = await axios.get('/api/get-messages')
            setMessages(response.data.messages || [])
            if (refresh) {
                toast.success('Messages refreshed')
            }
        } catch (error) {
            console.error('Error fetching messages:', error)
            toast.error('Failed to fetch messages')
        } finally {
            setLoading(false)
        }

    }, [setLoading, setMessages])

    useEffect(() => {
        if (!session || !session.user) return
        fetchacceptmessages()
        fetchMessages()
    }, [fetchMessages, session, fetchacceptmessages])

    const handleSwitchChange = async () => {
        const originalValue = acceptMessages;
        const nextValue = !originalValue;

        // 1. Optimistically update local UI immediately
        setValue('acceptMessages', nextValue);

        try {
            const response = await axios.post('/api/accept-messages', { acceptMessages: nextValue })
            toast.success(response.data.message || 'Status updated')
        } catch (error) {
            // 2. Revert if the server request fails
            setValue('acceptMessages', originalValue);
            console.error('Error updating message acceptance status:', error)
            toast.error('Failed to update message acceptance status')
        }
    }

    const { username } = session?.user || {}
    const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : ''
    const profileUrl = `${baseUrl}/u/${username}`

    const copytoClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast.success('Profile URL copied to clipboard')
    }

    if (!session || !session.user) {
        return <div className="flex h-screen items-center justify-center text-white bg-black">Please sign in</div>
    }

    return (
        <div className="min-h-screen bg-black text-white py-8">
            <div className="mx-4 md:mx-8 lg:mx-auto p-6 bg-zinc-900 rounded-2xl w-full max-w-6xl border border-zinc-800">
                <h1 className="text-4xl font-bold mb-4 text-white">User Dashboard</h1>

                <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2 text-neutral-200">Copy Your Unique Link</h2>{' '}
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={profileUrl}
                            disabled
                            className="input input-bordered w-full p-2 mr-2 rounded-md border border-zinc-700 bg-zinc-800 text-white"
                        />
                        <Button onClick={copytoClipboard}>Copy</Button>
                    </div>
                </div>

                <div className="mb-4 flex items-center">
                    <Switch
                        checked={acceptMessages}
                        onCheckedChange={handleSwitchChange}
                        disabled={isSwitchLoading} // Only disable during initial fetch
                    />
                    <span className="ml-2 text-neutral-200">
                        Accept Messages: {acceptMessages ? 'On' : 'Off'}
                    </span>
                </div>

                <div className="h-px bg-zinc-700 my-6" />

                <Button
                    className="mt-4 bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                    variant="outline"
                    onClick={(e) => {
                        e.preventDefault();
                        fetchMessages(true);
                    }}
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <RefreshCcw className="h-4 w-4" />
                    )}
                </Button>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {messages.length > 0 ? (
                        messages.map((message) => (
                            <MessageCard
                                key={String(message._id)}
                                message={message}
                                onMessageDelete={handleDeleteMessages}
                            />
                        ))
                    ) : (
                        <p className="text-neutral-400">No messages to display.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
