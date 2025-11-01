import {
  Package,
  Cpu,
  HardDrive,
  Zap,
  Activity,
  Clock,
  Wifi,
  CheckCircle,
  AlertCircle,
  Code,
  Box,
  Layers
} from 'lucide-react';

const AIServiceCard = ({ service }) => {
  if (!service) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-red-600 font-medium">Invalid service data</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'BETA':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'DEPRECATED':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'COMPUTER_VISION': 'from-blue-500 to-cyan-600',
      'GAMING': 'from-purple-500 to-pink-600',
      'NLP': 'from-green-500 to-emerald-600',
      'ROBOTICS': 'from-orange-500 to-red-600',
      'HEALTHCARE': 'from-pink-500 to-rose-600',
      'INDUSTRIAL_IOT': 'from-indigo-500 to-purple-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const requirements = service.resourceRequirements || {};
  const qosReqs = service.qosRequirements || {};
  const deployment = service.deployment || {};
  const pricing = service.pricing || {};

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getCategoryColor(service.category)} px-6 py-5 text-white`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{service.serviceName}</h3>
              <p className="text-white/80 text-sm mt-1">v{service.version} • {service.serviceId}</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-xl border ${getStatusColor(service.status)} bg-white/90 backdrop-blur-sm font-semibold text-sm flex items-center gap-2`}>
            {service.status === 'AVAILABLE' && <CheckCircle className="w-4 h-4" />}
            {service.status === 'BETA' && <Activity className="w-4 h-4" />}
            {service.status === 'DEPRECATED' && <AlertCircle className="w-4 h-4" />}
            {service.status}
          </div>
        </div>
      </div>

      {/* Category & Vendor */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Category</p>
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-semibold">
              {service.category?.replace('_', ' ')}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 font-medium mb-1">Vendor</p>
            <p className="text-sm font-bold text-gray-900">{service.vendor}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-6 py-4 border-b border-gray-100">
        <p className="text-gray-700 leading-relaxed">{service.description}</p>
      </div>

      {/* Resource Requirements */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="w-5 h-5 text-indigo-600" />
          <h4 className="text-lg font-bold text-gray-900">Resource Requirements</h4>
          {requirements.gpuRequired && (
            <span className="ml-auto px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold flex items-center gap-1">
              <Zap className="w-3 h-3" />
              GPU Required
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <p className="text-xs text-gray-600 font-medium">CPU</p>
            </div>
            <p className="text-lg font-bold text-blue-900">{requirements.cpuPerInstance || 0}</p>
            <p className="text-xs text-blue-700">cores/instance</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="w-4 h-4 text-green-600" />
              <p className="text-xs text-gray-600 font-medium">Memory</p>
            </div>
            <p className="text-lg font-bold text-green-900">{requirements.memoryPerInstance || 0}</p>
            <p className="text-xs text-green-700">GB/instance</p>
          </div>

          {requirements.gpuRequired && (
            <>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <p className="text-xs text-gray-600 font-medium">GPU Memory</p>
                </div>
                <p className="text-lg font-bold text-purple-900">{requirements.gpuMemoryPerInstance || 0}</p>
                <p className="text-xs text-purple-700">GB/instance</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  <p className="text-xs text-gray-600 font-medium">GPU Count</p>
                </div>
                <p className="text-lg font-bold text-indigo-900">{requirements.gpuCountPerInstance || 0}</p>
                <p className="text-xs text-indigo-700">GPUs/instance</p>
              </div>
            </>
          )}

          {!requirements.gpuRequired && (
            <>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <HardDrive className="w-4 h-4 text-orange-600" />
                  <p className="text-xs text-gray-600 font-medium">Storage</p>
                </div>
                <p className="text-lg font-bold text-orange-900">{requirements.storagePerInstance || 0}</p>
                <p className="text-xs text-orange-700">GB/instance</p>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-4 h-4 text-cyan-600" />
                  <p className="text-xs text-gray-600 font-medium">Instances</p>
                </div>
                <p className="text-lg font-bold text-cyan-900">{requirements.minInstances || 0}-{requirements.maxInstances || 0}</p>
                <p className="text-xs text-cyan-700">min-max</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* QoS Requirements */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-green-600" />
          <h4 className="text-lg font-bold text-gray-900">QoS Requirements</h4>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 text-center">
            <Clock className="w-5 h-5 text-red-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600 font-medium mb-1">Max Latency</p>
            <p className="text-2xl font-bold text-red-900">{qosReqs.maxLatency || 0}</p>
            <p className="text-xs text-red-700">ms</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
            <Wifi className="w-5 h-5 text-blue-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600 font-medium mb-1">Min Bandwidth</p>
            <p className="text-2xl font-bold text-blue-900">{qosReqs.minBandwidth || 0}</p>
            <p className="text-xs text-blue-700">Mbps</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
            <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600 font-medium mb-1">Reliability</p>
            <p className="text-2xl font-bold text-green-900">{qosReqs.reliabilityTarget || 0}</p>
            <p className="text-xs text-green-700">%</p>
          </div>
        </div>
      </div>

      {/* Capabilities */}
      {service.capabilities && service.capabilities.length > 0 && (
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-yellow-600" />
            <h4 className="text-sm font-bold text-gray-900">Capabilities</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {service.capabilities.map((cap, index) => (
              <span key={index} className="px-3 py-1 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 text-yellow-800 rounded-lg text-xs font-semibold">
                {cap}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Deployment Info */}
      {deployment.containerImage && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Box className="w-5 h-5 text-indigo-600" />
            <h4 className="text-sm font-bold text-gray-900">Deployment</h4>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <Code className="w-4 h-4 text-gray-500 mt-0.5" />
              <div className="flex-1 overflow-hidden">
                <p className="text-xs text-gray-500 font-medium mb-1">Container Image</p>
                <p className="text-xs font-mono text-gray-900 break-all">{deployment.containerImage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pricing */}
      <div className="px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="text-gray-600 font-medium">Pricing Model: </span>
            <span className="font-bold text-gray-900">{pricing.model || 'N/A'}</span>
          </div>
          <div className="flex gap-4">
            <div>
              <span className="text-gray-600 font-medium">Rate: </span>
              <span className="font-bold text-green-700">${pricing.pricePerHour || 0}/hr</span>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Data: </span>
              <span className="font-bold text-green-700">${pricing.pricePerGB || 0}/GB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIServiceCard;
