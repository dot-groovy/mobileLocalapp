<<<<<<< HEAD
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
=======
import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

import Colors, { AppColors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useTrackingStatus } from '@/src/hooks/useTrackingStatus';

function TrackingDot() {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  return <Animated.View style={[dotStyles.dot, { opacity: pulseAnim }]} />;
}

const dotStyles = StyleSheet.create({
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AppColors.success,
    position: 'absolute',
    top: -2,
    right: -4,
  },
});
>>>>>>> adf99c4 (atualização)

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
<<<<<<< HEAD
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
=======
  showDot?: boolean;
}) {
  const { showDot, ...rest } = props;
  return (
    <View>
      <FontAwesome size={21} style={{ marginBottom: -2 }} {...rest} />
      {showDot && <TrackingDot />}
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { isActive } = useTrackingStatus();
  const isDark = colorScheme === 'dark';
>>>>>>> adf99c4 (atualização)

  return (
    <Tabs
      screenOptions={{
<<<<<<< HEAD
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarStyle: {
          borderTopWidth: 0.5,
          borderTopColor: Colors[colorScheme ?? 'light'].border,
          elevation: 8,
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0.5,
          borderBottomColor: Colors[colorScheme ?? 'light'].border,
        },
      }}>
=======
        headerShown: false,
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : theme.border,
          backgroundColor: isDark ? '#0A101C' : theme.card,
          elevation: 0,
          shadowOpacity: 0,
          paddingTop: 2,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.2,
        },
      }}
    >
>>>>>>> adf99c4 (atualização)
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
<<<<<<< HEAD
          tabBarIcon: ({ color }) => <TabBarIcon name="dashboard" color={color} />,
=======
          tabBarIcon: ({ color }) => <TabBarIcon name="th-large" color={color} />,
>>>>>>> adf99c4 (atualização)
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
<<<<<<< HEAD
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
=======
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="map-o" color={color} showDot={isActive} />
          ),
>>>>>>> adf99c4 (atualização)
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          title: 'Timeline',
          tabBarIcon: ({ color }) => <TabBarIcon name="clock-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
