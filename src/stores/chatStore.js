import { create } from 'zustand';

const useChatStore = create((set, get) => ({
  messages: [],
  sessionId: null,
  isLoading: false,
  error: null,

  // Add a message to the chat
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...message
    }]
  })),

  // Set session ID
  setSessionId: (sessionId) => set({ sessionId }),

  // Set loading state
  setLoading: (isLoading) => set({ isLoading }),

  // Set error state
  setError: (error) => set({ error }),

  // Clear error
  clearError: () => set({ error: null }),

  // Clear all messages
  clearMessages: () => set({
    messages: [],
    sessionId: null,
    error: null
  }),

  // Send a message and get response
  sendMessage: async (messageText) => {
    const { addMessage, setLoading, setError, sessionId, setSessionId } = get();

    try {
      setLoading(true);
      setError(null);

      // Add user message
      addMessage({
        role: 'user',
        content: messageText
      });

      // Call API
      const { API_URL } = await import('../config/api');
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          session_id: sessionId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Update session ID if new
      if (data.session_id && data.session_id !== sessionId) {
        setSessionId(data.session_id);
      }

      // Add assistant response
      if (data.success) {
        addMessage({
          role: 'assistant',
          content: data.response
        });
      } else {
        throw new Error(data.error || 'Failed to get response');
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message);
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        isError: true
      });
    } finally {
      setLoading(false);
    }
  },
}));

export default useChatStore;
