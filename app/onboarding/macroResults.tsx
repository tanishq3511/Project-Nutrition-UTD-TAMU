
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const macroSplits = [
  {
    label: 'Moderate Carb (30/35/35)',
    protein: 0.3,
    fats: 0.35,
    carbs: 0.35,
  },
  {
    label: 'Lower Carb (40/40/20)',
    protein: 0.4,
    fats: 0.4,
    carbs: 0.2,
  },
  {
    label: 'Higher Carb (30/20/50)',
    protein: 0.3,
    fats: 0.2,
    carbs: 0.5,
  },
];

function gramsFromSplit(calories: number, split: { protein: number; fats: number; carbs: number }) {
  return {
    protein: Math.round((calories * split.protein) / 4),
    fats: Math.round((calories * split.fats) / 9),
    carbs: Math.round((calories * split.carbs) / 4),
  };
}

const tabOptions = [
  { label: 'Maintenance', adjust: 0 },
  { label: 'Cutting', adjust: -500 },
  { label: 'Bulking', adjust: 500 },
];

export default function MacroResults() {
  const { tdee, goal } = useLocalSearchParams<{ tdee: string; goal?: string }>();
  const baseCalories = Number(tdee) || 0;
  const router = useRouter();

  // Determine which tabs to show based on goal
  let allowedTabs = tabOptions;
  if (goal === 'Lose weight') allowedTabs = [tabOptions[1]];
  else if (goal === 'Maintain weight') allowedTabs = [tabOptions[0]];
  else if (goal && goal.toLowerCase().includes('build')) allowedTabs = [tabOptions[2]];

  const [tab, setTab] = useState(0);
  const calories = Math.round(baseCalories + allowedTabs[tab].adjust);

  return (
    <ImageBackground
      source={require('../../assets/images/bg.jpg')}
      style={StyleSheet.absoluteFill}
      resizeMode="contain"
      imageStyle={{ transform: [{ scale: 4.8 }, { translateX: 90 }] }}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Calories & Macros</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.tabRow}>
            {allowedTabs.map((t, idx) => (
              <TouchableOpacity
                key={t.label}
                style={[styles.tab, tab === idx && styles.tabActive]}
                onPress={() => setTab(idx)}
              >
                <Text style={[styles.tabText, tab === idx && styles.tabTextActive]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.calories}>{calories} calories/day</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Macronutrient Splits</Text>
          {macroSplits.map((split) => {
            const grams = gramsFromSplit(calories, split);
            return (
              <View key={split.label} style={styles.splitBox}>
                <Text style={styles.splitLabel}>{split.label}</Text>
                <Text style={styles.macroRow}><Text style={styles.macroName}>Protein:</Text> {grams.protein}g</Text>
                <Text style={styles.macroRow}><Text style={styles.macroName}>Fats:</Text> {grams.fats}g</Text>
                <Text style={styles.macroRow}><Text style={styles.macroName}>Carbs:</Text> {grams.carbs}g</Text>
              </View>
            );
          })}
        </View>
        <Text style={styles.info}>There are 4 calories per gram of both protein and carbohydrates, and 9 calories per gram of fats.</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/onboarding/ready')}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 12,
    width: '100%',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#23232b',
    borderRadius: 8,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#6B46C1',
  },
  tabText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tabTextActive: {
    color: '#B7EFC5',
  },
  calories: {
    fontSize: 22,
    color: '#B7EFC5',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  splitBox: {
    backgroundColor: '#23232b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '100%',
  },
  splitLabel: {
    color: '#B7EFC5',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  macroRow: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 2,
  },
  macroName: {
    fontWeight: 'bold',
    color: '#B7EFC5',
  },
  info: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 24,
    backgroundColor: '#6B46C1',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
