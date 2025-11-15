import { useState, useEffect } from 'react';

interface QuoteResponse {
  quote_main: string;
  playful_line: string;
  error?: string;
}

const API_BASE_URL = 'https://simplified-ai-server.onrender.com';

export const useQuoteOfTheDay = (enabled: boolean = true) => {
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = async () => {
    if (!enabled) {
      setQuote(null);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Fetching quote of the day...');
      const response = await fetch(`${API_BASE_URL}/quote-of-the-day`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: QuoteResponse = await response.json();
      console.log('✅ Quote received:', data);
      
      setQuote(data);
    } catch (err: any) {
      console.error('❌ Error fetching quote:', err);
      setError(err.message);
      // Fallback quotes khi có lỗi
      setQuote({
        quote_main: "Mỗi ngày là một trang mới - hãy viết nó thật đẹp!",
        playful_line: "Hôm nay bạn tỏa sáng chưa? ✨"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, [enabled]);

  return {
    quote,
    loading,
    error,
    refetch: fetchQuote
  };
};