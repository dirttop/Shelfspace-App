import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/app/lib/supabase';

export type FriendshipStatus = 'loading' | 'none' | 'pending_sent' | 'pending_received' | 'friends';

export function useFriendship(targetUserId: string | undefined) {
  const [status, setStatus] = useState<FriendshipStatus>('loading');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!targetUserId) {
      setStatus('none');
      return;
    }

    try {
      const { data: userData } = await supabase.auth.getUser();
      const me = userData?.user?.id;
      if (!me) {
         setStatus('none');
         return;
      }
      setCurrentUserId(me);

      if (me === targetUserId) {
         setStatus('none');
         return;
      }

      // Query friendships where me & target
      const { data, error } = await supabase
        .from('friends')
        .select('*')
        .or(`and(user_id.eq.${me},friend_id.eq.${targetUserId}),and(user_id.eq.${targetUserId},friend_id.eq.${me})`)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') {
          console.error("Supabase Error fetching friend status:", error);
        }
        setStatus('none');
        return;
      }

      if (data) {
        if (data.status === 'accepted') {
           setStatus('friends');
        } else if (data.status === 'pending') {
           if (data.user_id === me) {
              setStatus('pending_sent');
           } else {
              setStatus('pending_received');
           }
        } else {
           setStatus('none');
        }
      }
    } catch (err) {
      console.error("Error in fetchStatus", err);
      setStatus('none');
    }
  }, [targetUserId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const addFriend = async () => {
    if (!currentUserId || !targetUserId) return;
    try {
      setStatus('loading');
      const { error } = await supabase.from('friends').insert({
        user_id: currentUserId,
        friend_id: targetUserId,
        status: 'pending'
      });
      
      if (error && error.code !== '23505') throw error; // ignore duplicate
      
      // Send Notification
      await supabase.from('notifications').insert({
        title: 'Friend Request',
        senderId: currentUserId,
        receiverId: targetUserId,
        data: JSON.stringify({ type: 'friend_request' })
      });
      
      setStatus('pending_sent');
    } catch (err) {
      console.error("Error adding friend", err);
      await fetchStatus();
    }
  };

  const acceptRequest = async () => {
    if (!currentUserId || !targetUserId) return;
    try {
      setStatus('loading');
      // current user is friend_id
      const { error } = await supabase.from('friends')
        .update({ status: 'accepted' })
        .eq('user_id', targetUserId)
        .eq('friend_id', currentUserId);
        
      if (error) throw error;
      
      setStatus('friends');
      
      // Send acceptance notification
      await supabase.from('notifications').insert({
        title: 'Friend Request Accepted',
        senderId: currentUserId,
        receiverId: targetUserId,
        data: JSON.stringify({ type: 'friend_accept' })
      });
    } catch (err) {
      console.error("Error accepting request", err);
      await fetchStatus();
    }
  };

  const removeFriend = async () => {
    // Also acts as cancelRequest
    if (!currentUserId || !targetUserId) return;
    try {
      setStatus('loading');
      const { error } = await supabase.from('friends')
        .delete()
        .or(`and(user_id.eq.${currentUserId},friend_id.eq.${targetUserId}),and(user_id.eq.${targetUserId},friend_id.eq.${currentUserId})`);
        
      if (error) throw error;
      
      setStatus('none');
    } catch (err) {
      console.error("Error removing friend", err);
      await fetchStatus();
    }
  };

  return { status, addFriend, acceptRequest, removeFriend };
}
