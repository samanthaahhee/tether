import { Tabs } from 'expo-router';
import { Colors, Fonts } from '../../src/constants/theme';
import { IconHome, IconCompass, IconLeaf, IconSliders } from '../../src/components/Icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: Colors.cream },
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: Colors.sand,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#211e28',
        tabBarInactiveTintColor: '#80798c',
        tabBarLabelStyle: {
          fontFamily: Fonts.bodyMedium,
          fontSize: 9,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <IconHome size={22} color={color} /> }} />
      <Tabs.Screen name="sessions" options={{ title: 'Sessions', tabBarIcon: ({ color }) => <IconCompass size={22} color={color} /> }} />
      <Tabs.Screen name="learnings" options={{ title: 'Learnings', tabBarIcon: ({ color }) => <IconLeaf size={22} color={color} /> }} />
      <Tabs.Screen name="tools" options={{ title: 'Tools', tabBarIcon: ({ color }) => <IconSliders size={22} color={color} /> }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}
