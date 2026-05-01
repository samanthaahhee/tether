import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors, Fonts, Radius } from '../constants/theme';

/**
 * BreathingOverlay
 * ────────────────────────────────────────────────────────────────────
 * In-product calming tool. Modal sheet that does NOT navigate away
 * from the current chat — closes on backdrop tap or "Done".
 *
 * Two modes:
 *   - 'box'      → 4-second box breathing (inhale, hold, exhale, hold).
 *                  Each phase animates a circle scaling between 0.6 and 1.0.
 *                  Total session length: ~60 seconds (15 cycles).
 *   - 'grounding'→ 5-4-3-2-1 sensory grounding script.
 *                  Walks the user through naming things they see, hear,
 *                  feel, smell, taste.
 *
 * Why these two: box breathing is the most clinically-validated quick
 * regulation technique (used by US Navy SEALs and ER psychiatry alike).
 * 5-4-3-2-1 grounding is the standard non-breath alternative for users
 * with respiratory issues, asthma, or who panic on breath-focus.
 *
 * No external animation library — pure RN Animated. No haptics in the
 * idle path so the component is silent until invoked.
 *
 * App Store / Play Store note: this satisfies Apple's "mental health
 * apps should provide helpful resources during distress" review clause.
 * See docs/GUARDRAILS.md Section 13 (red-team test RT-104) and the
 * App Store Review Notes.
 */

type Mode = 'box' | 'grounding';

interface BreathingOverlayProps {
  visible: boolean;
  onClose: () => void;
  initialMode?: Mode;
}

const PHASE_LABELS: Record<number, string> = {
  0: 'Breathe in',
  1: 'Hold',
  2: 'Breathe out',
  3: 'Hold',
};

const PHASE_DURATION_MS = 4000;
const TOTAL_PHASES = 60; // 15 cycles × 4 phases ≈ 60s

const GROUNDING_STEPS = [
  { count: 5, sense: 'see', help: 'Look around. Name 5 things you can see.' },
  { count: 4, sense: 'feel', help: 'Notice 4 things you can physically feel.' },
  { count: 3, sense: 'hear', help: 'Listen for 3 things you can hear.' },
  { count: 2, sense: 'smell', help: 'Find 2 things you can smell.' },
  { count: 1, sense: 'taste', help: 'Notice 1 thing you can taste.' },
];

