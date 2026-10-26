<<<<<<< HEAD
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
=======
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
>>>>>>> adf99c4 (atualização)
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { AppColors } from '@/constants/Colors';
import { formatDuration } from '@/src/utils/time';

interface TopPlacesChartProps {
  places: { address: string; total_minutes: number; visit_count: number }[];
<<<<<<< HEAD
}

export default function TopPlacesChart({ places }: TopPlacesChartProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const maxMinutes = Math.max(...places.map(p => p.total_minutes), 1);

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
=======
  delay?: number;
}

const RANK_COLORS = [AppColors.primaryLight, AppColors.walking, AppColors.driving];

export default function TopPlacesChart({ places, delay = 0 }: TopPlacesChartProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const maxMinutes = Math.max(...places.map(p => p.total_minutes), 1);
  const trackColor = isDark ? 'rgba(255,255,255,0.06)' : AppColors.gray100;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 60,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: isDark ? 'rgba(255,255,255,0.06)' : theme.cardBorder,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
>>>>>>> adf99c4 (atualização)
      <Text style={[styles.title, { color: theme.text }]}>Top Places</Text>

      {places.length === 0 ? (
        <Text style={[styles.noData, { color: theme.textSecondary }]}>
          No places visited yet
        </Text>
      ) : (
        <View style={styles.list}>
<<<<<<< HEAD
          {places.map((place, idx) => (
            <View key={idx} style={styles.placeItem}>
              <View style={styles.placeHeader}>
                <View style={styles.placeNameRow}>
                  <FontAwesome name="map-pin" size={12} color={AppColors.primary} style={styles.pin} />
                  <Text style={[styles.placeName, { color: theme.text }]} numberOfLines={1}>
                    {place.address}
                  </Text>
                </View>
                <Text style={[styles.placeTime, { color: theme.textSecondary }]}>
                  {formatDuration(place.total_minutes)}
                </Text>
              </View>
              <View style={[styles.progressOuter, { backgroundColor: colorScheme === 'dark' ? AppColors.gray700 : AppColors.gray200 }]}>
                <View
                  style={[
                    styles.progressInner,
                    { width: `${(place.total_minutes / maxMinutes) * 100}%` },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
=======
          {places.map((place, idx) => {
            const ratio = place.total_minutes / maxMinutes;
            const accentColor = RANK_COLORS[idx] ?? AppColors.gray400;
            return (
              <View key={idx} style={styles.placeItem}>
                <View style={styles.placeRow}>
                  <View style={[styles.rankBadge, { backgroundColor: accentColor + '15' }]}>
                    <Text style={[styles.rankText, { color: accentColor }]}>{idx + 1}</Text>
                  </View>
                  <Text
                    style={[styles.placeName, { color: theme.text }]}
                    numberOfLines={1}
                  >
                    {place.address}
                  </Text>
                  <Text style={[styles.placeTime, { color: theme.textSecondary }]}>
                    {formatDuration(place.total_minutes)}
                  </Text>
                </View>
                <View style={[styles.progressOuter, { backgroundColor: trackColor }]}>
                  <View
                    style={[
                      styles.progressInner,
                      {
                        width: `${Math.round(ratio * 100)}%`,
                        backgroundColor: accentColor,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>
      )}
    </Animated.View>
>>>>>>> adf99c4 (atualização)
  );
}

const styles = StyleSheet.create({
  card: {
<<<<<<< HEAD
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    marginBottom: 12,
=======
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    marginBottom: 16,
>>>>>>> adf99c4 (atualização)
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
<<<<<<< HEAD
    marginBottom: 16,
  },
  noData: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
  list: {
    gap: 14,
  },
  placeItem: {
    gap: 6,
  },
  placeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  pin: {
    marginRight: 6,
  },
  placeName: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  placeTime: {
    fontSize: 12,
  },
  progressOuter: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressInner: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: AppColors.primary,
=======
    marginBottom: 18,
    letterSpacing: 0.2,
  },
  noData: {
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 22,
  },
  list: {
    gap: 16,
  },
  placeItem: {
    gap: 8,
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rankText: {
    fontSize: 11,
    fontWeight: '700',
  },
  placeName: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  placeTime: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressOuter: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginLeft: 34,
  },
  progressInner: {
    height: '100%',
    borderRadius: 2,
>>>>>>> adf99c4 (atualização)
  },
});
