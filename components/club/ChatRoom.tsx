'use client'

import { useState, useEffect, useRef } from 'react'
import { MessagesSquare, Send, User } from 'lucide-react'
import { sendChatMessage } from '@/lib/supabase/actions'

interface Message {
    id: string
    content: string
    created_at: string
    user_id: string
    user?: { email: string }
}

export default function ChatRoom({ clubId, roomId, initialMessages }: { clubId: string, roomId: string, initialMessages: any[] }) {
    const [messages, setMessages] = useState<any[]>(initialMessages)
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || loading) return

        setLoading(true)
        try {
            await sendChatMessage(clubId, roomId, newMessage)
            // In a real app we'd use Supabase Realtime here
            // For now we'll just optimistically add or wait for revalidation (if it was a server action with revalidatePath)
            // But since this is a client component, we'll manually add it for UX
            setMessages([...messages, {
                id: Math.random().toString(),
                content: newMessage,
                created_at: new Date().toISOString(),
                user: { email: 'Siz' }
            }])
            setNewMessage('')
        } catch (error) {
            console.error('Chat error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-[600px] bronze-border glass-card bg-black/40 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <MessagesSquare size={18} className="text-bronze" />
                    <span className="text-[11px] tracking-[0.2em] text-ivory uppercase font-bold"># {roomId}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[9px] text-green-500 tracking-widest font-bold">CANLI BAĞLANTI</span>
                </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar bg-gradient-to-b from-transparent to-black/20">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                        <MessagesSquare size={48} className="mb-4" />
                        <p className="text-xs italic tracking-widest uppercase">Bu kanalda henüz bir fısıltı duyulmadı.</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className="group flex flex-col gap-2 max-w-[80%]">
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] text-bronze uppercase font-bold tracking-widest">
                                    {msg.user?.email || 'Anonim'}
                                </span>
                                <span className="text-[8px] text-ivory/20 font-mono">
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div className="p-4 bg-white/[0.03] border border-white/5 rounded-sm text-sm text-ivory/80 italic font-sans leading-relaxed group-hover:border-bronze/20 transition-all">
                                {msg.content}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-6 border-t border-white/5 bg-white/[0.02]">
                <div className="relative">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Bir mesaj fısıldayın..."
                        className="w-full bg-black/40 border border-white/10 p-4 pr-16 text-xs text-ivory outline-none focus:border-bronze italic transition-all"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !newMessage.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-bronze hover:text-white transition-colors"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </form>
        </div>
    )
}