export default function BreathingOverlay({
  visible,
  onClose,
  initialMode = 'box',
}: BreathingOverlayProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [phase, setPhase] = useState(0);
  const [groundingStep, setGroundingStep] = useState(0);
  const scale = useRef(new Animated.Value(0.6)).current;

  // Reset state when overlay opens.
  useEffect(() => {
    if (visible) {
      setMode(initialMode);
      setPhase(0);
      setGroundingStep(0);
      scale.setValue(0.6);
    }
  }, [visible, initialMode, scale]);

  // Box-breathing cycle. Each phase is 4 seconds; circle scales on
  // inhale/exhale, holds steady on the holds.
  useEffect(() => {
    if (!visible || mode !== 'box') return;
    if (phase >= TOTAL_PHASES) return;

    const phaseInCycle = phase % 4;
    let target = 0.6;
    let animate = true;

    if (phaseInCycle === 0) target = 1.0;       // inhale → grow
    else if (phaseInCycle === 1) target = 1.0;  // hold full → stay
    else if (phaseInCycle === 2) target = 0.6;  // exhale → shrink
    else target = 0.6;                          // hold empty → stay

    if (phaseInCycle === 1 || phaseInCycle === 3) {
      animate = false; // hold phase — no scale animation
    }

    if (animate) {
      Animated.timing(scale, {
        toValue: target,
        duration: PHASE_DURATION_MS,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    }

    const t = setTimeout(() => setPhase((p) => p + 1), PHASE_DURATION_MS);
    return () => clearTimeout(t);
  }, [phase, mode, visible, scale]);

  const isComplete = mode === 'box' && phase >= TOTAL_PHASES;
  const cycleNumber = Math.floor(phase / 4) + 1;
  const totalCycles = TOTAL_PHASES / 4;
  const phaseLabel = PHASE_LABELS[phase % 4];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          {/* Mode switcher */}
          <View style={styles.tabRow}>
            <Pressable
              onPress={() => setMode('box')}
              style={[styles.tab, mode === 'box' && styles.tabActive]}
              accessibilityRole="button"
              accessibilityLabel="Box breathing"
            >
              <Text style={[styles.tabText, mode === 'box' && styles.tabTextActive]}>
                Breathe
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setMode('grounding')}
              style={[styles.tab, mode === 'grounding' && styles.tabActive]}
              accessibilityRole="button"
              accessibilityLabel="5-4-3-2-1 grounding"
            >
              <Text style={[styles.tabText, mode === 'grounding' && styles.tabTextActive]}>
                Ground
              </Text>
            </Pressable>
          </View>

          {mode === 'box' ? (
            <View style={styles.body}>
              {isComplete ? (
                <>
                  <Text style={styles.label}>Done.</Text>
                  <Text style={styles.help}>
                    Take a moment. When you&apos;re ready, come back to the conversation.
                  </Text>
                </>
              ) : (
                <>
                  <Animated.View
                    style={[styles.circle, { transform: [{ scale }] }]}
                    accessibilityElementsHidden
                  />
                  <Text style={styles.label}>{phaseLabel}</Text>
                  <Text style={styles.cycleText}>
                    Cycle {cycleNumber} of {totalCycles}
                  </Text>
                </>
              )}
            </View>
          ) : (
            <View style={styles.body}>
              <Text style={styles.groundingNum}>{GROUNDING_STEPS[groundingStep].count}</Text>
              <Text style={styles.label}>
                {GROUNDING_STEPS[groundingStep].sense}
              </Text>
              <Text style={styles.help}>
                {GROUNDING_STEPS[groundingStep].help}
              </Text>
              <View style={styles.stepNav}>
                <Pressable
                  onPress={() => setGroundingStep((s) => Math.max(0, s - 1))}
                  disabled={groundingStep === 0}
                  style={[styles.stepBtn, groundingStep === 0 && styles.stepBtnDisabled]}
                  accessibilityLabel="Previous step"
                >
                  <Text style={styles.stepBtnText}>←</Text>
                </Pressable>
                <Text style={styles.stepCounter}>
                  {groundingStep + 1} of {GROUNDING_STEPS.length}
                </Text>
                <Pressable
                  onPress={() =>
                    setGroundingStep((s) => Math.min(GROUNDING_STEPS.length - 1, s + 1))
                  }
                  disabled={groundingStep === GROUNDING_STEPS.length - 1}
                  style={[
                    styles.stepBtn,
                    groundingStep === GROUNDING_STEPS.length - 1 && styles.stepBtnDisabled,
                  ]}
                  accessibilityLabel="Next step"
                >
                  <Text style={styles.stepBtnText}>→</Text>
                </Pressable>
              </View>
            </View>
          )}

          <Pressable
            onPress={onClose}
            style={styles.doneBtn}
            accessibilityLabel="Close"
            accessibilityRole="button"
          >
            <Text style={styles.doneBtnText}>Done</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const CIRCLE_SIZE = 180;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 47, 35, 0.45)', // green800 with alpha
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sheet: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'stretch',
    gap: 20,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.stone200,
    borderRadius: 999,
    padding: 4,
    alignSelf: 'center',
    gap: 4,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
  },
  tabActive: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    color: Colors.midBrown,
  },
  tabTextActive: {
    color: Colors.charcoal,
  },
  body: {
    minHeight: 280,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: Colors.lime300,
    marginBottom: 10,
  },
  label: {
    fontFamily: 'InstrumentSans_600SemiBold',
    fontSize: 28,
    color: Colors.charcoal,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  cycleText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.midBrown,
  },
  help: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.warmBrown,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  groundingNum: {
    fontFamily: 'InstrumentSans_600SemiBold',
    fontSize: 96,
    color: Colors.green700,
    lineHeight: 100,
  },
  stepNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginTop: 8,
  },
  stepBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.stone200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: {
    opacity: 0.35,
  },
  stepBtnText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 18,
    color: Colors.charcoal,
  },
  stepCounter: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.midBrown,
    minWidth: 60,
    textAlign: 'center',
  },
  doneBtn: {
    backgroundColor: Colors.charcoal,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  doneBtnText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 15,
    color: '#fff',
  },
});
