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
      text: `¡Hola! Soy tu Asesor de Estilo Oficial @sappy.error. Tengo acceso a las ${items.length} prendas registradas en tu armario digital. ¿Para qué evento o vibra necesitas un outfit hoy?`,
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
            <span>AI</span>
            <span className="text-white/30 font-serif italic">Stylist</span>
          </h2>
          <p className="text-[10px] mono text-white/40 mt-1">
            GEMINI_INTELLIGENCE // PERSONAL_STYLE_CONSULTANT
          </p>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div
        className={`p-4 border-tech min-h-[380px] max-h-[500px] overflow-y-auto space-y-4 ${
          isDarkMode ? 'bg-[#0D0D0D]' : 'bg-neutral-50 border-neutral-200'
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
                <div className="w-7 h-7 bg-white text-black font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                  SE
                </div>
              )}

              <div
                className={`max-w-[85%] p-3.5 border text-xs font-mono leading-relaxed ${
                  isUser
                    ? 'bg-white text-black border-white'
                    : isDarkMode
                    ? 'bg-[#151515] border-white/10 text-neutral-200'
                    : 'bg-white border-neutral-200 text-neutral-800'
                }`}
              >
                <p className="whitespace-pre-line font-sans">{msg.text}</p>
                <span className="text-[9px] text-neutral-500 block text-right mt-1.5 font-mono">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {isUser && (
                <div className="w-7 h-7 bg-white/20 text-white font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs font-mono text-white/40">
            <RefreshCw className="w-4 h-4 animate-spin text-white" />
            <span>STYLIST @sappy.error PROCESSING QUERY...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="space-y-2">
        <div className="flex items-center space-x-1.5 text-[10px] font-mono text-neutral-500">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>SUGERENCIAS DE CONSULTA RÁPIDA:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputMessage(p);
              }}
              className={`text-[11px] font-mono px-2.5 py-1 border transition-colors ${
                isDarkMode
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  : 'bg-white border-neutral-200 text-neutral-600 hover:text-neutral-900'
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
          className={`flex-1 px-4 py-3 text-xs font-mono border focus:outline-none ${
            isDarkMode
              ? 'bg-neutral-900 border-neutral-800 text-white focus:border-white'
              : 'bg-white border-neutral-200 text-neutral-900 focus:border-neutral-900'
          }`}
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="px-5 py-3 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-mono font-bold text-xs uppercase tracking-wider disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center space-x-1"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">ENVIAR</span>
        </button>
      </form>
    </div>
  );
};
