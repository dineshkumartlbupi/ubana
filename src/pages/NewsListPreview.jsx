import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  IoEye as EyeIcon, 
  IoTrendingUp as TrendingIcon,
  IoCalendar as CalendarIcon,
  IoFilter as FilterIcon,
  IoSearch as SearchIcon,
  IoChevronDown as ChevronDownIcon,
  IoChevronForward as ChevronForwardIcon,
  IoWarning as WarningIcon
} from "react-icons/io5";

const API_BASE = import.meta.env.VITE_PAYLOAD_API_URL || "http://localhost:3011";

// News Card Component - Matching Figma Design
function NewsCard({ post, featured = false, size = "normal" }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTagInfo = () => {
    if (post.featured) {
      return { text: "Most viewed", icon: EyeIcon, color: "bg-green-500" };
    }
    if (post.trending) {
      return { text: "Trending", icon: TrendingIcon, color: "bg-green-400" };
    }
    return null;
  };

  const tagInfo = getTagInfo();
  const TagIcon = tagInfo?.icon;

  return (
    <motion.article 
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 h-full"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        {(() => {
          // Priority: coverImage > source URL
          // If coverImage is not available, use source URL
          const coverImageUrl = post.coverImage?.url ? post.coverImage.url : null;
          const sourceUrl = post.source && post.source.startsWith('http') ? post.source : null;
          const imageUrl = coverImageUrl || sourceUrl;
          
          return imageUrl ? (
            <img 
              src={imageUrl} 
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // If coverImage failed and source exists, try source
                if (coverImageUrl && sourceUrl && e.target.src === coverImageUrl) {
                  e.target.src = sourceUrl;
                }
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          );
        })()}
        
        {/* Tag */}
        {tagInfo && (
          <div className={`absolute top-4 right-4 ${tagInfo.color} text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg`}>
            <TagIcon className="w-3 h-3" />
            {tagInfo.text}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3">
            {post.excerpt}
          </p>
        </div>

        {/* Meta Information */}
        <div className="flex items-center justify-end text-sm text-gray-500">
          {post?.publishedAt && (
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          )}
        </div>

      </div>
    </motion.article>
  );
}

// Hero Section Component - Matching Figma
function HeroSection({ featuredPost }) {
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
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
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

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
      {/* Dot Pattern Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container mx-auto px-4 py-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-white"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {featuredPost.title}
          </h1>
          <p className="text-lg md:text-xl max-w-4xl mx-auto opacity-90 mb-8 leading-relaxed">
            {featuredPost.excerpt}
          </p>
          
          {/* Date */}
          <div className="flex items-center justify-center gap-2 text-white">
            <CalendarIcon className="w-4 h-4" />
            <span>{formatDate(featuredPost.publishedAt)}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function NewsPreview() {
  const [searchParams] = useSearchParams();
  const [newsPosts, setNewsPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    // Check if this is a preview request
    const preview = searchParams.get('preview');
    const token = searchParams.get('token');
    
    if (preview === 'true' && token) {
      setIsPreviewMode(true);
    }

    async function load() {
      try {
        setLoading(true);
        console.log('Fetching news preview from API_BASE:', API_BASE);
        
        // For preview, we fetch draft/unpublished versions
        const url = `${API_BASE}/api/news?sort=-createdAt&limit=20&draft=true`;
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
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading preview...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center text-red-600">
            <p className="text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const featuredPost = newsPosts.find(post => post.featured) || newsPosts[0];
  const regularPosts = newsPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Banner */}
      {isPreviewMode && (
        <div className="bg-yellow-500 text-yellow-900 px-4 py-2 text-center font-medium">
          <div className="flex items-center justify-center gap-2">
            <WarningIcon className="w-5 h-5" />
            <span>Preview Mode - This is how your news page will look when published</span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <HeroSection featuredPost={featuredPost} />

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-800 rounded-lg p-6 sticky top-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <FilterIcon className="w-5 h-5 text-white" />
                <h3 className="text-lg font-semibold text-white">Filters</h3>
              </div>

              <div className="space-y-4">
                {/* Trending Now */}
                <button className="w-full flex items-center justify-between p-3 rounded-lg transition-colors text-blue-400 hover:bg-gray-700">
                  <div className="flex items-center gap-3">
                    <TrendingIcon className="w-5 h-5" />
                    <span className="font-medium">Trending Now</span>
                  </div>
                  <ChevronForwardIcon className="w-4 h-4" />
                </button>

                {/* Latest News */}
                <button className="w-full flex items-center justify-between p-3 rounded-lg transition-colors text-gray-400 hover:bg-gray-700">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5" />
                    <span className="font-medium">Latest News</span>
                  </div>
                  <ChevronForwardIcon className="w-4 h-4" />
                </button>

                {/* Explore Categories */}
                <div>
                  <button className="w-full flex items-center justify-between p-3 rounded-lg transition-colors text-gray-400 hover:bg-gray-700">
                    <div className="flex items-center gap-3">
                      <SearchIcon className="w-5 h-5" />
                      <span className="font-medium">Explore categories</span>
                    </div>
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>
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
              {/* Featured News Section */}
              {featuredPost && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured News</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <NewsCard post={featuredPost} featured={true} />
                    {regularPosts.slice(0, 1).map((post) => (
                      <NewsCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              )}

              {/* All News Section */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">All News</h2>
                {regularPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularPosts.map((post) => (
                      <NewsCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-lg shadow-lg">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl">📰</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No news articles found</h3>
                    <p className="text-gray-500 mb-4">News articles are managed through the admin panel.</p>
                    <p className="text-sm text-gray-400">Check back later for updates!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
