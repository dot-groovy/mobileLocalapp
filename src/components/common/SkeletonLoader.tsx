import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

const SKEL = 'rgba(148,163,184,0.10)';

function Block({
  w = '100%' as any,
  h = 16,
  r = 8,
  style,
}: {
  w?: number | string;
  h?: number;
  r?: number;
  style?: any;
}) {
  return <View style={[{ width: w, height: h, borderRadius: r, backgroundColor: SKEL }, style]} />;
}

export function DashboardSkeleton() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 900, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const card: any[] = [s.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }];

  return (
    <Animated.View style={{ opacity: pulse }}>
      <View style={card}>
        <View style={s.row}>
          <Block w="42%" h={18} />
          <Block w={52} h={22} r={11} />
        </View>
        <View style={[s.row, { marginTop: 20, gap: 16, justifyContent: 'flex-start' }]}>
          <Block w={72} h={72} r={36} />
          <View style={{ flex: 1, gap: 8 }}>
            <Block w="35%" h={11} />
            <Block w="55%" h={26} />
            <Block w="40%" h={11} />
          </View>
        </View>
        <Block h={1} r={0} style={{ marginVertical: 18 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          {[0, 1, 2].map(i => (
            <View key={i} style={{ alignItems: 'center', gap: 8 }}>
              <Block w={36} h={36} r={18} />
              <Block w={38} h={16} />
              <Block w={46} h={10} />
            </View>
          ))}
        </View>
      </View>

      <View style={card}>
        <View style={s.row}>
          <Block w="48%" h={18} />
          <Block w={42} h={14} />
        </View>
        <Block h={14} r={7} style={{ marginTop: 16 }} />
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
          <Block w={100} h={30} r={10} />
          <Block w={95} h={30} r={10} />
          <Block w={75} h={30} r={10} />
        </View>
      </View>

      <View style={card}>
        <Block w="33%" h={18} />
        {[0, 1].map(i => (
          <View key={i} style={{ marginTop: 16, gap: 8 }}>
            <View style={[s.row, { justifyContent: 'flex-start' }]}>
              <Block w={22} h={22} r={11} />
              <Block w="55%" h={13} style={{ marginLeft: 8 }} />
            </View>
            <Block h={5} r={3} style={{ marginLeft: 30 }} />
          </View>
        ))}
      </View>

      <View style={card}>
        <View style={s.row}>
          <Block w="28%" h={18} />
          <Block w={48} h={14} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            height: 90,
            marginTop: 16,
          }}
        >
          {[30, 50, 22, 70, 42, 14, 56].map((h, i) => (
            <View key={i} style={{ alignItems: 'center', flex: 1 }}>
              <Block w={20} h={h} r={4} />
              <Block w={22} h={10} style={{ marginTop: 8 }} />
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

export function TimelineSkeleton() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 900, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View style={{ opacity: pulse, padding: 16, paddingLeft: 8 }}>
      {[0, 1, 2, 3].map(i => (
        <View key={i} style={{ flexDirection: 'row' }}>
          <View style={{ width: 34, alignItems: 'center' }}>
            <Block w={14} h={14} r={7} style={{ marginTop: 14 }} />
            <View
              style={{
                width: 2,
                flex: 1,
                backgroundColor: theme.cardBorder,
                borderRadius: 1,
                marginTop: 4,
              }}
            />
          </View>
          <View
            style={[
              s.timelineCard,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}
          >
            <View style={[s.row, { marginBottom: 8 }]}>
              <Block w={64} h={20} r={8} />
              <Block w={76} h={13} />
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Block w={56} h={13} />
              <Block w={46} h={13} />
            </View>
          </View>
        </View>
      ))}
    </Animated.View>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 22, padding: 22, borderWidth: 1, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timelineCard: { flex: 1, borderRadius: 16, padding: 14, borderWidth: 1, marginBottom: 10 },
});
