'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingModal({ isNewUser }: { isNewUser: boolean }) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check if user is new and if we haven't shown the modal in this session
        const hasSeenOnboarding = localStorage.getItem('nexlyn_onboarding_seen');

        if (isNewUser && !hasSeenOnboarding) {
            setIsOpen(true);
            dialogRef.current?.showModal();
            localStorage.setItem('nexlyn_onboarding_seen', 'true');
        }
    }, [isNewUser]);

    const handleClose = () => {
        dialogRef.current?.close();
        setIsOpen(false);
    };

    if (!isOpen && !isNewUser) return null;

    return (
        <dialog
            ref={dialogRef}
            className="backdrop:bg-black/80 p-0 rounded-lg border border-[#bda061]/20 bg-[#0d0a0a] text-[#f2ebd9] max-w-md w-full overflow-hidden shadow-2xl"
            style={{
                boxShadow: '0 0 50px rgba(158, 27, 27, 0.2)',
            }}
        >
            <div className="p-8 flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 rounded-full bg-[#9e1b1b]/10 flex items-center justify-center border border-[#9e1b1b]/30">
                    <svg className="w-8 h-8 text-[#c1121f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
                    </svg>
                </div>

                <div>
                    <h2 className="text-2xl font-playfair font-bold text-[#bda061] mb-2">nexLYN'e Katıldınız</h2>
                    <p className="text-[#f2ebd9]/70 font-inter leading-relaxed">
                        Geleceğin dünyasına ilk adımınızı attınız. Şimdi kulüpleri keşfedin veya kendi kulübünüzü kurun.
                    </p>
                </div>

                <button
                    onClick={handleClose}
                    className="w-full py-3 bg-transparent border border-[#9e1b1b] text-[#f2ebd9] uppercase tracking-widest text-sm font-medium hover:bg-[#9e1b1b] transition-all duration-300 rounded"
                    style={{ fontVariant: 'small-caps' }}
                >
                    Hadi Başlayalım
                </button>
            </div>
        </dialog>
    );
}
