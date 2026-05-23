export const AppColors = {
  primary: '#0891B2',
  primaryLight: '#22D3EE',
  primaryDark: '#0E7490',

  walking: '#10B981',
  driving: '#F59E0B',
  stationary: '#8B5CF6',
  transit: '#3B82F6',

  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',

  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
};

const tintColorLight = AppColors.primary;
const tintColorDark = AppColors.primaryLight;

export default {
  light: {
    text: AppColors.gray900,
    textSecondary: AppColors.gray500,
    background: '#FFFFFF',
    surface: AppColors.gray50,
    border: AppColors.gray200,
    tint: tintColorLight,
    tabIconDefault: AppColors.gray400,
    tabIconSelected: tintColorLight,
    card: '#FFFFFF',
    cardBorder: AppColors.gray100,
  },
  dark: {
    text: AppColors.gray50,
    textSecondary: AppColors.gray400,
    background: AppColors.gray900,
    surface: AppColors.gray800,
    border: AppColors.gray700,
    tint: tintColorDark,
    tabIconDefault: AppColors.gray500,
    tabIconSelected: tintColorDark,
    card: AppColors.gray800,
    cardBorder: AppColors.gray700,
  },
};
