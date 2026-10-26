<<<<<<< HEAD
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
=======
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
>>>>>>> adf99c4 (atualização)
import { AppColors } from '@/constants/Colors';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message }: LoadingSpinnerProps) {
<<<<<<< HEAD
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={AppColors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
=======
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    const rotation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    rotation.start();
    return () => rotation.stop();
  }, [rotateAnim, fadeAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Animated.View
        style={[
          styles.spinner,
          {
            borderColor: isDark ? 'rgba(255,255,255,0.06)' : AppColors.gray200,
            transform: [{ rotate }],
          },
        ]}
      >
        <View style={styles.spinnerArc} />
      </Animated.View>
      {message && (
        <Text style={[styles.message, { color: isDark ? AppColors.gray500 : AppColors.gray400 }]}>
          {message}
        </Text>
      )}
    </Animated.View>
>>>>>>> adf99c4 (atualização)
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
<<<<<<< HEAD
  message: {
    marginTop: 12,
    fontSize: 14,
    color: AppColors.gray500,
=======
  spinner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
  },
  spinnerArc: {
    position: 'absolute',
    top: -3,
    left: -3,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: AppColors.primaryLight,
  },
  message: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: '500',
>>>>>>> adf99c4 (atualização)
  },
});
