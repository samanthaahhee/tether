import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { Colors, Fonts } from '../../src/constants/theme';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.35 }}>{emoji}</Text>;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.warmWhite,
          borderTopColor: Colors.sand,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.terracotta,
        tabBarInactiveTintColor: Colors.lightBrown,
        tabBarLabelStyle: {
          fontFamily: Fonts.bodyMedium,
          fontSize: 9,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ focused }) => <TabIcon emoji="🏡" focused={focused} /> }} />
      <Tabs.Screen name="chat" options={{ title: 'Talk', tabBarIcon: ({ focused }) => <TabIcon emoji="💬" focused={focused} /> }} />
      <Tabs.Screen name="bridge" options={{ title: 'Bridge', tabBarIcon: ({ focused }) => <TabIcon emoji="🌉" focused={focused} /> }} />
      <Tabs.Screen name="journal" options={{ title: 'Journal', tabBarIcon: ({ focused }) => <TabIcon emoji="📖" focused={focused} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" focused={focused} /> }} />
    </Tabs>
  );
}
