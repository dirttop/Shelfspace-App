import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

export type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

export type AlertConfig = {
  title: string;
  message?: string;
  buttons: AlertButton[];
  icon?: 'success' | 'error' | 'warning' | 'info' | 'confirm';
};

type AlertContextType = {
  /** Show a simple informational dialog with a single OK button */
  showAlert: (title: string, message?: string, icon?: AlertConfig['icon']) => void;
  /** Show a two-button confirm dialog — typically for destructive actions */
  showConfirm: (
    title: string,
    message: string,
    onConfirm: () => void,
    options?: { confirmText?: string; cancelText?: string; destructive?: boolean }
  ) => void;
  /** Low-level: show any custom dialog config */
  showDialog: (config: AlertConfig) => void;
  hideDialog: () => void;
  config: AlertConfig | null;
  visible: boolean;
};

const AlertContext = createContext<AlertContextType | null>(null);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AlertConfig | null>(null);
  const [visible, setVisible] = useState(false);

  const showDialog = useCallback((cfg: AlertConfig) => {
    setConfig(cfg);
    setVisible(true);
  }, []);

  const hideDialog = useCallback(() => {
    setVisible(false);
    // Keep config briefly so the exit animation can complete
    setTimeout(() => setConfig(null), 300);
  }, []);

  const showAlert = useCallback(
    (title: string, message?: string, icon: AlertConfig['icon'] = 'info') => {
      showDialog({
        title,
        message,
        icon,
        buttons: [
          {
            text: 'OK',
            style: 'default',
            onPress: hideDialog,
          },
        ],
      });
    },
    [showDialog, hideDialog]
  );

  const showConfirm = useCallback(
    (
      title: string,
      message: string,
      onConfirm: () => void,
      options?: { confirmText?: string; cancelText?: string; destructive?: boolean }
    ) => {
      const { confirmText = 'Confirm', cancelText = 'Cancel', destructive = false } = options ?? {};
      showDialog({
        title,
        message,
        icon: destructive ? 'error' : 'confirm',
        buttons: [
          {
            text: cancelText,
            style: 'cancel',
            onPress: hideDialog,
          },
          {
            text: confirmText,
            style: destructive ? 'destructive' : 'default',
            onPress: () => {
              hideDialog();
              onConfirm();
            },
          },
        ],
      });
    },
    [showDialog, hideDialog]
  );

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm, showDialog, hideDialog, config, visible }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error('useAlert must be used within an <AlertProvider>');
  }
  return ctx;
}
