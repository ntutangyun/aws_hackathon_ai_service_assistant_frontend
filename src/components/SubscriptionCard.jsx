import {
  User,
  Phone,
  Signal,
  Wifi,
  Zap,
  Database,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Cpu,
  HardDrive,
  TrendingUp,
  BarChart3
} from 'lucide-react';

const SubscriptionCard = ({ subscription }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'SUSPENDED':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'TERMINATED':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'ULTRA_HIGH':
        return 'text-purple-600 bg-purple-50';
      case 'PREMIUM':
        return 'text-blue-600 bg-blue-50';
      case 'HIGH':
        return 'text-indigo-600 bg-indigo-50';
      case 'MEDIUM':
        return 'text-cyan-600 bg-cyan-50';
      case 'STANDARD':
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const cellular = subscription.cellularSubscription;
  const edgeAI = subscription.edgeAISubscriptions || [];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-5 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{subscription.subscriberName}</h3>
              <p className="text-blue-100 text-sm mt-1">ID: {subscription.subscriberId}</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-xl border ${getStatusColor(subscription.subscriptionStatus)} bg-white/90 backdrop-blur-sm font-semibold text-sm flex items-center gap-2`}>
            {subscription.subscriptionStatus === 'ACTIVE' && <CheckCircle className="w-4 h-4" />}
            {subscription.subscriptionStatus === 'SUSPENDED' && <Clock className="w-4 h-4" />}
            {subscription.subscriptionStatus === 'TERMINATED' && <XCircle className="w-4 h-4" />}
            {subscription.subscriptionStatus}
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">MSISDN</p>
              <p className="text-sm font-semibold text-gray-900">{subscription.msisdn}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Signal className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">IMSI</p>
              <p className="text-sm font-semibold text-gray-900">{subscription.imsi}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cellular Subscription */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Wifi className="w-5 h-5 text-blue-600" />
          <h4 className="text-lg font-bold text-gray-900">Cellular Plan</h4>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <p className="text-xs text-gray-600 font-medium mb-1">Plan Type</p>
            <p className="text-lg font-bold text-blue-900">{cellular.planType}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <p className="text-xs text-gray-600 font-medium mb-1">Data Used</p>
            <p className="text-lg font-bold text-green-900">{cellular.dataUsed} GB</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
            <p className="text-xs text-gray-600 font-medium mb-1">Data Limit</p>
            <p className="text-lg font-bold text-purple-900">
              {cellular.dataLimit ? `${cellular.dataLimit} GB` : 'Unlimited'}
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
            <p className="text-xs text-gray-600 font-medium mb-1">Remaining</p>
            <p className="text-lg font-bold text-orange-900">
              {cellular.dataLimit ? `${(cellular.dataLimit - cellular.dataUsed).toFixed(1)} GB` : '∞'}
            </p>
          </div>
        </div>

        {/* QoS Parameters */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-indigo-600" />
            <h5 className="text-sm font-bold text-gray-900">QoS Profile</h5>
            <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(cellular.qos.priority)}`}>
              {cellular.qos.priority}
            </span>
          </div>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div>
              <p className="text-gray-500 font-medium mb-1">QCI</p>
              <p className="font-bold text-gray-900">{cellular.qos.qci}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium mb-1">DL Speed</p>
              <p className="font-bold text-gray-900">{cellular.qos.maxBitRateDL} Mbps</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium mb-1">UL Speed</p>
              <p className="font-bold text-gray-900">{cellular.qos.maxBitRateUL} Mbps</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium mb-1">Guaranteed DL</p>
              <p className="font-bold text-gray-900">{cellular.qos.guaranteedBitRateDL} Mbps</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium mb-1">Guaranteed UL</p>
              <p className="font-bold text-gray-900">{cellular.qos.guaranteedBitRateUL} Mbps</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium mb-1">Latency</p>
              <p className="font-bold text-gray-900">{cellular.qos.latency} ms</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edge AI Subscriptions */}
      {edgeAI.length > 0 && (
        <div className="px-6 py-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-purple-600" />
            <h4 className="text-lg font-bold text-gray-900">Edge AI Services</h4>
            <span className="ml-auto px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
              {edgeAI.length} Active
            </span>
          </div>

          <div className="space-y-3">
            {edgeAI.map((service, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                      <Cpu className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-900">{service.serviceName}</h5>
                      <p className="text-xs text-gray-500 mt-0.5">ID: {service.serviceId}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    service.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {service.status}
                  </span>
                </div>

                {/* Service QoS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3 text-xs">
                  <div className="bg-indigo-50 rounded-lg p-2">
                    <p className="text-gray-600 font-medium mb-1">Priority</p>
                    <p className="font-bold text-indigo-900">{service.qos.priority}</p>
                  </div>
                  <div className="bg-cyan-50 rounded-lg p-2">
                    <p className="text-gray-600 font-medium mb-1">Max Latency</p>
                    <p className="font-bold text-cyan-900">{service.qos.maxLatency} ms</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2">
                    <p className="text-gray-600 font-medium mb-1">Min Bandwidth</p>
                    <p className="font-bold text-blue-900">{service.qos.minBandwidth} Mbps</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-2">
                    <p className="text-gray-600 font-medium mb-1">Compute Units</p>
                    <p className="font-bold text-purple-900">{service.qos.computeUnits} units</p>
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="flex items-center gap-4 text-xs bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Compute:</span>
                    <span className="font-bold text-gray-900">{service.usage.computeHours} hrs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Data:</span>
                    <span className="font-bold text-gray-900">{service.usage.dataProcessed} GB</span>
                  </div>
                  {service.qos.gpuEnabled && (
                    <div className="ml-auto px-2 py-1 bg-green-100 text-green-700 rounded font-semibold flex items-center gap-1">
                      <Cpu className="w-3 h-3" />
                      GPU
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer - Timestamps */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Database className="w-3 h-3" />
          <span>Created: {new Date(subscription.createdAt).toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3 h-3" />
          <span>Updated: {new Date(subscription.updatedAt).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;
