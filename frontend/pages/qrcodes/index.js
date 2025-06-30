import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import QRList from '../../components/QR/QRList';

const QRCodesPage = () => {
  const router = useRouter();
  const { property, item } = router.query;

  return (
    <>
      <Head>
        <title>QR Codes - aiBnb Management</title>
        <meta name="description" content="Manage QR codes for all items and properties" />
      </Head>
      
      <DashboardLayout>
        <div className="qr-codes-page">
          <div className="page-header">
            <div className="header-content">
              <h1>QR Code Management</h1>
              <p>Generate, manage, and download QR codes for your property items</p>
            </div>
            <div className="header-actions">
              <button
                onClick={() => router.push('/items')}
                className="primary-btn"
              >
                📱 Manage Items
              </button>
              <button
                onClick={() => router.push('/properties')}
                className="secondary-btn"
              >
                🏠 View Properties
              </button>
            </div>
          </div>

          <div className="qr-content">
            <QRList 
              propertyId={property} 
              itemId={item}
              showFilters={true}
            />
          </div>

          <div className="help-section">
            <div className="help-card">
              <h3>🎯 Quick Guide</h3>
              <ul>
                <li><strong>Filter by Property:</strong> Use the property dropdown to view QR codes for specific properties</li>
                <li><strong>Filter by Item:</strong> Select an item to see its QR codes (requires property selection first)</li>
                <li><strong>Generate QR Codes:</strong> Click "Manage Items" to create items and generate QR codes</li>
                <li><strong>Download QR Codes:</strong> Each QR code can be downloaded as a high-resolution PNG image</li>
                <li><strong>Track Usage:</strong> View scan counts and QR code status for each item</li>
              </ul>
            </div>

            <div className="help-card">
              <h3>📊 QR Code Workflow</h3>
              <div className="workflow-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Create Properties</h4>
                    <p>Set up your properties first</p>
                  </div>
                </div>
                <div className="step-arrow">→</div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Add Items</h4>
                    <p>Add items to each property</p>
                  </div>
                </div>
                <div className="step-arrow">→</div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Generate QR Codes</h4>
                    <p>Create QR codes for items</p>
                  </div>
                </div>
                <div className="step-arrow">→</div>
                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h4>Download & Use</h4>
                    <p>Download and place QR codes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .qr-codes-page {
            min-height: 100vh;
            background: #f8f9fa;
          }

          .page-header {
            background: white;
            border-bottom: 1px solid #e5e7eb;
            padding: 32px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .header-content h1 {
            margin: 0 0 8px 0;
            color: #1f2937;
            font-size: 2rem;
            font-weight: 700;
          }

          .header-content p {
            margin: 0;
            color: #6b7280;
            font-size: 1.1rem;
          }

          .header-actions {
            display: flex;
            gap: 12px;
          }

          .primary-btn, .secondary-btn {
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            border: none;
            font-size: 0.95rem;
          }

          .primary-btn {
            background: #3b82f6;
            color: white;
          }

          .primary-btn:hover {
            background: #2563eb;
            transform: translateY(-1px);
          }

          .secondary-btn {
            background: #f3f4f6;
            color: #374151;
            border: 1px solid #d1d5db;
          }

          .secondary-btn:hover {
            background: #e5e7eb;
            transform: translateY(-1px);
          }

          .qr-content {
            padding: 0;
            margin: 0;
          }

          .help-section {
            padding: 40px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 32px;
            max-width: 1200px;
            margin: 0 auto;
          }

          .help-card {
            background: white;
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
          }

          .help-card h3 {
            margin: 0 0 20px 0;
            color: #1f2937;
            font-size: 1.3rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .help-card ul {
            margin: 0;
            padding-left: 20px;
            color: #4b5563;
            line-height: 1.7;
          }

          .help-card li {
            margin-bottom: 12px;
          }

          .help-card li strong {
            color: #1f2937;
          }

          .workflow-steps {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
          }

          .step {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
            min-width: 120px;
          }

          .step-number {
            width: 32px;
            height: 32px;
            background: #3b82f6;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 0.9rem;
            flex-shrink: 0;
          }

          .step-content h4 {
            margin: 0 0 4px 0;
            color: #1f2937;
            font-size: 0.95rem;
            font-weight: 600;
          }

          .step-content p {
            margin: 0;
            color: #6b7280;
            font-size: 0.85rem;
          }

          .step-arrow {
            color: #9ca3af;
            font-size: 1.5rem;
            font-weight: bold;
          }

          @media (max-width: 1024px) {
            .help-section {
              grid-template-columns: 1fr;
              padding: 24px;
            }

            .page-header {
              padding: 24px;
              flex-direction: column;
              align-items: stretch;
              gap: 20px;
            }

            .header-actions {
              justify-content: center;
            }
          }

          @media (max-width: 768px) {
            .page-header {
              padding: 20px;
            }

            .header-content h1 {
              font-size: 1.6rem;
            }

            .header-content p {
              font-size: 1rem;
            }

            .help-section {
              padding: 16px;
            }

            .help-card {
              padding: 20px;
            }

            .workflow-steps {
              flex-direction: column;
              align-items: stretch;
            }

            .step {
              flex-direction: column;
              text-align: center;
              min-width: auto;
            }

            .step-arrow {
              transform: rotate(90deg);
              align-self: center;
            }

            .header-actions {
              flex-direction: column;
            }
          }
        `}</style>
      </DashboardLayout>
    </>
  );
};

export default QRCodesPage; 