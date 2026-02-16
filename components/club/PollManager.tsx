'use client'

import { useState } from 'react'
import { BarChart3, Check, Users, Lock } from 'lucide-react'
import { voteInPoll } from '@/lib/supabase/actions'

export default function PollManager({ poll, hasVoted, userId }: { poll: any, hasVoted: boolean, userId?: string }) {
    const [loading, setLoading] = useState(false)
    const [selectedOption, setSelectedOption] = useState<string | null>(null)

    const totalVotes = poll.votes?.length || 0
    const results = poll.options.map((opt: any) => {
        const count = poll.votes?.filter((v: any) => v.option_id === opt.id).length || 0
        const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0
        return { ...opt, count, percentage }
    })

    const handleVote = async () => {
        if (!selectedOption || loading || hasVoted) return
        setLoading(true)
        try {
            await voteInPoll(poll.id, selectedOption)
        } catch (error) {
            console.error('Vote error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bronze-border glass-card p-10 space-y-8 bg-black/40 group hover:border-bronze/20 transition-all relative overflow-hidden">
            <div className="absolute -top-10 -right-10 text-white/[0.02] w-48 h-48 rotate-12">
                <BarChart3 size={192} />
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <h4 className="text-xl font-serif text-ivory italic leading-relaxed max-w-lg">{poll.question}</h4>
                    <div className="flex flex-col items-end gap-2">
                        <span className="text-[9px] px-3 py-1 bg-bronze/10 border border-bronze/20 text-bronze tracking-widest font-bold uppercase">AKTİF ANKET</span>
                        <div className="flex items-center gap-2 text-[9px] text-ivory/20 uppercase tracking-widest">
                            <Users size={10} /> {totalVotes} KATILIMCI
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {results.map((opt: any) => (
                        <div key={opt.id} className="relative">
                            <button
                                onClick={() => !hasVoted && setSelectedOption(opt.id)}
                                disabled={hasVoted || loading}
                                className={`
                                    w-full p-5 border text-left text-xs tracking-widest uppercase transition-all rounded-sm flex justify-between items-center group/btn relative overflow-hidden
                                    ${hasVoted ? 'cursor-default border-white/5' : 'border-white/10 hover:border-bronze hover:bg-white/5'}
                                    ${selectedOption === opt.id ? 'border-bronze bg-bronze/5' : ''}
                                `}
                            >
                                {/* Results Progress Bar (Only visible if voted) */}
                                {hasVoted && (
                                    <div
                                        className="absolute left-0 top-0 bottom-0 bg-bronze/10 transition-all duration-1000"
                                        style={{ width: `${opt.percentage}%` }}
                                    />
                                )}

                                <span className={`relative z-10 ${hasVoted ? 'text-ivory/80' : 'text-ivory/60 group-hover/btn:text-ivory'}`}>
                                    {opt.text}
                                </span>

                                {hasVoted ? (
                                    <span className="relative z-10 text-[10px] font-mono text-bronze font-bold">
                                        %{opt.percentage}
                                    </span>
                                ) : (
                                    <div className={`w-4 h-4 rounded-full border transition-all ${selectedOption === opt.id ? 'border-bronze bg-bronze/20' : 'border-white/20 group-hover/btn:border-bronze'}`}>
                                        {selectedOption === opt.id && <Check size={12} className="text-bronze" />}
                                    </div>
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                {!hasVoted && (
                    <button
                        onClick={handleVote}
                        disabled={!selectedOption || loading}
                        className="w-full mt-8 py-4 bg-bronze text-white text-[10px] tracking-[0.4em] uppercase hover:bg-bronze-light transition-all shadow-xl shadow-bronze/20 disabled:opacity-30 disabled:shadow-none font-bold"
                    >
                        {loading ? 'SAYILIYOR...' : 'OYU MÜHÜRLE'}
                    </button>
                )}

                {hasVoted && (
                    <p className="text-[9px] text-ivory/20 tracking-widest uppercase italic text-center mt-6">
                        🔒 KONSENSÜS KATILIMINIZ ARŞİVLENDİ
                    </p>
                )}
            </div>
        </div>
    )
}
