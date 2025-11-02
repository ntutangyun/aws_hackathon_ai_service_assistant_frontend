import { useState } from 'react';
import {
  Upload,
  Send,
  RefreshCw,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Code,
  Link as LinkIcon,
  Zap,
  Server,
  FileJson,
  User,
  Cpu,
  FileAudio,
  Type,
  List,
  Layers
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

const MODEL_TYPES = [
  { value: 'image-classification', label: 'Image Classification', icon: ImageIcon, acceptFiles: 'image/*', needsFile: true },
  { value: 'text-classification', label: 'Text Classification', icon: Type, needsFile: false },
  { value: 'ner', label: 'Named Entity Recognition (NER)', icon: Type, needsFile: false },
  { value: 'image-captioning', label: 'Image Captioning', icon: ImageIcon, acceptFiles: 'image/*', needsFile: true },
  { value: 'audio-transcription', label: 'Audio Transcription', icon: FileAudio, acceptFiles: 'audio/*', needsFile: true },
  { value: 'sentence-embeddings', label: 'Sentence Embeddings', icon: Layers, needsFile: false },
  { value: 'image-generation', label: 'Image Generation/Refinement', icon: ImageIcon, acceptFiles: 'image/*', needsFile: true },
  { value: 'zero-shot-classification', label: 'Zero-shot Classification', icon: List, needsFile: false },
];

const TestAIServicesPage = () => {
  const [serverUrl, setServerUrl] = useState('');
  const [ueId, setUeId] = useState('123456');
  const [endpointType, setEndpointType] = useState('/model/run');
  const [modelType, setModelType] = useState('image-classification');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  // XAI-specific fields
  const [gradcamMethod, setGradcamMethod] = useState('GradCAM');
  const [targetCategories, setTargetCategories] = useState('');

  // Model-specific input fields
  const [textInput, setTextInput] = useState('');
  const [promptInput, setPromptInput] = useState('');
  const [sentencesInput, setSentencesInput] = useState('');
  const [sequenceInput, setSequenceInput] = useState('');
  const [candidateLabels, setCandidateLabels] = useState('');

  // Get current model type configuration
  const getCurrentModelConfig = () => {
    return MODEL_TYPES.find(m => m.value === modelType);
  };

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

  // Check if current endpoint is XAI-related
  const isXaiEndpoint = () => {
    return endpointType.includes('xai_model');
  };

  // Check if current endpoint is GET request
  const isGetRequest = () => {
    const endpoint = ENDPOINT_TYPES.find(e => e.value === endpointType);
    return endpoint?.method === 'GET';
  };

  // Validate inputs based on model type
  const validateInputs = () => {
    if (!serverUrl) {
      setError('Please enter a server URL');
      return false;
    }

    if (isGetRequest()) {
      return true;
    }

    const modelConfig = getCurrentModelConfig();

    // Check file requirement
    if (modelConfig?.needsFile && !selectedFile) {
      setError('Please select a file to upload');
      return false;
    }

    // Check text-based inputs
    switch (modelType) {
      case 'text-classification':
      case 'ner':
        if (!textInput.trim()) {
          setError('Please enter text input');
          return false;
        }
        break;
      case 'image-generation':
        if (!promptInput.trim()) {
          setError('Please enter a prompt');
          return false;
        }
        break;
      case 'sentence-embeddings':
        if (!sentencesInput.trim()) {
          setError('Please enter sentences');
          return false;
        }
        break;
      case 'zero-shot-classification':
        if (!sequenceInput.trim()) {
          setError('Please enter text to classify');
          return false;
        }
        if (!candidateLabels.trim()) {
          setError('Please enter candidate labels');
          return false;
        }
        break;
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

        // Add file if needed
        const modelConfig = getCurrentModelConfig();
        if (modelConfig?.needsFile && selectedFile) {
          formData.append('file', selectedFile);
        }

        // Add model-specific fields
        switch (modelType) {
          case 'text-classification':
          case 'ner':
            formData.append('text', textInput);
            break;

          case 'image-captioning':
            if (promptInput.trim()) {
              formData.append('text', promptInput);
            }
            break;

          case 'image-generation':
            formData.append('prompt', promptInput);
            break;

          case 'sentence-embeddings':
            const sentences = sentencesInput.split(',').map(s => s.trim()).filter(s => s);
            formData.append('sentences', JSON.stringify(sentences));
            break;

          case 'zero-shot-classification':
            formData.append('sequence', sequenceInput);
            const labels = candidateLabels.split(',').map(l => l.trim()).filter(l => l);
            formData.append('candidate_labels', JSON.stringify(labels));
            break;
        }

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

  const renderModelSpecificInputs = () => {
    const modelConfig = getCurrentModelConfig();

    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg">
            {modelConfig && <modelConfig.icon className="w-5 h-5 text-white" />}
          </div>
          <h2 className="text-xl font-bold text-gray-900">Model Inputs</h2>
        </div>

        <div className="space-y-4">
          {/* Model Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model Type
            </label>
            <select
              value={modelType}
              onChange={(e) => {
                setModelType(e.target.value);
                setSelectedFile(null);
                setPreviewUrl(null);
                setError(null);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              {MODEL_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Text Input (for text classification, NER) */}
          {(modelType === 'text-classification' || modelType === 'ner') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  {modelType === 'ner' ? 'Text for NER' : 'Text to Classify'}
                </div>
              </label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={modelType === 'ner' ? 'Enter text to extract entities...' : 'Enter text to classify...'}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              />
            </div>
          )}

          {/* Prompt Input (for image generation, image captioning) */}
          {modelType === 'image-captioning' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Prompt (Optional)
                </div>
              </label>
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Optional prompt for conditional image captioning..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          )}

          {modelType === 'image-generation' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Prompt (Required)
                </div>
              </label>
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Enter prompt for image generation/refinement..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              />
            </div>
          )}

          {/* Sentences Input (for sentence embeddings) */}
          {modelType === 'sentence-embeddings' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Sentences (comma-separated)
                </div>
              </label>
              <textarea
                value={sentencesInput}
                onChange={(e) => setSentencesInput(e.target.value)}
                placeholder="Enter sentences separated by commas, e.g., Hello world, How are you?"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              />
            </div>
          )}

          {/* Zero-shot Classification Inputs */}
          {modelType === 'zero-shot-classification' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Sequence to Classify
                  </div>
                </label>
                <textarea
                  value={sequenceInput}
                  onChange={(e) => setSequenceInput(e.target.value)}
                  placeholder="Enter text to classify..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <List className="w-4 h-4" />
                    Candidate Labels (comma-separated)
                  </div>
                </label>
                <input
                  type="text"
                  value={candidateLabels}
                  onChange={(e) => setCandidateLabels(e.target.value)}
                  placeholder="e.g., politics, sports, technology"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </>
          )}

          {/* File Upload */}
          {modelConfig?.needsFile && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  {modelConfig.icon === FileAudio ? <FileAudio className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                  {modelConfig.icon === FileAudio ? 'Audio File' : 'Image File'}
                </div>
              </label>
              {!selectedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-500 transition-all">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept={modelConfig.acceptFiles}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <div className="p-3 bg-gray-100 rounded-full">
                      {modelConfig.icon === FileAudio ?
                        <FileAudio className="w-6 h-6 text-gray-400" /> :
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Click to upload {modelConfig.icon === FileAudio ? 'audio' : 'image'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {modelConfig.acceptFiles}
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
                      {modelConfig.icon === FileAudio ?
                        <FileAudio className="w-4 h-4 text-gray-600" /> :
                        <ImageIcon className="w-4 h-4 text-gray-600" />
                      }
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
        </div>
      </div>
    );
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
              <p className="text-sm text-gray-600 mt-1">Test deployed AI services on (Simulated) Edge Servers</p>
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

              {/* Model-Specific Inputs (only show for non-GET endpoints) */}
              {!isGetRequest() && renderModelSpecificInputs()}

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
                    Configure your server, select a model type, provide required inputs, then click "Test API Endpoint" to see the results.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Example Usage Section */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-600" />
              Model Type Examples
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <p className="text-sm font-semibold text-gray-700 mb-2">Image Classification</p>
                <code className="text-xs text-gray-600 block">File: Image file (JPG, PNG)</code>
                <code className="text-xs text-gray-600 block">Data: ue_id</code>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <p className="text-sm font-semibold text-gray-700 mb-2">Text Classification / NER</p>
                <code className="text-xs text-gray-600 block">Data: text, ue_id</code>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <p className="text-sm font-semibold text-gray-700 mb-2">Image Captioning</p>
                <code className="text-xs text-gray-600 block">File: Image file</code>
                <code className="text-xs text-gray-600 block">Data: text (optional prompt), ue_id</code>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                <p className="text-sm font-semibold text-gray-700 mb-2">Audio Transcription</p>
                <code className="text-xs text-gray-600 block">File: Audio file (MP3, WAV)</code>
                <code className="text-xs text-gray-600 block">Data: ue_id</code>
              </div>
              <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl">
                <p className="text-sm font-semibold text-gray-700 mb-2">Sentence Embeddings</p>
                <code className="text-xs text-gray-600 block">Data: sentences (array), ue_id</code>
              </div>
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl">
                <p className="text-sm font-semibold text-gray-700 mb-2">Zero-shot Classification</p>
                <code className="text-xs text-gray-600 block">Data: sequence, candidate_labels, ue_id</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAIServicesPage;
