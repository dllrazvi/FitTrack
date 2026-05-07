import React from 'react';
import {View, Text, TouchableOpacity, Switch} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';
import {useStyles} from '../hooks/useStyles';

interface DarkModeToggleProps {
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  showLabel = true,
  size = 'medium',
}) => {
  const {isDark, toggleTheme} = useTheme();

  const styles = useStyles(theme => ({
    container: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      paddingVertical: theme.spacing.sm,
    },

    labelContainer: {
      flex: 1,
      marginRight: theme.spacing.md,
    },

    label: {
      fontSize:
        size === 'small'
          ? theme.typography.caption.fontSize
          : theme.typography.body.fontSize,
      fontWeight: '500' as const,
      color: theme.colors.text,
    },

    description: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },

    switchContainer: {
      alignItems: 'center' as const,
    },

    switch: {
      transform:
        size === 'small'
          ? [{scaleX: 0.8}, {scaleY: 0.8}]
          : size === 'large'
          ? [{scaleX: 1.2}, {scaleY: 1.2}]
          : [{scaleX: 1}, {scaleY: 1}],
    },

    icon: {
      fontSize: size === 'small' ? 16 : size === 'large' ? 24 : 20,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
  }));

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={toggleTheme}
      activeOpacity={0.7}>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </Text>
          <Text style={styles.description}>
            {isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          </Text>
        </View>
      )}

      <View style={styles.switchContainer}>
        <Text style={styles.icon}>{isDark ? '🌙' : '☀️'}</Text>
        <Switch
          style={styles.switch}
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{
            false: '#E9ECEF',
            true: '#007AFF',
          }}
          thumbColor={isDark ? '#FFFFFF' : '#FFFFFF'}
        />
      </View>
    </TouchableOpacity>
  );
};
