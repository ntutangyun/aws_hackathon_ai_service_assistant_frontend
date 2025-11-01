import { useState } from 'react';
import {
  Database,
  Server,
  Package,
  RefreshCw,
  Users,
  Cpu,
  HardDrive,
  Activity,
  ChevronDown,
  ChevronRight,
  Zap,
  TrendingUp,
  Layers
} from 'lucide-react';
import { udmApi, edgeServerApi, aiServiceApi } from '../services/mcpApi';
import SubscriptionCard from './SubscriptionCard';

const DebugPage = () => {
  const [activeTab, setActiveTab] = useState('udm');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // UDM State
  const [subscriptions, setSubscriptions] = useState(null);
  const [subscriptionSummary, setSubscriptionSummary] = useState(null);

  // Edge Server State
  const [edgeServers, setEdgeServers] = useState(null);
  const [networkSummary, setNetworkSummary] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);

  // AI Service State
  const [aiServices, setAIServices] = useState(null);
  const [catalogSummary, setCatalogSummary] = useState(null);
  const [categories, setCategories] = useState(null);

  // Expandable sections state
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // UDM Fetchers
  const fetchAllSubscriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await udmApi.getAllSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await udmApi.getSubscriptionSummary();
      setSubscriptionSummary(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Edge Server Fetchers
  const fetchAllEdgeServers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await edgeServerApi.getAllServers();
      setEdgeServers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchNetworkSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await edgeServerApi.getNetworkSummary();
      setNetworkSummary(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchHealthStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await edgeServerApi.getHealthStatus();
      setHealthStatus(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // AI Service Fetchers
  const fetchAllAIServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await aiServiceApi.getAllServices();
      setAIServices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCatalogSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await aiServiceApi.getCatalogSummary();
      setCatalogSummary(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await aiServiceApi.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderJSON = (data, title) => {
    if (!data) return null;

    const sectionKey = `${title}-${JSON.stringify(data).substring(0, 20)}`;
    const isExpanded = expandedSections[sectionKey];

    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6 overflow-hidden transition-all duration-300 hover:shadow-xl">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group"
        >
          <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
            {title}
          </h3>
          <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>
        </button>
        {isExpanded && (
          <div className="border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
            <pre className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 overflow-x-auto text-xs font-mono leading-relaxed">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  const renderSummaryCard = (icon, label, value, gradientFrom = "from-blue-500", gradientTo = "to-blue-600") => (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-2">{label}</p>
            <p className="text-3xl font-bold bg-gradient-to-br ${gradientFrom} ${gradientTo} bg-clip-text text-transparent">
              {value}
            </p>
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} shadow-lg`}>
            <div className="text-white">{icon}</div>
          </div>
        </div>
      </div>
      <div className={`h-1 bg-gradient-to-r ${gradientFrom} ${gradientTo}`}></div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                MCP Server Debug Panel
              </h1>
              <p className="text-sm text-gray-600 mt-1">Real-time visualization of 6G network simulation data</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('udm')}
              className={`px-6 py-4 font-semibold rounded-t-2xl transition-all duration-300 ${
                activeTab === 'udm'
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg transform -translate-y-1'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Database className={`w-5 h-5 ${activeTab === 'udm' ? 'animate-pulse' : ''}`} />
                <span>UDM</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('edge')}
              className={`px-6 py-4 font-semibold rounded-t-2xl transition-all duration-300 ${
                activeTab === 'edge'
                  ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg transform -translate-y-1'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Server className={`w-5 h-5 ${activeTab === 'edge' ? 'animate-pulse' : ''}`} />
                <span>Edge Servers</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('ai-services')}
              className={`px-6 py-4 font-semibold rounded-t-2xl transition-all duration-300 ${
                activeTab === 'ai-services'
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg transform -translate-y-1'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className={`w-5 h-5 ${activeTab === 'ai-services' ? 'animate-pulse' : ''}`} />
                <span>AI Services</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 mt-6">
          <div className="bg-red-50/90 backdrop-blur-sm border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Activity className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* UDM Tab */}
          {activeTab === 'udm' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Unified Data Management</h2>
                    <p className="text-sm text-gray-600 mt-1">User subscriptions and Edge AI services</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <TrendingUp className="w-4 h-4" />
                    <span>Live Data</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={fetchAllSubscriptions}
                    disabled={loading}
                    className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    )}
                    <span className="font-semibold">All Subscriptions</span>
                  </button>
                  <button
                    onClick={fetchSubscriptionSummary}
                    disabled={loading}
                    className="group px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 disabled:from-gray-400 disabled:to-gray-500 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Activity className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    )}
                    <span className="font-semibold">Summary Stats</span>
                  </button>
                </div>
              </div>

              {/* Summary Cards */}
              {subscriptionSummary && (
                <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Key Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {renderSummaryCard(<Users className="w-6 h-6" />, 'Total Subscriptions', subscriptionSummary.totalSubscriptions, 'from-blue-500', 'to-blue-600')}
                    {renderSummaryCard(<Activity className="w-6 h-6" />, 'Active Subscriptions', subscriptionSummary.activeSubscriptions, 'from-green-500', 'to-emerald-600')}
                    {renderSummaryCard(<Package className="w-6 h-6" />, 'Edge AI Services', subscriptionSummary.totalEdgeAIServices, 'from-purple-500', 'to-purple-600')}
                    {renderSummaryCard(<HardDrive className="w-6 h-6" />, 'Data Used (GB)', subscriptionSummary.totalDataUsed?.toFixed(1), 'from-orange-500', 'to-orange-600')}
                  </div>
                </div>
              )}

              {/* Data Display */}
              <div>
                {/* Subscriptions List */}
                {subscriptions && subscriptions.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Subscriptions</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        {subscriptions.length} Total
                      </span>
                    </div>
                    <div className="space-y-6">
                      {subscriptions.map((sub) => (
                        <SubscriptionCard key={sub.subscriberId} subscription={sub} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary Details (Keep as JSON for reference) */}
                {subscriptionSummary && renderJSON(subscriptionSummary, 'Detailed Summary Data')}
              </div>
            </div>
          )}

          {/* Edge Servers Tab */}
          {activeTab === 'edge' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Edge Server Network</h2>
                    <p className="text-sm text-gray-600 mt-1">GPU resources and deployed services</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <TrendingUp className="w-4 h-4" />
                    <span>Live Data</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={fetchAllEdgeServers}
                    disabled={loading}
                    className="group px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Server className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    )}
                    <span className="font-semibold">All Edge Servers</span>
                  </button>
                  <button
                    onClick={fetchNetworkSummary}
                    disabled={loading}
                    className="group px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 disabled:from-gray-400 disabled:to-gray-500 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Activity className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    )}
                    <span className="font-semibold">Network Summary</span>
                  </button>
                  <button
                    onClick={fetchHealthStatus}
                    disabled={loading}
                    className="group px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-700 text-white rounded-xl hover:from-pink-700 hover:to-rose-800 disabled:from-gray-400 disabled:to-gray-500 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Activity className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    )}
                    <span className="font-semibold">Health Status</span>
                  </button>
                </div>
              </div>

              {/* Summary Cards */}
              {networkSummary && (
                <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Network Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {renderSummaryCard(<Server className="w-6 h-6" />, 'Total Servers', networkSummary.totalServers, 'from-purple-500', 'to-purple-600')}
                    {renderSummaryCard(<Activity className="w-6 h-6" />, 'Online Servers', networkSummary.onlineServers, 'from-green-500', 'to-emerald-600')}
                    {renderSummaryCard(<Cpu className="w-6 h-6" />, 'Total GPUs', networkSummary.totalGPUs, 'from-indigo-500', 'to-indigo-600')}
                    {renderSummaryCard(<HardDrive className="w-6 h-6" />, 'GPU Memory (GB)', networkSummary.totalGPUMemory, 'from-orange-500', 'to-orange-600')}
                    {renderSummaryCard(<Activity className="w-6 h-6" />, 'GPU Utilization', `${networkSummary.gpuUtilization?.toFixed(1)}%`, 'from-red-500', 'to-red-600')}
                  </div>
                </div>
              )}

              {/* Data Display */}
              <div>
                {renderJSON(edgeServers, 'All Edge Servers')}
                {renderJSON(networkSummary, 'Network Summary Details')}
                {renderJSON(healthStatus, 'Health Status Report')}
              </div>
            </div>
          )}

          {/* AI Services Tab */}
          {activeTab === 'ai-services' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">AI Service Repository</h2>
                    <p className="text-sm text-gray-600 mt-1">Available AI services and deployment catalog</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <TrendingUp className="w-4 h-4" />
                    <span>Live Data</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={fetchAllAIServices}
                    disabled={loading}
                    className="group px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 disabled:from-gray-400 disabled:to-gray-500 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Package className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    )}
                    <span className="font-semibold">All AI Services</span>
                  </button>
                  <button
                    onClick={fetchCatalogSummary}
                    disabled={loading}
                    className="group px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-xl hover:from-cyan-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Activity className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    )}
                    <span className="font-semibold">Catalog Summary</span>
                  </button>
                  <button
                    onClick={fetchCategories}
                    disabled={loading}
                    className="group px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-xl hover:from-violet-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Database className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    )}
                    <span className="font-semibold">Categories</span>
                  </button>
                </div>
              </div>

              {/* Summary Cards */}
              {catalogSummary && (
                <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Catalog Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {renderSummaryCard(<Package className="w-6 h-6" />, 'Total Services', catalogSummary.totalServices, 'from-green-500', 'to-emerald-600')}
                    {renderSummaryCard(<Activity className="w-6 h-6" />, 'Available Services', catalogSummary.availableServices, 'from-cyan-500', 'to-blue-600')}
                    {renderSummaryCard(<Cpu className="w-6 h-6" />, 'GPU Required', catalogSummary.gpuRequiredServices, 'from-violet-500', 'to-purple-600')}
                    {renderSummaryCard(<Database className="w-6 h-6" />, 'Categories', catalogSummary.totalCategories, 'from-pink-500', 'to-rose-600')}
                  </div>
                </div>
              )}

              {/* Data Display */}
              <div>
                {renderJSON(aiServices, 'All AI Services')}
                {renderJSON(catalogSummary, 'Catalog Summary Details')}
                {renderJSON(categories, 'Service Categories')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
