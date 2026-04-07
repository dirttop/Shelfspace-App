import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useMemo, useState, useEffect } from 'react';
import { View, Switch, Alert, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';
import AppText from '../common/AppText';
import { supabase } from '@/app/lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type Shelf = {
  id: string;
  name: string;
  display_on_profile: boolean;
};

export type CustomizeShelvesModalProps = {
  userId: string;
  onShelvesUpdated?: () => void;
};

export const CustomizeShelvesModal = forwardRef<BottomSheetModal, CustomizeShelvesModalProps>(
  ({ userId, onShelvesUpdated }, ref) => {
    const insets = useSafeAreaInsets();
    const snapPoints = useMemo(() => ['60%', '90%'], []);
    const [shelves, setShelves] = useState<Shelf[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Track loading state for individual toggles
    const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

    const fetchShelves = useCallback(async () => {
      if (!userId) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('shelves')
        .select('id, name, display_on_profile')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
        
      if (error) {
        Alert.alert('Error', 'Failed to load shelves.');
      } else {
        setShelves(data as Shelf[]);
      }
      setLoading(false);
    }, [userId]);

    const handlePresent = useCallback(() => {
      fetchShelves();
    }, [fetchShelves]);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.3}
          pressBehavior="close"
        />
      ),
      []
    );

    const handleToggle = async (shelf: Shelf) => {
      if (togglingIds.has(shelf.id)) return;

      const newValue = !shelf.display_on_profile;
      
      // Optimistic update
      setShelves(prev => prev.map(s => s.id === shelf.id ? { ...s, display_on_profile: newValue } : s));
      setTogglingIds(prev => new Set(prev).add(shelf.id));

      const { error } = await supabase
        .from('shelves')
        .update({ display_on_profile: newValue })
        .eq('id', shelf.id);

      setTogglingIds(prev => {
        const next = new Set(prev);
        next.delete(shelf.id);
        return next;
      });

      if (error) {
         // Revert on error
         setShelves(prev => prev.map(s => s.id === shelf.id ? { ...s, display_on_profile: !newValue } : s));
         Alert.alert('Error', 'Failed to update shelf visibility.');
      }
    };

    const handleDismiss = useCallback(() => {
      if (onShelvesUpdated) onShelvesUpdated();
    }, [onShelvesUpdated]);

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: 'white' }}
        handleIndicatorStyle={{ backgroundColor: '#A1A1AA', opacity: 0.8 }}
        onChange={(index) => {
          if (index === 0 || index === 1) {
             handlePresent();
          }
        }}
        onDismiss={handleDismiss}
      >
        <View className="flex-1">
          <View className="px-6 pt-2 pb-4 border-b border-gray-100 flex-row items-center justify-between">
              <AppText variant="title">Customize Shelves</AppText>
          </View>
          <BottomSheetScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 24) }}>
            {loading && shelves.length === 0 ? (
              <View className="py-8 items-center justify-center">
                <ActivityIndicator />
              </View>
            ) : (
              <View className="px-4 py-2">
                <AppText variant="caption" className="text-slate-500 mb-4 px-2">
                  Turn on the shelves you want to display on your profile.
                </AppText>
                {shelves.map(shelf => (
                  <TouchableOpacity 
                     key={shelf.id} 
                     className="flex-row items-center justify-between py-4 px-2 border-b border-gray-50"
                     onPress={() => handleToggle(shelf)}
                     disabled={togglingIds.has(shelf.id)}
                  >
                     <AppText variant="body" className="flex-1">{shelf.name}</AppText>
                     {togglingIds.has(shelf.id) ? (
                        <ActivityIndicator size="small" className="mr-2" />
                     ) : (
                        <Switch 
                           value={shelf.display_on_profile} 
                           onValueChange={() => handleToggle(shelf)} 
                           trackColor={{ false: '#d1d5db', true: Colors.primary }}
                        />
                     )}
                  </TouchableOpacity>
                ))}
                {shelves.length === 0 && !loading && (
                   <AppText variant="body" className="text-slate-500 text-center py-4">No shelves found.</AppText>
                )}
              </View>
            )}
          </BottomSheetScrollView>
        </View>
      </BottomSheetModal>
    );
  }
);

CustomizeShelvesModal.displayName = 'CustomizeShelvesModal';
