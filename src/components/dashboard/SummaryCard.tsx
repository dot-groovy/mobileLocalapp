<<<<<<< HEAD
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
=======
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Svg, { Circle } from 'react-native-svg';
>>>>>>> adf99c4 (atualização)
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { AppColors } from '@/constants/Colors';
import type { DailySummary } from '@/src/types';
import { formatDuration } from '@/src/utils/time';

interface SummaryCardProps {
  summary: DailySummary | null;
<<<<<<< HEAD
}

interface StatItemProps {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
  value: string;
  color: string;
  textColor: string;
  secondaryColor: string;
}

function StatItem({ icon, label, value, color, textColor, secondaryColor }: StatItemProps) {
  return (
    <View style={styles.statItem}>
      <FontAwesome name={icon} size={18} color={color} />
      <Text style={[styles.statValue, { color: textColor }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: secondaryColor }]}>{label}</Text>
=======
  delay?: number;
}

function ProgressRing({
  progress,
  size = 76,
  strokeWidth = 5,
  color = AppColors.primaryLight,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const colorScheme = useColorScheme() ?? 'light';
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(progress, 0), 1);
  const offset = circumference * (1 - clamped);
  const trackColor = colorScheme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={trackColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {clamped > 0 && (
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      )}
    </Svg>
  );
}

function StatBlock({
  icon,
  value,
  unit,
  label,
  color,
  theme,
}: {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  value: string;
  unit?: string;
  label: string;
  color: string;
  theme: any;
}) {
  return (
    <View style={styles.statBlock}>
      <View style={[styles.statIconCircle, { backgroundColor: color + '12' }]}>
        <FontAwesome name={icon} size={14} color={color} />
      </View>
      <View style={styles.valueRow}>
        <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
        {unit && <Text style={[styles.statUnit, { color: theme.textSecondary }]}> {unit}</Text>}
      </View>
      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{label}</Text>
>>>>>>> adf99c4 (atualização)
    </View>
  );
}

<<<<<<< HEAD
export default function SummaryCard({ summary }: SummaryCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const totalTime = summary
    ? summary.walking_min + summary.driving_min + summary.stationary_min
    : 0;

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <Text style={[styles.title, { color: theme.text }]}>Today's Summary</Text>

      <View style={styles.statsRow}>
        <StatItem
          icon="map-marker"
          label="Places"
          value={summary ? `${summary.places_count}` : '0'}
          color={AppColors.stationary}
          textColor={theme.text}
          secondaryColor={theme.textSecondary}
        />
        <StatItem
          icon="road"
          label="Distance"
          value={summary ? `${summary.total_distance_km.toFixed(1)} km` : '0 km'}
          color={AppColors.primary}
          textColor={theme.text}
          secondaryColor={theme.textSecondary}
        />
        <StatItem
          icon="clock-o"
          label="Active"
          value={formatDuration(totalTime)}
          color={AppColors.walking}
          textColor={theme.text}
          secondaryColor={theme.textSecondary}
        />
      </View>
    </View>
=======
export default function SummaryCard({ summary, delay = 0 }: SummaryCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const total = summary
    ? summary.walking_min + summary.stationary_min
    : 0;
  const active = summary?.walking_min ?? 0;
  const activeRatio = total > 0 ? active / total : 0;
  const walkedKm = summary?.total_distance_km ?? 0;
  const distanceValue = walkedKm < 1
    ? Math.round(walkedKm * 1000).toString()
    : walkedKm.toFixed(2);
  const distanceUnit = walkedKm < 1 ? 'm' : 'km';

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
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: theme.text }]}>Today's Activity</Text>
        <View style={[styles.liveBadge, { backgroundColor: AppColors.success + '15' }]}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Live</Text>
        </View>
      </View>

      <View style={styles.ringSection}>
        <View style={styles.ringWrapper}>
          <ProgressRing progress={activeRatio} />
          <View style={styles.ringCenter}>
            <Text style={[styles.ringPercent, { color: theme.text }]}>
              {Math.round(activeRatio * 100)}
            </Text>
            <Text style={[styles.ringPercentSign, { color: theme.textSecondary }]}>%</Text>
          </View>
        </View>
        <View style={styles.ringInfo}>
          <Text style={[styles.ringLabel, { color: theme.textSecondary }]}>WALKING RATIO</Text>
          <Text style={[styles.ringHero, { color: theme.text }]}>
            {distanceValue}
            <Text style={[styles.ringHeroUnit, { color: theme.textSecondary }]}> {distanceUnit}</Text>
          </Text>
          <Text style={[styles.ringSubtext, { color: theme.textSecondary }]}>walked today</Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : theme.cardBorder }]} />

      <View style={styles.statsRow}>
        <StatBlock
          icon="pause-circle"
          value={formatDuration(summary?.stationary_min ?? 0)}
          label="Stopped"
          color={AppColors.stationary}
          theme={theme}
        />
        <View style={[styles.statDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : theme.cardBorder }]} />
        <StatBlock
          icon="male"
          value={formatDuration(summary?.walking_min ?? 0)}
          label="Walking"
          color={AppColors.walking}
          theme={theme}
        />
        <View style={[styles.statDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : theme.cardBorder }]} />
        <StatBlock
          icon="car"
          value={formatDuration(summary?.driving_min ?? 0)}
          label="Driving"
          color={AppColors.driving}
          theme={theme}
        />
      </View>
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
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    minWidth: 80,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
=======
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AppColors.success,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.success,
    letterSpacing: 0.3,
  },
  ringSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 18,
  },
  ringWrapper: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringCenter: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  ringPercent: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  ringPercentSign: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 1,
  },
  ringInfo: {
    flex: 1,
  },
  ringLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 4,
  },
  ringHero: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  ringHeroUnit: {
    fontSize: 15,
    fontWeight: '600',
  },
  ringSubtext: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginBottom: 18,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 44,
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statValue: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  statUnit: {
    fontSize: 12,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 3,
    letterSpacing: 0.2,
>>>>>>> adf99c4 (atualização)
  },
});
