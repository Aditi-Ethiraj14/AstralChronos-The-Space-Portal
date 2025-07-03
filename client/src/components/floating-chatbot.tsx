import { useState } from "react";
import { Bot, X, Send, Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSpeech } from "@/hooks/use-speech";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm your space assistant. Ask me anything about space exploration, astronomy, or the cosmos!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const { isListening, startListening, stopListening, speak } = useSpeech();

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send to new N8N chatbot webhook
      const webhookUrl = "https://adie13.app.n8n.cloud/webhook-test/a21bcd3a-9aa0-4087-800a-a10530eef4cc";

      let botResponse = "I'm here to help with space questions! Unfortunately, my AI connection is currently unavailable, but I'd love to chat about space exploration, planets, or astronomy.";

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      if (response.ok) {
        const data = await response.text();
        console.log('Chatbot webhook response:', data);
        
        // Try to parse JSON response from N8N
        try {
          const parsed = JSON.parse(data);
          if (parsed.text) {
            botResponse = parsed.text;
          } else if (parsed.response) {
            botResponse = parsed.response;
          } else {
            botResponse = data;
          }
        } catch {
          // If parsing fails, use the raw response
          botResponse = data;
        }
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // Speak the response if speech synthesis is available
      speak(botResponse);

    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to get response from space assistant.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((transcript) => {
        setInputValue(transcript);
        sendMessage(transcript);
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="glass-morphism rounded-xl w-80 h-96 mb-4 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-600">
              <h3 style={{ fontFamily: 'Orbitron, monospace', color: 'hsl(207, 90%, 54%)' }}>
                Space Assistant
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.isUser 
                      ? 'ml-auto' 
                      : ''
                  }`}
                  style={{
                    backgroundColor: message.isUser 
                      ? 'hsl(220, 69%, 36%, 0.4)' 
                      : 'hsl(207, 90%, 54%, 0.2)'
                  }}
                >
                  <p className="text-sm">{message.text}</p>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-lg p-3 max-w-[80%]"
                  style={{ backgroundColor: 'hsl(207, 90%, 54%, 0.2)' }}
                >
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'hsl(207, 90%, 54%)' }}></div>
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'hsl(207, 90%, 54%)', animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'hsl(207, 90%, 54%)', animationDelay: '0.2s' }}></div>
                  </div>
                </motion.div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-600">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about space..."
                  className="flex-1 border"
                  style={{ 
                    backgroundColor: 'hsl(220, 69%, 36%, 0.2)', 
                    borderColor: 'hsl(220, 69%, 36%, 0.4)' 
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'hsl(207, 90%, 54%)'}
                  onBlur={(e) => e.target.style.borderColor = 'hsl(220, 69%, 36%, 0.4)'}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading}
                  className=""
                  style={{ backgroundColor: 'hsl(207, 90%, 54%)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(207, 90%, 54%, 0.8)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(207, 90%, 54%)'}
                >
                  <Send className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleVoiceToggle}
                  style={{
                    backgroundColor: isListening ? '#ef4444' : 'hsl(250, 85%, 60%)'
                  }}
                  onMouseEnter={(e) => {
                    if (isListening) {
                      e.currentTarget.style.backgroundColor = '#dc2626';
                    } else {
                      e.currentTarget.style.backgroundColor = 'hsl(250, 85%, 60%, 0.8)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isListening) {
                      e.currentTarget.style.backgroundColor = '#ef4444';
                    } else {
                      e.currentTarget.style.backgroundColor = 'hsl(250, 85%, 60%)';
                    }
                  }}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>

              {isListening && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-xs text-center text-gray-400 flex items-center justify-center gap-1"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  Listening...
                </motion.div>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center glow-button animate-float"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Bot className="w-8 h-8 text-white" />
      </motion.button>
    </div>
  );
}
