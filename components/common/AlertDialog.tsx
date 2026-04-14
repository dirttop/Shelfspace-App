import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { AlertConfig, useAlert } from '@/contexts/AlertContext';
import AppText from '@/components/common/AppText';
import { Colors } from '@/constants/Colors';
import { CheckCircle2, XCircle, AlertTriangle, Info, HelpCircle } from 'lucide-react-native';

// ─── Icon mapping ────────────────────────────────────────────────────────────

function DialogIcon({ icon }: { icon: AlertConfig['icon'] }) {
  const size = 40;
  switch (icon) {
    case 'success':
      return <CheckCircle2 size={size} color={Colors.success} />;
    case 'error':
      return <XCircle size={size} color={Colors.destructive} />;
    case 'warning':
      return <AlertTriangle size={size} color={Colors.warning} />;
    case 'confirm':
      return <HelpCircle size={size} color={Colors.primary} />;
    case 'info':
    default:
      return <Info size={size} color={Colors.primary} />;
  }
}

// ─── Button ──────────────────────────────────────────────────────────────────

function DialogButton({
  text,
  style = 'default',
  onPress,
  isLastButton,
  totalButtons,
}: {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
  isLastButton: boolean;
  totalButtons: number;
}) {
  const isCancel = style === 'cancel';
  const isDestructive = style === 'destructive';
  const isFullWidth = totalButtons === 1;

  const bgColor = isCancel
    ? 'transparent'
    : isDestructive
    ? Colors.destructive
    : Colors.primary;

  const textColor = isCancel ? Colors.mutedForeground : '#fff';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.button,
        isFullWidth && styles.buttonFullWidth,
        !isFullWidth && !isLastButton && styles.buttonWithRightMargin,
        isCancel && styles.buttonCancel,
        { backgroundColor: bgColor },
      ]}
    >
      <AppText
        variant="label"
        style={{ color: textColor, fontWeight: '600', fontSize: 15 }}
      >
        {text}
      </AppText>
    </TouchableOpacity>
  );
}

// ─── Dialog Component ─────────────────────────────────────────────────────────

export function AlertDialog() {
  const { visible, config, hideDialog } = useAlert();

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.88)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(scale, {
          toValue: 1,
          damping: 18,
          stiffness: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 160, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.92, duration: 160, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!config) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={hideDialog}
    >
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={undefined} />
      </Animated.View>

      {/* Card */}
      <View style={styles.centeredContainer} pointerEvents="box-none">
        <Animated.View style={[styles.card, { opacity, transform: [{ scale }] }]}>
          {/* Icon */}
          {config.icon && (
            <View style={styles.iconContainer}>
              <DialogIcon icon={config.icon} />
            </View>
          )}

          {/* Title */}
          <AppText variant="subtitle" style={styles.title}>
            {config.title}
          </AppText>

          {/* Message */}
          {!!config.message && (
            <AppText variant="body" style={styles.message}>
              {config.message}
            </AppText>
          )}

          {/* Buttons */}
          <View
            style={[
              styles.buttonRow,
              config.buttons.length === 1 && styles.buttonRowSingle,
            ]}
          >
            {config.buttons.map((btn, index) => (
              <DialogButton
                key={btn.text}
                text={btn.text}
                style={btn.style}
                onPress={btn.onPress}
                isLastButton={index === config.buttons.length - 1}
                totalButtons={config.buttons.length}
              />
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingTop: 28,
    paddingBottom: 20,
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 6,
    color: Colors.foreground,
  },
  message: {
    textAlign: 'center',
    color: Colors.mutedForeground,
    lineHeight: 22,
    marginBottom: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  buttonRowSingle: {
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonFullWidth: {
    flex: 1,
  },
  buttonWithRightMargin: {},
  buttonCancel: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
  },
});
