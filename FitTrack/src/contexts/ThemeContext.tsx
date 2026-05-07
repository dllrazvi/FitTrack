import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Theme {
  colors: {
    // Primary colors
    primary: string;
    secondary: string;
    accent: string;

    // Background colors
    background: string;
    surface: string;
    card: string;

    // Text colors
    text: string;
    textSecondary: string;
    textMuted: string;

    // Status colors
    success: string;
    warning: string;
    error: string;
    info: string;

    // Border and divider
    border: string;
    divider: string;

    // Input colors
    inputBackground: string;
    inputBorder: string;
    placeholder: string;

    // Button colors
    buttonPrimary: string;
    buttonSecondary: string;
    buttonText: string;

    // Shadow
    shadow: string;
  };

  // Typography
  typography: {
    h1: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
    h2: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
    h3: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
    body: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
    caption: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
  };

  // Spacing
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };

  // Border radius
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

const lightTheme: Theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    accent: '#FF9500',

    background: '#FFFFFF',
    surface: '#F8F9FA',
    card: '#FFFFFF',

    text: '#000000',
    textSecondary: '#6C757D',
    textMuted: '#ADB5BD',

    success: '#28A745',
    warning: '#FFC107',
    error: '#DC3545',
    info: '#17A2B8',

    border: '#E9ECEF',
    divider: '#DEE2E6',

    inputBackground: '#FFFFFF',
    inputBorder: '#CED4DA',
    placeholder: '#6C757D',

    buttonPrimary: '#007AFF',
    buttonSecondary: '#6C757D',
    buttonText: '#FFFFFF',

    shadow: 'rgba(0, 0, 0, 0.1)',
  },

  typography: {
    h1: {fontSize: 32, fontWeight: 'bold', lineHeight: 40},
    h2: {fontSize: 24, fontWeight: 'bold', lineHeight: 32},
    h3: {fontSize: 20, fontWeight: '600', lineHeight: 28},
    body: {fontSize: 16, fontWeight: '400', lineHeight: 24},
    caption: {fontSize: 14, fontWeight: '400', lineHeight: 20},
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
};

const darkTheme: Theme = {
  colors: {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    accent: '#FF9F0A',

    // Soft charcoal stack (readability) — same family as Profile cards / iOS grays
    background: '#121214',
    surface: '#1C1C1E',
    card: '#2C2C2E',

    text: '#F2F2F7',
    textSecondary: '#AEAEB2',
    textMuted: '#8E8E93',

    success: '#30D158',
    warning: '#FFD60A',
    error: '#FF453A',
    info: '#64D2FF',

    border: '#38383A',
    divider: '#48484A',

    inputBackground: '#1C1C1E',
    inputBorder: '#38383A',
    placeholder: '#8E8E93',

    buttonPrimary: '#0A84FF',
    buttonSecondary: '#48484A',
    buttonText: '#FFFFFF',

    shadow: 'rgba(0, 0, 0, 0.3)',
  },

  typography: {
    h1: {fontSize: 32, fontWeight: 'bold', lineHeight: 40},
    h2: {fontSize: 24, fontWeight: 'bold', lineHeight: 32},
    h3: {fontSize: 20, fontWeight: '600', lineHeight: 28},
    body: {fontSize: 16, fontWeight: '400', lineHeight: 24},
    caption: {fontSize: 14, fontWeight: '400', lineHeight: 20},
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const [isDark, setIsDark] = useState(false);

  // Load saved theme after first paint (never return null — that caused a white screen)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (!cancelled && savedTheme) {
          setIsDark(savedTheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const saveTheme = async (theme: 'light' | 'dark') => {
    try {
      await AsyncStorage.setItem('theme', theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    saveTheme(newTheme ? 'dark' : 'light');
  };

  const setTheme = (theme: 'light' | 'dark') => {
    setIsDark(theme === 'dark');
    saveTheme(theme);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{theme, isDark, toggleTheme, setTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};
