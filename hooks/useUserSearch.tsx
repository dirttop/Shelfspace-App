import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/app/lib/supabase';

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  bio?: string;
  avatar_url?: string;
  read_count?: number;
  reading_count?: number;
  shelved_count?: number;
  post_count?: number;
  friend_count?: number;
  follow_count?: number;
}

export function useUserSearch(query: string) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!query || query.trim().length === 0) {
      setUsers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchTerm = `%${query.trim()}%`;
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, username, bio, avatar_url, read_count, reading_count, shelved_count, post_count, friend_count, follow_count")
        .or(`username.ilike.${searchTerm},first_name.ilike.${searchTerm},last_name.ilike.${searchTerm}`)
        .limit(20);

      if (fetchError) {
        throw fetchError;
      }

      setUsers(data || []);
    } catch (err: any) {
      console.error("Supabase Error in useUserSearch:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
}
