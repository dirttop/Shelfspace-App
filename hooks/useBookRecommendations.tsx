import { useEffect, useState } from 'react';
import { Book } from '@/types/book';
import { gql, useQuery } from '@apollo/client';
import { supabase } from '@/app/lib/supabase';

interface RecommendationsResponse {
  getRecommendations: Array<Omit<Book, 'source'> & { source: string }>;
}

export const GET_RECOMMENDATIONS_QUERY = gql`
  query GetRecommendations($userId: String!, $offset: Int) {
    getRecommendations(userId: $userId, offset: $offset) {
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

export function useBookRecommendations() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.id) {
        setUserId(data.user.id);
      }
    });
  }, []);

  const { data, loading, error, fetchMore, refetch } = useQuery<RecommendationsResponse, { userId: string, offset: number }>(
    GET_RECOMMENDATIONS_QUERY,
    {
      variables: { userId: userId!, offset: 0 },
      skip: !userId,
      fetchPolicy: 'network-only', // Always fetch fresh to prevent stale caching
    }
  );

  const books: Book[] = 
    data?.getRecommendations?.map((book) => {
      let validSource: Book['source'] = 'Google Books';
      if (book.source === 'Cache' || book.source === 'Google Books' || book.source === 'Open Library') {
        validSource = book.source as Book['source'];
      }
      return { ...book, source: validSource };
    }) || [];

  const loadMore = () => {
    if (!loading && books.length > 0) {
      fetchMore({
        variables: { offset: books.length },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || fetchMoreResult.getRecommendations.length === 0) return prev;
          
          // Combine existing books and new books safely by ISBN to absolutely prevent dupes
          const existingIsbns = new Set(prev.getRecommendations.map(b => b.isbn));
          const newBooks = fetchMoreResult.getRecommendations.filter(b => !existingIsbns.has(b.isbn));

          return {
            getRecommendations: [...prev.getRecommendations, ...newBooks]
          };
        }
      });
    }
  };

  return {
    books,
    loading: loading || !userId,
    error,
    loadMore,
    refetch
  };
}
