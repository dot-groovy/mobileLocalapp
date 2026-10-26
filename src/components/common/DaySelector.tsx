<<<<<<< HEAD
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { AppColors } from '@/constants/Colors';
import { formatDate, isToday, addDays } from '@/src/utils/time';
=======
import React, { useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { AppColors } from '@/constants/Colors';
import { haptic } from '@/src/utils/haptics';
import { formatDate, isToday, addDays, getDateString } from '@/src/utils/time';
>>>>>>> adf99c4 (atualização)

interface DaySelectorProps {
  dateString: string;
  onDateChange: (date: string) => void;
}

export default function DaySelector({ dateString, onDateChange }: DaySelectorProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
<<<<<<< HEAD
  const todayCheck = isToday(dateString);
  const dateTimestamp = new Date(dateString).getTime();

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <TouchableOpacity
        style={styles.arrow}
        onPress={() => onDateChange(addDays(dateString, -1))}>
        <FontAwesome name="chevron-left" size={16} color={theme.tint} />
      </TouchableOpacity>

      <View style={styles.dateContainer}>
        <Text style={[styles.dateText, { color: theme.text }]}>
          {todayCheck ? 'Today' : formatDate(dateTimestamp)}
        </Text>
        {!todayCheck && (
          <Text style={[styles.fullDate, { color: theme.textSecondary }]}>
            {dateString}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.arrow}
        onPress={() => !todayCheck && onDateChange(addDays(dateString, 1))}
        disabled={todayCheck}>
        <FontAwesome
          name="chevron-right"
          size={16}
          color={todayCheck ? AppColors.gray300 : theme.tint}
        />
      </TouchableOpacity>
    </View>
=======
  const isDark = colorScheme === 'dark';
  const todayCheck = isToday(dateString);
  const dateTimestamp = new Date(dateString).getTime();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animatePress = useCallback(
    (direction: number) => {
      haptic.light();
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 0.96, duration: 80, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
      ]).start();
      onDateChange(addDays(dateString, direction));
    },
    [dateString, onDateChange, scaleAnim]
  );

  const goToToday = useCallback(() => {
    haptic.selection();
    onDateChange(getDateString());
  }, [onDateChange]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderColor: isDark ? 'rgba(255,255,255,0.06)' : theme.cardBorder,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.arrow}
        onPress={() => animatePress(-1)}
        activeOpacity={0.6}
      >
        <FontAwesome name="angle-left" size={22} color={theme.tint} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.dateContainer} onPress={goToToday} activeOpacity={0.7}>
        {todayCheck ? (
          <View style={styles.todayBadge}>
            <View style={[styles.todayDot, { backgroundColor: AppColors.success }]} />
            <Text style={[styles.todayText, { color: theme.text }]}>Today</Text>
          </View>
        ) : (
          <>
            <Text style={[styles.dateText, { color: theme.text }]}>
              {formatDate(dateTimestamp)}
            </Text>
            <Text style={[styles.fullDate, { color: theme.textSecondary }]}>Tap for today</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.arrow}
        onPress={() => !todayCheck && animatePress(1)}
        disabled={todayCheck}
        activeOpacity={0.6}
      >
        <FontAwesome
          name="angle-right"
          size={22}
          color={todayCheck ? AppColors.gray600 : theme.tint}
        />
      </TouchableOpacity>
    </Animated.View>
>>>>>>> adf99c4 (atualização)
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
<<<<<<< HEAD
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  arrow: {
    padding: 8,
  },
  dateContainer: {
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
  },
  fullDate: {
    fontSize: 12,
=======
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 16,
    marginHorizontal: 12,
    marginVertical: 8,
  },
  arrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateContainer: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  todayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  todayDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  todayText: {
    fontSize: 16,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 15,
    fontWeight: '600',
  },
  fullDate: {
    fontSize: 11,
>>>>>>> adf99c4 (atualização)
    marginTop: 2,
  },
});
