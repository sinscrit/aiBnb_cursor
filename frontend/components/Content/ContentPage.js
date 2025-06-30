import { useState, useEffect } from 'react';

/**
 * ContentPage Component
 * 
 * Mobile-responsive component for displaying instructional content
 * accessed via QR codes. Optimized for touch interfaces and various screen sizes.
 */
export default function ContentPage({ content, qrCode }) {
  const [isVideoError, setIsVideoError] = useState(false);
  const [isImageError, setIsImageError] = useState(false);

  if (!content) {
    return <div>No content available</div>;
  }

  const { item, property, scan_count } = content;

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const youtubeVideoId = item.media_type === 'youtube' ? getYouTubeVideoId(item.media_url) : null;

  // Render media content based on type
  const renderMediaContent = () => {
    if (!item.media_url) {
      return (
        <div className="no-media">
          <div className="no-media-icon">📄</div>
          <p>Instructions available below</p>
        </div>
      );
    }

    switch (item.media_type) {
      case 'youtube':
        if (youtubeVideoId && !isVideoError) {
          return (
            <div className="video-container">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&showinfo=0&controls=1&fs=1`}
                title={item.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onError={() => setIsVideoError(true)}
              />
            </div>
          );
        } else {
          return (
            <div className="media-error">
              <div className="error-icon">🎥</div>
              <p>Video not available</p>
              <a href={item.media_url} target="_blank" rel="noopener noreferrer" className="external-link">
                View on YouTube
              </a>
            </div>
          );
        }

      case 'image':
        if (!isImageError) {
          return (
            <div className="image-container">
              <img
                src={item.media_url}
                alt={item.name}
                onError={() => setIsImageError(true)}
              />
            </div>
          );
        } else {
          return (
            <div className="media-error">
              <div className="error-icon">🖼️</div>
              <p>Image not available</p>
              <a href={item.media_url} target="_blank" rel="noopener noreferrer" className="external-link">
                View Original
              </a>
            </div>
          );
        }

      case 'pdf':
        return (
          <div className="pdf-container">
            <div className="pdf-icon">📋</div>
            <p>PDF Instructions</p>
            <a href={item.media_url} target="_blank" rel="noopener noreferrer" className="pdf-link">
              Open PDF Instructions
            </a>
          </div>
        );

      case 'url':
      case 'link':
        return (
          <div className="link-container">
            <div className="link-icon">🔗</div>
            <p>External Instructions</p>
            <a href={item.media_url} target="_blank" rel="noopener noreferrer" className="external-link">
              View Instructions
            </a>
          </div>
        );

      default:
        return (
          <div className="unknown-media">
            <div className="unknown-icon">❓</div>
            <p>Content available at:</p>
            <a href={item.media_url} target="_blank" rel="noopener noreferrer" className="external-link">
              View Content
            </a>
          </div>
        );
    }
  };

  // Format metadata for display
  const formatMetadata = () => {
    if (!item.metadata) return null;

    const metadata = typeof item.metadata === 'string' ? JSON.parse(item.metadata) : item.metadata;
    const entries = Object.entries(metadata).filter(([key, value]) => 
      value && !['id', 'created_at', 'updated_at'].includes(key)
    );

    if (entries.length === 0) return null;

    return (
      <div className="metadata-section">
        <h3>Additional Information</h3>
        <div className="metadata-grid">
          {entries.map(([key, value]) => (
            <div key={key} className="metadata-item">
              <strong>{key.replace('_', ' ').toUpperCase()}:</strong>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="content-page">
      {/* Header Section */}
      <div className="content-header">
        <div className="property-info">
          <h1 className="property-name">{property.name}</h1>
          {property.address && (
            <p className="property-address">{property.address}</p>
          )}
        </div>
        
        <div className="scan-info">
          <span className="scan-count">Scan #{scan_count}</span>
        </div>
      </div>

      {/* Item Information */}
      <div className="item-section">
        <div className="item-header">
          <h2 className="item-name">{item.name}</h2>
          {item.location && (
            <div className="item-location">
              <span className="location-icon">📍</span>
              <span>{item.location}</span>
            </div>
          )}
        </div>

        {/* Media Content */}
        <div className="media-section">
          {renderMediaContent()}
        </div>

        {/* Item Description */}
        {item.description && (
          <div className="description-section">
            <h3>Instructions</h3>
            <p className="item-description">{item.description}</p>
          </div>
        )}

        {/* Metadata */}
        {formatMetadata()}

        {/* Property Settings/Info */}
        {property.settings && Object.keys(property.settings).length > 0 && (
          <div className="property-settings">
            <h3>Property Information</h3>
            <div className="settings-grid">
              {Object.entries(property.settings).map(([key, value]) => (
                <div key={key} className="setting-item">
                  <strong>{key.replace('_', ' ').toUpperCase()}:</strong>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="content-footer">
        <p>Need help? Contact your host</p>
        <p className="qr-code-id">QR: {qrCode}</p>
      </div>

      <style jsx>{`
        .content-page {
          max-width: 800px;
          width: 100%;
          background: white;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          min-height: 90vh;
          display: flex;
          flex-direction: column;
        }

        .content-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .property-name {
          font-size: 1.8rem;
          font-weight: bold;
          margin: 0 0 5px 0;
        }

        .property-address {
          margin: 0;
          opacity: 0.9;
          font-size: 0.9rem;
        }

        .scan-info {
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: bold;
        }

        .item-section {
          flex: 1;
          padding: 30px;
        }

        .item-header {
          margin-bottom: 25px;
        }

        .item-name {
          font-size: 2rem;
          font-weight: bold;
          margin: 0 0 10px 0;
          color: #333;
        }

        .item-location {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
          font-size: 1rem;
        }

        .location-icon {
          font-size: 1.2rem;
        }

        .media-section {
          margin-bottom: 30px;
        }

        .video-container {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          height: 0;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .video-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .image-container {
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .image-container img {
          width: 100%;
          height: auto;
          display: block;
        }

        .no-media, .media-error, .pdf-container, .link-container, .unknown-media {
          text-align: center;
          padding: 40px;
          background: #f8f9fa;
          border-radius: 10px;
          border: 2px dashed #dee2e6;
        }

        .no-media-icon, .error-icon, .pdf-icon, .link-icon, .unknown-icon {
          font-size: 3rem;
          margin-bottom: 15px;
          display: block;
        }

        .external-link, .pdf-link {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          margin-top: 15px;
          font-weight: bold;
          transition: background 0.3s ease;
        }

        .external-link:hover, .pdf-link:hover {
          background: #5a6fd8;
        }

        .description-section, .metadata-section, .property-settings {
          margin-bottom: 25px;
        }

        .description-section h3, .metadata-section h3, .property-settings h3 {
          font-size: 1.3rem;
          margin: 0 0 15px 0;
          color: #333;
          border-bottom: 2px solid #667eea;
          padding-bottom: 8px;
        }

        .item-description {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #555;
          margin: 0;
        }

        .metadata-grid, .settings-grid {
          display: grid;
          gap: 12px;
          margin-top: 15px;
        }

        .metadata-item, .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }

        .metadata-item strong, .setting-item strong {
          color: #333;
          font-size: 0.9rem;
        }

        .metadata-item span, .setting-item span {
          color: #666;
          font-weight: normal;
        }

        .content-footer {
          background: #f8f9fa;
          padding: 20px 30px;
          text-align: center;
          border-top: 1px solid #dee2e6;
          color: #666;
        }

        .content-footer p {
          margin: 5px 0;
          font-size: 0.9rem;
        }

        .qr-code-id {
          font-family: monospace;
          font-size: 0.8rem;
          opacity: 0.7;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .content-page {
            margin: 10px;
            border-radius: 10px;
            min-height: 85vh;
          }

          .content-header {
            padding: 20px;
            flex-direction: column;
            gap: 15px;
          }

          .property-name {
            font-size: 1.5rem;
          }

          .item-section {
            padding: 20px;
          }

          .item-name {
            font-size: 1.6rem;
          }

          .metadata-item, .setting-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .content-footer {
            padding: 15px 20px;
          }
        }

        @media (max-width: 480px) {
          .content-page {
            margin: 5px;
            border-radius: 8px;
            min-height: 80vh;
          }

          .content-header {
            padding: 15px;
          }

          .property-name {
            font-size: 1.3rem;
          }

          .item-section {
            padding: 15px;
          }

          .item-name {
            font-size: 1.4rem;
          }

          .no-media, .media-error, .pdf-container, .link-container, .unknown-media {
            padding: 25px 15px;
          }

          .no-media-icon, .error-icon, .pdf-icon, .link-icon, .unknown-icon {
            font-size: 2.5rem;
          }
        }

        /* Touch-friendly improvements */
        @media (hover: none) and (pointer: coarse) {
          .external-link, .pdf-link {
            padding: 15px 30px;
            font-size: 1.1rem;
            min-height: 44px; /* Minimum touch target size */
          }
        }
      `}</style>
    </div>
  );
} 