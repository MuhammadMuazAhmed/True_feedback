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
import Card from "@/components/ui/card";

export default function Dashboard() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [iswitchloadingerror, setIswitchloadingerror] = useState(false);


    const handleDeleteMessages = async (messageID: string) => {
        setMessages(messages.filter((message) => String(message._id) !== messageID))
    }

    const { data: session } = useSession()


    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })

    const { register, setValue, watch } = form

    const acceptMessages = watch('acceptMessages')

    const fetchacceptmessages = useCallback(async () => {
        try {
            setLoading(true)
            const response = await axios.get('/api/accept-messages')
            setValue('acceptMessages', response.data.isReceivingMessages)
            setMessages(response.data)
        } catch (error) {
            console.error('Error fetching messages:', error)
            toast.error('Failed to fetch messages')
        } finally {
            setLoading(false)
        }
    }, [setValue])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setLoading(true)
        setIswitchloadingerror(false)
        try {
            const response = await axios.get('/api/get-messages')
            setMessages(response.data.messages || [])
            if (refresh) {
                toast.success('Messages fetched successfully')
            }
        } catch (error) {
            console.error('Error fetching messages:', error)
            toast.error('Failed to fetch messages')
        } finally {
            setLoading(false)
            setIswitchloadingerror(false)
        }

    }, [setLoading, setMessages])

    useEffect(() => {
        if (!session || !session.user) return
        fetchacceptmessages()
        fetchMessages()
    }, [fetchMessages, session, fetchacceptmessages, setValue])

    const handleSwitchChange = async () => {
        try {
            await axios.post('/api/accept-messages', { acceptMessages: !acceptMessages })
            setValue('acceptMessages', !acceptMessages)
            toast.success('Message acceptance status updated')
        } catch (error) {
            console.error('Error fetching messages:', error)
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
        return <div className="flex h-screen items-center justify-center text-zinc-500">Please sign in</div>
    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered w-full p-2 mr-2 rounded-md border border-gray-300 bg-gray-50"
                    />
                    <Button onClick={copytoClipboard}>Copy</Button>
                </div>
            </div>

            <div className="mb-4 flex items-center">
                <Switch
                    {...register('acceptMessages')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={iswitchloadingerror}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessages ? 'On' : 'Off'}
                </span>
            </div>

            <div className="h-px bg-zinc-200 dark:bg-zinc-700 my-6" />

            <Button
                className="mt-4"
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
                        <Card
                            key={String(message._id)}
                            message={message}
                            onMessageDelete={handleDeleteMessages}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    );
}
