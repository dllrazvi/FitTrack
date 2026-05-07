import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getAuth, onAuthStateChanged} from '@react-native-firebase/auth';
import {
  subscribeUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type UiNotification,
} from '../services/userNotificationsFirestore';

const firebaseAuth = getAuth();

type Ctx = {
  notifications: UiNotification[];
  unreadCount: number;
  panelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  markOneRead: (id: string) => Promise<void>;
};

const NotificationInboxContext = createContext<Ctx | undefined>(undefined);

export function useNotificationInbox(): Ctx {
  const v = useContext(NotificationInboxContext);
  if (!v) {
    throw new Error('useNotificationInbox must be used within NotificationInboxProvider');
  }
  return v;
}

export const NotificationInboxProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<UiNotification[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    let unsubNotif: (() => void) | undefined;
    const off = onAuthStateChanged(firebaseAuth, u => {
      unsubNotif?.();
      unsubNotif = undefined;
      if (!u) {
        setNotifications([]);
        return;
      }
      unsubNotif = subscribeUserNotifications(
        u.uid,
        setNotifications,
        err => console.warn('Notification inbox:', err.message),
      );
    });
    return () => {
      off();
      unsubNotif?.();
    };
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter(n => !n.read).length,
    [notifications],
  );

  const closePanel = useCallback(() => setPanelOpen(false), []);

  const openPanel = useCallback(() => {
    const uid = firebaseAuth.currentUser?.uid;
    if (uid) {
      markAllNotificationsRead(uid).catch(e =>
        console.warn('markAllNotificationsRead', e),
      );
    }
    setPanelOpen(true);
  }, []);

  const markOneRead = useCallback(async (id: string) => {
    const uid = firebaseAuth.currentUser?.uid;
    if (!uid) {
      return;
    }
    try {
      await markNotificationRead(uid, id);
    } catch (e) {
      console.warn('markNotificationRead', e);
    }
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      panelOpen,
      openPanel,
      closePanel,
      markOneRead,
    }),
    [notifications, unreadCount, panelOpen, openPanel, closePanel, markOneRead],
  );

  return (
    <NotificationInboxContext.Provider value={value}>
      {children}
      <Modal
        visible={panelOpen}
        animationType="fade"
        transparent
        onRequestClose={closePanel}>
        <Pressable style={styles.backdrop} onPress={closePanel}>
          <Pressable
            style={[
              styles.dropdown,
              {top: Math.max(insets.top, 8) + 8, right: 12},
            ]}
            onPress={e => e.stopPropagation()}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Notifications</Text>
              <TouchableOpacity onPress={closePanel} hitSlop={12}>
                <Text style={styles.closeX}>×</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.dropdownBody} keyboardShouldPersistTaps="handled">
              {notifications.length === 0 ? (
                <Text style={styles.empty}>No notifications</Text>
              ) : (
                notifications.map(n => (
                  <TouchableOpacity
                    key={n.id}
                    style={[styles.row, !n.read && styles.rowUnread]}
                    onPress={() => markOneRead(n.id)}>
                    <Text style={styles.msg}>{n.message}</Text>
                    <Text style={styles.time}>{n.time}</Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </NotificationInboxContext.Provider>
  );
};

export function NotificationBellIcon({
  onPress,
  unreadCount,
}: {
  onPress: () => void;
  unreadCount: number;
}) {
  return (
    <TouchableOpacity
      style={styles.bellWrap}
      onPress={onPress}
      hitSlop={{top: 16, bottom: 16, left: 16, right: 16}}
      accessibilityRole="button"
      accessibilityLabel="Notifications">
      <Text style={styles.bellIcon}>🔔</Text>
      {unreadCount > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backdrop: {flex: 1, backgroundColor: 'rgba(0,0,0,0.25)'},
  dropdown: {
    position: 'absolute',
    width: 300,
    maxHeight: 400,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  dropdownTitle: {fontSize: 16, fontWeight: '700', color: '#2C3E50'},
  closeX: {fontSize: 22, color: '#95A5A6', paddingHorizontal: 4},
  dropdownBody: {maxHeight: 320},
  row: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rowUnread: {backgroundColor: '#F8FAFC'},
  msg: {fontSize: 14, color: '#2C3E50'},
  time: {fontSize: 11, color: '#95A5A6', marginTop: 4},
  empty: {padding: 20, textAlign: 'center', color: '#95A5A6'},
  bellWrap: {position: 'relative', padding: 4},
  bellIcon: {fontSize: 22},
  badge: {
    position: 'absolute',
    right: -2,
    top: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E74C3C',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {color: 'white', fontSize: 11, fontWeight: '700'},
});
