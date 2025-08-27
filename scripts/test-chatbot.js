#!/usr/bin/env node

/**
 * Chatbot Test Script
 * This script demonstrates the chatbot's rule-based responses
 */

const testQuestions = [
  "How much protein should I eat?",
  "What are good sources of carbohydrates?",
  "Tell me about healthy fats",
  "How often should I work out?",
  "I need help with meal planning",
  "How much water should I drink?",
  "What's my daily calorie need?",
  "Can you help me with vitamin supplements?",
  "What's the best time to exercise?",
  "How do I build muscle?"
];

// Mock rule-based response function (same logic as in the app)
function getRuleBasedResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('protein') || lowerMessage.includes('protein intake')) {
    return "Protein is essential for muscle building and recovery. Aim for 0.8-1.2g per kg of body weight daily. Good sources include lean meats, fish, eggs, dairy, legumes, and plant-based proteins.";
  }
  
  if (lowerMessage.includes('carbohydrate') || lowerMessage.includes('carbs')) {
    return "Carbohydrates are your body's main energy source. Focus on complex carbs like whole grains, fruits, vegetables, and legumes. They provide sustained energy and important nutrients.";
  }
  
  if (lowerMessage.includes('fat') || lowerMessage.includes('healthy fats')) {
    return "Healthy fats are crucial for hormone production and nutrient absorption. Include sources like avocados, nuts, olive oil, fatty fish, and seeds. Aim for 20-35% of daily calories.";
  }
  
  if (lowerMessage.includes('workout') || lowerMessage.includes('exercise')) {
    return "Aim for at least 150 minutes of moderate exercise or 75 minutes of vigorous exercise weekly. Include strength training 2-3 times per week and flexibility exercises.";
  }
  
  if (lowerMessage.includes('meal plan') || lowerMessage.includes('diet plan')) {
    return "A balanced meal plan should include protein, complex carbs, healthy fats, and plenty of vegetables. Consider your activity level, goals, and preferences when planning meals.";
  }
  
  if (lowerMessage.includes('water') || lowerMessage.includes('hydration')) {
    return "Stay hydrated by drinking water throughout the day. A general guideline is 8-10 glasses daily, but needs vary based on activity level, climate, and individual factors.";
  }
  
  if (lowerMessage.includes('calorie') || lowerMessage.includes('calories')) {
    return "Calorie needs depend on age, gender, weight, height, and activity level. Use a TDEE calculator to estimate your daily needs, then adjust based on your goals (weight loss, maintenance, or gain).";
  }
  
  return null;
}

// Test the chatbot
console.log("🤖 Chatbot Test Script\n");
console.log("Testing rule-based responses for common nutrition and fitness questions:\n");

testQuestions.forEach((question, index) => {
  console.log(`Q${index + 1}: ${question}`);
  
  const response = getRuleBasedResponse(question);
  if (response) {
    console.log(`A: ${response}\n`);
  } else {
    console.log(`A: [Would trigger AI response] This is a complex question that would be handled by the AI service.\n`);
  }
});

console.log("✅ Test completed! The chatbot can handle:");
console.log("- Common nutrition questions (protein, carbs, fats, etc.)");
console.log("- Fitness and workout questions");
console.log("- Meal planning advice");
console.log("- Hydration guidance");
console.log("- Calorie and macro questions");
console.log("\nFor questions not covered by rules, the AI service would provide personalized responses.");
