import React, { useState, useRef, useEffect } from 'react';
import { ClothingItem } from '../types';
import { Sparkles, Send, Bot, User, RefreshCw, Lightbulb } from 'lucide-react';

interface AiStylistViewProps {
  items: ClothingItem[];
  isDarkMode: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export const AiStylistView: React.FC<AiStylistViewProps> = ({ items, isDarkMode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `¡Hola! Soy tu Asesor de Estilo Personal. Tengo acceso a las ${items.length} prendas registradas en tu armario digital. ¿Para qué evento o vibra necesitas un outfit hoy?`,
      timestamp: new Date()
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const closetSummary = items.map((i) => ({
        title: i.title,
        category: i.category,
        color: i.color || 'Neutro'
      }));

      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          closetSummary
        })
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: data.reply || 'No pude procesar la respuesta en este momento.',
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.warn('Error sending AI chat message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    'Recomiéndame un outfit para un rave hoy en la noche.',
    '¿Cómo combino mis pantalones de paracaídas?',
    'Dame una opción de layering para día frío.',
    '¿Cuáles son las piezas clave de mi armario?'
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-28">
      {/* Header */}
      <div className="border-b pb-4 border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight font-sans flex items-center space-x-2">
            <span>Asesor de</span>
            <span className="text-white/30 font-serif italic">Estilo</span>
          </h2>
          <p className="text-[10px] mono text-white/40 mt-1">
            CONSULTAS DE MODA // PERSONAL_STYLE_CONSULTANT
          </p>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div
        className={`p-4 rounded-3xl border min-h-[380px] max-h-[500px] overflow-y-auto space-y-4 shadow-xs ${
          isDarkMode ? 'bg-neutral-900/80 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
        }`}
      >
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 bg-black text-white dark:bg-white dark:text-black rounded-full text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  isUser
                    ? 'bg-black text-white dark:bg-white dark:text-black font-medium'
                    : isDarkMode
                    ? 'bg-neutral-800 text-neutral-200 border border-neutral-700/50'
                    : 'bg-white border border-neutral-200 text-neutral-800 shadow-xs'
                }`}
              >
                <p className="whitespace-pre-line font-sans">{msg.text}</p>
                <span className="text-[9px] text-neutral-400 block text-right mt-1.5 font-medium">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {isUser && (
                <div className="w-7 h-7 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-white rounded-full text-xs flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs font-medium text-neutral-400">
            <RefreshCw className="w-4 h-4 animate-spin text-black dark:text-white" />
            <span>Asesor de Estilo pensando respuesta...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="space-y-2">
        <div className="flex items-center space-x-1.5 text-xs font-medium text-neutral-400">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Sugerencias de consulta rápida:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputMessage(p);
              }}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                isDarkMode
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-700'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-100 hover:text-black hover:border-neutral-300'
              }`}
            >
              "{p}"
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Escribe tu consulta de estilo o evento..."
          className={`flex-1 px-4 py-3 text-xs rounded-full border transition-all focus:outline-none ${
            isDarkMode
              ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-white/30'
              : 'bg-neutral-100 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-black/30'
          }`}
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="px-5 py-3 bg-black text-white dark:bg-white dark:text-black rounded-full font-semibold text-xs tracking-wide disabled:opacity-40 hover:opacity-90 transition-opacity flex items-center space-x-1.5 shadow-sm cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Enviar</span>
        </button>
      </form>
    </div>
  );
};
