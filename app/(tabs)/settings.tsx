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
<<<<<<< HEAD
=======
import { useSafeAreaInsets } from 'react-native-safe-area-context';
>>>>>>> adf99c4 (atualização)
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { AppColors } from '@/constants/Colors';
import { useTrackingStatus } from '@/src/hooks/useTrackingStatus';
import { useDatabase } from '@/src/database/provider';
import { deleteAllData, exportAllData } from '@/src/database/queries';
<<<<<<< HEAD
import Constants from 'expo-constants';

type AccuracyLevel = 'high' | 'balanced' | 'low';
type RetentionDays = number;
=======
import { haptic } from '@/src/utils/haptics';
import Constants from 'expo-constants';

type AccuracyLevel = 'high' | 'balanced' | 'low';
>>>>>>> adf99c4 (atualização)

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
<<<<<<< HEAD
=======
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
>>>>>>> adf99c4 (atualização)
  const { settings, isActive, toggleTracking, updateSettings } = useTrackingStatus();
  const { db } = useDatabase();
  const [exporting, setExporting] = useState(false);

  const handleToggleTracking = useCallback(async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Background tracking is only available on mobile devices.');
      return;
    }
<<<<<<< HEAD
=======
    haptic.medium();
>>>>>>> adf99c4 (atualização)
    await toggleTracking();
  }, [toggleTracking]);

  const handleAccuracyChange = useCallback(async () => {
<<<<<<< HEAD
=======
    haptic.selection();
>>>>>>> adf99c4 (atualização)
    const options: AccuracyLevel[] = ['high', 'balanced', 'low'];
    const currentIdx = options.indexOf(settings.accuracy);
    const next = options[(currentIdx + 1) % options.length];
    await updateSettings({ accuracy: next });
  }, [settings.accuracy, updateSettings]);

  const handleRetentionChange = useCallback(async () => {
<<<<<<< HEAD
    const options: RetentionDays[] = [30, 60, 90, 180, 365];
=======
    haptic.selection();
    const options: number[] = [30, 60, 90, 180, 365];
>>>>>>> adf99c4 (atualização)
    const currentIdx = options.indexOf(settings.retentionDays);
    const next = options[(currentIdx + 1) % options.length];
    await updateSettings({ retentionDays: next });
  }, [settings.retentionDays, updateSettings]);

  const handleExport = useCallback(async () => {
    if (!db) return;
<<<<<<< HEAD
=======
    haptic.light();
>>>>>>> adf99c4 (atualização)
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
<<<<<<< HEAD
=======
      haptic.success();
>>>>>>> adf99c4 (atualização)
    } catch (e) {
      Alert.alert('Export Failed', 'Could not export data. Please try again.');
    }
    setExporting(false);
  }, [db]);

  const handleClearData = useCallback(() => {
<<<<<<< HEAD
=======
    haptic.medium();
>>>>>>> adf99c4 (atualização)
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
<<<<<<< HEAD
=======
            haptic.success();
>>>>>>> adf99c4 (atualização)
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

<<<<<<< HEAD
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
=======
  const sectionStyle = [
    styles.section,
    {
      backgroundColor: theme.card,
      borderColor: isDark ? 'rgba(255,255,255,0.06)' : theme.cardBorder,
    },
  ];

  const dividerStyle = [
    styles.divider,
    { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : theme.border },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.screenTitle, { color: theme.text }]}>Settings</Text>

      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>TRACKING</Text>
      <View style={sectionStyle}>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { backgroundColor: AppColors.primary + '15' }]}>
              <FontAwesome name="location-arrow" size={16} color={AppColors.primary} />
            </View>
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Background Tracking
              </Text>
>>>>>>> adf99c4 (atualização)
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                {isActive ? 'Currently active' : 'Paused'}
              </Text>
            </View>
          </View>
          <Switch
            value={isActive}
            onValueChange={handleToggleTracking}
<<<<<<< HEAD
            trackColor={{ false: AppColors.gray300, true: AppColors.primary + '60' }}
            thumbColor={isActive ? AppColors.primary : AppColors.gray400}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <TouchableOpacity style={styles.settingRow} onPress={handleAccuracyChange}>
          <View style={styles.settingLeft}>
            <FontAwesome name="bullseye" size={18} color={AppColors.walking} style={styles.settingIcon} />
=======
            trackColor={{
              false: isDark ? '#334155' : AppColors.gray300,
              true: AppColors.primary + '60',
            }}
            thumbColor={isActive ? AppColors.primaryLight : isDark ? '#64748B' : AppColors.gray400}
          />
        </View>

        <View style={dividerStyle} />

        <TouchableOpacity
          style={styles.settingRow}
          onPress={handleAccuracyChange}
          activeOpacity={0.6}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { backgroundColor: AppColors.walking + '15' }]}>
              <FontAwesome name="bullseye" size={16} color={AppColors.walking} />
            </View>
