import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Post } from '@/types/post';

interface UseFeedProps {
  filter: string;
  currentUserId: string | null;
}

export function useFeed({ filter, currentUserId }: UseFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasFriends, setHasFriends] = useState(false);

  const fetchPosts = useCallback(async (isRefreshing = false) => {
    if (isRefreshing) setRefreshing(true);
    else setLoading(true);

    try {
      if (!currentUserId) {
        setPosts([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      const twoWeeksAgoISO = twoWeeksAgo.toISOString();

      // Start building the base query
      // Note: We use !userId to specify the join
      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles!userId(
            id,
            username,
            first_name,
            last_name,
            avatar_url
          ),
          books:book_isbn(
            isbn,
            title,
            authors,
            coverImage:cover_image,
            pageCount:page_count
          ),
          postLikes:postLikes(count),
          comments:comments(count)
        `)
        .gte('created_at', twoWeeksAgoISO)
        .order('created_at', { ascending: false });

      if (filter === 'Friends') {
        const { data: friendsData, error: friendsError } = await supabase
          .from('friends')
          .select('user_id, friend_id')
          .eq('status', 'accepted')
          .or(`user_id.eq.${currentUserId},friend_id.eq.${currentUserId}`);

        if (friendsError) throw friendsError;

        const friendIds = friendsData ? friendsData.map(f => f.user_id === currentUserId ? f.friend_id : f.user_id) : [];
        setHasFriends(friendIds.length > 0);

        const feedUserIds = [...friendIds, currentUserId];
        query = query.in('userId', feedUserIds);
      }

      const { data, error } = await query;
      if (error) throw error;

      // --- OPTIMIZATION (Performance) ---
      // Instead of each card fetching its own "isLiked" status, we fetch them all in one batch call
      if (data && data.length > 0) {
        const postIds = data.map(p => p.id);
        const { data: likesData, error: likesError } = await supabase
          .from('postLikes')
          .select('postId')
          .in('postId', postIds)
          .eq('userId', currentUserId);

        if (!likesError && likesData) {
          const likedPostIds = new Set(likesData.map(l => l.postId));
          const postsWithLikedStatus = data.map(post => ({
            ...post,
            isLiked: likedPostIds.has(post.id)
          })) as Post[];
          setPosts(postsWithLikedStatus);
        } else {
          setPosts(data as unknown as Post[]);
        }
      } else {
        setPosts([]);
      }

    } catch (err) {
      console.error('Error fetching feed:', err);
      setPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter, currentUserId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const refresh = () => fetchPosts(true);

  return {
    posts,
    loading,
    refreshing,
    refresh,
    hasFriends,
    setPosts // Allow local updates (like optimistic likes if we move them here)
  };
}
