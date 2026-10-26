import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { AppColors } from '@/constants/Colors';
import { formatTime, formatDuration } from '@/src/utils/time';

interface GapCardProps {
  startAt: number;
  endAt: number;
  index?: number;
}

export default function GapCard({ startAt, endAt, index = 0 }: GapCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(8)).current;

  const durationMin = Math.max(0, (endAt - startAt) / 60000);

  useEffect(() => {
    const staggerDelay = index < 10 ? index * 60 : 0;
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 260, useNativeDriver: true }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 60,
          useNativeDriver: true,
        }),
      ]).start();
    }, staggerDelay);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={[
        styles.row,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.timeline}>
        <View
          style={[
            styles.line,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : AppColors.gray300,
            },
          ]}
        />
      </View>
      <View
        style={[
          styles.card,
          {
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : theme.cardBorder,
            backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
          },
        ]}
      >
        <FontAwesome
          name="question-circle-o"
          size={13}
          color={theme.textSecondary}
        />
        <View style={styles.textCol}>
          <Text style={[styles.title, { color: theme.textSecondary }]}>
            Gap in tracking
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {formatTime(startAt)} – {formatTime(endAt)} · {formatDuration(durationMin)}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  timeline: {
    width: 34,
    alignItems: 'center',
  },
  line: {
    width: 2,
    flex: 1,
    borderRadius: 1,
    opacity: 0.6,
    borderStyle: 'dashed',
  },
  card: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 11,
    marginTop: 2,
  },
});
