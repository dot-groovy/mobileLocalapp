import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { AppColors } from '@/constants/Colors';
import { formatDuration } from '@/src/utils/time';

interface TopPlacesChartProps {
  places: { address: string; total_minutes: number; visit_count: number }[];
}

export default function TopPlacesChart({ places }: TopPlacesChartProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const maxMinutes = Math.max(...places.map(p => p.total_minutes), 1);

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <Text style={[styles.title, { color: theme.text }]}>Top Places</Text>

      {places.length === 0 ? (
        <Text style={[styles.noData, { color: theme.textSecondary }]}>
          No places visited yet
        </Text>
      ) : (
        <View style={styles.list}>
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
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
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
  },
});
