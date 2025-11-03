import { useColorScheme } from 'nativewind';
import { THEME } from '../theme/theme';

export const useAppTheme = () => {
  const { colorScheme } = useColorScheme();

  return { theme: THEME[colorScheme ?? 'light'] };
};
