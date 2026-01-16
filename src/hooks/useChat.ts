import { useState, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// CBT-guided responses for the mock chatbot
const cbtResponses: Record<string, string[]> = {
  sad: [
    "I hear that you're feeling sad right now, and that's completely valid. Would you like to try a thought reframing exercise together? Sometimes our thoughts can feel heavier than they need to be.",
    "Thank you for sharing that with me. Sadness is a natural emotion. Let's explore what might be contributing to this feeling. Can you tell me more about what's been on your mind?",
    "I'm here for you. When we feel sad, it can help to identify the thoughts connected to that feeling. What thoughts have been going through your mind today?",
  ],
  anxious: [
    "Anxiety can feel overwhelming, but you're not alone in this. Let's try a grounding technique: Can you name 5 things you can see right now?",
    "I understand you're feeling anxious. Let's work through this together. Often, anxiety is connected to thoughts about the future. What specific worry is on your mind right now?",
    "Thank you for trusting me with this. Anxiety often makes things seem more threatening than they are. Let's examine this thought together - what evidence supports it, and what evidence might contradict it?",
  ],
  thoughts: [
    "Our thoughts have a powerful impact on how we feel. In CBT, we call automatic negative thoughts 'cognitive distortions.' Would you like me to help you identify if any of these patterns might be at play?",
    "That's a great step - examining our thoughts is key to feeling better. Can you share a specific thought that's been bothering you? We can work on reframing it together.",
    "Let's practice some thought challenging. When you notice a difficult thought, ask yourself: Is this thought helpful? Is it based on facts or feelings? What would I tell a friend who had this thought?",
  ],
  day: [
    "I'd love to hear about your day. Sometimes just talking through our experiences can help us process them better. What stood out to you today, whether positive or challenging?",
    "Sharing about your day is a wonderful way to reflect. What's one thing that went well today, even if it seems small? And is there anything that felt difficult?",
    "Tell me about your day. I'm here to listen without judgment. As you share, we might discover some patterns in thoughts or situations that affect your mood.",
  ],
  exercise: [
    "Great choice! Let's do a simple CBT exercise called the 'Three Cs': Catch it (the thought), Check it (is it accurate?), and Change it (to something more balanced). Think of a negative thought you had recently. What was it?",
    "Here's a helpful exercise: The 5-4-3-2-1 grounding technique. Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. This helps bring you back to the present moment.",
    "Let's try a gratitude exercise. Can you think of three things you're grateful for today? They can be as simple as a warm cup of coffee or a kind word from someone. Gratitude helps shift our focus from what's wrong to what's right.",
  ],
  default: [
    "Thank you for sharing that with me. I'm here to support you. Would you like to explore this feeling further, or would you prefer to try a calming exercise?",
    "I appreciate you opening up. Remember, it's okay to not be okay sometimes. What would feel most helpful for you right now - talking more about this, or trying a relaxation technique?",
    "I hear you. Your feelings are valid, and you're taking a positive step by expressing them. How can I best support you in this moment?",
  ],
};

const welcomeMessage: ChatMessage = {
  id: 'welcome',
  content: "Hello! I'm your MindEase companion, here to support you with empathy and evidence-based CBT techniques. How are you feeling today? You can share what's on your mind, or choose from the quick options below.",
  sender: 'bot',
  timestamp: new Date(),
};

function getResponseCategory(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('sad') || lowerMessage.includes('down') || lowerMessage.includes('depressed') || lowerMessage.includes('unhappy')) {
    return 'sad';
  }
  if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('nervous') || lowerMessage.includes('stress')) {
    return 'anxious';
  }
  if (lowerMessage.includes('thought') || lowerMessage.includes('thinking') || lowerMessage.includes('mind')) {
    return 'thoughts';
  }
  if (lowerMessage.includes('day') || lowerMessage.includes('today') || lowerMessage.includes('happened')) {
    return 'day';
  }
  if (lowerMessage.includes('exercise') || lowerMessage.includes('technique') || lowerMessage.includes('cbt') || lowerMessage.includes('help me')) {
    return 'exercise';
  }
  
  return 'default';
}

function getRandomResponse(category: string): string {
  const responses = cbtResponses[category] || cbtResponses.default;
  return responses[Math.floor(Math.random() * responses.length)];
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: 'user_' + Date.now(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate typing delay for natural feel (1-3 seconds)
    const typingDelay = 1000 + Math.random() * 2000;
    
    await new Promise(resolve => setTimeout(resolve, typingDelay));

    const category = getResponseCategory(content);
    const responseContent = getRandomResponse(category);

    const botMessage: ChatMessage = {
      id: 'bot_' + Date.now(),
      content: responseContent,
      sender: 'bot',
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages(prev => [...prev, botMessage]);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([welcomeMessage]);
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
    clearChat,
  };
}
