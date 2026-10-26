<<<<<<< HEAD
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { AppColors } from '@/constants/Colors';
import type { Trip, TransportMode } from '@/src/types';
import { formatTime, formatDuration } from '@/src/utils/time';

interface TripCardProps {
  trip: Trip;
}

const modeConfig: Record<TransportMode, { icon: React.ComponentProps<typeof FontAwesome>['name']; color: string; label: string }> = {
  walking: { icon: 'male', color: AppColors.walking, label: 'Walking' },
  driving: { icon: 'car', color: AppColors.driving, label: 'Driving' },
  stationary: { icon: 'pause', color: AppColors.stationary, label: 'Stationary' },
  unknown: { icon: 'question', color: AppColors.gray400, label: 'Unknown' },
};

export default function TripCard({ trip }: TripCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const config = modeConfig[trip.transport_mode] ?? modeConfig.unknown;
  const durationMin = (trip.end_at - trip.start_at) / 60000;

  return (
    <View style={styles.row}>
      <View style={styles.timeline}>
        <View style={[styles.iconCircle, { backgroundColor: config.color + '20' }]}>
          <FontAwesome name={config.icon} size={12} color={config.color} />
        </View>
        <View style={[styles.line, { backgroundColor: colorScheme === 'dark' ? AppColors.gray700 : AppColors.gray200 }]} />
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
        <View style={styles.header}>
          <Text style={[styles.modeLabel, { color: config.color }]}>{config.label}</Text>
          <Text style={[styles.time, { color: theme.textSecondary }]}>
            {formatTime(trip.start_at)} - {formatTime(trip.end_at)}
          </Text>
        </View>
        <View style={styles.stats}>
          <Text style={[styles.stat, { color: theme.text }]}>
            {trip.distance_km.toFixed(1)} km
          </Text>
          <Text style={[styles.statDivider, { color: theme.textSecondary }]}> &middot; </Text>
          <Text style={[styles.stat, { color: theme.text }]}>
            {formatDuration(durationMin)}
          </Text>
        </View>
      </View>
    </View>
=======
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { AppColors } from '@/constants/Colors';
import { useRouteSelection } from '@/src/contexts/RouteSelectionContext';
import { haptic } from '@/src/utils/haptics';
import type { Trip, TransportMode } from '@/src/types';
import { formatTime, formatDuration, getDateString } from '@/src/utils/time';

interface TripCardProps {
  trip: Trip;
  index?: number;
  highlighted?: boolean;
}

const modeConfig: Record<
  TransportMode,
  {
    icon: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
    label: string;
  }
> = {
  walking: { icon: 'street-view', color: AppColors.walking, label: 'Walking' },
  driving: { icon: 'car', color: AppColors.driving, label: 'Driving' },
  stationary: { icon: 'pause-circle', color: AppColors.stationary, label: 'Stopped' },
  unknown: { icon: 'exchange', color: AppColors.gray400, label: 'Movement' },
};

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(2)} km`;
}

function formatPace(km: number, durationMs: number): string | null {
  if (km <= 0 || durationMs <= 0) return null;
  const kmh = km / (durationMs / 3600000);
  if (!Number.isFinite(kmh) || kmh < 0.1) return null;
  return `${kmh.toFixed(1)} km/h`;
}

export default function TripCard({ trip, index = 0, highlighted = false }: TripCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const { selectRoute } = useRouteSelection();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(12)).current;
  const highlightAnim = useRef(new Animated.Value(0)).current;

  const config = modeConfig[trip.transport_mode] ?? modeConfig.unknown;
  const durationMs = trip.end_at - trip.start_at;
  const durationMin = durationMs / 60000;
  const pace = formatPace(trip.distance_km, durationMs);

  useEffect(() => {
    const staggerDelay = index < 10 ? index * 60 : 0;
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
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

  useEffect(() => {
    if (!highlighted) {
      highlightAnim.setValue(0);
      return;
    }
    Animated.sequence([
      Animated.timing(highlightAnim, { toValue: 1, duration: 220, useNativeDriver: false }),
      Animated.delay(1200),
      Animated.timing(highlightAnim, { toValue: 0, duration: 500, useNativeDriver: false }),
    ]).start();
  }, [highlighted, highlightAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    haptic.light();
    selectRoute({
      type: 'trip',
      trip,
      dateString: getDateString(trip.start_at),
    });
    router.navigate('/(tabs)/map');
  };

  const borderOverlay = highlightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [isDark ? 'rgba(255,255,255,0.06)' : theme.cardBorder, config.color],
  });

  return (
    <TouchableOpacity activeOpacity={1} onPress={handlePress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.row,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }, { translateY: slideAnim }] },
        ]}
      >
        <View style={styles.timeline}>
          <View style={[styles.iconCircle, { backgroundColor: config.color + '15' }]}>
            <FontAwesome name={config.icon} size={13} color={config.color} />
          </View>
          <View style={[styles.line, { backgroundColor: isDark ? '#1E293B' : AppColors.gray200 }]} />
        </View>

        <Animated.View
          style={[
            styles.card,
            { backgroundColor: theme.surface, borderColor: borderOverlay },
          ]}
        >
          <View style={styles.header}>
            <View style={[styles.modePill, { backgroundColor: config.color + '12' }]}>
              <Text style={[styles.modeLabel, { color: config.color }]}>{config.label}</Text>
            </View>
            <Text style={[styles.time, { color: theme.textSecondary }]}>
              {formatTime(trip.start_at)} – {formatTime(trip.end_at)}
            </Text>
          </View>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <FontAwesome name="road" size={11} color={config.color} />
              <Text style={[styles.statValue, { color: theme.text }]}>
                {formatDistance(trip.distance_km)}
              </Text>
            </View>
            <View style={[styles.statDot, { backgroundColor: theme.textSecondary }]} />
            <View style={styles.statItem}>
              <FontAwesome name="clock-o" size={11} color={theme.textSecondary} />
              <Text style={[styles.statValue, { color: theme.text }]}>
                {formatDuration(durationMin)}
              </Text>
            </View>
            {pace && (
              <>
                <View style={[styles.statDot, { backgroundColor: theme.textSecondary }]} />
                <View style={styles.statItem}>
                  <FontAwesome name="tachometer" size={11} color={theme.textSecondary} />
                  <Text style={[styles.statValue, { color: theme.text }]}>{pace}</Text>
                </View>
              </>
            )}
          </View>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
>>>>>>> adf99c4 (atualização)
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  row: {
    flexDirection: 'row',
  },
  timeline: {
    width: 32,
    alignItems: 'center',
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
=======
  row: { flexDirection: 'row' },
  timeline: {
    width: 34,
    alignItems: 'center',
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
>>>>>>> adf99c4 (atualização)
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  line: {
    width: 2,
    flex: 1,
<<<<<<< HEAD
  },
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    marginBottom: 8,
=======
    borderRadius: 1,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    marginBottom: 10,
>>>>>>> adf99c4 (atualização)
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
<<<<<<< HEAD
    marginBottom: 4,
  },
  modeLabel: {
    fontSize: 14,
    fontWeight: '600',
=======
    marginBottom: 8,
    gap: 8,
  },
  modePill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  modeLabel: {
    fontSize: 12,
    fontWeight: '700',
>>>>>>> adf99c4 (atualização)
  },
  time: {
    fontSize: 12,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
<<<<<<< HEAD
  },
  stat: {
    fontSize: 13,
    fontWeight: '500',
  },
  statDivider: {
    fontSize: 13,
=======
    flexWrap: 'wrap',
    gap: 7,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  statDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    opacity: 0.5,
>>>>>>> adf99c4 (atualização)
  },
});
