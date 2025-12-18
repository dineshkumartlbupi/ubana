import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getImageUrl } from "../utils/imageUtils.jsx";

const API_BASE = import.meta.env.VITE_PAYLOAD_API_URL || "http://localhost:3011";

function CaseCard({ cs }) {
  const imageUrl = getImageUrl(cs?.coverImage?.url || cs?.coverImage?.sizes?.card?.url);
  return (
    <Link to={`/preview/case-studies/${cs.slug}?preview=true`} className="block group">
      <article className="relative bg-white rounded-2xl shadow-sm overflow-hidden ring-1 ring-slate-200 hover:shadow-md transition-shadow">
        {imageUrl && (
          <img src={imageUrl} alt={cs.title} className="w-full h-56 object-cover" loading="lazy" />
        )}
        <div className="p-5">
          <h3 className="text-[#101828] text-lg font-semibold leading-snug group-hover:text-blue-600">
            {cs.title}
          </h3>
          <p className="text-slate-600 text-sm mt-2 line-clamp-3">{cs.excerpt}</p>
        </div>
      </article>
    </Link>
  );
}

export default function CaseStudiesPreview() {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const params = useMemo(() => {
    const qp = new URLSearchParams();
    qp.set("sort", "-createdAt");
    qp.set("limit", "24");
    qp.set("draft", "true");
    return qp.toString();
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/case-studies?${params}`);
        if (!res.ok) throw new Error(`Failed to load case studies (${res.status})`);
        const json = await res.json();
        if (!isMounted) return;
        const docs = json?.docs || [];
        setItems(docs);
        setFeatured(docs[0] || null);
      } catch (e) {
        if (!isMounted) return;
        setError(e?.message || "Failed to load");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false };
  }, [params]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading preview…</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  return (
    <div className="bg-[#071226]">
      <section className="container mx-auto px-4 pt-14 pb-10">
        <div className="text-center text-yellow-300 bg-yellow-900/30 border border-yellow-700 rounded-lg px-4 py-2 mb-6">
          Preview Mode - Draft items are shown
        </div>
        {featured && (
          <div className="relative rounded-[32px] overflow-hidden ring-1 ring-white/10" style={{
            background:"radial-gradient(120% 120% at 100% 0%, rgba(21,71,164,.55) 0%, rgba(9,23,47,.65) 45%, rgba(6,17,35,.85) 100%)",
            boxShadow:"0 30px 80px rgba(0,0,0,.45)"
          }}>
            <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h1 className="text-white text-[2rem] md:text-[2.5rem] font-semibold leading-tight">{featured.title}</h1>
                <p className="text-blue-100 mt-4 max-w-xl">{featured.excerpt}</p>
                <Link to={`/preview/case-studies/${featured.slug}?preview=true`} className="inline-flex items-center mt-6 bg-[#FFBF3C] text-black font-semibold px-6 py-2.5 rounded-full hover:bg-white transition">View Case Study</Link>
              </div>
              <div>
                {featured?.coverImage?.url && (
                  <img src={getImageUrl(featured.coverImage.url)} alt={featured.title} className="w-full h-[360px] object-cover rounded-2xl" />
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map(cs => (
            <CaseCard key={cs.id} cs={cs} />
          ))}
        </div>
      </section>
    </div>
  );
}


