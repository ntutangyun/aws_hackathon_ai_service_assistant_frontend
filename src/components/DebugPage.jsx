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
import EdgeServerCard from './EdgeServerCard';
import AIServiceCard from './AIServiceCard';

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
      console.log('Raw API Response:', data);

      // Handle different possible response formats
      let subscriptionData = data;

      // If data is wrapped in a result/data property
      if (data && data.result) {
        subscriptionData = data.result;
      } else if (data && data.data) {
        subscriptionData = data.data;
      } else if (data && data.subscriptions) {
        subscriptionData = data.subscriptions;
      }

      console.log('Processed subscriptions:', subscriptionData);

      // Ensure it's an array
      if (Array.isArray(subscriptionData)) {
        setSubscriptions(subscriptionData);
      } else if (subscriptionData && typeof subscriptionData === 'object') {
        // If it's a single object, wrap it in an array
        setSubscriptions([subscriptionData]);
      } else {
        setSubscriptions([]);
        console.warn('Unexpected data format:', subscriptionData);
      }
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      setError(err.message);
      setSubscriptions(null);
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
      console.log('Raw Edge Servers Response:', data);

      let serverData = data;
      if (data && data.result) {
        serverData = data.result;
      } else if (data && data.data) {
        serverData = data.data;
      } else if (data && data.servers) {
        serverData = data.servers;
      }

      if (Array.isArray(serverData)) {
        setEdgeServers(serverData);
      } else if (serverData && typeof serverData === 'object') {
        setEdgeServers([serverData]);
      } else {
        setEdgeServers([]);
      }
    } catch (err) {
      console.error('Error fetching edge servers:', err);
      setError(err.message);
      setEdgeServers(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchNetworkSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await edgeServerApi.getNetworkSummary();
      let summaryData = data;
      if (data && data.result) summaryData = data.result;
      if (data && data.data) summaryData = data.data;
      setNetworkSummary(summaryData);
    } catch (err) {
      console.error('Error fetching network summary:', err);
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
      let healthData = data;
      if (data && data.result) healthData = data.result;
      if (data && data.data) healthData = data.data;
      setHealthStatus(healthData);
    } catch (err) {
      console.error('Error fetching health status:', err);
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
      console.log('Raw AI Services Response:', data);

      let serviceData = data;
      if (data && data.result) {
        serviceData = data.result;
      } else if (data && data.data) {
        serviceData = data.data;
      } else if (data && data.services) {
        serviceData = data.services;
      }

      if (Array.isArray(serviceData)) {
        setAIServices(serviceData);
      } else if (serviceData && typeof serviceData === 'object') {
        setAIServices([serviceData]);
      } else {
        setAIServices([]);
      }
    } catch (err) {
      console.error('Error fetching AI services:', err);
      setError(err.message);
      setAIServices(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchCatalogSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await aiServiceApi.getCatalogSummary();
      let summaryData = data;
      if (data && data.result) summaryData = data.result;
      if (data && data.data) summaryData = data.data;
      setCatalogSummary(summaryData);
    } catch (err) {
      console.error('Error fetching catalog summary:', err);
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
      let catData = data;
      if (data && data.result) catData = data.result;
      if (data && data.data) catData = data.data;
      setCategories(catData);
    } catch (err) {
      console.error('Error fetching categories:', err);
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
                {/* Loading State */}
                {loading && subscriptions === null && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">Loading subscriptions...</p>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {!loading && subscriptions !== null && subscriptions.length === 0 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                    <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                      <Users className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Subscriptions Found</h3>
                    <p className="text-gray-600">Click "All Subscriptions" to fetch data from the server.</p>
                  </div>
                )}

                {/* Subscriptions List */}
                {!loading && subscriptions && subscriptions.length > 0 && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900">All Subscriptions</h3>
                      <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-semibold shadow-lg">
                        {subscriptions.length} Total
                      </span>
                    </div>
                    <div className="space-y-6">
                      {subscriptions.map((sub, index) => (
                        <SubscriptionCard key={sub.subscriberId || index} subscription={sub} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Debug Info - Remove after testing */}
                {!loading && subscriptions !== null && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="text-xs font-mono text-yellow-800">
                      Debug: Received {subscriptions ? subscriptions.length : 0} subscriptions
                    </p>
                  </div>
                )}

                {/* Summary Details (Keep as JSON for reference) */}
                {subscriptionSummary && (
                  <div className="mt-8">
                    {renderJSON(subscriptionSummary, 'Detailed Summary Data')}
                  </div>
                )}
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
                {/* Edge Servers List */}
                {!loading && edgeServers && edgeServers.length > 0 && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900">All Edge Servers</h3>
                      <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl text-sm font-semibold shadow-lg">
                        {edgeServers.length} Total
                      </span>
                    </div>
                    <div className="space-y-6">
                      {edgeServers.map((server, index) => (
                        <EdgeServerCard key={server.serverId || index} server={server} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Health Status as Cards */}
                {!loading && healthStatus && Array.isArray(healthStatus) && healthStatus.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Health Status Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {healthStatus.map((health, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition-all">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-gray-900">{health.serverName}</h4>
                            <span className={`w-3 h-3 rounded-full ${
                              health.health === 'HEALTHY' ? 'bg-green-500' :
                              health.health === 'WARNING' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Status:</span>
                              <span className="font-semibold">{health.status}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">CPU:</span>
                              <span className="font-semibold">{health.utilization?.cpu?.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Memory:</span>
                              <span className="font-semibold">{health.utilization?.memory?.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">GPU:</span>
                              <span className="font-semibold">{health.utilization?.gpu?.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Services:</span>
                              <span className="font-semibold">{health.deployedServices || 0}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Network Summary as JSON (keep for reference) */}
                {networkSummary && (
                  <div className="mt-8">
                    {renderJSON(networkSummary, 'Network Summary Details')}
                  </div>
                )}
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
                {/* AI Services List */}
                {!loading && aiServices && aiServices.length > 0 && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900">All AI Services</h3>
                      <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-semibold shadow-lg">
                        {aiServices.length} Total
                      </span>
                    </div>
                    <div className="space-y-6">
                      {aiServices.map((service, index) => (
                        <AIServiceCard key={service.serviceId || index} service={service} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Categories Overview */}
                {!loading && categories && Array.isArray(categories) && categories.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Service Categories</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categories.map((cat, index) => (
                        <div key={index} className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition-all">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-gray-900">{cat.category?.replace('_', ' ')}</h4>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                              {cat.count} services
                            </span>
                          </div>
                          {cat.services && cat.services.length > 0 && (
                            <div className="space-y-1 mt-3">
                              {cat.services.slice(0, 3).map((svc, idx) => (
                                <div key={idx} className="text-xs text-gray-600 truncate">
                                  • {svc.serviceName}
                                </div>
                              ))}
                              {cat.services.length > 3 && (
                                <div className="text-xs text-gray-500 italic">
                                  + {cat.services.length - 3} more
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Catalog Summary (keep as JSON for reference) */}
                {catalogSummary && (
                  <div className="mt-8">
                    {renderJSON(catalogSummary, 'Catalog Summary Details')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
