<<<<<<< HEAD
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
=======
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
>>>>>>> adf99c4 (atualização)
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { AppColors } from '@/constants/Colors';

interface EmptyStateProps {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  title: string;
  subtitle?: string;
}

export default function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
<<<<<<< HEAD

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: colorScheme === 'dark' ? AppColors.gray800 : AppColors.gray100 }]}>
        <FontAwesome name={icon} size={32} color={AppColors.gray400} />
      </View>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      {subtitle && <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>}
    </View>
=======
  const isDark = colorScheme === 'dark';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 60, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[styles.container, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
    >
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : AppColors.gray50 },
        ]}
      >
        <FontAwesome
          name={icon}
          size={28}
          color={isDark ? AppColors.gray600 : AppColors.gray300}
        />
      </View>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
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
    padding: 32,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
<<<<<<< HEAD
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
=======
    marginBottom: 18,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
>>>>>>> adf99c4 (atualização)
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
<<<<<<< HEAD
=======
    maxWidth: 260,
>>>>>>> adf99c4 (atualização)
  },
});
