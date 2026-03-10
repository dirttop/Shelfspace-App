import { Book } from '@/types/book';
import { gql, useQuery } from '@apollo/client';

interface SearchBooksResponse {
  searchBooks: Array<Omit<Book, 'source'> & { source: string }>;
}

interface SearchBooksVariables {
  query: string;
}

export const SEARCH_BOOKS_QUERY = gql`
  query SearchBooks($query: String!) {
    searchBooks(q: $query) {
      title
      authors
      description
      coverImage
      pageCount
      publisher
      isbn
      source
      releaseYear
    }
  }
`;

export function useBookSearch(query: string) {
  const { data, loading, error } = useQuery<SearchBooksResponse, SearchBooksVariables>(
    SEARCH_BOOKS_QUERY,
    {
      variables: { query },
      skip: !query || query.trim().length === 0,
    }
  );

  if (error) {
    console.error("Apollo Error in useBookSearch:", JSON.stringify(error, null, 2));
  }

  const books: Book[] = 
    data?.searchBooks?.map((book) => {
      let validSource: Book['source'] = 'Google Books';
      
      if (book.source === 'Cache' || book.source === 'Google Books' || book.source === 'Open Library') {
        validSource = book.source as Book['source'];
      }
      
      return {
        ...book,
        source: validSource,
      };
    }) || [];

  return {
    books,
    loading,
    error,
  };
}