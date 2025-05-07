
import OpenAI from "openai";
import { toast } from "@/hooks/use-toast";

// This should be stored in environment variables in production
// For demo purposes, using a temporary key that should be replaced
const OPENAI_API_KEY = "your-api-key-here";

class AIService {
  private openai: OpenAI;
  
  constructor() {
    this.openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true // Only for demo, use server-side API calls in production
    });
  }
  
  async generateResponse(messages: Array<{ role: 'user' | 'assistant' | 'system', content: string }>) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant for LUKSO Flow Hub. Help with contract negotiations, milestone tracking, and project management. Be concise, helpful, and professional. When suggesting actions, focus on escrow contracts and milestone management."
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 150,
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error("Error generating AI response:", error);
      toast({
        title: "AI Assistant Error",
        description: "Could not generate response. Please try again later.",
        variant: "destructive",
      });
      throw error;
    }
  }
  
  async suggestAction(chatHistory: string[], currentContext: string) {
    const contextPrompt = `Based on this conversation: 
${chatHistory.slice(-5).join('\n')}

Current context: ${currentContext}

Suggest a helpful action for this project conversation. Focus on milestone management, escrow contracts, or dispute resolution if relevant.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant for LUKSO Flow Hub. Provide brief, actionable suggestions for contract negotiations and milestone management."
          },
          {
            role: "user",
            content: contextPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 100,
      });
      
      return {
        suggestion: response.choices[0].message.content,
        type: this.determineSuggestionType(response.choices[0].message.content)
      };
    } catch (error) {
      console.error("Error generating AI suggestion:", error);
      return null;
    }
  }
  
  private determineSuggestionType(suggestion: string): 'deal' | 'escrow' | 'dispute' {
    const lowerSuggestion = suggestion.toLowerCase();
    
    if (lowerSuggestion.includes('dispute') || lowerSuggestion.includes('conflict') || lowerSuggestion.includes('disagreement')) {
      return 'dispute';
    } else if (lowerSuggestion.includes('escrow') || lowerSuggestion.includes('payment') || lowerSuggestion.includes('milestone')) {
      return 'escrow';
    }
    
    return 'deal';
  }
}

export default new AIService();
