import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import LazyImage from "../components/lazyImage";
import useSEO from "../utils/useSEO";
import { getImageUrl } from "../utils/imageUtils.jsx";
import ButtonArrow from "../components/buttonArrow";
import { IoChevronDown } from "react-icons/io5";

const API_BASE = import.meta.env.VITE_PAYLOAD_API_URL || "http://localhost:3011";

function Badge({ badge }) {
  if (!badge || badge === "none") return null;
  const label = badge === "most_viewed" ? "Most viewed" : "Recently added";
  return (
    <span className="absolute top-5.5 right-5.5 z-10 rounded-lg bg-[#DBF262] text-[#536109] text-xs font-medium tracking-tight px-3 py-2 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M17.8856 8.64983C17.7248 8.42986 13.8934 3.26367 8.99991 3.26367C4.10647 3.26367 0.274852 8.42986 0.114223 8.64962C-0.0380743 8.85831 -0.0380743 9.14135 0.114223 9.35004C0.274852 9.57001 4.10647 14.7362 8.99991 14.7362C13.8934 14.7362 17.7248 9.56998 17.8856 9.35022C18.0381 9.14156 18.0381 8.85831 17.8856 8.64983ZM8.99991 13.5494C5.39537 13.5494 2.27345 10.1205 1.3493 8.99953C2.27226 7.87759 5.38764 4.45048 8.99991 4.45048C12.6043 4.45048 15.726 7.87878 16.6505 9.00034C15.7276 10.1222 12.6122 13.5494 8.99991 13.5494Z" fill="#536109"/>
        <path d="M8.99991 5.43945C7.03671 5.43945 5.43945 7.03671 5.43945 8.99991C5.43945 10.9631 7.03671 12.5604 8.99991 12.5604C10.9631 12.5604 12.5604 10.9631 12.5604 8.99991C12.5604 7.03671 10.9631 5.43945 8.99991 5.43945ZM8.99991 11.3735C7.69104 11.3735 6.6263 10.3087 6.6263 8.99991C6.6263 7.69107 7.69107 6.62629 8.99991 6.62629C10.3087 6.62629 11.3735 7.69107 11.3735 8.99991C11.3735 10.3087 10.3088 11.3735 8.99991 11.3735Z" fill="#536109"/>
      </svg>
      {label}
    </span>
  );
}

