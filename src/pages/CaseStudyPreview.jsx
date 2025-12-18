import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { renderRichTextContent } from "../utils/richTextRenderer";
import { getImageUrl } from "../utils/imageUtils.jsx";

const API_BASE = import.meta.env.VITE_PAYLOAD_API_URL || "http://localhost:3011";
const DOWNLOAD_LABEL = "Download complete casestudy";

export default function CaseStudyPreview() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const url = slug
          ? `${API_BASE}/api/case-studies?where[slug][equals]=${slug}&limit=1&draft=true`
          : `${API_BASE}/api/case-studies?limit=1&draft=true`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to load (${res.status})`);
        const json = await res.json();
        if (!isMounted) return;
        if (json?.docs?.length) setItem(json.docs[0]); else setError('Not found');
      } catch (e) {
        if (!isMounted) return;
        setError(e?.message || 'Failed to load');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false };
  }, [slug, searchParams]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading preview…</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  if (!item) return null;

  const imageUrl = getImageUrl(item?.coverImage?.url);
  const clientLogoUrl = getImageUrl(item?.clientLogo?.url);
  const pdfUrl = item?.downloadPdf && typeof item.downloadPdf === 'object' && item.downloadPdf?.url
    ? getImageUrl(item.downloadPdf.url) 
    : null;
  const downloadUrl = pdfUrl;
  const infoBlocks = [
    { title: "About the client", content: item?.aboutClient },
    { title: "Problem", content: item?.problem },
    { title: "Approach", content: item?.approach },
  ].filter((block) => block.content);

  return (
    <div className="bg-[#020a1c] text-white">
      <div className="bg-yellow-900/30 text-yellow-300 border border-yellow-700 px-4 py-2 text-center">Preview Mode</div>
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0A4ACC 0%, #072056 45%, #040C22 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25), transparent 45%)" }} />
        <div className="container mx-auto px-4 pt-16 pb-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-blue-100/90 text-sm">
              <Link to="/preview/case-studies?preview=true" className="hover:text-white transition">Case Studies</Link>
              <span className="opacity-70">›</span>
              <span className="opacity-90 line-clamp-1">{item.title}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight mt-6">{item.title}</h1>
            {item.excerpt && (
              <p className="text-blue-100/90 mt-4 text-lg">{item.excerpt}</p>
            )}
          </div>
          {imageUrl && (
            <div className="mt-12">
              <div className="rounded-[32px] overflow-hidden shadow-2xl ring-1 ring-white/10">
                <img src={imageUrl} alt={item.title} className="w-full h-[320px] md:h-[480px] object-cover" />
              </div>
            </div>
          )}
        </div>
      </section>
      {infoBlocks.length > 0 && (
        <section className="container mx-auto px-4 pb-20 -mt-16 relative">
          <div className="rounded-[32px] border border-white/10 bg-gradient-to-b from-[#0f1f3e] to-[#050c1c] p-8 md:p-12 shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
            <div className="bg-white/5 rounded-3xl p-6 md:p-10 shadow-inner shadow-black/20 space-y-8">
              {infoBlocks.map((block, idx) => {
                const isAbout = block.title === "About the client";
                return (
                  <div
                    key={block.title + idx}
                    className={`pb-8 ${idx !== infoBlocks.length - 1 ? "border-b border-white/10" : ""}`}
                  >
                    <p className="text-[#C4FF61] uppercase tracking-[0.2em] text-xs font-semibold">{block.title}</p>
                    <div
                      className={`mt-4 text-base text-blue-50/90 leading-relaxed space-y-3 ${
                        isAbout && clientLogoUrl ? "flex flex-col gap-6 md:flex-row md:items-start md:gap-10" : ""
                      }`}
                    >
                      <div className="flex-1 space-y-3">{renderRichTextContent(block.content)}</div>
                      {isAbout && clientLogoUrl && (
                        <div className="flex-shrink-0 w-full md:w-auto md:min-w-[160px] flex items-center justify-center">
                          <img
                            src={clientLogoUrl}
                            alt={`${item.title} logo`}
                            className="max-h-16 object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {downloadUrl && (
                <div className="pt-4 border-t border-white/10">
                  <div className="flex flex-col gap-4 md:flex-row md:gap-6 md:items-center justify-center">
                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-[#FFC857] text-[#071226] font-semibold px-8 py-4 rounded-full shadow-lg shadow-yellow-500/30 hover:translate-y-0.5 transition-transform"
                      download
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M12 3v12m0 0 4-4m-4 4-4-4" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5 21h14" strokeLinecap="round" />
                      </svg>
                      {DOWNLOAD_LABEL}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}


