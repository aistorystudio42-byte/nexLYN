export interface Club {
    id: string;
    name: string;
    slug: string;
    description: string;
    type: string;
    image_url?: string;
    logo_url?: string;
    owner_id: string;
    created_at: string;
}

export interface PaginatedClubs {
    clubs: Club[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
}
