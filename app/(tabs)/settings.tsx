import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Switch,
  TouchableOpacity,
  Alert,
  Platform,
  Share,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { AppColors } from '@/constants/Colors';
import { useTrackingStatus } from '@/src/hooks/useTrackingStatus';
import { useDatabase } from '@/src/database/provider';
import { deleteAllData, exportAllData } from '@/src/database/queries';
import Constants from 'expo-constants';

type AccuracyLevel = 'high' | 'balanced' | 'low';
type RetentionDays = number;

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { settings, isActive, toggleTracking, updateSettings } = useTrackingStatus();
  const { db } = useDatabase();
  const [exporting, setExporting] = useState(false);

  const handleToggleTracking = useCallback(async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Background tracking is only available on mobile devices.');
      return;
    }
    await toggleTracking();
  }, [toggleTracking]);

  const handleAccuracyChange = useCallback(async () => {
    const options: AccuracyLevel[] = ['high', 'balanced', 'low'];
    const currentIdx = options.indexOf(settings.accuracy);
    const next = options[(currentIdx + 1) % options.length];
    await updateSettings({ accuracy: next });
  }, [settings.accuracy, updateSettings]);

  const handleRetentionChange = useCallback(async () => {
    const options: RetentionDays[] = [30, 60, 90, 180, 365];
    const currentIdx = options.indexOf(settings.retentionDays);
    const next = options[(currentIdx + 1) % options.length];
    await updateSettings({ retentionDays: next });
  }, [settings.retentionDays, updateSettings]);

  const handleExport = useCallback(async () => {
    if (!db) return;
    setExporting(true);
    try {
      const data = await exportAllData(db);
      const json = JSON.stringify(data, null, 2);
      if (Platform.OS === 'web') {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `localapp-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        await Share.share({
          message: json,
          title: 'LocalApp Data Export',
        });
      }
    } catch (e) {
      Alert.alert('Export Failed', 'Could not export data. Please try again.');
    }
    setExporting(false);
  }, [db]);

  const handleClearData = useCallback(() => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your location history, visits, and trips. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            if (!db) return;
            await deleteAllData(db);
            Alert.alert('Done', 'All data has been deleted.');
          },
        },
      ]
    );
  }, [db]);

  const accuracyLabels: Record<AccuracyLevel, string> = {
    high: 'High (best accuracy, more battery)',
    balanced: 'Balanced',
    low: 'Low (saves battery)',
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}>

      {/* Tracking Section */}
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>TRACKING</Text>
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <FontAwesome name="location-arrow" size={18} color={AppColors.primary} style={styles.settingIcon} />
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Background Tracking</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                {isActive ? 'Currently active' : 'Paused'}
              </Text>
            </View>
          </View>
          <Switch
            value={isActive}
            onValueChange={handleToggleTracking}
            trackColor={{ false: AppColors.gray300, true: AppColors.primary + '60' }}
            thumbColor={isActive ? AppColors.primary : AppColors.gray400}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <TouchableOpacity style={styles.settingRow} onPress={handleAccuracyChange}>
          <View style={styles.settingLeft}>
            <FontAwesome name="bullseye" size={18} color={AppColors.walking} style={styles.settingIcon} />
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Accuracy</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                {accuracyLabels[settings.accuracy]}
              </Text>
            </View>
          </View>
          <FontAwesome name="chevron-right" size={14} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Data Section */}
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>DATA</Text>
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <TouchableOpacity style={styles.settingRow} onPress={handleRetentionChange}>
          <View style={styles.settingLeft}>
            <FontAwesome name="calendar" size={18} color={AppColors.driving} style={styles.settingIcon} />
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Data Retention</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                Keep data for {settings.retentionDays} days
              </Text>
            </View>
          </View>
          <FontAwesome name="chevron-right" size={14} color={theme.textSecondary} />
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <TouchableOpacity style={styles.settingRow} onPress={handleExport} disabled={exporting}>
          <View style={styles.settingLeft}>
            <FontAwesome name="download" size={18} color={AppColors.primary} style={styles.settingIcon} />
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                {exporting ? 'Exporting...' : 'Export Data'}
              </Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                Save as JSON file
              </Text>
            </View>
          </View>
          <FontAwesome name="chevron-right" size={14} color={theme.textSecondary} />
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <TouchableOpacity style={styles.settingRow} onPress={handleClearData}>
          <View style={styles.settingLeft}>
            <FontAwesome name="trash-o" size={18} color={AppColors.error} style={styles.settingIcon} />
            <View>
              <Text style={[styles.settingLabel, { color: AppColors.error }]}>Clear All Data</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                Delete all stored location data
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>ABOUT</Text>
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <FontAwesome name="info-circle" size={18} color={AppColors.gray400} style={styles.settingIcon} />
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>LocalApp</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                Version {Constants.expoConfig?.version ?? '1.0.0'}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <FontAwesome name="shield" size={18} color={AppColors.success} style={styles.settingIcon} />
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Privacy</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                All data is stored locally on your device. Nothing is sent to any server.
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 16,
    marginLeft: 4,
  },
  section: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  settingIcon: {
    width: 28,
    textAlign: 'center',
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  settingDesc: {
    fontSize: 12,
    marginTop: 2,
    maxWidth: 240,
  },
  divider: {
    height: 0.5,
    marginLeft: 56,
  },
  footer: {
    height: 40,
  },
});
