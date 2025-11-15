import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
  currentDesign?: {
    theme?: string;
    layout?: number;
    fontFamily?: string;
    buttonFill?: number;
    buttonCorner?: number;
  };
}

const API_BASE_URL = 'https://simplified-ai-server.onrender.com';
const API_KEY = 'YOUR_API_KEY';

// Hàm tạo user signature đơn giản dựa trên token
const getUserSignature = (): string => {
  const token =
    localStorage.getItem('authToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('authToken') ||
    sessionStorage.getItem('token');

  if (!token) return 'anonymous';

  // Tạo signature đơn giản từ token (lấy 10 ký tự đầu)
  return `user_${token.substring(0, 10)}${token.length}`;
};

// Hàm tạo storage key riêng cho mỗi user
const getChatStorageKey = (): string => {
  const userSignature = getUserSignature();
  return `ai_chat_box_messages_${userSignature}`;
};

// Hook để phát hiện thay đổi user
const useUserChangeDetection = () => {
  const [userSig, setUserSig] = useState(getUserSignature());
  const userSigRef = useRef(userSig);

  // luôn giữ signature mới nhất
  useEffect(() => {
    userSigRef.current = userSig;
  }, [userSig]);

  // interval chạy đúng, không rerun vô hạn
  useEffect(() => {
    const interval = setInterval(() => {
      const newSig = getUserSignature();
      if (newSig !== userSigRef.current) {
        console.log("🔄 User changed:", userSigRef.current, "→", newSig);
        userSigRef.current = newSig;
        setUserSig(newSig);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return userSig;
};

// Hàm tạo default message
const getDefaultMessage = (): Message[] => [
  {
    id: '1',
    content: 'Xin chào! Tôi là trợ lý AI thiết kế portfolio. Tôi có thể giúp bạn: \n\n• Tư vấn chọn theme phù hợp\n• Gợi ý bố cục profile\n• Tư vấn màu sắc và font chữ\n• Đề xuất cải thiện thiết kế hiện tại\n\nHãy cho tôi biết bạn là ai và bạn cần hỗ trợ gì nhé!',
    isUser: false,
    timestamp: new Date()
  }
];

// Hàm lấy messages từ localStorage - LUÔN reset nếu là user mới
const getStoredMessages = (sig: string): Message[] => {
  const key = `ai_chat_box_messages_${sig}`;
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    }
  } catch {}

  return getDefaultMessage();
};


export const AIChatBox: React.FC<AIChatBoxProps> = ({
  isOpen,
  onClose,
  isMinimized,
  currentDesign
}) => {
  // Theo dõi sự thay đổi của user
  const currentUserSig = useUserChangeDetection();
  const [messages, setMessages] = useState<Message[]>(() => getStoredMessages(currentUserSig));
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [, setStorageKey] = useState(getChatStorageKey());

  // Effect để reset messages khi user thay đổi
  useEffect(() => {
    console.log('🔄 User signature changed, loading new chat history:', currentUserSig);
    const newMessages = getStoredMessages(currentUserSig);
    setMessages(newMessages);
  }, [currentUserSig]);

  useEffect(() => {
    setStorageKey(getChatStorageKey());
    }, [currentUserSig]);

  // Lưu messages vào localStorage mỗi khi messages thay đổi
  useEffect(() => {
    try {
      const storageKey = `ai_chat_box_messages_${currentUserSig}`;
      localStorage.setItem(storageKey, JSON.stringify(messages));
      console.log('💾 Saved chat for user:', currentUserSig);
    } catch (error) {
      console.error('Error saving chat messages to storage:', error);
    }
  }, [messages, currentUserSig]);

  // Xóa chat anonymous khi đóng trang web
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentUserSig === 'anonymous') {
        localStorage.removeItem('ai_chat_box_messages_anonymous');
        console.log('🗑️ Cleaned anonymous chat on page unload');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentUserSig]);

  // Auto-scroll to bottom khi có tin nhắn mới VÀ khi chatbox mở ra
  useEffect(() => {
    if (isOpen && shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [messages, isOpen, shouldAutoScroll]);

  // Khi chatbox mở ra, tự động scroll xuống cuối
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        setShouldAutoScroll(true);
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ 
            behavior: 'smooth',
            block: 'end'
          });
        }
      }, 100);
    }
  }, [isOpen, isMinimized]);

  // Theo dõi scroll behavior của user
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setShouldAutoScroll(isAtBottom);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  // Hàm gọi API AI để lấy đề xuất portfolio
  const getPortfolioSuggestions = async (userInfo: string): Promise<string> => {
    try {
      console.log('🔄 Calling AI API with user info:', userInfo);
      
      const response = await fetch(`${API_BASE_URL}/portfolio-suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify({
          userInfo: userInfo,
          currentDesign: currentDesign || undefined
        })
      });

      console.log('📡 API Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error details:', errorText);
        throw new Error(`Lỗi API: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ AI API Response:', data);
      
      return formatAIResponse(data);

    } catch (error) {
      console.error('Error calling AI API:', error);
      
      return `Tôi hiểu bạn muốn: "${userInfo}". Hiện tại tính năng AI đang được hoàn thiện. Dựa trên thông tin của bạn, tôi đề xuất:

🎯 **Bố cục**: Layout 2 - Chuyên nghiệp, phù hợp để xin việc
🎨 **Chủ đề màu**: Dark Slate - Trông rất chuyên nghiệp
✏️ **Font chữ**: Spartan - Dễ đọc và hiện đại
📝 **Bio**: Hãy viết một bio ngắn gọn về kinh nghiệm và mục tiêu của bạn

Bạn có muốn tôi giải thích thêm về đề xuất nào không?`;
    }
  };

  // Hàm format response từ AI
  const formatAIResponse = (data: any): string => {
    let aiResponse = `Dựa trên thông tin của bạn, tôi đề xuất:\n\n`;

    if (data.layout) {
      aiResponse += `🎯 Bố cục: ${data.layout.name}\n`;
      aiResponse += `   - ${data.layout.explanation}\n\n`;
    }

    if (data.palette && data.palette.length > 0) {
      const theme = data.allColorThemes?.find((t: any) => t.number === data.palette[0]);
      aiResponse += `🎨 Chủ đề màu: ${theme?.name || `Theme ${data.palette[0]}`}\n\n`;
    }

    if (data.fonts && data.fonts.length > 0) {
      aiResponse += `✏️ Font chữ đề xuất: ${data.fonts.join(', ')}\n\n`;
    }

    if (data.bio) {
      aiResponse += `📝 Bio gợi ý: "${data.bio}"\n\n`;
    }

    if (data.social_suggestions && data.social_suggestions.length > 0) {
      aiResponse += `🔗 Nên thêm các link: ${data.social_suggestions.join(', ')}\n\n`;
    }

    aiResponse += `💡 Bạn muốn tôi giải thích thêm về đề xuất nào không?`;

    return aiResponse;
  };

  // Hàm xử lý tin nhắn và gọi AI khi cần
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setShouldAutoScroll(true);

    try {
      const aiResponseContent = await getPortfolioSuggestions(inputMessage.trim());
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error('Error in AI conversation:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Xin lỗi, đã có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại sau.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Quick suggestion buttons
  const quickSuggestions = [
    'Tôi là sinh viên thiết kế, cần portfolio giới thiệu bản thân',
    'Tôi làm freelance developer, muốn portfolio chuyên nghiệp',
    'Gợi ý màu sắc phù hợp cho ngành công nghệ'
  ];

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 xl:right-[415px] z-50 w-80 bg-white rounded-2xl shadow-2xl border border-[#f3b4c3]">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#f3b4c3] to-[#D48A8A] text-[#161515] rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Bot size={20} />
            <span className="font-semibold font-spartan">AI Design Assistant</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/30 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 xl:right-[415px] z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-[#f3b4c3] flex flex-col">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#f1b1c0] to-[#fc9292] text-[#161515] rounded-t-2xl">
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <span className="font-semibold font-spartan">AI Design Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/30 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div 
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f7f7f7]"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {!message.isUser && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#e69595] text-white flex items-center justify-center">
                <Bot size={16} />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl p-3 ${
                message.isUser
                  ? 'bg-[#fbc1c1] text-[#161515] rounded-br-none ml-auto font-spartan'
                  : 'bg-white border border-[#f3b4c3] text-[#440808] rounded-bl-none font-spartan'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <div
                className={`text-xs mt-1 ${
                  message.isUser ? 'text-[#440808]' : 'text-[#A18686]'
                }`}
              >
                {message.timestamp.toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#e39595] text-white flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="bg-white border border-[#f3b4c3] rounded-2xl rounded-bl-none p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#D48A8A] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#D48A8A] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-[#D48A8A] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <div className="text-xs text-[#A18686] mt-2">AI đang phân tích...</div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 2 && (
        <div className="px-4 pt-2 bg-[#f7f7f7]">
          <div className="text-xs text-[#A18686] mb-2 font-spartan">Mô tả nhanh về bạn:</div>
          <div className="flex flex-wrap gap-2 mb-3">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(suggestion)}
                className="text-xs bg-white border border-[#f3b4c3] rounded-full px-3 py-1.5 hover:bg-[#ece6e6] transition-colors text-[#440808] font-spartan"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-[#f3b4c3] bg-white rounded-b-2xl">
        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Mô tả về bạn hoặc nhu cầu portfolio của bạn..."
            className="flex-1 border border-[#f3b4c3] rounded-2xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#D48A8A] focus:border-transparent max-h-32 bg-[#f7f7f7] text-[#440808] placeholder-[#A18686] font-spartan"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-[#dea2a2] text-[#161515] p-2 rounded-2xl hover:bg-[#D48A8A] disabled:bg-[#ece6e6] disabled:text-[#A18686] disabled:cursor-not-allowed transition-colors flex-shrink-0 font-spartan font-bold"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="text-xs text-[#A18686] text-center mt-2 font-spartan">
          AI sẽ phân tích và đề xuất thiết kế portfolio phù hợp
        </div>
      </div>
    </div>
  );
};