import { useEffect, useRef } from 'react';
import { Loader2, AlertCircle, Trash2, Bot } from 'lucide-react';
import useChatStore from '../stores/chatStore';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const ChatContainer = () => {
  const messagesEndRef = useRef(null);
  const { messages, isLoading, error, sendMessage, clearMessages, clearError } = useChatStore();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (message) => {
    await sendMessage(message);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all messages?')) {
      clearMessages();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              AI Service Assistant
            </h1>
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Powered by AWS Bedrock
            </p>
          </div>
          <button
            onClick={handleClear}
            className="group px-4 py-2.5 text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
            title="Clear conversation"
          >
            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Clear</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50/90 backdrop-blur-sm border-b border-red-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between bg-white/50 rounded-xl px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3 text-red-800">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
              <button
                onClick={clearError}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 p-8">
              <div className="text-center">
                <div className="inline-block p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl mb-6">
                  <Bot className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                  Welcome to AI Service Assistant
                </h2>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Start a conversation by typing a message below. I can help you manage your 6G network services, subscriptions, and edge deployments.
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-200/50 rounded-xl mx-4 mb-4 shadow-sm">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">AI is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white/80 backdrop-blur-xl shadow-2xl border-t border-gray-200/50">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
