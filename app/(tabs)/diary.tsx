import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMealContext } from '../../contexts/MealContext';

// Sample meal data for today
const sampleMeals = [
  {
    id: 1,
    name: "Grilled Chicken Bowl",
    calories: 450,
    protein: 35,
    carbs: 45,
    fats: 12,
  },
  {
    id: 2,
    name: "Salmon Quinoa Salad",
    calories: 380,
    protein: 28,
    carbs: 32,
    fats: 18,
  },
];

const MealPopup = ({ 
  visible, 
  meal, 
  onClose, 
  onRemoveMeal 
}: { 
  visible: boolean;
  meal: any;
  onClose: () => void;
  onRemoveMeal: () => void;
}) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="fade"
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        {/* Meal Header */}
        <View style={styles.mealHeader}>
          <Text style={styles.mealName}>{meal?.name}</Text>
        </View>

        {/* Calories */}
        <View style={styles.caloriesContainer}>
          <Text style={styles.caloriesValue}>{meal?.calories}</Text>
          <Text style={styles.caloriesLabel}>Calories</Text>
        </View>

        {/* Macros */}
        <View style={styles.macrosContainer}>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{meal?.protein}g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{meal?.carbs}g</Text>
            <Text style={styles.macroLabel}>Carbohydrates</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{meal?.fats}g</Text>
            <Text style={styles.macroLabel}>Fats</Text>
          </View>
        </View>

        {/* Remove Button */}
        <TouchableOpacity style={styles.removeButton} onPress={onRemoveMeal}>
          <Text style={styles.removeButtonText}>Remove Meal</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const MacroCard = ({ label, value, unit }: { label: string; value: number; unit: string }) => (
  <View style={styles.macroCard}>
    <Text style={styles.macroCardValue}>{value}</Text>
    <Text style={styles.macroCardLabel}>{label}</Text>
    <Text style={styles.macroCardUnit}>{unit}</Text>
  </View>
);

const MealCard = ({ meal, onPress }: { meal: any; onPress: () => void }) => (
  <TouchableOpacity style={styles.mealCard} onPress={onPress}>
    <View style={styles.mealCardInfo}>
      <Text style={styles.mealCardName}>{meal.name}</Text>
      <Text style={styles.mealCardCalories}>{meal.calories} calories</Text>
    </View>
    <View style={styles.mealCardMacros}>
      <Text style={styles.mealCardMacroText}>P: {meal.protein}g</Text>
      <Text style={styles.mealCardMacroText}>C: {meal.carbs}g</Text>
      <Text style={styles.mealCardMacroText}>F: {meal.fats}g</Text>
    </View>
  </TouchableOpacity>
);

export default function DiaryScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mealPopupVisible, setMealPopupVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const { getMealsForDate, removeMeal } = useMealContext();

  // Get meals for the selected date
  const dateString = selectedDate.toISOString().split('T')[0];
  const meals = getMealsForDate(dateString);

  // Calculate daily totals
  const dailyTotals = meals.reduce((totals, meal) => ({
    calories: totals.calories + meal.calories,
    protein: totals.protein + meal.protein,
    carbs: totals.carbs + meal.carbs,
    fats: totals.fats + meal.fats,
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleMealPress = (meal: any) => {
    setSelectedMeal(meal);
    setMealPopupVisible(true);
  };

  const handleRemoveMeal = () => {
    if (selectedMeal) {
      removeMeal(selectedMeal.id);
      setMealPopupVisible(false);
      setSelectedMeal(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3B2F87" />
      <LinearGradient
        colors={['#3B2F87', '#6B46C1', '#8B5CF6']}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Diary</Text>
        </View>

        {/* Calendar Navigation */}
        <View style={styles.calendarContainer}>
          <TouchableOpacity style={styles.arrowButton} onPress={goToPreviousDay}>
            <Text style={styles.arrowText}>←</Text>
          </TouchableOpacity>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          </View>
          <TouchableOpacity style={styles.arrowButton} onPress={goToNextDay}>
            <Text style={styles.arrowText}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Daily Macro Summary */}
        <View style={styles.macroSummaryContainer}>
          <Text style={styles.macroSummaryTitle}>Daily Totals</Text>
          <View style={styles.macroCardsContainer}>
            <MacroCard label="Calories" value={dailyTotals.calories} unit="cal" />
            <MacroCard label="Protein" value={dailyTotals.protein} unit="g" />
            <MacroCard label="Carbs" value={dailyTotals.carbs} unit="g" />
            <MacroCard label="Fats" value={dailyTotals.fats} unit="g" />
          </View>
        </View>

        {/* Meals List */}
        <View style={styles.mealsContainer}>
          <Text style={styles.mealsTitle}>Meals</Text>
          <ScrollView style={styles.mealsList} showsVerticalScrollIndicator={false}>
            {meals.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No meals added yet</Text>
                <Text style={styles.emptyStateSubtext}>Add meals from the dashboard to see them here</Text>
              </View>
            ) : (
              meals.map((meal) => (
                <MealCard 
                  key={meal.id} 
                  meal={meal} 
                  onPress={() => handleMealPress(meal)}
                />
              ))
            )}
          </ScrollView>
        </View>

        {/* Meal Popup */}
        <MealPopup
          visible={mealPopupVisible}
          meal={selectedMeal}
          onClose={() => setMealPopupVisible(false)}
          onRemoveMeal={handleRemoveMeal}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3B2F87',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  calendarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  arrowButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  macroSummaryContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  macroSummaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  macroCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  macroCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
  },
  macroCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  macroCardLabel: {
    fontSize: 12,
    color: '#E5E7EB',
    opacity: 0.8,
  },
  macroCardUnit: {
    fontSize: 10,
    color: '#E5E7EB',
    opacity: 0.6,
  },
  mealsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mealsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  mealsList: {
    flex: 1,
  },
  mealCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealCardInfo: {
    flex: 1,
  },
  mealCardName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mealCardCalories: {
    color: '#E5E7EB',
    fontSize: 14,
    opacity: 0.8,
  },
  mealCardMacros: {
    alignItems: 'flex-end',
  },
  mealCardMacroText: {
    color: '#E5E7EB',
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#E5E7EB',
    opacity: 0.8,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    maxHeight: '80%',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  mealHeader: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  mealName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  caloriesContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  caloriesValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3B2F87',
  },
  caloriesLabel: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 2,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B2F87',
  },
  macroLabel: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },
  removeButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 