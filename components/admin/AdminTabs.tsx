'use client'

import { useState } from 'react'
import { LayoutDashboard, Home, BookOpen, Info, Settings, Compass } from 'lucide-react'

const ICON_MAP: Record<string, any> = {
    dashboard: LayoutDashboard,
    home: Home,
    explore: BookOpen,
    about: Info,
    categories: Compass,
    system: Settings
}

interface AdminTabsProps {
    sections: {
        id: string
        label: string
        icon: string // Changed from 'any' to 'string'
        component: React.ReactNode
    }[]
}

export default function AdminTabs({ sections }: AdminTabsProps) {
    const [activeTab, setActiveTab] = useState(sections[0].id)

    return (
        <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Navigation */}
            <aside className="lg:w-64 space-y-2">
                {sections.map((section) => {
                    const Icon = ICON_MAP[section.icon] || Settings
                    return (
                        <button
                            key={section.id}
                            onClick={() => setActiveTab(section.id)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-sm transition-all text-xs tracking-[0.2em] font-sans uppercase border ${activeTab === section.id
                                    ? 'bg-bronze border-bronze text-ivory shadow-lg shadow-bronze/10'
                                    : 'bg-white/5 border-white/5 text-ivory/40 hover:bg-white/10'
                                }`}
                        >
                            <Icon size={16} />
                            {section.label}
                        </button>
                    )
                })}
            </aside>

            {/* Content Area */}
            <main className="flex-1 animate-fade-in min-h-[600px]">
                {sections.find((s) => s.id === activeTab)?.component}
            </main>
        </div>
    )
}
