import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { renderRichTextContent } from "../utils/richTextRenderer";
import { getImageUrl } from "../utils/imageUtils.jsx";

const API_BASE = import.meta.env.VITE_PAYLOAD_API_URL || "http://localhost:3011";

export default function CaseStudyPrint() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/case-studies?where[slug][equals]=${slug}&limit=1`);
        if (!res.ok) throw new Error(`Failed to load case study (${res.status})`);
        const json = await res.json();
        if (!isMounted) return;
        if (json?.docs?.length) {
          setItem(json.docs[0]);
          // Auto-trigger print dialog after a short delay to allow content to render
          setTimeout(() => {
            window.print();
          }, 500);
        } else {
          setError('Not found');
        }
      } catch (e) {
        if (!isMounted) return;
        setError(e?.message || 'Failed to load');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false };
  }, [slug]);

  useEffect(() => {
    // Handle print dialog close - navigate back
    const handleAfterPrint = () => {
      navigate(`/case-studies/${slug}`);
    };
    
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="print-container">
        <div className="loading">Loading case study...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="print-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  const imageUrl = getImageUrl(item?.coverImage?.url);
  const clientLogoUrl = getImageUrl(item?.clientLogo?.url);
  const infoBlocks = [
    { title: "About the client", content: item?.aboutClient },
    { title: "Problem", content: item?.problem },
    { title: "Approach", content: item?.approach },
  ].filter((block) => block.content);

  return (
    <>
      <style>{`
        @media screen {
          .print-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
            min-height: 100vh;
          }
          .no-print {
            display: block;
            margin-bottom: 20px;
            padding: 10px;
            background: #f0f0f0;
            border-radius: 4px;
          }
        }
        @media print {
          @page {
            size: A4;
            margin: 2cm;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            background: white;
            color: black;
          }
          body {
            background: white;
            color: black;
          }
          .page-break {
            page-break-after: always;
          }
          .avoid-break {
            page-break-inside: avoid;
          }
        }
        .print-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .print-header {
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .print-title {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #1a1a1a;
        }
        .print-meta {
          font-size: 14px;
          color: #666;
          margin-top: 10px;
        }
        .print-section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        .print-section-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 12px;
          color: #2c3e50;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 8px;
        }
        .print-content {
          font-size: 14px;
          line-height: 1.8;
          color: #444;
        }
        .print-content p {
          margin-bottom: 12px;
        }
        .print-content ul,
        .print-content ol {
          margin-left: 20px;
          margin-bottom: 12px;
        }
        .print-content li {
          margin-bottom: 8px;
        }
        .print-logo-container {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
        }
        .print-logo {
          max-height: 60px;
          max-width: 200px;
          object-fit: contain;
        }
        .print-image {
          max-width: 100%;
          height: auto;
          margin: 20px 0;
          border-radius: 4px;
        }
        .loading, .error {
          text-align: center;
          padding: 40px;
          font-size: 18px;
        }
        .error {
          color: #d32f2f;
        }
      `}</style>
      <div className="print-container">
        <div className="no-print">
          <button onClick={() => navigate(`/case-studies/${slug}`)} style={{
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}>
            ← Back to Case Study
          </button>
          <p style={{ color: '#666', fontSize: '14px' }}>
            This page will automatically open the print dialog. Use your browser's print function to save as PDF.
          </p>
        </div>

        <div className="print-header">
          <h1 className="print-title">{item.title}</h1>
          {item.excerpt && (
            <p className="print-meta" style={{ fontStyle: 'italic', color: '#666' }}>
              {item.excerpt}
            </p>
          )}
          {Array.isArray(item.metrics) && item.metrics.length > 0 && (
            <div className="print-meta" style={{ marginTop: '15px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {item.metrics.map((m, i) => (
                <span key={i} style={{ fontSize: '12px' }}>
                  <strong>{m.value}</strong> {m.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {imageUrl && (
          <div className="print-section avoid-break">
            <img src={imageUrl} alt={item.title} className="print-image" />
          </div>
        )}

        {infoBlocks.map((block, idx) => {
          const isAbout = block.title === "About the client";
          return (
            <div key={block.title + idx} className="print-section avoid-break">
              <h2 className="print-section-title">{block.title}</h2>
              <div className="print-content">
                {isAbout && clientLogoUrl && (
                  <div className="print-logo-container">
                    <img src={clientLogoUrl} alt={`${item.title} logo`} className="print-logo" />
                  </div>
                )}
                {renderRichTextContent(block.content)}
              </div>
            </div>
          );
        })}

        <div className="print-section" style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #ddd', fontSize: '12px', color: '#999' }}>
          <p>© {new Date().getFullYear()} Ubona. All Rights Reserved.</p>
        </div>
      </div>
    </>
  );
}

