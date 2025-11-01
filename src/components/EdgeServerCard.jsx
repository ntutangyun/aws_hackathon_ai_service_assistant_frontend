import {
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Activity,
  MapPin,
  Zap,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  TrendingUp,
  Package
} from 'lucide-react';

const EdgeServerCard = ({ server }) => {
  if (!server) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-red-600 font-medium">Invalid server data</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ONLINE':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'OFFLINE':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getHealthColor = (health) => {
    switch (health) {
      case 'HEALTHY':
        return 'bg-green-500';
      case 'WARNING':
        return 'bg-yellow-500';
      case 'CRITICAL':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getHealthIcon = (health) => {
    switch (health) {
      case 'HEALTHY':
        return <CheckCircle className="w-4 h-4" />;
      case 'WARNING':
        return <AlertCircle className="w-4 h-4" />;
      case 'CRITICAL':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const resources = server.resources || {};
  const cpu = resources.cpu || {};
  const memory = resources.memory || {};
  const gpu = resources.gpu || {};
  const storage = resources.storage || {};
  const network = resources.network || {};
  const deployedServices = server.deployedServices || [];
  const location = server.location || {};
  const metrics = server.metrics || {};

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-5 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Server className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{server.serverName}</h3>
              <p className="text-purple-100 text-sm mt-1">ID: {server.serverId}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className={`px-4 py-2 rounded-xl border ${getStatusColor(server.status)} bg-white/90 backdrop-blur-sm font-semibold text-sm`}>
              {server.status}
            </div>
          </div>
        </div>
      </div>

      {/* Location & Health */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-purple-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Location</p>
              <p className="text-sm font-semibold text-gray-900">{location.address || 'Unknown'}</p>
              <p className="text-xs text-gray-500">
                {location.latitude?.toFixed(4)}, {location.longitude?.toFixed(4)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getHealthColor(server.health)} animate-pulse`}></div>
            <span className="text-sm font-semibold text-gray-700">{server.health}</span>
            {getHealthIcon(server.health)}
          </div>
        </div>
      </div>

      {/* Resource Metrics */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-indigo-600" />
          <h4 className="text-lg font-bold text-gray-900">Resource Utilization</h4>
        </div>

        <div className="space-y-4">
          {/* CPU */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-gray-900">CPU</span>
              </div>
              <span className="text-sm font-semibold text-blue-900">
                {cpu.used || 0} / {cpu.total || 0} cores
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${cpu.utilization || 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-blue-800 mt-1 text-right font-semibold">
              {(cpu.utilization || 0).toFixed(1)}%
            </p>
          </div>

          {/* Memory */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-green-600" />
                <span className="font-bold text-gray-900">Memory</span>
              </div>
              <span className="text-sm font-semibold text-green-900">
                {memory.used || 0} / {memory.total || 0} GB
              </span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${memory.utilization || 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-green-800 mt-1 text-right font-semibold">
              {(memory.utilization || 0).toFixed(1)}%
            </p>
          </div>

          {/* GPU */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                <span className="font-bold text-gray-900">GPU ({gpu.model || 'N/A'})</span>
              </div>
              <span className="text-sm font-semibold text-purple-900">
                {gpu.usedMemory || 0} / {gpu.totalMemory || 0} GB
              </span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${gpu.utilization || 0}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-purple-800 font-medium">
                {gpu.count || 0} GPUs Available
              </p>
              <p className="text-xs text-purple-800 font-semibold">
                {(gpu.utilization || 0).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Storage & Network in Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="w-4 h-4 text-orange-600" />
                <span className="font-bold text-sm text-gray-900">Storage</span>
              </div>
              <p className="text-lg font-bold text-orange-900">{storage.used || 0} GB</p>
              <p className="text-xs text-orange-700">of {storage.total || 0} GB</p>
            </div>
            <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wifi className="w-4 h-4 text-cyan-600" />
                <span className="font-bold text-sm text-gray-900">Network</span>
              </div>
              <p className="text-lg font-bold text-cyan-900">{network.currentThroughput || 0} Gbps</p>
              <p className="text-xs text-cyan-700">of {network.bandwidth || 0} Gbps</p>
            </div>
          </div>
        </div>
      </div>

      {/* Deployed Services */}
      {deployedServices.length > 0 && (
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-purple-600" />
            <h4 className="text-lg font-bold text-gray-900">Deployed Services</h4>
            <span className="ml-auto px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
              {deployedServices.length} Active
            </span>
          </div>

          <div className="space-y-3">
            {deployedServices.map((service, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="font-bold text-gray-900">{service.serviceName}</h5>
                    <p className="text-xs text-gray-500 mt-0.5">ID: {service.deploymentId}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    service.status === 'RUNNING' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {service.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="bg-blue-50 rounded-lg p-2">
                    <p className="text-gray-600 font-medium mb-1">Instances</p>
                    <p className="font-bold text-blue-900">{service.instances || 0}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2">
                    <p className="text-gray-600 font-medium mb-1">CPU Usage</p>
                    <p className="font-bold text-green-900">{service.resourceUsage?.cpu || 0} cores</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-2">
                    <p className="text-gray-600 font-medium mb-1">GPU Memory</p>
                    <p className="font-bold text-purple-900">{service.resourceUsage?.gpuMemory || 0} GB</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-2">
                    <p className="text-gray-600 font-medium mb-1">Active Users</p>
                    <p className="font-bold text-orange-900">{service.activeUsers || 0}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {metrics && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <div>
                <p className="text-gray-500 font-medium">Avg Latency</p>
                <p className="font-bold text-gray-900">{metrics.avgLatency || 0} ms</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-gray-500 font-medium">Uptime</p>
                <p className="font-bold text-gray-900">{metrics.uptime || 0}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-gray-500 font-medium">Total Requests</p>
                <p className="font-bold text-gray-900">{(metrics.totalRequests || 0).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <div>
                <p className="text-gray-500 font-medium">Error Rate</p>
                <p className="font-bold text-gray-900">{metrics.errorRate || 0}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Capabilities */}
      {server.capabilities && server.capabilities.length > 0 && (
        <div className="px-6 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-t border-gray-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-gray-600">Capabilities:</span>
            {server.capabilities.map((cap, index) => (
              <span key={index} className="px-2 py-1 bg-white border border-purple-200 text-purple-700 rounded-lg text-xs font-semibold">
                {cap}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EdgeServerCard;
