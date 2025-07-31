import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';

const mealSummary = [
  { label: 'Breakfast', name: 'Vegetable Omelette', kcal: 420, protein: 30 },
  { label: 'Lunch', name: 'Grilled Salmon', kcal: 620, protein: 50 },
  { label: 'Dinner', name: 'Chicken Salad', kcal: 500, protein: 45 },
];

const macros = [
  { label: 'Protein', value: 105, goal: 130 },
  { label: 'Carbs', value: 25, goal: 50 },
  { label: 'Fats', value: 85, goal: 100 },
];

const weeklyIntake = [2000, 2200, 1800, 2500, 0, 0, 0]; 

export default function Dashboard() {
  return (
    <ImageBackground
      source={require('../../assets/images/bg.jpg')}
      style={StyleSheet.absoluteFill}
      resizeMode="contain"
      imageStyle={{ transform: [{ scale: 4.8 }, { translateX: 90 }] }}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoIcon}>🍽️</Text>
              <Text style={styles.logoText}>SmartBite</Text>
            </View>
            <Text style={styles.welcomeText}>Welcome back, Dhivyesh!</Text>
            <Text style={styles.subtitle}>Here's your daily meal summary:</Text>
          </View>

          {/* Daily Meal Summary Card */}
          <View style={styles.card}>
            {mealSummary.map((meal) => (
              <View key={meal.label} style={styles.mealRow}>
                <Text style={styles.mealLabel}>{meal.label}</Text>
                <View style={styles.mealInfo}>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <Text style={styles.mealDetails}>{meal.kcal} kcal   {meal.protein}g protein</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Macros Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Macros</Text>
            <View style={styles.macrosContainer}>
              {macros.map((macro) => (
                <View key={macro.label} style={styles.macroItem}>
                  <View style={styles.progressCircle}>
                    <View style={styles.macroTextContainer}>
                      <Text style={styles.macroValue}>{macro.value}g</Text>
                      <Text style={styles.macroGoal}>/{macro.goal}g</Text>
                    </View>
                  </View>
                  <Text style={styles.macroLabel}>{macro.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Weekly Calorie Intake Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Weekly Calorie Intake</Text>
            <View style={styles.chartContainer}>
              <View style={styles.yAxis}>
                <Text style={styles.yAxisLabel}>3,000</Text>
                <Text style={styles.yAxisLabel}>1,000</Text>
                <Text style={styles.yAxisLabel}>0</Text>
              </View>
              <View style={styles.barChart}>
                {weeklyIntake.map((val, idx) => (
                  <View key={idx} style={styles.barContainer}>
                    <View style={[styles.bar, { height: Math.max(10, (val / 3000) * 120) }]} />
                    <Text style={styles.barLabel}>{['S','M','T','W','T','F','S'][idx]}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.botIcon}>🤖</Text>
              <Text style={styles.actionText}>Ask NutriBot</Text>
            </TouchableOpacity>
            <View style={styles.goalCard}>
              <View style={styles.goalCircle}>
                <Text style={styles.goalText}>6/7</Text>
              </View>
              <Text style={styles.goalSubtext}>days met</Text>
            </View>
          </View>
        </View>
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
  },
  header: {
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  mealLabel: {
    fontWeight: 'bold',
    color: '#fff',
    width: 80,
    fontSize: 16,
    marginTop: 2,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  mealDetails: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  macroTextContainer: {
    alignItems: 'center',
  },
  macroValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  macroGoal: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  macroLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 140,
  },
  yAxis: {
    justifyContent: 'space-between',
    height: 120,
    marginRight: 10,
  },
  yAxisLabel: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  barChart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    width: 20,
    backgroundColor: '#fff',
    borderRadius: 2,
    marginBottom: 8,
  },
  barLabel: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  botIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  goalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  goalCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  goalSubtext: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
}); 