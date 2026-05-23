import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { AppColors } from '@/constants/Colors';
import { formatDate, isToday, addDays } from '@/src/utils/time';

interface DaySelectorProps {
  dateString: string;
  onDateChange: (date: string) => void;
}

export default function DaySelector({ dateString, onDateChange }: DaySelectorProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginTop: 2,
  },
});
