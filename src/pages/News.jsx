import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import LazyImage from "../components/lazyImage";
import ButtonArrow from "../components/buttonArrow";
import { 
  IoEye as EyeIcon, 
  IoTrendingUp as TrendingIcon,
  IoFilter as FilterIcon,
  IoSearch as SearchIcon,
  IoChevronDown as ChevronDownIcon,
  IoChevronForward as ChevronForwardIcon,
  IoFlash as FlashIcon
} from "react-icons/io5";
import { getImageUrl } from "../utils/imageUtils.jsx";

const API_BASE = import.meta.env.VITE_PAYLOAD_API_URL || "http://localhost:3011";

const CATEGORY_LABELS = {
  general: "General News",
  technology: "Technology",
  "ai-ml": "Gen AI",
  business: "Business",
  "press-release": "Press Release",
  industry: "Industry News",
  product: "Product Updates",
  company: "Company News",
};

const formatCategoryLabel = (value) => {
  if (!value) return "";
  if (CATEGORY_LABELS[value]) return CATEGORY_LABELS[value];
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const TAG_STYLES = {
  latest: {
    text: "Recently added",
    icon: "/assets/images/recent.svg",
    alt: "recent doc icon",
    bg: "bg-[#DBF262]",
    textColor: "text-[#536109]",
  },
  featured: {
    text: "Most viewed",
    icon: "/assets/images/eye.svg",
    alt: "eye icon",
    bg: "bg-[#DBF262]",
    textColor: "text-[#536109]",
  },
  trending: {
    text: "Trending",
    icon: "/assets/images/recent.svg",
    alt: "trend icon",
    bg: "bg-[#DBF262]",
    textColor: "text-[#536109]",
  },
};

// News Card Component - Matching Figma Design
function NewsCard({ post, featured = false, size = "normal", onOpenModal, latestNewsId }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);

  
  // Determine which image to use: coverImage first, then source
  const coverImageUrl = post.coverImage?.url ? getImageUrl(post.coverImage.url) : null;
  const sourceUrl = post.source && post.source.startsWith('http') ? post.source : null;
  
  // Initialize current image URL
  useEffect(() => {
    if (coverImageUrl) {
      setCurrentImageUrl(coverImageUrl);
    } else if (sourceUrl) {
      setCurrentImageUrl(sourceUrl);
    } else {
      setCurrentImageUrl(null);
    }
    setImageLoaded(false);
    setImageError(false);
  }, [coverImageUrl, sourceUrl]);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const sourceName =
    post?.sourceInfo?.name ||
    post?.author?.name ||
    "Ubona Communications";

  const sourceAvatarUrl = post?.sourceInfo?.avatar?.url
    ? getImageUrl(post.sourceInfo.avatar.url)
    : post?.author?.avatar?.url
    ? getImageUrl(post.author.avatar.url)
    : null;

  const sourceInitials = sourceName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("") || "UB";

  const getTagInfo = () => {
    const isLatest = latestNewsId && post.id === latestNewsId;
    if (isLatest) {
      return TAG_STYLES.latest;
    }
    if (post.featured) {
      return TAG_STYLES.featured;
    }
    if (post.trending) {
      return TAG_STYLES.trending;
    }
    return null;
  };

  const tagInfo = getTagInfo();
  // const TagIcon = tagInfo?.icon;

  return (
    <div className="group cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
      
        const finalImage = currentImageUrl;  // the exact working image
      
        if (post.redirect_link) {
          window.open(post.redirect_link, "_blank");
        } else {
          onOpenModal({ ...post, finalImage });
        }
      }}
    >
      <motion.article 
        className="bg-white p-4 pb-6 border border-[#EDEDED] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Cover Image */}
        <div className="relative h-48 overflow-hidden rounded-xl bg-[#0E1E35]">
          {!imageLoaded && !imageError && currentImageUrl && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0E1E35] via-[#0F2244] to-[#163B7A] animate-pulse" />
          )}
          {currentImageUrl ? (
            <LazyImage 
              src={currentImageUrl} 
              alt={post.title}
              wrapperClassName="w-full h-full block"
              className={`w-full h-full rounded-xl object-cover transition-transform duration-300 ${imageLoaded ? 'opacity-100 group-hover:scale-105' : 'opacity-0'}`}
              afterLoad={() => setImageLoaded(true)}
              onError={() => {
                // If coverImage failed and source exists, try source
                if (currentImageUrl === coverImageUrl && sourceUrl) {
                  setCurrentImageUrl(sourceUrl);
                  setImageError(false);
                  setImageLoaded(false);
                } else {
                  setImageError(true);
                }
              }}
            />
          ) : null}
          {imageError && !sourceUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/40 to-indigo-700/30 text-blue-100 text-sm font-medium">
              Image unavailable
            </div>
          )}
          
          {/* Tag */}
          {tagInfo && (
            <div className="absolute top-1.5 right-1.5">
              <span className={`${tagInfo.bg} ${tagInfo.textColor} px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg`}>
                {/* <TagIcon className="w-4 h-4" /> */}
                <img src={tagInfo.icon} alt={tagInfo.alt} className="w-4.5 h-4.5" />
                {tagInfo.text}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col mt-3">
          <h3 className="text-base font-semibold text-[#242424] tracking-[-0.16px] mb-2 md:mb-3.5 line-clamp-2 group-hover:text-blue-600 transition-colors ease-in-out duration-500 leading-tight">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 mb-3 md:mb-4">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                {sourceAvatarUrl ? (
                  <img
                    src={sourceAvatarUrl}
                    alt={sourceName}
                    className="w-8 h-8 rounded-full object-cover border border-gray-100"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#EAF2FF] text-[#1269CD] flex items-center justify-center text-xs font-semibold">
                    {sourceInitials}
                  </div>
                )}
                <span className="text-xs font-semibold text-[#001528] leading-tight">
                  {sourceName}
                </span>
              </div>
              {post?.publishedAt && (
                <p className="text-xs text-[#001528] font-normal flex items-center gap-2">
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <g clipPath="url(#clip0_922_22521)">
                        <path d="M2.11607 14H11.885C12.909 14 13.7413 13.1678 13.7413 12.1437V2.89332C13.7413 1.86925 12.909 1.03702 11.885 1.03702H11.1487V0.518509C11.1487 0.23332 10.9153 0 10.6301 0C10.3449 0 10.1116 0.23332 10.1116 0.518509V1.03702H3.88941V0.518509C3.88941 0.23332 3.65605 0 3.37086 0C3.08567 0 2.85235 0.23332 2.85235 0.518509V1.03702H2.11607C1.09199 1.03702 0.259766 1.86925 0.259766 2.89332V12.1437C0.259766 13.1678 1.09199 14 2.11607 14ZM1.29683 2.89332C1.29683 2.44222 1.66497 2.07408 2.11607 2.07408H2.85235V2.59259C2.85235 2.87778 3.08567 3.1111 3.37086 3.1111C3.65605 3.1111 3.88937 2.87778 3.88937 2.59259V2.07408H10.1116V2.59259C10.1116 2.87778 10.3449 3.1111 10.6301 3.1111C10.9153 3.1111 11.1486 2.87778 11.1486 2.59259V2.07408H11.8849C12.336 2.07408 12.7042 2.44222 12.7042 2.89332V4.40741H1.29683V2.89332ZM1.29683 5.44443H12.7042V12.1437C12.7042 12.5948 12.3361 12.9629 11.885 12.9629H2.11607C1.66497 12.9629 1.29683 12.5948 1.29683 12.1437V5.44443Z" fill="#001528"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_922_22521">
                          <rect width="14" height="14" fill="white"/>
                        </clipPath>
                      </defs>
                    </svg> 
                  </span> {formatDate(post.publishedAt)}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

// Hero Section Component - Matching Figma
function HeroSection({ featuredPost, onOpenModal }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!featuredPost) {
    return (
      <div className="bg-[#6246EC] h-68 rounded-[20px] backdrop-blur-xs flex flex-col justify-between relative bg-[url('/assets/images/blog/blog-bnr-bg.webp')] bg-no-repeat bg-bottom mb-15">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Latest News
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 mb-8">
              Stay updated with the latest developments, insights, and announcements
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Get cover image URL - priority: coverImage > source URL
  // If coverImage is not available, use source URL
  const heroCoverImageUrl = featuredPost.coverImage?.url ? getImageUrl(featuredPost.coverImage.url) : null;
  const heroSourceUrl = featuredPost.source && featuredPost.source.startsWith('http') ? featuredPost.source : null;
  const heroImageUrl = heroCoverImageUrl || heroSourceUrl;

  return (
    <div className="relative min-h-68 rounded-[20px] overflow-hidden mb-6 md:mb-15">
      {/* Cover Image Background */}
      {heroImageUrl ? (
        <div className="absolute inset-0">
          <img 
            src={heroImageUrl} 
            alt={featuredPost.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-[#1269CD] bg-[url('/assets/images/blog/blog-bnr-bg.svg')] bg-no-repeat bg-top">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      )}
      
      <div className="relative flex flex-col justify-between min-h-68 px-4 pt-12 pb-5.5">
        <div className="flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center relative z-10"
          >
            <h1 className="w-full md:w-4xl mx-auto text-2xl md:text-3xl font-semibold text-white mb-2.5 leading-tight">
              {featuredPost.title}
            </h1>
            <p className="text-base text-white max-w-4xl mx-auto mb-4">
              {featuredPost.excerpt}
            </p>
            <div className="flex justify-center">
              <ButtonArrow
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
              
                  const finalImage = featuredPost.coverImage?.url 
                    ? getImageUrl(featuredPost.coverImage.url)
                    : featuredPost.source;
              
                  if (featuredPost.redirect_link) {
                    window.open(featuredPost.redirect_link, "_blank");
                  } else {
                    onOpenModal({
                      ...featuredPost,
                      finalImage
                    });
                  }
                }}
                text="View More"
                bgColor="#FFBF3C"
                hoverColor="#1269CD"
                textColor="#000"
                hoverTextColor="#fff"
                padding="pl-4 py-1 pr-1 w-full sm:w-auto"
                rounded="rounded-full"
                textSize="text-base"
              />
            </div>
          </motion.div>
        </div>
        
        {/* Date */}
        <div className="flex items-end justify-center md:justify-end relative mt-4 md:mt-0 px-5.5 pb-5.5">
          <div className="flex items-center gap-2.5">
            <img className="" src="/assets/images/blog/blog-calndr.svg" alt="calender icon" />
            <span className="text-base text-white font-medium tracking-[-0.16px]">{formatDate(featuredPost.publishedAt)}</span>
          </div>
        </div>
      </div>
      {/* Author and Date */}
      {/* <div className="flex items-end justify-between relative px-5.5 pb-5.5">
        <div>
          {featuredPost.author && (
            <div className="flex items-center gap-2.5">
              {featuredPost.author.avatar?.url ? (
                <img 
                  src={getImageUrl(featuredPost.author.avatar.url)} 
                  alt={featuredPost.author.name}
                  className="w-11 h-11 rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
                  <PersonIcon className="w-11 h-11" />
                </div>
              )}
              <span className="text-white  text-xl tracking-[-0.2px] font-semibold">{featuredPost.author.name}</span>
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <img className="" src="/assets/images/blog/blog-calndr.svg" alt="calender icon" />
            <span className="text-base text-white font-medium tracking-[-0.16px]">{formatDate(featuredPost.publishedAt)}</span>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default function News() {
  const location = useLocation();
  const isAllNewsPage = location.pathname === '/news/all';
  const [newsPosts, setNewsPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const latestNewsId = useMemo(() => {
    if (!newsPosts.length) return null;

    const getTimestamp = (post) => {
      if (!post) return 0;
      const source = post.publishedAt || post.createdAt;
      const time = new Date(source || 0).getTime();
      return Number.isNaN(time) ? 0 : time;
    };

    const latestPost = newsPosts.reduce((currentLatest, post) => {
      return getTimestamp(post) > getTimestamp(currentLatest) ? post : currentLatest;
    }, newsPosts[0]);

    return latestPost?.id || null;
  }, [newsPosts]);

  const categoryFilters = useMemo(() => {
    const map = new Map();
    newsPosts.forEach((post) => {
      const rawCategories = Array.isArray(post?.category)
        ? post.category
        : post?.category
        ? [post.category]
        : [];

      rawCategories.forEach((cat) => {
        if (!cat || map.has(cat)) return;
        map.set(cat, formatCategoryLabel(cat));
      });
    });
    return Array.from(map, ([value, label]) => ({ value, label }));
  }, [newsPosts]);

  const filteredPosts = useMemo(() => {
    if (filter === "trending") {
      return newsPosts.filter((post) => post.trending);
    }

    if (filter === "latest") {
      return newsPosts;
    }

    if (filter.startsWith("category:")) {
      const targetCategory = filter.replace("category:", "");
      return newsPosts.filter((post) => {
        const categories = Array.isArray(post?.category)
          ? post.category
          : post?.category
          ? [post.category]
          : [];
        return categories.includes(targetCategory);
      });
    }

    return newsPosts;
  }, [filter, newsPosts]);

  const postsToDisplay = isAllNewsPage
    ? filteredPosts
    : filteredPosts.slice(0, 6);

  const hasResults = filteredPosts.length > 0;

  const openNewsModal = (post) => {
    setSelectedNews(post);
    setIsModalOpen(true);
  };

  const closeNewsModal = () => {
    setSelectedNews(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        console.log('Fetching news from API_BASE:', API_BASE);
        
        // Fetch news posts from dedicated News collection
        const limit = isAllNewsPage ? 50 : 10; // Show more posts on all news page
        const url = `${API_BASE}/api/news?sort=-publishedAt&limit=${limit}`;
        console.log('Fetching URL:', url);
        
        const res = await fetch(url);
        console.log('Response status:', res.status);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('API Error:', errorText);
          throw new Error(`Failed to load news (${res.status}): ${errorText}`);
        }
        
        const json = await res.json();
        if (!isMounted) return;
        
        console.log('News posts data:', json.docs);
        setNewsPosts(json.docs || []);
      } catch (e) {
        if (!isMounted) return;
        console.error('Error loading news:', e);
        setError(e?.message || "Failed to load");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#00081F] pt-24">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading news...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#00081F] pt-24">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center text-red-600">
            <p className="text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // When filter is "trending", only show trending posts in hero section
  const featuredPost = filter === "trending"
    ? (filteredPosts.find((post) => post.featured) || filteredPosts[0] || null)
    : (filteredPosts.find((post) => post.featured) ||
       filteredPosts[0] ||
       newsPosts.find((post) => post.featured) ||
       newsPosts[0]);

  return (
    <div className="min-h-screen bg-[#00081F] pt-24 xl:pt-30 px-4 xl:px-12 2xl:px-22">
      {/* Hero Section */}
      <HeroSection featuredPost={featuredPost} onOpenModal={openNewsModal} />

      {/* Main Content Area */}
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pb-8">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="sticky top-24 space-y-6"
            >
              <div className="rounded-xl p-4"
                style={{ background: "linear-gradient(180deg, rgba(0, 22, 44, 0.80) 28.51%, rgba(18, 105, 205, 0.80) 100%)" }}
              >
                <p className="text-sm font-semibold text-[#DBF262] mb-8.5 flex items-center">
                  Filters
                </p>
                <div className="space-y-4">
                  {/* Trending Now */}
                  <button
                    onClick={() => setFilter("trending")}
                    className={`w-full text-left px-4 py-3 rounded-lg text-base text-white outline-0 transition-all duration-200 flex items-center justify-between gap-2.5 cursor-pointer ${
                      filter === "trending" 
                        ? "bg-[#1269CD]" 
                        : "bg-transparent hover:bg-[#1a2438]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <LazyImage effect="blur" src="/assets/images/blog/fltr-bar.svg" alt="bar icon" className="w-5" />
                      <span className="font-medium">Trending Now</span>
                    </div>
                    <ChevronForwardIcon className="w-4 h-4" />
                  </button>

                  {/* Latest News */}
                  <button
                    onClick={() => setFilter("latest")}
                    className={`w-full text-left px-4 py-3 rounded-lg text-base text-white outline-0 transition-all duration-200 flex items-center justify-between cursor-pointer ${
                      filter === "latest" 
                        ? "bg-[#1269CD]" 
                        : "bg-transparent hover:bg-[#1a2438]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <LazyImage effect="blur" src="/assets/images/blog/fltr-time.svg" alt="time icon" className="w-5" />
                      <span className="font-medium">Latest News</span>
                    </div>
                    <ChevronForwardIcon className="w-4 h-4" />
                  </button>

                  {/* Explore Categories */}
                  <div>
                    <button
                      onClick={() => setShowCategories(!showCategories)}
                      className="w-full text-left px-4 py-3 rounded-lg text-base text-white outline-0 transition-all duration-200 flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <LazyImage effect="blur" src="/assets/images/blog/fltr-search.svg" alt="time icon" className="w-5" />
                        <span className="text-sm font-semibold">Explore categories</span>
                      </span>
                      <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${showCategories ? 'rotate-0' : '-rotate-90'}`} />
                    </button>

                    {showCategories && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1 pt-2"
                      >
                        <button
                          onClick={() => setFilter("all")}
                          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center justify-between gap-2 cursor-pointer ${
                            filter === "all" 
                              ? "bg-[#1269CD] text-white" 
                              : "text-white hover:bg-[#00081F]"
                          }`}
                        >
                          <span className="text-xs font-medium text-white">All News</span>
                          <ChevronForwardIcon className={`w-4 h-4 transition-transform duration-200 ${
                            filter === "all" ? 'opacity-100' : 'opacity-50'
                          }`} />
                        </button>
                        {categoryFilters.length === 0 ? (
                          <p className="text-xs text-white/70 px-4 py-2">
                            Categories will appear once news items are categorized in the admin.
                          </p>
                        ) : (
                          categoryFilters.map(({ value, label }) => {
                            const active = filter === `category:${value}`;
                            return (
                              <button
                                key={value}
                                onClick={() => setFilter(`category:${value}`)}
                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center justify-between gap-2 cursor-pointer ${
                                  active
                                    ? "bg-[#1269CD] text-white"
                                    : "text-white hover:bg-[#00081F]"
                                }`}
                              >
                                <span>{label}</span>
                                <ChevronForwardIcon
                                  className={`w-4 h-4 transition-transform duration-200 ${
                                    active ? "opacity-100" : "opacity-50"
                                  }`}
                                />
                              </button>
                            );
                          })
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >

                {/* Latest News Section */}
                <div>
                  {/* <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {isAllNewsPage ? 'All News' : 'Latest News'}
                  </h2> */}
                  {hasResults ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {postsToDisplay.map((post) => (
                          <NewsCard key={post.id} post={post} onOpenModal={openNewsModal} latestNewsId={latestNewsId} />
                        ))}
                      </div>
                      
                      {/* Read More Link - only show on main news page */}
                      {!isAllNewsPage && filter === "all" && filteredPosts.length > 6 && (
                        <div className="text-center mt-8">
                          <Link 
                            to="/news/all"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                          >
                            Read More News
                            <ChevronForwardIcon className="w-4 h-4" />
                          </Link>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-16 bg-white rounded-lg shadow-lg">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">📰</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No news articles found</h3>
                      <p className="text-gray-500 mb-4">
                        {filter === "all"
                          ? "News articles are managed through the admin panel."
                          : "Try another filter or reset to view all news."}
                      </p>
                      <p className="text-sm text-gray-400">Check back later for updates!</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
      </div>
      {isModalOpen && selectedNews && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 md:px-0">
          <div className="relative max-w-4xl w-full group">

            {/* Close button */}
            <button
              onClick={closeNewsModal}
              className="absolute top-2 md:top-4 right-2 md:right-4 cursor-pointer bg-white text-black w-7 md:w-10 h-7 md:h-10 rounded-full shadow-lg flex items-center justify-center z-50 md:opacity-0 group-hover:opacity-100 hover:shadow-xl hover:bg-[#FFBF3C] transition-all ease-in-out duration-500"
            >
              ✕
            </button>

            {/* Image only */}
            <img
              src={selectedNews.finalImage}
              className="w-full max-h-[90vh] object-contain rounded-xl"
              alt="news"
            />
          </div>
        </div>
      )}

    </div>
    );
  }