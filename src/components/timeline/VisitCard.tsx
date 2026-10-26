<<<<<<< HEAD
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { AppColors } from '@/constants/Colors';
import type { Visit } from '@/src/types';
import { formatTime, formatDuration } from '@/src/utils/time';

interface VisitCardProps {
  visit: Visit;
}

export default function VisitCard({ visit }: VisitCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const label = visit.address ?? `${visit.lat.toFixed(4)}, ${visit.lng.toFixed(4)}`;
  const isOngoing = !visit.departure_at;

  return (
    <View style={styles.row}>
      <View style={styles.timeline}>
        <View style={[styles.dot, { backgroundColor: AppColors.stationary }]} />
        <View style={[styles.line, { backgroundColor: colorScheme === 'dark' ? AppColors.gray700 : AppColors.gray200 }]} />
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <View style={styles.header}>
          <FontAwesome name="map-pin" size={14} color={AppColors.stationary} />
          <Text style={[styles.placeName, { color: theme.text }]} numberOfLines={2}>
            {label}
          </Text>
        </View>

        <View style={styles.details}>
          <Text style={[styles.time, { color: theme.textSecondary }]}>
            {formatTime(visit.arrival_at)}
            {visit.departure_at ? ` - ${formatTime(visit.departure_at)}` : ''}
          </Text>
          <View style={[styles.badge, { backgroundColor: isOngoing ? AppColors.success + '20' : AppColors.stationary + '20' }]}>
            <Text style={[styles.badgeText, { color: isOngoing ? AppColors.success : AppColors.stationary }]}>
              {isOngoing ? 'Currently here' : formatDuration(visit.duration_minutes)}
            </Text>
          </View>
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
import type { Visit } from '@/src/types';
import { formatTime, formatDuration, getDateString } from '@/src/utils/time';

interface VisitCardProps {
  visit: Visit;
  index?: number;
  highlighted?: boolean;
}

export default function VisitCard({ visit, index = 0, highlighted = false }: VisitCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const { selectRoute } = useRouteSelection();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(12)).current;
  const highlightAnim = useRef(new Animated.Value(0)).current;

  const label = visit.address ?? `${visit.lat.toFixed(4)}, ${visit.lng.toFixed(4)}`;
  const isOngoing = !visit.departure_at;
  const validDeparture = !!visit.departure_at && visit.departure_at > visit.arrival_at;
  const displayDuration = Math.max(0, visit.duration_minutes);
  const accentColor = isOngoing ? AppColors.success : AppColors.stationary;

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
      type: 'visit',
      visit,
      dateString: getDateString(visit.arrival_at),
    });
    router.navigate('/(tabs)/map');
  };

  const borderOverlay = highlightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [isDark ? 'rgba(255,255,255,0.06)' : theme.cardBorder, accentColor],
  });

  return (
    <TouchableOpacity activeOpacity={1} onPress={handlePress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.row,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.timeline}>
          <View style={[styles.dot, { backgroundColor: accentColor }]}>
            {isOngoing && <View style={styles.dotInner} />}
          </View>
          <View style={[styles.line, { backgroundColor: isDark ? '#1E293B' : AppColors.gray200 }]} />
        </View>

        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: theme.card,
              borderColor: borderOverlay,
            },
          ]}
        >
          <View style={styles.header}>
            <View style={[styles.titleRow]}>
              <FontAwesome name="map-pin" size={13} color={accentColor} />
              <Text style={[styles.placeName, { color: theme.text }]} numberOfLines={2}>
                {label}
              </Text>
            </View>
            <View
              style={[
                styles.badge,
                { backgroundColor: accentColor + '18' },
              ]}
            >
              {isOngoing && <View style={[styles.liveDot, { backgroundColor: AppColors.success }]} />}
              <Text style={[styles.badgeText, { color: accentColor }]}>
                {isOngoing ? 'Now' : formatDuration(displayDuration)}
              </Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <FontAwesome name="sign-in" size={10} color={theme.textSecondary} />
              <Text style={[styles.statText, { color: theme.textSecondary }]}>
                {formatTime(visit.arrival_at)}
              </Text>
            </View>
            {validDeparture && (
              <>
                <View style={[styles.statDot, { backgroundColor: theme.textSecondary }]} />
                <View style={styles.statItem}>
                  <FontAwesome name="sign-out" size={10} color={theme.textSecondary} />
                  <Text style={[styles.statText, { color: theme.textSecondary }]}>
                    {formatTime(visit.departure_at!)}
                  </Text>
                </View>
              </>
            )}
            <View style={[styles.statDot, { backgroundColor: theme.textSecondary }]} />
            <View style={styles.statItem}>
              <FontAwesome name="hourglass-half" size={10} color={theme.textSecondary} />
              <Text style={[styles.statText, { color: theme.textSecondary }]}>
                {isOngoing && !validDeparture
                  ? formatDuration((Date.now() - visit.arrival_at) / 60000)
                  : formatDuration(displayDuration)}
              </Text>
            </View>
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
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 16,
=======
  row: { flexDirection: 'row' },
  timeline: {
    width: 34,
    alignItems: 'center',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
>>>>>>> adf99c4 (atualização)
  },
  line: {
    width: 2,
    flex: 1,
<<<<<<< HEAD
  },
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
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
    alignItems: 'center',
<<<<<<< HEAD
    marginBottom: 8,
    gap: 8,
=======
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
>>>>>>> adf99c4 (atualização)
  },
  placeName: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
<<<<<<< HEAD
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  time: {
    fontSize: 13,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
=======
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    opacity: 0.5,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 5,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
>>>>>>> adf99c4 (atualização)
  },
});
