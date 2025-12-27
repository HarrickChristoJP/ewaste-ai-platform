import React from 'react';

const ResultsDisplay = ({ result }) => {
  const handleNewUpload = () => {
    window.location.reload();
  };

  if (!result) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h3>No analysis results found</h3>
        <button onClick={handleNewUpload} style={{ marginTop: '20px', padding: '10px 20px' }}>
          ← Upload New Image
        </button>
      </div>
    );
  }

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#757575';
    }
  };

  const getRiskIcon = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'high': return '⚠️⚠️';
      case 'medium': return '⚠️';
      case 'low': return '✅';
      default: return '❓';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <button 
        onClick={handleNewUpload}
        style={{
          marginBottom: '30px',
          padding: '10px 20px',
          background: '#f5f5f5',
          border: '1px solid #ddd',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        ← Upload Another Image
      </button>

      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        border: '1px solid #e0e0e0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: '#2E7D32', margin: 0 }}>{result.class || 'Unknown E-Waste'}</h1>
          <div style={{
            padding: '10px 20px',
            background: getRiskColor(result.risk),
            color: 'white',
            borderRadius: '25px',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            {getRiskIcon(result.risk)} {result.risk || 'Unknown'} Risk
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          background: '#f8f9fa',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '25px'
        }}>
          <div>
            <strong>Confidence:</strong><br />
            <span style={{ fontSize: '24px', color: '#2196F3' }}>
              {(result.confidence || 0).toFixed(2)}%
            </span>
          </div>
          <div>
            <strong>AI Model:</strong><br />
            <span>TensorFlow CNN</span>
          </div>
          <div>
            <strong>Analysis Time:</strong><br />
            <span>~2 seconds</span>
          </div>
        </div>

        <div style={{ margin: '25px 0' }}>
          <h3 style={{ color: '#D84315' }}>⚠️ Environmental Impact</h3>
          <div style={{
            background: '#FFF3E0',
            padding: '20px',
            borderRadius: '8px',
            borderLeft: '5px solid #FF9800',
            fontSize: '16px',
            lineHeight: '1.6'
          }}>
            {result.impact || 'This e-waste contains materials that can be harmful to the environment if not disposed properly.'}
          </div>
        </div>

        <div style={{ margin: '25px 0' }}>
          <h3 style={{ color: '#2E7D32' }}>♻️ Recycling Instructions</h3>
          <div style={{
            background: '#E8F5E9',
            padding: '20px',
            borderRadius: '8px',
            borderLeft: '5px solid #4CAF50',
            fontSize: '16px',
            lineHeight: '1.6'
          }}>
            {result.recycle || '1. Remove any batteries. 2. Wipe personal data. 3. Take to certified e-waste recycler. 4. Do not dispose in regular trash.'}
          </div>
        </div>

        <div style={{ margin: '25px 0' }}>
          <h3 style={{ color: '#1565C0' }}>📍 Nearby Recycling Centers</h3>
          <div style={{
            background: '#E3F2FD',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0' }}>Green E-Waste Center</h4>
                <p style={{ margin: 0, color: '#666' }}>📏 2.5 km away | ⭐ 4.5/5</p>
                <p style={{ margin: '5px 0 0 0' }}>📍 123 Eco Street, Your City</p>
              </div>
              <button style={{
                padding: '8px 20px',
                background: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>
                Directions
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0' }}>Safe Recycling Hub</h4>
                <p style={{ margin: 0, color: '#666' }}>📏 3.8 km away | ⭐ 4.2/5</p>
                <p style={{ margin: '5px 0 0 0' }}>📍 456 Green Avenue, Your City</p>
              </div>
              <button style={{
                padding: '8px 20px',
                background: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>
                Directions
              </button>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '30px',
          padding: '15px',
          background: '#f5f5f5',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          <p>♻️ Proper e-waste disposal prevents soil and water contamination, conserves resources, and protects human health.</p>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;