import React, { useState } from 'react';

const UploadImage = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debug, setDebug] = useState('');

  const handleFileChange = (e) => {
    console.log('File selected:', e.target.files[0]);
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError('');
      setDebug(`File selected: ${selectedFile.name} (${(selectedFile.size/1024).toFixed(1)} KB)`);
    }
  };

  const handleUpload = async () => {
    console.log('Upload button clicked');
    setDebug('Upload button clicked');
    
    if (!file) {
      setError('Please select an image first');
      setDebug('No file selected');
      return;
    }

    setLoading(true);
    setError('');
    setDebug('Starting upload...');

    const formData = new FormData();
    formData.append('image', file);

    try {
      setDebug('Sending to http://localhost:5000/predict');
      console.log('Sending to backend...', file);
      
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData
      });
      
      console.log('Response status:', response.status);
      setDebug(`Response status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Success! Result:', result);
      setDebug(`Success! Got result: ${result.class || 'Unknown'}`);
      
      onUploadSuccess(result);
    } catch (err) {
      console.error('Upload error:', err);
      setError(`Failed: ${err.message}`);
      setDebug(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: '#2E7D32' }}>📸 Upload E-Waste Image</h2>
      <p style={{ color: '#666' }}>Take a clear photo of your e-waste item</p>

      {/* DEBUG INFO */}
      <div style={{ 
        background: '#f0f0f0', 
        padding: '10px', 
        margin: '10px 0',
        borderRadius: '5px',
        fontSize: '12px',
        fontFamily: 'monospace'
      }}>
        <strong>Debug:</strong> {debug || 'No action yet'}
      </div>

      <div style={{
        border: '2px dashed #4CAF50',
        padding: '40px',
        textAlign: 'center',
        margin: '30px 0',
        borderRadius: '10px',
        background: '#f9f9f9'
      }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          id="file-input"
          style={{ display: 'none' }}
        />
        <label htmlFor="file-input" style={{ cursor: 'pointer', display: 'block' }}>
          <div style={{ fontSize: '60px', color: '#4CAF50' }}>📁</div>
          <div style={{ margin: '15px 0' }}>
            <div style={{
              padding: '12px 30px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              display: 'inline-block'
            }}>
              Choose Image File
            </div>
          </div>
          <p style={{ color: '#888' }}>Click to select JPG, PNG, or other image files</p>
        </label>
      </div>

      {preview && (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <h4>Image Preview:</h4>
          <img 
            src={preview} 
            alt="Preview" 
            style={{ 
              maxWidth: '300px', 
              maxHeight: '200px', 
              border: '2px solid #ddd',
              borderRadius: '8px',
              margin: '10px 0'
            }}
          />
          <p style={{ fontSize: '14px', color: '#555' }}>
            Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
          </p>
        </div>
      )}

      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <button
          onClick={handleUpload}
          disabled={loading || !file}
          style={{
            padding: '15px 50px',
            background: loading ? '#999' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 8px rgba(33, 150, 243, 0.3)'
          }}
        >
          {loading ? 'Analyzing...' : 'Analyze E-Waste'}
        </button>
      </div>

      {error && (
        <div style={{
          background: '#FFEBEE',
          color: '#D32F2F',
          padding: '15px',
          borderRadius: '5px',
          margin: '20px 0',
          border: '1px solid #FFCDD2'
        }}>
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      <div style={{
        marginTop: '40px',
        padding: '20px',
        background: '#E8F5E9',
        borderRadius: '10px',
        textAlign: 'left'
      }}>
        <h4>📋 How to test:</h4>
        <ol>
          <li>Click "Choose Image File"</li>
          <li>Select any image from your computer</li>
          <li>Click "Analyze E-Waste"</li>
          <li>Check debug messages above</li>
          <li>Open browser Console (F12) for more details</li>
        </ol>
      </div>
    </div>
  );
};

export default UploadImage;