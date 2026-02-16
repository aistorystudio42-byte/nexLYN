export default function SeckilerPage() {
    return (
        <div className="container mx-auto px-8 pt-32 pb-20">
            <div className="max-w-2xl">
                <h1 className="text-5xl font-serif text-ivory mb-6">Seçkiler</h1>
                <p className="text-ivory/60 leading-relaxed font-sans mb-12">
                    Editörlerimizin ve küratörlerimizin özenle seçtiği, haftalık olarak güncellenen tematik koleksiyonlar.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-[4/3] bronze-border glass-card p-6 flex flex-col justify-end group cursor-pointer hover-lift">
                            <div className="text-[10px] tracking-[0.2em] text-bronze mb-2 uppercase">Koleksiyon #{i}</div>
                            <h3 className="text-2xl font-serif text-ivory group-hover:text-bronze-light transition-colors">Yakında Burada</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
