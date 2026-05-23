import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { AppColors } from '@/constants/Colors';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message }: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={AppColors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: AppColors.gray500,
  },
});
