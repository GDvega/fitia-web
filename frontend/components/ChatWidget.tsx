import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { ChatMessage } from '../types';
import { sendChatMessage } from '../services/api';
import { useTranslation } from 'react-i18next';

interface ChatWidgetProps {
  onPlanUpdated?: () => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ onPlanUpdated }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userProfile = useUserStore(state => state.userProfile);
  const userId = useUserStore(state => state.userId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0 && userProfile) {
      setMessages([{
        id: 'welcome',
        role: 'model',
        text: t('chat.welcome', { name: userProfile.name }),
        timestamp: new Date()
      }]);
    }
  }, [userProfile, t]);

  const handleSend = async () => {
    if (!inputValue.trim() || !userId) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(userId, userMsg.text);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.message,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMsg]);

      // Check intent to trigger update
      if (response.intent === 'CHANGE_MEAL' && onPlanUpdated) {
        onPlanUpdated();
      }

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: t('chat.error'),
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 w-80 sm:w-96 h-[500px] shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-fitia-green p-4 flex justify-between items-center text-white">
            <div className="flex items-center space-x-2">
              <div className="bg-white/20 p-1.5 rounded-full">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{t('chat.header')}</h3>
                <p className="text-xs text-green-100">{t('chat.status')}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 space-y-4 scrollbar-hide">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.role === 'user'
                    ? 'bg-fitia-orange text-white rounded-br-none'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-600 rounded-bl-none'
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 text-gray-400 border border-gray-100 dark:border-gray-600 rounded-2xl rounded-bl-none px-4 py-3 text-xs flex items-center space-x-1 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-fitia-green/20 transition-all">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('chat.placeholder')}
                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim()}
                className={`ml-2 p-1.5 rounded-full transition-colors ${!inputValue.trim()
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-fitia-green hover:bg-green-50 dark:hover:bg-green-900/20'
                  }`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`shadow-lg transition-all duration-300 transform hover:scale-105 ${isOpen ? 'bg-gray-700 rotate-90 opacity-0 pointer-events-none' : 'bg-fitia-green opacity-100'
          } text-white p-4 rounded-full flex items-center justify-center`}
      >
        <MessageCircle size={28} />
      </button>
    </div>
  );
};

export default ChatWidget;