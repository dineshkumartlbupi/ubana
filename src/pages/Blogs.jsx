import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import useSEO from "../utils/useSEO";
import LazyImage from "../components/lazyImage";
import ButtonArrow from "../components/buttonArrow";
import { IoChevronDown, IoClose, IoSearch } from "react-icons/io5";

const API_BASE = import.meta.env.VITE_PAYLOAD_API_URL || "http://localhost:3011"; // Default to localhost:3011

// Helper function to extract categories from a blog post
const getCategories = (post) => {
  if (Array.isArray(post.category)) {
    // New format: array of objects with category field
    return post.category.map(c => {
      if (typeof c === 'string') return c;
      return c?.category || c;
    }).filter(Boolean);
  }
  if (typeof post.category === 'string') {
    // Old format: single string, might be comma-separated
    return post.category.split(',').map(c => c.trim()).filter(Boolean);
  }
  return [];
};

// Blog Card Component - Case Study Format
function BlogCard({ post, featured = false }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: '2-digit' 
    });
  };

  return (
    <Link to={`/blogs/${post.slug}`} className="group">
      <motion.article 
        className="bg-white p-4 pb-6 border border-[#EDEDED] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.2 }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Cover Image */}
        <div className="relative h-48 overflow-hidden bg-[#E8E3E3] rounded-xl">
          {post?.coverImage?.url ? (
            <img 
              src={post.coverImage.url.startsWith('http') ? post.coverImage.url : `${API_BASE}${post.coverImage.url}`} 
              alt={post.title}
              className="w-full h-full rounded-xl object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className={`w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-white text-2xl font-bold ${
              post?.coverImage?.url ? 'hidden' : 'flex'
            }`}
          >
            {(() => {
              const cats = getCategories(post);
              return cats.length > 0 ? cats[0].toUpperCase() : 'BLOG';
            })()}
          </div>
          
          {/* Trending Tag */}
          {post?.featured && (
            <div className="absolute top-1.5 right-1.5">
              <span className="bg-[#DBF262] text-[#536109] px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm">
              <LazyImage effect="blur" src="/assets/images/blog/bar-green.svg" alt="bar icon" className="w-4.5" /> Trending
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col mt-3">
          {/* Title */}
          <h3 className="text-base font-semibold text-[#242424] tracking-[-0.16px] mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
            {post?.title}
          </h3>
          
          {/* Excerpt */}
          {post?.excerpt && (
            <p className="text-sm text-[#000B15] opacity-60 mb-0 line-clamp-2 leading-relaxed flex-1">
              {post.excerpt}
            </p>
          )}

          {/* Category Badge */}
          {/* {post?.category && (
            <div className="mb-4 flex flex-wrap gap-2">
              {Array.isArray(post.category) ? (
                post.category.map((cat, idx) => (
                  <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                    {(typeof cat === 'string' ? cat : cat?.category || '').replace('-', '/').toUpperCase()}
                  </span>
                ))
              ) : (
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                  {post.category.replace('-', '/').toUpperCase()}
                </span>
              )}
            </div>
          )} */}

          {/* Author & Meta */}
          <div className="flex items-center justify-between pt-4 mt-auto">
            <div className="flex items-center gap-2">
              {post?.author?.avatar?.url ? (
                <img 
                  src={post.author.avatar.url.startsWith('http') ? post.author.avatar.url : `${API_BASE}${post.author.avatar.url}`} 
                  alt={post.author.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-sm">
                  {post?.author?.name?.charAt(0) || 'A'}
                </div>
              )}
              <span className="text-sm font-medium text-[#000B15]">{post?.author?.name}</span>
            </div>
            
            <div className="flex items-center gap-5">
              {post?.readTime && (
                <p className="text-xs text-[#1269CD] font-normal flex items-center gap-2">
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <g clip-path="url(#clip0_922_22514)">
                        <path d="M7 14C10.8593 14 14 10.8593 14 7C14 3.14067 10.8594 0 7 0C3.14063 0 0 3.14067 0 7C0 10.8593 3.14067 14 7 14ZM7 0.933318C10.346 0.933318 13.0667 3.65398 13.0667 7C13.0667 10.346 10.346 13.0667 7 13.0667C3.65398 13.0667 0.933318 10.346 0.933318 7C0.933318 3.65398 3.65401 0.933318 7 0.933318Z" fill="#1269CD"/>
                        <path d="M9.04153 9.23145C9.12788 9.30143 9.23052 9.33412 9.33319 9.33412C9.47086 9.33412 9.60619 9.27345 9.69718 9.15912C9.85819 8.95845 9.82549 8.66445 9.62486 8.50344L7.46652 6.77677V3.26744C7.46652 3.01077 7.25653 2.80078 6.99986 2.80078C6.74319 2.80078 6.5332 3.01077 6.5332 3.26744V7.00079C6.5332 7.14313 6.59855 7.27612 6.7082 7.36477L9.04153 9.23145Z" fill="#1269CD"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_922_22514">
                          <rect width="14" height="14" fill="white"/>
                        </clipPath>
                      </defs>
                    </svg>
                  </span> {post.readTime} min read
                </p>
              )}
              {post?.publishedAt && (
                <p className="text-xs text-[#001528] font-normal flex items-center gap-2">
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <g clip-path="url(#clip0_922_22521)">
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
    </Link>
  );
}

// Category configuration
const CATEGORIES = [
  { value: 'all', label: 'Show All', icon: '📚' },
  { value: 'corporate-security', label: 'Corporate Security', icon: '🔒' },
  { value: 'ivr', label: 'IVR', icon: '📞' },
  { value: 'ai', label: 'AI', icon: '🤖' },
  { value: 'work-culture', label: 'Work Culture', icon: '👥' },
  { value: 'bots', label: 'Bots', icon: '🤖' },
  { value: 'nlp', label: 'NLP', icon: '💬' },
  { value: 'gitops', label: 'GitOps', icon: '⚙️' },
  { value: 'sales', label: 'Sales', icon: '💼' },
  { value: 'technology', label: 'Technology', icon: '💻' },
  { value: 'ccaas', label: 'CCaaS', icon: '☁️' },
  { value: 'ml', label: 'ML', icon: '🧠' },
  { value: 'cloud-security', label: 'Cloud Security', icon: '🛡️' },
  { value: 'growth', label: 'Growth', icon: '📈' },
];

export default function Blogs() {
  useSEO({
    title: "Ubona Blog | Insights on AI Voice Automation and Emerging Tech",
    description: "Explore Ubona’s latest insights on AI voice automation, conversational platforms, and more. Discover how technology shapes modern communication."
  });
  const [blogPosts, setBlogPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest'); // 'latest' or 'trending'
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        console.log('Fetching from API_BASE:', API_BASE);
        const url = `${API_BASE}/api/blog-posts?sort=-publishedAt&limit=100`;
        console.log('Fetching URL:', url);
        
        const res = await fetch(url);
        console.log('Response status:', res.status);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('API Error:', errorText);
          throw new Error(`Failed to load blogs (${res.status}): ${errorText}`);
        }
        
        const json = await res.json();
        if (!isMounted) return;
        
        // Debug: Log the blog posts data to see image URLs
        console.log('Blog posts data:', json.docs);
        if (json.docs && json.docs.length > 0) {
          console.log('First blog post coverImage:', json.docs[0].coverImage);
          console.log('First blog post coverImage URL:', json.docs[0].coverImage?.url);
        }
        
        const docs = json.docs || [];
        setBlogPosts(docs);
        
        // Extract all unique categories from all blog posts
        const allCats = docs.flatMap(getCategories);
        const uniqueCats = Array.from(new Set(allCats)).sort();
        setCategories(uniqueCats);
      } catch (e) {
        if (!isMounted) return;
        console.error('Error loading blogs:', e);
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

  // Filter and sort blogs
  useEffect(() => {
    let filtered = [...blogPosts];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => {
        const cats = getCategories(post);
        return cats.some(c => c.toLowerCase() === selectedCategory.toLowerCase());
      });
    }

    // Filter by trending (only show featured posts) - only when no category filter is active
    if (sortBy === 'trending' && selectedCategory === 'all') {
      filtered = filtered.filter(post => post.featured === true);
    }
    console.log('Filtered posts:', filtered);

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.title?.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        post.tags?.some(tag => tag.tag?.toLowerCase().includes(query))
      );
    }

    // Sort by trending or latest
    if (sortBy === 'trending') {
      filtered = filtered.sort((a, b) => {
        // Featured posts first
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        // Then by date
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      });
    } else {
      // Latest
      filtered = filtered.sort((a, b) => 
        new Date(b.publishedAt) - new Date(a.publishedAt)
      );
    }

    setFilteredPosts(filtered);
  }, [blogPosts, selectedCategory, sortBy, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#00081F]">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading blogs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#00081F]">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center text-red-400">
            <p className="text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const trendingPosts = blogPosts.filter(post => post.featured).slice(0, 3);
  const latestPosts = [...blogPosts].sort((a, b) => 
    new Date(b.publishedAt) - new Date(a.publishedAt)
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#00081F] pt-24 xl:pt-30 px-4 xl:px-12 2xl:px-22">
      {/* Header */}
      <div className="bg-[#1269CD] rounded-[20px] overflow-hidden backdrop-blur-xs mb-8 md:mb-15">
        <div className="w-full md:w-5xl mx-auto flex justify-center items-center h-100 px-4 py-12 bg-[url('/assets/images/blog/blog-bnr-bg.svg')] bg-no-repeat bg-cover bg-center md:bg-center-bottom overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span>
              <LazyImage effect="blur" src="/assets/images/home/halo-color.svg" alt="halo icon" className="w-24" />
            </span>
            <h1 className="text-4xl md:text-[3.25rem] font-bold text-white mt-5 mb-2.5">
              HALO Genie <span className="font-light">by Ubona</span>
            </h1>
            <p className="text-base text-white max-w-lg mx-auto mb-8">
              Emerging as a groundbreaking solution, transforming how businesses connect with their customers.
            </p>
            <div className="flex justify-center">
              <ButtonArrow
                to="/blogs/halo_genie_AI-Powered%20_communication_meets_seamless_cloud_deployment"
                text="Read More about Genie"
                bgColor="#FFBF3C"
                hoverColor="#30178A"
                textColor="#000"
                hoverTextColor="#fff"
                padding="pl-4 py-1 pr-1 w-full md:w-auto"
                rounded="rounded-full"
                textSize="text-base"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-0 pb-12">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <motion.aside 
            className="lg:w-64 xl:w-72 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="sticky top-24 space-y-6">
              {/* Filters Header */}
              <div className="rounded-xl p-4"
                style={{ background: "linear-gradient(180deg, rgba(0, 22, 44, 0.80) 28.51%, rgba(18, 105, 205, 0.80) 100%)" }}
              >
                <p className="text-sm font-semibold text-[#DBF262] mb-8.5 flex items-center">
                  Filters
                </p>
                
                {/* Search Bar */}
                <div className="hidden">
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Search blogs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#00081F] text-white border border-blue-900/50 rounded-lg pl-10 pr-10 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        <IoClose className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Active Filters */}
                  {(selectedCategory !== 'all' || searchQuery) && (
                    <div className="mb-4 pb-4 border-b border-blue-900/30">
                      <p className="text-xs text-gray-400 mb-2">Active Filters:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCategory !== 'all' && (
                          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                            {selectedCategory}
                            <button onClick={() => setSelectedCategory('all')} className="hover:text-gray-200">
                              <IoClose className="w-3 h-3" />
                            </button>
                          </span>
                        )}
                        {searchQuery && (
                          <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                            &quot;{searchQuery}&quot;
                            <button onClick={() => setSearchQuery('')} className="hover:text-gray-200">
                              <IoClose className="w-3 h-3" />
                            </button>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => {setSortBy('trending'); setSelectedCategory('all');}}
                    className={`w-full text-left px-4 py-3 rounded-lg text-base text-white outline-0 transition-all duration-200 flex items-center gap-2.5 cursor-pointer ${
                      sortBy === 'trending'
                        ? 'bg-[#1269CD]'
                        : 'bg-transparent hover:bg-[#1a2438]'
                    }`}
                  >
                    <LazyImage effect="blur" src="/assets/images/blog/fltr-bar.svg" alt="bar icon" className="w-5" />
                    <span className="font-medium">Trending Now</span>
                  </button>
                  <button
                    onClick={() => {setSortBy('latest'); setSelectedCategory('all');}}
                    className={`w-full text-left px-4 py-3 rounded-lg text-base text-white outline-0 transition-all duration-200 flex items-center gap-2.5 cursor-pointer ${
                      sortBy === 'latest'
                        ? 'bg-[#1269CD]'
                        : 'bg-transparent hover:bg-[#1a2438]'
                    }`}
                  >
                    <LazyImage effect="blur" src="/assets/images/blog/fltr-time.svg" alt="time icon" className="w-5" />
                    <span className="font-medium">Latest Blogs</span>
                  </button>
                  {/* Category Filters */}
                  <button
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="w-full text-left px-4 py-3 rounded-lg text-base text-white outline-0 transition-all duration-200 flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <LazyImage effect="blur" src="/assets/images/blog/fltr-search.svg" alt="time icon" className="w-5" />
                      <span className="text-sm font-semibold">Explore Categories</span>
                    </span>
                    <IoChevronDown 
                      className={`w-4 h-4 transition-transform duration-200 ${
                        showCategoryDropdown ? '-rotate-180' : 'rotate-0'
                      }`}
                    />
                  </button>
                  
                  <AnimatePresence>
                    {showCategoryDropdown && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 pt-2">
                          <button
                            onClick={() => {setSelectedCategory('all'); setSortBy('latest');}}
                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                              selectedCategory === 'all'
                                ? 'bg-[#1269CD] text-white'
                                : 'text-white hover:bg-[#00081F]'
                            }`}
                          >
                            <span className="text-xs font-medium text-white">Show All</span>
                            <span className="ml-auto text-xs">
                              <IoChevronDown 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  selectedCategory === 'all' ? '-rotate-90 opacity-100' : '-rotate-90 opacity-50'
                                }`}
                              />
                            </span>
                          </button>
                          {categories.map((cat) => {
                            const categoryConfig = CATEGORIES.find(c => c.value === cat);
                            return (
                              <button
                                key={cat}
                                onClick={() => {setSelectedCategory(cat); setSortBy('');}}
                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                                  selectedCategory === cat
                                    ? 'bg-[#1269CD] text-white'
                                    : 'text-white hover:bg-[#00081F]'
                                }`}
                              >
                                <span className="text-xs font-medium text-white hidden">{categoryConfig?.icon || ''}</span>
                                <span className="text-xs font-medium text-white">{categoryConfig?.label || cat}</span>
                                <span className="ml-auto text-xs">
                                  <IoChevronDown 
                                    className={`w-4 h-4 transition-transform duration-200 ${
                                      selectedCategory === cat ? '-rotate-90 opacity-100' : '-rotate-90 opacity-50'
                                    }`}
                                  />
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Quick Links - Trending Posts */}
                  {sortBy !== 'trending' && trendingPosts.length > 0 && (
                    <div className="bg-[#0A1628] rounded-lg p-4 border border-blue-900/30 hidden">
                      <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <span>⚡</span> Trending Posts
                      </h3>
                      <div className="space-y-3">
                        {trendingPosts.map((post) => (
                          <Link
                            key={post.id}
                            to={`/blogs/${post.slug}`}
                            className="block group"
                          >
                            <div className="flex gap-2">
                              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                {post?.coverImage?.url ? (
                                  <img 
                                    src={post.coverImage.url.startsWith('http') ? post.coverImage.url : `${API_BASE}${post.coverImage.url}`} 
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
                                  {post.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {post.readTime} min read
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Links - Latest Posts */}
                  {sortBy !== 'latest' && latestPosts.length > 0 && (
                    <div className="bg-[#0A1628] rounded-lg p-4 border border-blue-900/30 hidden">
                      <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <span>🆕</span> Latest Posts
                      </h3>
                      <div className="space-y-3">
                        {latestPosts.map((post) => (
                          <Link
                            key={post.id}
                            to={`/blogs/${post.slug}`}
                            className="block group"
                          >
                            <div className="flex gap-2">
                              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                {post?.coverImage?.url ? (
                                  <img 
                                    src={post.coverImage.url.startsWith('http') ? post.coverImage.url : `${API_BASE}${post.coverImage.url}`} 
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
                                  {post.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.main 
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Results Header */}
            {/* <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-white">
                  {sortBy === 'trending' ? '⚡ Trending Blogs' : '🆕 Latest Blogs'}
                </h2>
                <span className="text-sm text-gray-400">
                  {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
                </span>
              </div>
              {selectedCategory !== 'all' && (
                <p className="text-sm text-gray-400">
                  Showing {CATEGORIES.find(c => c.value === selectedCategory)?.label} articles
                </p>
              )}
            </div> */}

            {/* Blog Grid */}
            {filteredPosts.length === 0 ? (
              <div className="text-center py-20 bg-[#0A1628] rounded-lg border border-blue-900/30">
                <div className="text-6xl mb-4">😔</div>
                <p className="text-gray-300 text-lg mb-2">No blogs found</p>
                <p className="text-gray-500 text-sm mb-6">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <BlogCard post={post} featured={post.featured} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.main>
        </div>
      </div>
    </div>
  );
}
