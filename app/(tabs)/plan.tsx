import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ImageBackground
} from 'react-native';
import { useMealContext } from '../../contexts/MealContext';

// Test meal data
const testMeals = [
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
  {
    id: 3,
    name: "Turkey Avocado Wrap",
    calories: 420,
    protein: 25,
    carbs: 38,
    fats: 22,
  },
  {
    id: 4,
    name: "Veggie Power Bowl",
    calories: 320,
    protein: 18,
    carbs: 52,
    fats: 8,
  },
  {
    id: 5,
    name: "Beef Stir Fry",
    calories: 480,
    protein: 32,
    carbs: 28,
    fats: 26,
  },
];

const restaurants = [
  { id: 1, name: 'Dining Hall West', closing: 'Closes in 5 Hours' },
  { id: 2, name: 'Papa Johns', closing: 'Closes in 3 Hours' },
  { id: 3, name: 'Einstein Bros Bagels', closing: 'Closes in 5 Hours' },
  { id: 4, name: 'Einstein Bros Bagels', closing: 'Closes in 5 Hours' },
];

const RestaurantCard = ({ 
  id, 
  name, 
  closing, 
  isExpanded, 
  onPress,
  onGenerateMeal
}: { 
  id: number;
  name: string; 
  closing: string;
  isExpanded: boolean;
  onPress: () => void;
  onGenerateMeal: () => void;
}) => (
  <View style={styles.restaurantCardContainer}>
    <TouchableOpacity 
      style={[
        styles.restaurantCard, 
        isExpanded && styles.restaurantCardExpanded
      ]} 
      onPress={onPress}
    >
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{name}</Text>
        <Text style={styles.closingTime}>{closing}</Text>
      </View>
      <Text style={[styles.chevronText, isExpanded && styles.chevronRotated]}>⌄</Text>
      {isExpanded && (
        <View style={styles.generateButtonContainer}>
          <TouchableOpacity style={styles.generateButton} onPress={onGenerateMeal}>
            <Text style={styles.generateButtonText}>Generate a Meal!</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  </View>
);

const MealPopup = ({ 
  visible, 
  meal, 
  onClose, 
  onAddToDiary, 
  onGenerateAnother 
}: { 
  visible: boolean;
  meal: any;
  onClose: () => void;
  onAddToDiary: () => void;
  onGenerateAnother: () => void;
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
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.addToDiaryButton} onPress={onAddToDiary}>
            <Text style={styles.addToDiaryText}>Add to Diary</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.generateAnotherButton} onPress={onGenerateAnother}>
            <Text style={styles.generateAnotherText}>Regenerate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default function PlanScreen() {
  const [expandedRestaurant, setExpandedRestaurant] = useState<number | null>(null);
  const [mealPopupVisible, setMealPopupVisible] = useState(false);
  const [currentMeal, setCurrentMeal] = useState<any>(null);
  const { addMeal } = useMealContext();

  const handleRestaurantPress = (restaurantId: number) => {
    setExpandedRestaurant(expandedRestaurant === restaurantId ? null : restaurantId);
  };

  const handleGenerateMeal = () => {
    const randomMeal = testMeals[Math.floor(Math.random() * testMeals.length)];
    setCurrentMeal(randomMeal);
    setMealPopupVisible(true);
  };

  const handleAddToDiary = () => {
    if (currentMeal) {
      addMeal(currentMeal);
      setMealPopupVisible(false);
      setCurrentMeal(null);
    }
  };

  const handleGenerateAnother = () => {
    const randomMeal = testMeals[Math.floor(Math.random() * testMeals.length)];
    setCurrentMeal(randomMeal);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3B2F87" />
      <ImageBackground
        source={require('../../assets/images/bg.jpg')}
        style={StyleSheet.absoluteFill}
        resizeMode="contain"
        imageStyle={{ transform: [{ scale: 4.8 }, { translateX: 90 }, {translateY: 0}] }}
      >
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.headerLeft, { marginTop: 80, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.menuIcon}>
                  {[...Array(3)].map((_, i) => <View key={i} style={styles.menuLine} />)}
                </View>
                <View>
                  <Text style={styles.greeting}>Good Afternoon</Text>
                  <Text style={styles.name}>Dhivyesh!</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {['🚶', '🚲'].map((icon, i) => (
                  <TouchableOpacity key={i} style={styles.iconButton}>
                    <Text style={styles.iconText}>{icon}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIconText}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Your order?"
              placeholderTextColor="#9CA3AF"
            />
            <Text style={styles.qrIconText}>📱</Text>
          </View>
          {/* Lunch Status */}
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>Lunch is served!</Text>
            <Text style={styles.lastUpdated}>Last Updated March 25 2:00 PM</Text>
          </View>
          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            {['Dining Hall', 'Restaurants', 'Market'].map((label, i) => (
              <TouchableOpacity key={label} style={[styles.filterButton, i === 0 && styles.activeFilter]}>
                <Text style={i === 0 ? styles.filterTextActive : styles.filterText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Restaurant List */}
          <ScrollView style={styles.restaurantList} showsVerticalScrollIndicator={false}>
            {restaurants.map((r) => (
              <RestaurantCard 
                key={r.id} 
                {...r} 
                isExpanded={expandedRestaurant === r.id}
                onPress={() => handleRestaurantPress(r.id)}
                onGenerateMeal={handleGenerateMeal}
              />
            ))}
          </ScrollView>
          {/* Meal Popup */}
          <MealPopup
            visible={mealPopupVisible}
            meal={currentMeal}
            onClose={() => setMealPopupVisible(false)}
            onAddToDiary={handleAddToDiary}
            onGenerateAnother={handleGenerateAnother}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3B2F87',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuLine: {
    width: 20,
    height: 2,
    backgroundColor: 'white',
    marginVertical: 2,
  },
  greeting: {
    color: '#E5E7EB',
    fontSize: 14,
    opacity: 0.8,
  },
  name: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  iconText: {
    fontSize: 20,
    color: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIconText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  qrIconText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  statusContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  lastUpdated: {
    color: '#E5E7EB',
    fontSize: 14,
    opacity: 0.8,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeFilter: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterText: {
    color: '#E5E7EB',
    fontSize: 14,
  },
  filterTextActive: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  restaurantList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  restaurantCardContainer: {
    marginBottom: 15,
  },
  restaurantCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantCardExpanded: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  closingTime: {
    color: '#E5E7EB',
    fontSize: 14,
    opacity: 0.8,
  },
  chevronText: {
    color: 'white',
    fontSize: 16,
    transform: [{ rotate: '0deg' }],
  },
  chevronRotated: {
    transform: [{ rotate: '180deg' }],
  },
  generateButtonContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  generateButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#3B2F87',
    fontSize: 16,
    fontWeight: '600',
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
    fontSize: 14,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  addToDiaryButton: {
    backgroundColor: '#3B2F87',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  addToDiaryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  generateAnotherButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3B2F87',
  },
  generateAnotherText: {
    color: '#3B2F87',
    fontSize: 16,
    fontWeight: '600',
  },
}); 