>>>>>>> adf99c4 (atualização)
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Accuracy</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                {accuracyLabels[settings.accuracy]}
              </Text>
            </View>
          </View>
<<<<<<< HEAD
          <FontAwesome name="chevron-right" size={14} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Data Section */}
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>DATA</Text>
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <TouchableOpacity style={styles.settingRow} onPress={handleRetentionChange}>
          <View style={styles.settingLeft}>
            <FontAwesome name="calendar" size={18} color={AppColors.driving} style={styles.settingIcon} />
=======
          <FontAwesome name="chevron-right" size={12} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>DATA</Text>
      <View style={sectionStyle}>
        <TouchableOpacity
          style={styles.settingRow}
          onPress={handleRetentionChange}
          activeOpacity={0.6}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { backgroundColor: AppColors.driving + '15' }]}>
              <FontAwesome name="calendar" size={16} color={AppColors.driving} />
            </View>
>>>>>>> adf99c4 (atualização)
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Data Retention</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                Keep data for {settings.retentionDays} days
              </Text>
            </View>
          </View>
<<<<<<< HEAD
          <FontAwesome name="chevron-right" size={14} color={theme.textSecondary} />
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <TouchableOpacity style={styles.settingRow} onPress={handleExport} disabled={exporting}>
          <View style={styles.settingLeft}>
            <FontAwesome name="download" size={18} color={AppColors.primary} style={styles.settingIcon} />
=======
          <FontAwesome name="chevron-right" size={12} color={theme.textSecondary} />
        </TouchableOpacity>

        <View style={dividerStyle} />

        <TouchableOpacity
          style={styles.settingRow}
          onPress={handleExport}
          disabled={exporting}
          activeOpacity={0.6}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { backgroundColor: AppColors.primary + '15' }]}>
              <FontAwesome name="download" size={16} color={AppColors.primary} />
            </View>
>>>>>>> adf99c4 (atualização)
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                {exporting ? 'Exporting...' : 'Export Data'}
              </Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                Save as JSON file
              </Text>
            </View>
          </View>
<<<<<<< HEAD
          <FontAwesome name="chevron-right" size={14} color={theme.textSecondary} />
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <TouchableOpacity style={styles.settingRow} onPress={handleClearData}>
          <View style={styles.settingLeft}>
            <FontAwesome name="trash-o" size={18} color={AppColors.error} style={styles.settingIcon} />
            <View>
              <Text style={[styles.settingLabel, { color: AppColors.error }]}>Clear All Data</Text>
=======
          <FontAwesome name="chevron-right" size={12} color={theme.textSecondary} />
        </TouchableOpacity>

        <View style={dividerStyle} />

        <TouchableOpacity
          style={styles.settingRow}
          onPress={handleClearData}
          activeOpacity={0.6}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { backgroundColor: AppColors.error + '15' }]}>
              <FontAwesome name="trash-o" size={16} color={AppColors.error} />
            </View>
            <View>
              <Text style={[styles.settingLabel, { color: AppColors.error }]}>
                Clear All Data
              </Text>
>>>>>>> adf99c4 (atualização)
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                Delete all stored location data
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

<<<<<<< HEAD
      {/* About Section */}
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>ABOUT</Text>
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <FontAwesome name="info-circle" size={18} color={AppColors.gray400} style={styles.settingIcon} />
=======
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>ABOUT</Text>
      <View style={sectionStyle}>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : AppColors.gray50 },
              ]}
            >
              <FontAwesome name="info-circle" size={16} color={AppColors.gray400} />
            </View>
>>>>>>> adf99c4 (atualização)
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>LocalApp</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                Version {Constants.expoConfig?.version ?? '1.0.0'}
              </Text>
            </View>
          </View>
        </View>

<<<<<<< HEAD
        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <FontAwesome name="shield" size={18} color={AppColors.success} style={styles.settingIcon} />
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Privacy</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                All data is stored locally on your device. Nothing is sent to any server.
=======
        <View style={dividerStyle} />

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { backgroundColor: AppColors.success + '15' }]}>
              <FontAwesome name="shield" size={16} color={AppColors.success} />
            </View>
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Privacy</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                All data is stored locally on your device
>>>>>>> adf99c4 (atualização)
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
<<<<<<< HEAD
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
=======
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
    marginTop: 20,
    marginLeft: 4,
  },
  section: {
    borderRadius: 16,
>>>>>>> adf99c4 (atualização)
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
<<<<<<< HEAD
  settingIcon: {
    width: 28,
    textAlign: 'center',
=======
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
>>>>>>> adf99c4 (atualização)
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
<<<<<<< HEAD
    height: 0.5,
    marginLeft: 56,
=======
    height: StyleSheet.hairlineWidth,
    marginLeft: 62,
>>>>>>> adf99c4 (atualização)
  },
  footer: {
    height: 40,
  },
});
