export type Book = {
    title: string;
    authors: string[];
    description: string;
    coverImage?: string;
    pageCount?: number;
    publisher?: string;
    isbn?: string;
    source: 'Cache' | 'Google Books' | 'Open Library';
    globalRating?: number;
    releaseDate?: string;
};
