// API service for MCP server data
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// UDM (Unified Data Management) APIs
export const udmApi = {
  getAllSubscriptions: async (status = null) => {
    const url = new URL(`${API_URL}/mcp/udm/subscriptions`);
    if (status) url.searchParams.append('status', status);
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch subscriptions');
    return response.json();
  },

  getSubscription: async (subscriberId) => {
    const response = await fetch(`${API_URL}/mcp/udm/subscriptions/${subscriberId}`);
    if (!response.ok) throw new Error('Failed to fetch subscription');
    return response.json();
  },

  getSubscriptionSummary: async () => {
    const response = await fetch(`${API_URL}/mcp/udm/summary`);
    if (!response.ok) throw new Error('Failed to fetch subscription summary');
    return response.json();
  },

  getQosProfile: async (subscriberId) => {
    const response = await fetch(`${API_URL}/mcp/udm/subscriptions/${subscriberId}/qos`);
    if (!response.ok) throw new Error('Failed to fetch QoS profile');
    return response.json();
  },

  getEdgeAISubscriptions: async (subscriberId) => {
    const response = await fetch(`${API_URL}/mcp/udm/subscriptions/${subscriberId}/edge-ai`);
    if (!response.ok) throw new Error('Failed to fetch Edge AI subscriptions');
    return response.json();
  }
};

// Edge Server APIs
export const edgeServerApi = {
  getAllServers: async (status = null, health = null) => {
    const url = new URL(`${API_URL}/mcp/edge/servers`);
    if (status) url.searchParams.append('status', status);
    if (health) url.searchParams.append('health', health);
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch edge servers');
    return response.json();
  },

  getServer: async (serverId) => {
    const response = await fetch(`${API_URL}/mcp/edge/servers/${serverId}`);
    if (!response.ok) throw new Error('Failed to fetch edge server');
    return response.json();
  },

  getServerResources: async (serverId) => {
    const response = await fetch(`${API_URL}/mcp/edge/servers/${serverId}/resources`);
    if (!response.ok) throw new Error('Failed to fetch server resources');
    return response.json();
  },

  getGpuResources: async (serverId) => {
    const response = await fetch(`${API_URL}/mcp/edge/servers/${serverId}/gpu`);
    if (!response.ok) throw new Error('Failed to fetch GPU resources');
    return response.json();
  },

  getDeployedServices: async (serverId) => {
    const response = await fetch(`${API_URL}/mcp/edge/servers/${serverId}/services`);
    if (!response.ok) throw new Error('Failed to fetch deployed services');
    return response.json();
  },

  getNetworkSummary: async () => {
    const response = await fetch(`${API_URL}/mcp/edge/network-summary`);
    if (!response.ok) throw new Error('Failed to fetch network summary');
    return response.json();
  },

  getHealthStatus: async () => {
    const response = await fetch(`${API_URL}/mcp/edge/health-status`);
    if (!response.ok) throw new Error('Failed to fetch health status');
    return response.json();
  },

  findServersWithCapacity: async (requirements) => {
    const url = new URL(`${API_URL}/mcp/edge/servers/find-capacity`);
    Object.entries(requirements).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, value);
      }
    });
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to find servers with capacity');
    return response.json();
  }
};

// AI Service Repository APIs
export const aiServiceApi = {
  getAllServices: async (category = null, status = null, gpuRequired = null) => {
    const url = new URL(`${API_URL}/mcp/ai-services/services`);
    if (category) url.searchParams.append('category', category);
    if (status) url.searchParams.append('status', status);
    if (gpuRequired !== null) url.searchParams.append('gpu_required', gpuRequired);
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch AI services');
    return response.json();
  },

  getService: async (serviceId) => {
    const response = await fetch(`${API_URL}/mcp/ai-services/services/${serviceId}`);
    if (!response.ok) throw new Error('Failed to fetch AI service');
    return response.json();
  },

  searchServices: async (keyword) => {
    const response = await fetch(`${API_URL}/mcp/ai-services/services/search?keyword=${encodeURIComponent(keyword)}`);
    if (!response.ok) throw new Error('Failed to search services');
    return response.json();
  },

  getCategories: async () => {
    const response = await fetch(`${API_URL}/mcp/ai-services/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  getCatalogSummary: async () => {
    const response = await fetch(`${API_URL}/mcp/ai-services/summary`);
    if (!response.ok) throw new Error('Failed to fetch catalog summary');
    return response.json();
  },

  getServiceRequirements: async (serviceId) => {
    const response = await fetch(`${API_URL}/mcp/ai-services/services/${serviceId}/requirements`);
    if (!response.ok) throw new Error('Failed to fetch service requirements');
    return response.json();
  },

  getDeploymentInfo: async (serviceId) => {
    const response = await fetch(`${API_URL}/mcp/ai-services/services/${serviceId}/deployment`);
    if (!response.ok) throw new Error('Failed to fetch deployment info');
    return response.json();
  },

  findServicesByResources: async (constraints) => {
    const url = new URL(`${API_URL}/mcp/ai-services/services/find-by-resources`);
    Object.entries(constraints).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, value);
      }
    });
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to find services by resources');
    return response.json();
  }
};