function CaseCard({ cs }) {
  const imageUrl = getImageUrl(cs?.coverImage?.url || cs?.coverImage?.sizes?.card?.url);
  return (
    <Link to={`/case-studies/${cs.slug}`} className="block group">
      <article className="relative group bg-white p-3 md:px-4 md:pt-4 md:pb-6 rounded-xl overflow-hidden border border-[#EDEDED] md:h-full">
        <Badge badge={cs.badge} />
        <div className="overflow-hidden rounded-xl">
          {imageUrl && (
            <img src={imageUrl} alt={cs.title} className="w-full h-56 object-cover rounded-xl bg-[#E8E3E3] hover:scale-110 transition-all ease-in-out duration-500" loading="lazy" />
          )}
        </div>
        <div className="mt-4">
          <h3 className="text-[#242424] text-base 2xl:text-xl font-semibold leading-snug group-hover:text-blue-600 transition-all ease-in-out duration-500">
            {cs.title}
          </h3>
          <p className="text-[#000B15] text-sm mt-3.5 font-normal line-clamp-2 opacity-60">{cs.excerpt}</p>
          {Array.isArray(cs.tags) && cs.tags.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4">
              {cs.tags.map((t, i) => (
                <span key={i} className="text-xs text-[#1269CD] font-normal">
                  • {t.tag || t}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

export default function CaseStudies() {
  useSEO({
    title: "Explore Ubona's Cloud-Based Call Center Case Studies",
    description: "Discover how Ubona s interactive voice response system, customer support chatbots, and AI for omni channel interactions have transformed client experiences in our case studies."
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [allItems, setAllItems] = useState([]);
  const [openExplore, setOpenExplore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const category = searchParams.get("category") || "all";

  // Helper function to extract categories from a case study
  const getCategories = (cs) => {
    if (Array.isArray(cs.category)) {
      // New format: array of objects with category field
      return cs.category.map(c => {
        if (typeof c === 'string') return c;
        return c?.category || c;
      }).filter(Boolean);
    }
    if (typeof cs.category === 'string') {
      // Old format: single string, might be comma-separated
      return cs.category.split(',').map(c => c.trim()).filter(Boolean);
    }
    return [];
  };
  const normalizeCategory = (c) =>
    c.trim().replace(/\s+/g, " ");
  

  // Filter items based on selected category
  const items = useMemo(() => {
    if (category === "all") return allItems;
    return allItems.filter(cs => {
      const cats = getCategories(cs);
      return cats.some(c => c.toLowerCase() === category.toLowerCase());
    });
  }, [allItems, category]);

  const featured = useMemo(() => items[0] || null, [items]);

  const params = useMemo(() => {
    const qp = new URLSearchParams();
    qp.set("sort", "-publishedAt");
    qp.set("limit", "100"); // Get more items to filter client-side if needed
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
        
        setAllItems(docs);
        
        // derive categories quick list from all case studies
        // const allCats = docs.flatMap(getCategories);
        // const cats = Array.from(new Set(allCats)).sort();
        // setCategories(["all", ...cats]);
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

  const categoryGroups = useMemo(() => {
    const allCats = allItems.flatMap(getCategories);
  
    const uniqueCats = Array.from(
      new Set(allCats.map(normalizeCategory))
    ).sort();
  
    return {
      explore: uniqueCats,
    };
  }, [allItems]);
  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#00081F]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-[#00081F] flex items-center justify-center text-red-600">{error}</div>
    );
  }

  return (
    <div className="bg-[#00081F]">
      {/* Featured banner (Figma-like) */}
      {featured && (
        <section className="px-4 xl:px-12 2xl:px-22 pt-24 pb-8.5 md:pb-15">
          <div
            className="relative rounded-[20px] overflow-hidden ring-1 ring-white/10"
            style={{
              backgroundImage: `
                  url(${getImageUrl(featured.coverImage.url)}),
                  radial-gradient(120% 120% at 100% 0%, rgba(21,71,164,.55) 0%, rgba(9,23,47,.65) 45%, rgba(6,17,35,.85) 100%)
                `,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                boxShadow: "0 30px 80px rgba(0,0,0,.45)",
            }}
          >
            <div className="p-4 pb-7 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-end h-106 md:h-119">
              <div>
                {/* <p className="text-[#93C5FD] text-sm font-medium tracking-wide mb-2">Latest Success Stories</p> */}
                <h1 className="text-white text-2xl md:text-[2rem] font-semibold leading-tight">
                  {featured.title}
                </h1>
                <p className="text-sm text-[#C3C3C3] mt-5 max-w-xl">{featured.excerpt}</p>
                <div className="flex mt-6">
                  <ButtonArrow
                    to={`/case-studies/${featured.slug}`}
                    text="View Case Study"
                    bgColor="#FFBF3C"
                    hoverColor="#1269CD"
                    textColor="#282828"
                    hoverTextColor="#fff"
                    padding="pl-4 py-1 pr-1 w-full md:w-auto"
                    rounded="rounded-full"
                    textSize="text-base"
                  />
                </div>
              </div>
              <div className="relative hidden">
                {featured?.coverImage?.url && (
                  <img src={getImageUrl(featured.coverImage.url)} alt={featured.title} className="w-full h-[360px] object-cover rounded-2xl" />
                )}
                {Array.isArray(featured.metrics) && featured.metrics.length > 0 && (
                  <div className="absolute -top-6 left-4 flex gap-4">
                    {featured.metrics.slice(0,3).map((m,i) => (
                      <div key={i} className="bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-xl px-4 py-3">
                        <div className="text-green-300 font-bold">{m.value}</div>
                        <div className="text-xs opacity-80 whitespace-nowrap">{m.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="px-4 xl:px-12 2xl:px-22 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
          {/* Filters */}
          <aside className="md:col-span-1">
            <div
              className="rounded-2xl px-4 pt-4 pb-6 ring-1 ring-white/10"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0, 22, 44, 0.80) 28.51%, rgba(18, 105, 205, 0.80) 100%)",
              }}
            >
              <p className="text-sm font-semibold text-[#DBF262] mb-8.5 flex items-center">
                Filters
              </p>
              {/* Latest Success Stories */}
              <button
                onClick={() => setSearchParams({})}
                className={`w-full flex items-center justify-between cursor-pointer px-4 py-3 rounded-lg text-white text-base font-medium transition
                  ${category === "all" ? "bg-[#1269CD]" : "hover:bg-[#1a2438]"}`}
              >
                <span className="flex items-center gap-3">
                  <img src="/assets/images/blog/fltr-time.svg" className="w-5" />
                  Latest Success Stories
                </span>
                <IoChevronDown className="-rotate-90" />
              </button>

              {/* Explore categories */}
              <div className="mt-4">
                <button
                  onClick={() => setOpenExplore((v) => !v)}
                  className="w-full flex items-center justify-between cursor-pointer px-4 py-3 rounded-lg text-white hover:bg-[#1a2438]"
                >
                  <span className="flex items-center gap-3">
                  <LazyImage effect="blur" src="/assets/images/blog/fltr-search.svg" alt="time icon" className="w-5" />
                    Explore categories
                  </span>
                  <IoChevronDown
                    className={`transition-transform ${
                      openExplore ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openExplore && (
                  <div className="mt-2 space-y-1">
                    {/* All Case Studies */}
                    <button
                      onClick={() => setSearchParams({})}
                      className={`w-full px-4 py-2 text-sm rounded-lg cursor-pointer text-white text-left
                        ${category === "all" ? "bg-[#1269CD]" : "hover:bg-[#1a2438]"}`}
                    >
                      All Case Studies
                    </button>

                    {/* Dynamic categories */}
                    {categoryGroups.explore.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSearchParams({ category: c })}
                        className={`w-full flex items-center justify-between cursor-pointer px-4 py-2 rounded-lg text-sm text-white transition
                          ${
                            category.toLowerCase() === c.toLowerCase()
                              ? "bg-[#1269CD]"
                              : "hover:bg-[#1a2438]"
                          }`}
                      >
                        <span>{c}</span>
                        <IoChevronDown className="-rotate-90 opacity-70" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>


          {/* Grid */}
          <div className="md:col-span-3 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-6">
              {items.map(cs => (
                <CaseCard key={cs.id} cs={cs} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


