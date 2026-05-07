import {Platform, StatusBar} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

/**
 * Top inset for screen chrome (headers, back). Some Android emulators/devices
 * report 0 from SafeAreaView while content still draws under the status bar /
 * center punch-hole — we combine insets, StatusBar height, a floor, and extra
 * clearance so titles and touch targets are below the camera.
 */
export function useScreenTopInset(): number {
  const insets = useSafeAreaInsets();
  const statusH = StatusBar.currentHeight ?? 0;
  const merged = Math.max(insets.top, statusH);

  if (Platform.OS === 'android') {
    const floor = merged < 12 ? 28 : merged;
    return floor + 20;
  }

  return Math.max(merged, 20) + 8;
}
