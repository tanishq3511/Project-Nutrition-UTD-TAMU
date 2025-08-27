import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  BackHandler,
} from 'react-native';
import { IconSymbol } from './ui/IconSymbol';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import { defaultAIService } from '../services/aiService';
import { defaultWebSearchService } from '../services/webSearchService';
import { useChat, ChatMessage } from '../contexts/ChatContext';
import { useUser } from '../contexts/UserContext';
import { useMealContext, Meal } from '../contexts/MealContext';

interface ChatBotProps {
  onClose: () => void;
}

export default function ChatBot({ onClose }: ChatBotProps) {
  const { messages, addMessage } = useChat();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingDiaryOffer, setPendingDiaryOffer] = useState<any>(null);
  const flatListRef = useRef<FlatList>(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { userProfile } = useUser();
  const { addMeal } = useMealContext();

  // Function to parse nutrition information and offer to add to diary
  const parseAndOfferDiary = (aiResponse: string, userQuestion: string) => {
    console.log('Parsing AI response:', aiResponse);
    console.log('User question:', userQuestion);
    
    // Enhanced nutrition patterns for better extraction
    const nutritionPatterns = [
      // Primary patterns - most common formats
      { pattern: /(\d+(?:\.\d+)?)\s*calories?/i, type: 'calories' },
      { pattern: /(\d+(?:\.\d+)?)\s*g\s*protein/i, type: 'protein' },
      { pattern: /(\d+(?:\.\d+)?)\s*g\s*carbs?/i, type: 'carbs' },
      { pattern: /(\d+(?:\.\d+)?)\s*g\s*fat/i, type: 'fat' },
      
      // Alternative unit patterns
      { pattern: /(\d+(?:\.\d+)?)\s*grams?\s*protein/i, type: 'protein' },
      { pattern: /(\d+(?:\.\d+)?)\s*grams?\s*carbs?/i, type: 'carbs' },
      { pattern: /(\d+(?:\.\d+)?)\s*grams?\s*fat/i, type: 'fat' },
      
      // Shorthand patterns
      { pattern: /(\d+(?:\.\d+)?)\s*cal/i, type: 'calories' },
      { pattern: /(\d+(?:\.\d+)?)\s*protein/i, type: 'protein' },
      { pattern: /(\d+(?:\.\d+)?)\s*carbs?/i, type: 'carbs' },
      { pattern: /(\d+(?:\.\d+)?)\s*fat/i, type: 'fat' },
      
      // Web search and serving size patterns
      { pattern: /(\d+(?:\.\d+)?)\s*calories?.*per\s*serving/i, type: 'calories' },
      { pattern: /(\d+(?:\.\d+)?)\s*g\s*protein.*per\s*serving/i, type: 'protein' },
      { pattern: /(\d+(?:\.\d+)?)\s*g\s*carbs?.*per\s*serving/i, type: 'carbs' },
      { pattern: /(\d+(?:\.\d+)?)\s*g\s*fat.*per\s*serving/i, type: 'fat' },
      
      // Brand-specific patterns (e.g., "Chobani: 80 cal, 15g protein")
      { pattern: /(\d+(?:\.\d+)?)\s*cal(?:ories?)?/i, type: 'calories' },
      { pattern: /(\d+(?:\.\d+)?)\s*protein/i, type: 'protein' },
      { pattern: /(\d+(?:\.\d+)?)\s*carbs?/i, type: 'carbs' },
      { pattern: /(\d+(?:\.\d+)?)\s*fat/i, type: 'fat' }
    ];

    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fats = 0;

    // Extract nutrition values from the response with better logic
    nutritionPatterns.forEach(({ pattern, type }) => {
      const matches = aiResponse.match(new RegExp(pattern.source, 'gi'));
      if (matches) {
        matches.forEach(match => {
          const valueMatch = match.match(/(\d+(?:\.\d+)?)/);
          if (valueMatch) {
            const value = parseFloat(valueMatch[1]);
            console.log(`Found ${type}: ${value} from pattern: ${pattern.source}`);
            
            // Only update if we haven't found a value yet or if this is a better match
            switch (type) {
              case 'calories':
                if (calories === 0 || value > calories) calories = value;
                break;
              case 'protein':
                if (protein === 0 || value > protein) protein = value;
                break;
              case 'carbs':
                if (carbs === 0 || value > carbs) carbs = value;
                break;
              case 'fat':
                if (fats === 0 || value > fats) fats = value;
                break;
            }
          }
        });
      }
    });

    console.log('Extracted nutrition:', { calories, protein, carbs, fats });

    // If we found nutrition information, offer to add to diary
    if (calories > 0 || protein > 0 || carbs > 0 || fats > 0) {
      // Extract food name and brand from AI response
      let foodName = '';
      let brandName = '';
      
      // Enhanced brand detection - try multiple patterns
      const brandPatterns = [
        /Brand:\s*([^,\n.!?]+)/i,                    // "Brand: Chobani"
        /brand\s*:\s*([^,\n.!?]+)/i,                 // "brand: Chobani"
        /from\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i, // "from Chobani"
        /by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,   // "by Chobani"
        /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Greek|Protein|Energy|Granola|Organic)/i, // "Chobani Greek"
        /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:yogurt|bar|shake|powder|milk)/i,         // "Chobani yogurt"
      ];
      
      for (const pattern of brandPatterns) {
        const match = aiResponse.match(pattern);
        if (match) {
          // Clean up the brand name to avoid capturing extra text
          let brandName = match[1].trim();
          
          // Remove common suffixes and extra words
          brandName = brandName
            .replace(/\s+-\s*\d+.*$/i, '')  // Remove "- 80 calories" etc.
            .replace(/\s+calories?.*$/i, '') // Remove "calories" and following text
            .replace(/\s+per\s+serving.*$/i, '') // Remove "per serving" and following text
            .replace(/\s+[A-Z][a-z]+\s+[A-Z][a-z]+$/i, '') // Remove trailing product descriptors
            .trim();
          
          console.log('Extracted brand name with pattern:', pattern.source, '→', brandName);
          break;
        }
      }
      
      // Look for web search source citations
      const sourceMatch = aiResponse.match(/Source\s*\d+:\s*([^,\n.!?]+)/i);
      if (sourceMatch) {
        const source = sourceMatch[1].trim();
        // Extract brand from source if it looks like a brand name
        if (source.match(/^[A-Z][a-z]+/)) {
          brandName = source;
          console.log('Extracted brand name from source:', brandName);
        }
      }
      
      // Try to extract from AI response first (for meal recommendations)
      const mealMatch = aiResponse.match(/Here's a great [^:]+: ([^(]+)/i);
      if (mealMatch) {
        foodName = mealMatch[1].trim();
        console.log('Extracted food name from meal format:', foodName);
      } else {
        // Try alternative meal recommendation formats
        const altMealMatch = aiResponse.match(/(?:Try|Consider|How about|I recommend|A great option is)\s+([^.!?]+)/i);
        if (altMealMatch) {
          foodName = altMealMatch[1].trim();
          console.log('Extracted food name from alternative meal format:', foodName);
        } else {
          // Fall back to extracting from user question
          foodName = userQuestion.toLowerCase();
          
          // Remove common question patterns to get just the food name
          foodName = foodName
            .replace(/how many calories (are )?(in|of|for)\s+/i, '')
            .replace(/what are the calories (in|of|for)\s+/i, '')
            .replace(/calories (in|of|for)\s+/i, '')
            .replace(/what's the (calorie|nutrition) (of|in|for)\s+/i, '')
            .replace(/tell me the (calories|nutrition) (of|in|for)\s+/i, '')
            .replace(/give me the (calories|nutrition) (of|in|for)\s+/i, '')
            .replace(/show me the (calories|nutrition) (of|in|for)\s+/i, '')
            .replace(/recommend\s+/i, '')
            .replace(/suggest\s+/i, '')
            .replace(/can you\s+/i, '')
            .replace(/what should i eat\s*/i, '')
            .replace(/\?/g, '')
            .replace(/^what\s+/i, '')
            .replace(/^how\s+/i, '')
            .replace(/^tell\s+/i, '')
            .replace(/^give\s+/i, '')
            .replace(/^show\s+/i, '')
            .trim();
          
          console.log('Extracted food name from user question:', foodName);
        }
      }

      // Clean up the food name further
      foodName = foodName
        .replace(/^a\s+/i, '')
        .replace(/^an\s+/i, '')
        .replace(/^the\s+/i, '')
        .replace(/^some\s+/i, '')
        .replace(/^about\s+/i, '')
        .replace(/^for\s+/i, '')
        .replace(/^in\s+/i, '')
        .replace(/^of\s+/i, '')
        .trim();

      // Capitalize first letter
      foodName = foodName.charAt(0).toUpperCase() + foodName.slice(1);

      // Combine brand and food name if both exist
      let displayName = foodName;
      if (brandName) {
        displayName = `${brandName} ${foodName}`;
      }

      console.log('Final food name:', displayName);
      console.log('Brand name:', brandName);

      // Return offer message instead of automatically adding
      return {
        foodName: displayName,
        brandName: brandName,
        originalFoodName: foodName,
        calories,
        protein,
        carbs,
        fats,
        offerMessage: `Would you like me to add ${displayName} to your diary? (${calories} calories, ${protein}g protein, ${carbs}g carbs, ${fats}g fat)`
      };
    }

    console.log('No nutrition information found');
    return null;
  };

  // Function to add food to diary when user confirms
  const addFoodToDiary = (foodInfo: any) => {
    const meal: Meal = {
      id: Date.now(),
      name: foodInfo.foodName,
      calories: foodInfo.calories || 0,
      protein: foodInfo.protein || 0,
      carbs: foodInfo.carbs || 0,
      fats: foodInfo.fats || 0,
      // Add brand information if available
      brand: foodInfo.brandName || undefined,
      // Add timestamp for better tracking
      timestamp: new Date(),
    };

    addMeal(meal);
    
    // Create a more informative confirmation message
    let confirmationMessage = `✅ Added ${foodInfo.foodName} to your diary!`;
    if (foodInfo.brandName) {
      confirmationMessage += `\n📝 Brand: ${foodInfo.brandName}`;
    }
    confirmationMessage += `\n📊 ${foodInfo.calories} calories, ${foodInfo.protein}g protein, ${foodInfo.carbs}g carbs, ${foodInfo.fats}g fat`;
    
    return confirmationMessage;
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Handle back button press (Android)
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleClose();
      return true; // Prevent default back behavior
    });

    return () => backHandler.remove();
  }, []);

  // Handle close with confirmation if there are messages
  const handleClose = () => {
    if (messages.length > 1) { // More than just the welcome message
      Alert.alert(
        'Exit Chat',
        'Are you sure you want to exit? Your conversation will be saved.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Exit',
            style: 'destructive',
            onPress: onClose,
          },
        ]
      );
    } else {
      onClose();
    }
  };

  // Generate AI response using the configured AI service
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      // Build personalized context based on user profile
      let userContext = '';
      if (userProfile) {
        userContext = `
USER PROFILE:
- Weight: ${userProfile.weight} lbs
- Height: ${userProfile.heightFeet}' ${userProfile.heightInches}"
- Age: ${userProfile.age} years
- Gender: ${userProfile.gender}
- Activity Level: ${userProfile.activityLevel}
- Nutrition Goal: ${userProfile.nutritionGoal}
- Daily Calorie Needs (TDEE): ${userProfile.tdee} calories

`;
      }

      // Check if this is a nutrition query that could benefit from web search
      const isNutritionQuery = userMessage.toLowerCase().includes('calories') || 
                              userMessage.toLowerCase().includes('calorie') ||
                              userMessage.toLowerCase().includes('nutrition') ||
                              userMessage.toLowerCase().includes('protein') ||
                              userMessage.toLowerCase().includes('carbs') ||
                              userMessage.toLowerCase().includes('fat') ||
                              userMessage.toLowerCase().includes('how many') ||
                              userMessage.toLowerCase().includes('what are') ||
                              userMessage.toLowerCase().includes('tell me about');

      let webSearchResults: any[] = [];
      let useWebSearch = false;

      // Perform web search for nutrition queries
      if (isNutritionQuery) {
        try {
          console.log('Performing web search for nutrition query:', userMessage);
          const searchResults = await defaultWebSearchService.searchNutrition(userMessage);
          webSearchResults = searchResults;
          useWebSearch = searchResults.length > 0;
          console.log('Web search results:', searchResults);
        } catch (error) {
          console.error('Web search error:', error);
          // Continue without web search if it fails
        }
      }

      const enhancedContext = `You are Nutribot, an expert nutritionist and certified personal trainer with 15+ years of experience. You specialize in sports nutrition, meal planning, and fitness optimization.

${userContext}
IMPORTANT INSTRUCTIONS:
- Users are looking for nutrition advice whether it's finding calories of certain items or just healthy tips to improve their diet and lifestyle
- Provide SHORT and CONCISE answers - aim for 2-3 sentences maximum
- Give direct, actionable advice without unnecessary explanations
- Focus on the most important information only
- Use bullet points or short lists when helpful
- Keep responses brief but informative
- Avoid verbose explanations and lengthy details
- Use the user's profile information to provide personalized advice when relevant
- Consider their specific nutrition goal, calorie needs, and activity level

${useWebSearch ? `
WEB SEARCH RESULTS AVAILABLE:
${webSearchResults.map((result, index) => `
Source ${index + 1}: ${result.title}
${result.nutritionInfo ? `Nutrition: ${result.nutritionInfo.calories || 'N/A'} calories, ${result.nutritionInfo.protein || 'N/A'}g protein, ${result.nutritionInfo.carbs || 'N/A'}g carbs, ${result.nutritionInfo.fat || 'N/A'}g fat` : 'Nutrition info not available'}
Snippet: ${result.snippet}
`).join('\n')}

