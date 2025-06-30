import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ContentPage from '../../components/Content/ContentPage';
import { apiService, apiHelpers } from '../../utils/api';

/**
 * Dynamic Content Page for QR Code Display
 * Route: /content/[qrCode]
 * 
 * This page displays content for a specific QR code when scanned.
 * It's mobile-optimized and provides instructional content for items.
 */
export default function QRContentPage() {
  const router = useRouter();
  const { qrCode } = router.query;
  
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewStartTime] = useState(Date.now());

  // Fetch content data when QR code is available
  useEffect(() => {
    if (!qrCode) return;

    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch content by QR code
        const response = await apiService.content.getByQRCode(qrCode);
        const contentData = apiHelpers.extractData(response);
        
        setContent(contentData);

        // Record page view for analytics
        setTimeout(() => {
          recordPageView();
        }, 1000);

      } catch (err) {
        console.error('Error fetching content:', err);
        const errorDetails = apiHelpers.handleError(err);
        setError(errorDetails);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [qrCode]);

  // Record analytics for page view
  const recordPageView = async () => {
    try {
      const viewDuration = Date.now() - viewStartTime;
      
      await apiService.content.recordView(qrCode, {
        view_duration: viewDuration,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`
      });
    } catch (error) {
      // Don't block UI for analytics errors
      console.warn('Analytics recording failed:', error);
    }
  };

  // Handle page unload to record total view time
  useEffect(() => {
    const handleBeforeUnload = () => {
      recordPageView();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Generate page metadata
  const getPageMeta = () => {
    if (!content) {
      return {
        title: 'Loading Content...',
        description: 'Loading instructional content',
        keywords: 'instructions, qr code, help'
      };
    }

    const { content_meta, item, property } = content;
    
    return {
      title: content_meta.title,
      description: content_meta.description,
      keywords: content_meta.keywords.join(', ')
    };
  };

  const pageMeta = getPageMeta();

  return (
    <>
      <Head>
        <title>{pageMeta.title}</title>
        <meta name="description" content={pageMeta.description} />
        <meta name="keywords" content={pageMeta.keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        
        {/* Mobile optimization */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Open Graph for social sharing */}
        {content && (
          <>
            <meta property="og:title" content={content.content_meta.title} />
            <meta property="og:description" content={content.content_meta.description} />
            <meta property="og:url" content={content.content_meta.canonical_url} />
            <meta property="og:type" content="article" />
            {content.item.media_type === 'image' && content.item.media_url && (
              <meta property="og:image" content={content.item.media_url} />
            )}
          </>
        )}
      </Head>

      <div className="content-page-container">
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
            <h2>Loading Content...</h2>
            <p>Please wait while we retrieve your instructions</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2>Content Not Available</h2>
            
            {error.status === 404 && (
              <>
                <p>This QR code was not found or may have expired.</p>
                <ul className="error-suggestions">
                  <li>Check that you scanned the QR code correctly</li>
                  <li>Verify the QR code is still active</li>
                  <li>Contact your host if you continue having issues</li>
                </ul>
              </>
            )}

            {error.status === 410 && (
              <>
                <p>This QR code is no longer active.</p>
                <p>Please contact your host for updated instructions.</p>
              </>
            )}

            {error.status === 0 && (
              <>
                <p>Unable to connect to the server.</p>
                <p>Please check your internet connection and try again.</p>
              </>
            )}

            {![404, 410, 0].includes(error.status) && (
              <>
                <p>An unexpected error occurred while loading this content.</p>
                <p>Error: {error.message}</p>
              </>
            )}

            <button 
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

        {content && !loading && !error && (
          <ContentPage content={content} qrCode={qrCode} />
        )}
      </div>

      <style jsx>{`
        .content-page-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .loading-container, .error-container {
          text-align: center;
          background: white;
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          max-width: 500px;
          width: 100%;
        }

        .loading-spinner {
          margin-bottom: 20px;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-icon {
          font-size: 3rem;
          margin-bottom: 20px;
        }

        .error-suggestions {
          text-align: left;
          margin: 20px 0;
          padding-left: 20px;
        }

        .error-suggestions li {
          margin-bottom: 8px;
          color: #666;
        }

        .retry-button {
          background: #667eea;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          margin-top: 20px;
          transition: background 0.3s ease;
        }

        .retry-button:hover {
          background: #5a6fd8;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .content-page-container {
            padding: 10px;
          }

          .loading-container, .error-container {
            padding: 30px 20px;
            margin: 10px;
          }

          .spinner {
            width: 40px;
            height: 40px;
          }
        }

        @media (max-width: 480px) {
          .loading-container, .error-container {
            padding: 20px 15px;
          }

          .error-icon {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </>
  );
} 