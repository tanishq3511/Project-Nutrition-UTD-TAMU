# Chatbot Integration Setup Guide

This guide explains how to set up and configure the AI-powered chatbot in your nutrition app.

## Features

- **Rule-based responses** for common nutrition/fitness questions
- **AI-powered responses** for complex queries using OpenAI or Anthropic
- **Chat interface** integrated into the "More" tab
- **Firebase-ready** for storing chat history (can be extended)

## Current Implementation

The chatbot is currently configured to use a **mock AI service** for development purposes. It provides:
- Instant responses to common questions (protein, carbs, fats, workouts, etc.)
- Simulated AI responses for complex questions

## Setting Up Real AI Integration

### Option 1: OpenAI Integration

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Create a `.env` file in your project root:
   ```
   EXPO_PUBLIC_OPENAI_API_KEY=your_actual_openai_api_key_here
   ```
3. Update `services/aiService.ts`:
   ```typescript
   export const AIConfig = {
     service: 'openai', // Change from 'mock' to 'openai'
     // ... rest of config
   };
   ```

### Option 2: Anthropic Claude Integration

1. Get an API key from [Anthropic](https://console.anthropic.com/)
2. Create a `.env` file in your project root:
   ```
   EXPO_PUBLIC_ANTHROPIC_API_KEY=your_actual_anthropic_api_key_here
   ```
3. Update `services/aiService.ts`:
   ```typescript
   export const AIConfig = {
     service: 'anthropic', // Change from 'mock' to 'anthropic'
     // ... rest of config
   };
   ```

## Customizing Responses

### Adding Rule-based Responses

Edit the `getRuleBasedResponse` function in `components/ChatBot.tsx`:

```typescript
if (lowerMessage.includes('vitamin d')) {
  return "Vitamin D is important for bone health and immune function. Get it from sunlight, fatty fish, egg yolks, and fortified foods. Consider supplements if you have limited sun exposure.";
}
```

### Customizing AI Prompts

Modify the system prompt in `services/aiService.ts` or when calling the service:

```typescript
const response = await defaultAIService.generateResponse(
  userMessage,
  "You are a certified nutritionist and personal trainer. Provide evidence-based advice about nutrition, exercise, and healthy living. Always consider the user's safety and recommend consulting healthcare professionals for medical advice."
);
```

## Firebase Integration (Optional)

To store chat history, you can extend the chatbot to save messages to Firebase:

1. Add a `saveMessage` function to store messages
2. Load previous conversations on app startup
3. Sync across devices

## Testing

1. Run your app
2. Go to the "More" tab
3. Tap "AI Nutrition Assistant"
4. Try asking questions about:
   - Protein intake
   - Carbohydrates
   - Workout routines
   - Meal planning
   - Any other nutrition/fitness topics

## Troubleshooting

- **Mock responses**: If you see "This is a mock response", the AI service isn't configured
- **API errors**: Check your API key and internet connection
- **Rate limits**: OpenAI and Anthropic have usage limits; consider implementing rate limiting

## Security Notes

- Never commit API keys to version control
- Use environment variables for sensitive data
- Consider implementing user authentication before allowing AI access
- Monitor API usage to control costs

## Next Steps

- Add voice input/output capabilities
- Implement conversation memory/context
- Add image recognition for food items
- Integrate with your meal planning system
- Add user preferences and personalization
