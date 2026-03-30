import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppState } from '../src/hooks/useAppState';
import { Colors, Fonts, Radius } from '../src/constants/theme';
import { ChevronLeft } from '../src/components/Icon';

export default function ReflectionsPage() {
  const { state } = useAppState();
  const router = useRouter();
  const reflections = state.learnings.reflections;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <ChevronLeft size={11} color={Colors.midBrown} style={{ marginTop: 1 }} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Session reflections</Text>
        <Text style={styles.subtitle}>{reflections.length} reflection{reflections.length !== 1 ? 's' : ''} from your sessions</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {reflections.slice().reverse().map((r, i) => {
          const date = new Date(r.date);
          const dateStr = date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
          return (
            <View key={i} style={styles.card}>
              <Text style={styles.date}>{dateStr}</Text>
              <Text style={styles.text}>{r.text}</Text>
            </View>
          );
        })}

        {reflections.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No reflections yet</Text>
            <Text style={styles.emptyBody}>Complete a session to see your first reflection here.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 8, alignSelf: 'flex-start', marginBottom: 12 },
  backText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.midBrown },
  title: { fontFamily: Fonts.display, fontSize: 24, color: Colors.charcoal, marginBottom: 4 },
  subtitle: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  card: { backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 18, marginBottom: 14 },
  date: { fontFamily: Fonts.bodyMedium, fontSize: 11, color: Colors.terracotta, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 10 },
  text: { fontFamily: Fonts.body, fontSize: 15, color: Colors.charcoal, lineHeight: 24 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontFamily: Fonts.display, fontSize: 16, color: Colors.charcoal, marginBottom: 4 },
  emptyBody: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, textAlign: 'center' },
});
