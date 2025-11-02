import { useState } from 'react';
import {
  Upload,
  Send,
  RefreshCw,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Code,
  Server,
  FileJson,
  User,
  Cpu,
  Zap,
  Plus,
  Trash2,
  Edit3
} from 'lucide-react';

const GRADCAM_METHODS = [
  'GradCAM',
  'HiResCAM',
  'AblationCAM',
  'XGradCAM',
  'GradCAMPlusPlus',
  'ScoreCAM',
  'LayerCAM',
  'EigenCAM',
  'EigenGradCAM',
  'KPCA_CAM',
  'RandomCAM',
];

const ENDPOINT_TYPES = [
  { value: '/model/run', label: 'Run AI Service' },
  { value: '/model/profile_run', label: 'Profile AI Service' },
  { value: '/xai_model/run', label: 'Run with XAI (Image Classification)' },
  { value: '/xai_model/profile_run', label: 'Profile with XAI' },
  { value: '/help', label: 'Get Help Information', method: 'GET' },
];

const TestAIServicesPage = () => {
  const [serverUrl, setServerUrl] = useState('');
  const [ueId, setUeId] = useState('123456');
  const [endpointType, setEndpointType] = useState('/model/run');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  // XAI-specific fields
  const [gradcamMethod, setGradcamMethod] = useState('GradCAM');
  const [targetCategories, setTargetCategories] = useState('');

  // Dynamic custom fields - array of {name: string, values: string[], type: 'string' | 'array'}
  const [customFields, setCustomFields] = useState([]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
      setError(null);
    }
  };

  // Clear selected file
  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  // Add a new custom field
  const addCustomField = () => {
    setCustomFields([...customFields, { name: '', values: [''], type: 'string' }]);
  };

  // Remove a custom field
  const removeCustomField = (index) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  // Update custom field name
  const updateCustomFieldName = (index, name) => {
    const updated = [...customFields];
    updated[index].name = name;
    setCustomFields(updated);
  };

  // Update custom field value (for string type, index 0)
  const updateCustomFieldValue = (index, valueIndex, value) => {
    const updated = [...customFields];
    updated[index].values[valueIndex] = value;
    setCustomFields(updated);
  };

  // Update custom field type
  const updateCustomFieldType = (index, type) => {
    const updated = [...customFields];
    updated[index].type = type;
    // When switching to array, ensure at least one value
    if (type === 'array' && updated[index].values.length === 0) {
      updated[index].values = [''];
    }
    setCustomFields(updated);
  };

  // Add array item to field
  const addArrayItem = (index) => {
    const updated = [...customFields];
    updated[index].values.push('');
    setCustomFields(updated);
  };

  // Remove array item from field
  const removeArrayItem = (index, valueIndex) => {
    const updated = [...customFields];
    updated[index].values = updated[index].values.filter((_, i) => i !== valueIndex);
    // Keep at least one value
    if (updated[index].values.length === 0) {
      updated[index].values = [''];
    }
    setCustomFields(updated);
  };

  // Check if current endpoint is XAI-related
  const isXaiEndpoint = () => {
    return endpointType.includes('xai_model');
  };

  // Check if current endpoint is GET request
  const isGetRequest = () => {
    const endpoint = ENDPOINT_TYPES.find(e => e.value === endpointType);
    return endpoint?.method === 'GET';
  };

  // Validate inputs
  const validateInputs = () => {
    if (!serverUrl) {
      setError('Please enter a server URL');
      return false;
    }

    return true;
  };

  // Test the API endpoint
  const testApiEndpoint = async () => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const fullUrl = `${serverUrl}${endpointType}`;
      let result;

      if (isGetRequest()) {
        // GET request for /help endpoint
        result = await fetch(fullUrl);
      } else {
        // POST request with FormData
        const formData = new FormData();

        // Add ue_id as form field (always required for POST)
        formData.append('ue_id', ueId);

        // Add file if selected
        if (selectedFile) {
          formData.append('file', selectedFile);
        }

        // Add custom fields (filter out empty field names)
        customFields.forEach(field => {
          if (field.name.trim()) {
            if (field.type === 'array') {
              // For array type, append each non-empty value separately with the same field name
              // This way the backend receives it as an array
              const nonEmptyValues = field.values.filter(v => v.trim().length > 0);
              nonEmptyValues.forEach(value => {
                formData.append(field.name, value);
              });
            } else {
              // For string type, just append the first value
              const value = field.values[0] || '';
              if (value.trim()) {
                formData.append(field.name, value);
              }
            }
          }
        });

        // Add XAI-specific fields if needed
        if (isXaiEndpoint()) {
          formData.append('gradcam_method_name', gradcamMethod);

          // Parse target categories
          if (targetCategories.trim()) {
            const categoriesArray = targetCategories.split(',').map(c => c.trim()).filter(c => c);
            formData.append('target_category_indexes', JSON.stringify(categoriesArray.map(Number)));
          } else {
            formData.append('target_category_indexes', JSON.stringify([]));
          }
        }

        result = await fetch(fullUrl, {
          method: 'POST',
          body: formData,
        });
      }

      if (!result.ok) {
        throw new Error(`HTTP ${result.status}: ${result.statusText}`);
      }

      const data = await result.json();

      // Extract custom headers
      const customHeaders = {
        'X-Process-Time': result.headers.get('X-Process-Time'),
        'X-NODE-ID': result.headers.get('X-NODE-ID'),
        'X-K8S-POD-NAME': result.headers.get('X-K8S-POD-NAME'),
      };

      setResponse({
        status: result.status,
        statusText: result.statusText,
        headers: customHeaders,
        allHeaders: Object.fromEntries(result.headers.entries()),
        data: data
      });
    } catch (err) {
      console.error('Error testing API:', err);
      setError(err.message || 'Failed to test API endpoint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
              <Server className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Test AI Services
              </h1>
              <p className="text-sm text-gray-600 mt-1">Test deployed AI services with flexible custom parameters</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Panel - Configuration */}
            <div className="space-y-6">
              {/* Server Configuration */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                    <Server className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Server Configuration</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Server URL
                    </label>
                    <input
                      type="text"
                      value={serverUrl}
                      onChange={(e) => setServerUrl(e.target.value)}
                      placeholder="http://localhost:9000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        UE ID (User Equipment ID)
                      </div>
                    </label>
                    <input
                      type="text"
                      value={ueId}
                      onChange={(e) => setUeId(e.target.value)}
                      placeholder="123456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Endpoint Type
                    </label>
                    <select
                      value={endpointType}
                      onChange={(e) => setEndpointType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      {ENDPOINT_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* File Upload */}
              {!isGetRequest() && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">File Upload (Optional)</h2>
                  </div>

                  {!selectedFile ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-500 transition-all">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <div className="p-3 bg-gray-100 rounded-full">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">
                            Click to upload file
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Any file type supported
                          </p>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {previewUrl && (
                        <div className="rounded-xl overflow-hidden border border-gray-200">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-48 object-contain bg-gray-50"
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-gray-600" />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(selectedFile.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={clearFile}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* XAI Options (only show for XAI endpoints) */}
              {isXaiEndpoint() && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                      <Cpu className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">XAI Options</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GradCAM Method
                      </label>
                      <select
                        value={gradcamMethod}
                        onChange={(e) => setGradcamMethod(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      >
                        {GRADCAM_METHODS.map(method => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Category Indexes (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={targetCategories}
                        onChange={(e) => setTargetCategories(e.target.value)}
                        placeholder="111, 32, 44 (leave empty for top confident category)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Leave empty to explain the top confident category
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Fields (only show for non-GET endpoints) */}
              {!isGetRequest() && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg">
                        <Edit3 className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Custom Parameters</h2>
                    </div>
                    <button
                      onClick={addCustomField}
                      className="flex items-center gap-2 px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-all text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add Field
                    </button>
                  </div>

                  {customFields.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">No custom parameters added yet</p>
                      <p className="text-xs mt-1">Click "Add Field" to add custom parameters</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {customFields.map((field, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="flex gap-2 items-start mb-3">
                            <div className="flex-1">
                              <input
                                type="text"
                                value={field.name}
                                onChange={(e) => updateCustomFieldName(index, e.target.value)}
                                placeholder="Field name (e.g., text, text_prompt, sentences)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm font-medium"
                              />
                            </div>
                            <select
                              value={field.type}
                              onChange={(e) => updateCustomFieldType(index, e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                            >
                              <option value="string">String</option>
                              <option value="array">Array of Strings</option>
                            </select>
                            <button
                              onClick={() => removeCustomField(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Remove field"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Values */}
                          <div className="space-y-2">
                            {field.values.map((value, valueIndex) => (
                              <div key={valueIndex} className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  value={value}
                                  onChange={(e) => updateCustomFieldValue(index, valueIndex, e.target.value)}
                                  placeholder={field.type === 'array' ? `Item ${valueIndex + 1}` : 'Value'}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                                />
                                {field.type === 'array' && (
                                  <div className="flex gap-1">
                                    {valueIndex === field.values.length - 1 && (
                                      <button
                                        onClick={() => addArrayItem(index)}
                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                        title="Add item"
                                      >
                                        <Plus className="w-4 h-4" />
                                      </button>
                                    )}
                                    {field.values.length > 1 && (
                                      <button
                                        onClick={() => removeArrayItem(index, valueIndex)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        title="Remove item"
                                      >
                                        <XCircle className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-800">
                      <strong>Tip:</strong> Select "Array of Strings" type and use the + button to add multiple items. Each item will be sent as a separate value with the same field name.
                    </p>
                  </div>
                </div>
              )}

              {/* Test Button */}
              <button
                onClick={testApiEndpoint}
                disabled={loading || !serverUrl}
                className="w-full group px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 disabled:from-gray-400 disabled:to-gray-500 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span className="font-semibold">Testing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold">Test API Endpoint</span>
                  </>
                )}
              </button>
            </div>

            {/* Right Panel - Response */}
            <div className="space-y-6">
              {/* Error Display */}
              {error && (
                <div className="bg-red-50/90 backdrop-blur-sm border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-2xl shadow-lg animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Error</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Response */}
              {response && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Response</h2>
                    <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${
                      response.status >= 200 && response.status < 300
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {response.status} {response.statusText}
                    </span>
                  </div>

                  {/* Custom Headers */}
                  {response.headers && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Server className="w-4 h-4" />
                        Service Information
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        {response.headers['X-Process-Time'] && (
                          <div className="bg-blue-50 rounded-lg p-3 flex justify-between items-center">
                            <span className="text-xs font-medium text-gray-600">Process Time</span>
                            <span className="text-sm font-bold text-blue-700">{response.headers['X-Process-Time']}</span>
                          </div>
                        )}
                        {response.headers['X-NODE-ID'] && (
                          <div className="bg-purple-50 rounded-lg p-3 flex justify-between items-center">
                            <span className="text-xs font-medium text-gray-600">Node ID</span>
                            <span className="text-sm font-bold text-purple-700">{response.headers['X-NODE-ID']}</span>
                          </div>
                        )}
                        {response.headers['X-K8S-POD-NAME'] && (
                          <div className="bg-green-50 rounded-lg p-3 flex justify-between items-center">
                            <span className="text-xs font-medium text-gray-600">K8S Pod Name</span>
                            <span className="text-sm font-bold text-green-700">{response.headers['X-K8S-POD-NAME']}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* XAI Image (if present) */}
                  {response.data?.xai_results?.image && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        XAI Visualization
                      </h3>
                      <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                        <img
                          src={`data:image/png;base64,${response.data.xai_results.image}`}
                          alt="XAI Heatmap"
                          className="w-full h-auto"
                        />
                      </div>
                      {response.data.xai_results.xai_method && (
                        <p className="text-xs text-gray-600 mt-2">
                          Method: <span className="font-semibold">{response.data.xai_results.xai_method}</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Model Results (for XAI) */}
                  {response.data?.model_results && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        Model Results
                      </h3>
                      <div className="bg-gray-50 rounded-xl p-4 max-h-48 overflow-y-auto">
                        <pre className="text-xs font-mono text-gray-700 leading-relaxed">
                          {JSON.stringify(response.data.model_results, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Response Body */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FileJson className="w-4 h-4" />
                      Full Response
                    </h3>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 max-h-96 overflow-y-auto">
                      <pre className="text-xs font-mono text-gray-700 leading-relaxed">
                        {JSON.stringify(response.data, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Placeholder when no response */}
              {!response && !error && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                  <div className="inline-block p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full mb-4">
                    <Zap className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Test</h3>
                  <p className="text-gray-600">
                    Configure your server, add custom parameters if needed, then click "Test API Endpoint" to see the results.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Example Usage Section */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-600" />
              Common Parameter Examples
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <p className="text-sm font-semibold text-gray-700 mb-2">Text Input</p>
                <code className="text-xs text-gray-600 block">Field: text</code>
                <code className="text-xs text-gray-600 block">Value: "Your text here"</code>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <p className="text-sm font-semibold text-gray-700 mb-2">Prompt</p>
                <code className="text-xs text-gray-600 block">Field: prompt</code>
                <code className="text-xs text-gray-600 block">Value: "Generate an image..."</code>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <p className="text-sm font-semibold text-gray-700 mb-2">Text Prompts (Array)</p>
                <code className="text-xs text-gray-600 block">Field: text_prompt</code>
                <code className="text-xs text-gray-600 block">Type: Array of Strings</code>
                <code className="text-xs text-gray-600 block">Items: "a cat", "a dog"</code>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                <p className="text-sm font-semibold text-gray-700 mb-2">Sequence</p>
                <code className="text-xs text-gray-600 block">Field: sequence</code>
                <code className="text-xs text-gray-600 block">Value: "Text to classify"</code>
              </div>
              <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl">
                <p className="text-sm font-semibold text-gray-700 mb-2">Candidate Labels (Array)</p>
                <code className="text-xs text-gray-600 block">Field: candidate_labels</code>
                <code className="text-xs text-gray-600 block">Type: Array of Strings</code>
                <code className="text-xs text-gray-600 block">Items: "sports", "tech"</code>
              </div>
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl">
                <p className="text-sm font-semibold text-gray-700 mb-2">Custom Field</p>
                <code className="text-xs text-gray-600 block">Field: your_field_name</code>
                <code className="text-xs text-gray-600 block">Value: your_value</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAIServicesPage;
