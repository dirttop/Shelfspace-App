import { useState, useCallback } from 'react';
import { supabase } from '@/app/lib/supabase';
import { useFocusEffect } from 'expo-router';

export function useNotifications(userId: string | null) {
  const [notificationCount, setNotificationCount] = useState(0);

  const fetchNotificationCount = useCallback(async () => {
    if (!userId) return;
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('receiverId', userId);
        
      if (!error && count !== null) {
        setNotificationCount(count);
      }
    } catch (e) {
      console.error('Error fetching notifications:', e);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchNotificationCount();
    }, [fetchNotificationCount])
  );

  return { notificationCount, refreshNotifications: fetchNotificationCount };
}
