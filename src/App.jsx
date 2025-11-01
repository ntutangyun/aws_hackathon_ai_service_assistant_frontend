import './App.css'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import ChatContainer from './components/ChatContainer'
import DebugPage from './components/DebugPage'
import { MessageSquare, Database, Sparkles } from 'lucide-react'

function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-gradient-to-r from-white via-blue-50/30 to-purple-50/30 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 py-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                6G Network Assistant
              </h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              to="/"
              className={`px-6 py-2.5 font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 ${
                location.pathname === '/'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </Link>
            <Link
              to="/debug"
              className={`px-6 py-2.5 font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 ${
                location.pathname === '/debug'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Debug</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen">
        <Navigation />
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<ChatContainer />} />
            <Route path="/debug" element={<DebugPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
