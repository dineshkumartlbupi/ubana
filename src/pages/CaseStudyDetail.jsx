import { useEffect, useState, useLayoutEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { renderRichTextContent } from "../utils/richTextRenderer";
import { getImageUrl } from "../utils/imageUtils.jsx";

const API_BASE = import.meta.env.VITE_PAYLOAD_API_URL || "http://localhost:3011";
const DOWNLOAD_LABEL = "Download complete casestudy";

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Force scroll to top immediately and repeatedly
    window.scrollTo(0, 0);

    // Keep forcing it for the first 500ms to fight any auto-scroll/restoration
    const intervalId = setInterval(() => {
      window.scrollTo(0, 0);
    }, 10);

    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
    }, 500);

    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [slug]); // Re-run if slug changes

  useEffect(() => {
    if (!loading) {
      window.scrollTo(0, 0);
    }
  }, [loading]);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/case-studies?where[slug][equals]=${slug}&limit=1`);
        if (!res.ok) throw new Error(`Failed to load case study (${res.status})`);
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
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020a1c] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>
    );
  }

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
      {/* Hero banner */}
      <section
        className="relative overflow-hidden"
      >
        <div className="px-4 xl:px-12 2xl:px-22 pt-24 relative">
          <div className="bg-[#1269CD] h-68 p-10 rounded-[20px] backdrop-blur-xs flex flex-col relative bg-[url('/assets/images/blog/blog-dtl-bnr-bg.webp')] bg-no-repeat bg-bottom mb-7.5">
            <div className="absolute inset-0 bg-[#1269CD]/50 rounded-[20px]"></div>
            <div className="flex items-center justify-center relative gap-1.5 text-sm">
              <div className="h-[2px] w-10 md:w-28 bg-linear-to-r from-[#434343]/0 to-[#FFBF3C] hidden md:block mr-3"></div>
              <Link to="/case-studies" className="text-white/70 hover:text-white whitespace-nowrap transition">Case Studies</Link>
              <span className="opacity-70">›</span>
              <span className="text-[#FFBF3C] line-clamp-1">{item.title}</span>
              <div className="h-[2px] md:w-28 w-10 bg-linear-to-r from-[#FFBF3C] to-[#434343]/0 hidden md:block ml-3"></div>
            </div>
            <h1 className="relative text-xl md:text-3xl font-normal leading-tight text-center mt-8.5 md:w-1/2 mx-auto">{item.title}</h1>
            {item.excerpt && (
              <p className="text-blue-100/90 mt-4 text-lg hidden">{item.excerpt}</p>
            )}
            {Array.isArray(item.metrics) && item.metrics.length > 0 && (
              <div className="mt-8 flex-wrap justify-center gap-4 hidden">
                {item.metrics.map((m, i) => (
                  <div
                    key={i}
                    className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-6 py-4 min-w-[140px]"
                  >
                    <div className="text-2xl font-bold text-[#C4FF61]">{m.value}</div>
                    <div className="text-xs uppercase tracking-[0.2em] text-white/70 mt-1">{m.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {imageUrl && (
            <div className="">
              <div className="rounded-[20px] overflow-hidden shadow-2xl ring-1 ring-white/10">
                <img src={imageUrl} alt={item.title} className="w-full h-[320px] md:h-[508px] object-cover" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Structured detail blocks */}
      {infoBlocks.length > 0 && (
        <section className="px-4 xl:px-12 2xl:px-22 pb-20 mt-13 relative">
          <div className="rounded-[18px] md:rounded-[36px] overflow-hidden border border-white/10 px-4.5 py-7 md:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.55)]"
            style={{ background: "linear-gradient(180deg, rgba(0, 22, 44, 0.60) 28.51%, rgba(18, 105, 205, 0.60) 100%)" }}
          >
            <div className="max-w-2xl mx-auto space-y-8 md:space-y-15 relative">
              {infoBlocks.map((block, idx) => {
                const isAbout = block.title === "About the client";
                return (
                  <div
                    key={block.title + idx}
                    className="relative !last:mb-0"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <p className="text-[#DBF262] text-2xl font-normal">{block.title}</p>
                      {isAbout && (
                        <div className="flex-shrink-0 w-full md:w-auto md:min-w-[160px] hidden items-center justify-center">
                          <img
                            src={clientLogoUrl}
                            alt={`${item.title} logo`}
                            className="max-h-9 object-contain"
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-base font-normal text-[#C3C3C3]">{renderRichTextContent(block.content)}</p>
                  </div>
                );
              })}
              {downloadUrl && (
                <div className="absolute z-10 md:bottom-10 bottom-10 w-full">
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center w-full gap-1.5 bg-[#FFBF3C] hover:bg-white text-[#000B15] text-base font-normal px-4 md:px-8 py-3 rounded-full shadow-lg shadow-white-500/30 hover:scale-105 transition-all ease-in-out duration-500"
                    download
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-5 h-5 group-hover:animate-bounce"
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
              )}
              <div className="absolute -bottom-16 md:bottom-0 -left-4.5 md:-left-10 w-[110%] md:w-[130%] h-[25%] md:h-[30%] bg-[#052B5A]/10 backdrop-blur-xs"></div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}


