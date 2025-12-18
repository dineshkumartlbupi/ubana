import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  IoCalendar as Calendar, 
  IoPricetag as Tag,
  IoEye as EyeIcon,
  IoTrendingUp as TrendingIcon,
  IoList as ListIcon,
  IoWarning as WarningIcon,
  IoChevronForward as ChevronForwardIcon
} from "react-icons/io5";
import { renderRichTextContent } from "../utils/richTextRenderer.jsx";
import { getImageUrl } from "../utils/imageUtils.jsx";

const API_BASE = import.meta.env.VITE_PAYLOAD_API_URL || "http://localhost:3011";

// Table of Contents Component - Matching Design
function TableOfContents({ toc }) {
  console.log('TableOfContents received toc:', toc);
  
  const scrollToSection = (anchor) => {
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 sticky top-8">
      <div className="flex items-center gap-2 mb-6">
        <ListIcon className="w-5 h-5 text-white" />
        <h3 className="text-lg font-semibold text-white">Table of Content</h3>
      </div>
      {toc && toc.length > 0 ? (
        <nav className="space-y-3">
          {toc.map((item, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(item.anchor)}
              className="w-full flex items-center justify-between p-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-700 hover:text-white group"
            >
              <span className="text-left">{item.title}</span>
              <ChevronForwardIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </nav>
      ) : (
        <div className="text-gray-400 text-sm">
          <p>No table of contents available.</p>
          <p className="mt-2 text-xs">Add headings (H2, H3) to your content to generate a table of contents.</p>
        </div>
      )}
    </div>
  );
}

export default function NewsPreview() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [newsPost, setNewsPost] = useState(null);
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
        
        // For preview, we need to fetch the draft/unpublished version
        const url = slug 
          ? `${API_BASE}/api/news?where[slug][equals]=${slug}&limit=1&draft=true`
          : `${API_BASE}/api/news?sort=-createdAt&limit=1&draft=true`;
        
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to load news post (${res.status})`);
        const json = await res.json();
        
        if (!isMounted) return;
        
        if (json.docs && json.docs.length > 0) {
          setNewsPost(json.docs[0]);
        } else {
          setError("News article not found");
        }
      } catch (e) {
        if (!isMounted) return;
        setError(e?.message || "Failed to load");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    
    load();
    return () => {
      isMounted = false;
    };
  }, [slug, searchParams]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTagInfo = () => {
    if (newsPost?.featured) {
      return { text: "Most viewed", icon: EyeIcon, color: "bg-green-500" };
    }
    if (newsPost?.trending) {
      return { text: "Trending", icon: TrendingIcon, color: "bg-green-400" };
    }
    return null;
  };

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

  if (!newsPost) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <p className="text-lg text-gray-600">News article not found</p>
          </div>
        </div>
      </div>
    );
  }

  const tagInfo = getTagInfo();
  const TagIcon = tagInfo?.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Banner */}
      {isPreviewMode && (
        <div className="bg-yellow-500 text-yellow-900 px-4 py-2 text-center font-medium">
          <div className="flex items-center justify-center gap-2">
            <WarningIcon className="w-5 h-5" />
            <span>Preview Mode - This is how your article will look when published</span>
          </div>
        </div>
      )}

      {/* Hero Section with Purple Background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800">
        {/* Dot Pattern Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {newsPost.title}
            </h1>
            
            {/* Date */}
            <div className="flex items-center justify-center gap-2 text-white">
              <Calendar className="w-4 h-4" />
              <span>Posted {formatDate(newsPost.publishedAt)}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Hero Image */}
      {(() => {
        // Priority: coverImage > source URL
        // If coverImage is not available, use source URL
        const coverImageUrl = newsPost.coverImage?.url ? getImageUrl(newsPost.coverImage.url) : null;
        const sourceUrl = newsPost.source && newsPost.source.startsWith('http') ? newsPost.source : null;
        const imageUrl = coverImageUrl || sourceUrl;
        
        return imageUrl ? (
          <div className="container mx-auto px-4 -mt-8 relative z-10">
            <div className="relative h-64 md:h-96 overflow-hidden rounded-lg shadow-2xl">
              <img 
                src={imageUrl} 
                alt={newsPost.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // If coverImage failed and source exists, try source
                  if (coverImageUrl && sourceUrl && e.target.src === coverImageUrl) {
                    e.target.src = sourceUrl;
                  }
                }}
              />
              {tagInfo && (
                <div className={`hidden absolute top-4 right-4 ${tagInfo.color} text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1`}>
                  <TagIcon className="w-4 h-4" />
                  {tagInfo.text}
                </div>
              )}
            </div>
          </div>
        ) : null;
      })()}

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Table of Contents */}
          <div className="lg:col-span-1">
            <TableOfContents toc={newsPost?.tableOfContents} />
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-3">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              {/* Article Content */}
              <div className="p-8">
                {/* Excerpt */}
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {newsPost.excerpt}
                </p>

                {/* Tags */}
                {newsPost.tags && newsPost.tags.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-600">Tags:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newsPost.tags.map((tagObj, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {tagObj.tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                  <div className="text-gray-800 leading-relaxed">
                    {renderRichTextContent(newsPost.content)}
                  </div>
                </div>
              </div>
            </motion.article>
          </div>
        </div>
      </div>
    </div>
  );
}