Use this web search data to provide the most accurate and up-to-date nutrition information. Always cite your sources when using web search results.` : ''}

FOOD BRAND IDENTIFICATION REQUIREMENTS:
- ALWAYS identify and mention specific brand names when users ask about packaged foods, snacks, or beverages
- For generic foods (fruits, vegetables, raw ingredients), provide standard nutrition facts
- For branded products, specify the brand name and include "Brand: [Brand Name]" in your response
- Examples: "Brand: Chobani Greek Yogurt", "Brand: Quaker Oats", "Brand: KIND Bars"
- When possible, provide nutrition info for the specific brand's standard serving size
- If you're unsure about a specific brand, mention that nutrition can vary by brand and suggest checking the label

MEAL DIVERSITY REQUIREMENTS:
- NEVER repeat the same meal recommendation twice in a conversation
- Always suggest DIFFERENT meals each time
- Include variety: proteins (chicken, fish, tofu, eggs, beans), grains (quinoa, rice, oats), vegetables, fruits
- Rotate between different meal types and cuisines
- Use the user's nutrition goals to guide variety (e.g., high protein, low carb, etc.)

FOOD CALORIE QUERIES & MEAL RECOMMENDATIONS:
- When users ask about calories or nutrition of specific foods/meals, provide the calorie and macro information
- When users ask for meal recommendations, ALWAYS include the nutrition breakdown
- Provide DIVERSE meal suggestions - don't repeat the same meals
- Suggest different types of meals: breakfast, lunch, dinner, snacks
- Include variety: proteins, grains, vegetables, fruits, dairy alternatives
- Always format nutrition info clearly: "X calories, Xg protein, Xg carbs, Xg fat"
- Use consistent formatting for all nutrition values (e.g., "150 calories, 25g protein, 10g carbs, 5g fat")
- After giving the nutrition info, ask if they want to add it to their diary
- DO NOT suggest downloading food diary apps or external applications
- Focus on helping them track within their current app
- For meal recommendations, structure response as: "Here's a great [meal]: [food name] ([nutrition breakdown])"
- Vary your suggestions based on the user's nutrition goals and preferences

DIARY INTEGRATION:
- When discussing specific foods, always mention their calorie and macro content
- Offer to help users track their nutrition in their diary
- Provide serving size recommendations
- Suggest meal combinations for better nutrition balance
- Include brand information when available for better tracking accuracy

User Question: ${userMessage}`;

      const response = await defaultAIService.generateResponse(
        userMessage,
        enhancedContext,
        useWebSearch
      );
      
      // Ensure response is not too long (limit to ~1500 characters for full responses)
      const maxLength = 1500;
      if (response.text.length > maxLength) {
        return response.text.substring(0, maxLength) + '...';
      }
      
      return response.text;
    } catch (error) {
      console.error('AI service error:', error);
      return "I'm sorry, I'm having trouble connecting to my AI service right now. Please try again later.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      text: userMessage,
      isUser: true,
      timestamp: new Date(),
    };

    addMessage(newUserMessage);
    setInputText('');
    setIsLoading(true);

    try {
      // Generate AI response for complex questions
      const aiResponse = await generateAIResponse(userMessage);
      
      // Check if the AI response contains nutrition information and offer to add to diary
      // Only offer diary integration for specific food calorie queries or meal recommendations
      const isFoodCalorieQuery = userMessage.toLowerCase().includes('calories') || 
                               userMessage.toLowerCase().includes('calorie') ||
                               userMessage.toLowerCase().includes('nutrition') ||
                               userMessage.toLowerCase().includes('protein') ||
                               userMessage.toLowerCase().includes('carbs') ||
                               userMessage.toLowerCase().includes('fat');
      
      const isMealRecommendationQuery = userMessage.toLowerCase().includes('meal') ||
                                      userMessage.toLowerCase().includes('recommend') ||
                                      userMessage.toLowerCase().includes('suggestion') ||
                                      userMessage.toLowerCase().includes('what should i eat') ||
                                      userMessage.toLowerCase().includes('breakfast') ||
                                      userMessage.toLowerCase().includes('lunch') ||
                                      userMessage.toLowerCase().includes('dinner') ||
                                      userMessage.toLowerCase().includes('snack');
      
      let hasDiaryOffer = false;
      if (isFoodCalorieQuery || isMealRecommendationQuery) {
        console.log('Diary integration triggered for:', userMessage);
        const diaryOffer = parseAndOfferDiary(aiResponse, userMessage);
        console.log('Diary offer result:', diaryOffer);
        if (diaryOffer) {
          setPendingDiaryOffer(diaryOffer);
          hasDiaryOffer = true;
        }
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
        hasDiaryOffer: hasDiaryOffer,
      };
      addMessage(botMessage);

    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble responding right now. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.botMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.isUser ? styles.userMessageText : styles.botMessageText
      ]}>
        {item.text}
      </Text>
      
      {/* Show diary confirmation buttons if this message has a diary offer */}
      {item.hasDiaryOffer && (
        <View style={styles.diaryButtonsContainer}>
          <TouchableOpacity
            style={styles.diaryConfirmButton}
            onPress={() => {
              if (pendingDiaryOffer) {
                const confirmationMessage = addFoodToDiary(pendingDiaryOffer);
                addMessage({
                  id: (Date.now() + 3).toString(),
                  text: confirmationMessage,
                  isUser: false,
                  timestamp: new Date(),
                });
                setPendingDiaryOffer(null);
              }
            }}
          >
            <Text style={styles.diaryButtonText}>✅ Yes, add to diary</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.diaryDeclineButton}
            onPress={() => {
              addMessage({
                id: (Date.now() + 4).toString(),
                text: "No problem! Let me know if you need anything else.",
                isUser: false,
                timestamp: new Date(),
              });
              setPendingDiaryOffer(null);
            }}
          >
            <Text style={styles.diaryButtonText}>❌ No, thanks</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <Text style={styles.timestamp}>
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <View style={styles.fullScreenContainer}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <IconSymbol name="xmark" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Nutribot</Text>
          </View>
        </View>

        {/* Messages */}
        <View style={styles.messagesList}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            style={{ flex: 1 }}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Loading indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#8B5CF6" />
            <Text style={styles.loadingText}>Thinking...</Text>
          </View>
        )}

        {/* Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me about nutrition, fitness, or meal planning..."
            placeholderTextColor="rgba(139, 92, 246, 0.6)"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <IconSymbol 
              name="arrow.up.circle.fill" 
              size={24} 
              color="#fff" 
            />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    zIndex: 1000,
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#8B5CF6',
    backgroundColor: '#1a1a1a',
    minHeight: 80,
    width: '100%',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#8B5CF6',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
    minHeight: 40,
    position: 'absolute',
    left: 20,
    top: 45,
    zIndex: 1,
  },
  messagesList: {
    flex: 1,
    backgroundColor: '#000000',
    width: '100%',
  },
  messagesContent: {
    padding: 15,
    paddingBottom: 20,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 20,
    maxWidth: '85%',
    width: '100%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
  },
  botMessage: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
  },
  messageText: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 22,
    fontSize: 16,
    lineHeight: 22,
    maxWidth: '100%',
  },
  userMessageText: {
    backgroundColor: '#8B5CF6',
    color: '#fff',
  },
  botMessageText: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  timestamp: {
    fontSize: 11,
    color: 'rgba(139, 92, 246, 0.5)',
    marginTop: 6,
    marginHorizontal: 18,
    fontWeight: '400',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 12,
    width: '100%',
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#8B5CF6',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#8B5CF6',
    backgroundColor: '#000000',
    minHeight: 70,
    width: '100%',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderColor: '#8B5CF6',
    minHeight: 44,
  },
  sendButton: {
    padding: 12,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    minWidth: 44,
    minHeight: 44,
  },
  diaryButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginHorizontal: 18,
  },
  diaryConfirmButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  diaryDeclineButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  diaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
