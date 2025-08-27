import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Meal {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  date?: string; // ISO date string
  brand?: string; // Brand name for branded products
  timestamp?: Date; // When the meal was added
}

interface MealContextType {
  meals: Meal[];
  addMeal: (meal: Meal) => void;
  removeMeal: (mealId: number) => void;
  getMealsForDate: (date: string) => Meal[];
}

const MealContext = createContext<MealContextType | undefined>(undefined);

export const useMealContext = () => {
  const context = useContext(MealContext);
  if (context === undefined) {
    throw new Error('useMealContext must be used within a MealProvider');
  }
  return context;
};

interface MealProviderProps {
  children: ReactNode;
}

export const MealProvider: React.FC<MealProviderProps> = ({ children }) => {
  const [meals, setMeals] = useState<Meal[]>([]);

  const addMeal = (meal: Meal) => {
    const mealWithDate = {
      ...meal,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    };
    setMeals(prevMeals => [...prevMeals, mealWithDate]);
  };

  const removeMeal = (mealId: number) => {
    setMeals(prevMeals => prevMeals.filter(meal => meal.id !== mealId));
  };

  const getMealsForDate = (date: string) => {
    return meals.filter(meal => meal.date === date);
  };

  const value = {
    meals,
    addMeal,
    removeMeal,
    getMealsForDate,
  };

  return (
    <MealContext.Provider value={value}>
      {children}
    </MealContext.Provider>
  );
}; 