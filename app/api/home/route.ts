import { NextResponse } from 'next/server'

export async function GET() {
    // Mock performance-focused home data fetch
    return NextResponse.json({
        categories: [
            { id: '1', title: 'Edebiyat', subtitle: 'Tozlu Raflar', cover_url: '' },
            { id: '2', title: 'Felsefe', subtitle: 'Varlık ve Hiçlik', cover_url: '' },
            { id: '3', title: 'Mimari', subtitle: 'Gotik Detaylar', cover_url: '' },
            { id: '4', title: 'Sanat', subtitle: 'Rönesans Esintisi', cover_url: '' },
        ],
        curatorPick: {
            id: 'cp1',
            title: 'Karanlık Romantizm',
            subtitle: 'Haftalık İnceleme',
            cover_url: ''
        }
    })
}
