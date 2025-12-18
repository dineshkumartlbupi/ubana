import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  IoArrowBack as ArrowLeft, 
  IoCalendar as Calendar, 
  IoTime as Clock, 
  IoPerson as User, 
  IoPricetag as Tag,
  IoChevronForward as ChevronRight
} from "react-icons/io5";

const API_BASE = import.meta.env.VITE_PAYLOAD_API_URL || "http://localhost:3011";

// Helper function to generate slug from text
const slugify = (text) => {
  return text
    ?.toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-') || '';
};

// Extract headings from content to build TOC
const extractHeadings = (content) => {
  const headings = [];
  if (!content?.root?.children) return headings;

  content.root.children.forEach((node, index) => {
    if (node.type === 'heading') {
      const text = node.children?.[0]?.text || '';
      const level = node.tag || 'h2';
      const id = slugify(text);
      headings.push({ text, level, id, index });
    }
  });

  return headings;
};

export default function BlogDetail() {
  const { slug } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tableOfContents, setTableOfContents] = useState([]);
  const [activeSection, setActiveSection] = useState("");
  const contentRefs = useRef({});

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        
        // Fetch the specific blog post with depth to populate upload relationships
        const res = await fetch(`${API_BASE}/api/blog-posts?where[slug][equals]=${slug}&limit=1&depth=3`);
        if (!res.ok) throw new Error(`Failed to load blog post (${res.status})`);
        const json = await res.json();
        
        if (!isMounted) return;
        
        if (json.docs && json.docs.length > 0) {
          console.log('Blog post content structure:', json.docs[0].content);
          setBlogPost(json.docs[0]);
          
          // Extract headings for table of contents
          const headings = extractHeadings(json.docs[0].content);
          setTableOfContents(headings);
          if (headings.length > 0) {
            setActiveSection(headings[0].id);
          }
          
          // Fetch related posts (same category, excluding current)
          // Helper function to extract categories
          const getCategories = (post) => {
            if (Array.isArray(post.category)) {
              return post.category.map(c => {
                if (typeof c === 'string') return c;
                return c?.category || c;
              }).filter(Boolean);
            }
            if (typeof post.category === 'string') {
              return post.category.split(',').map(c => c.trim()).filter(Boolean);
            }
            return [];
          };
          
          const currentCategories = getCategories(json.docs[0]);
          if (currentCategories.length > 0) {
            // Fetch all posts and filter client-side for related posts
            const relatedRes = await fetch(`${API_BASE}/api/blog-posts?where[id][not_equals]=${json.docs[0].id}&limit=20`);
            if (relatedRes.ok) {
              const relatedJson = await relatedRes.json();
              // Filter posts that share at least one category
              const related = (relatedJson.docs || []).filter(post => {
                const postCats = getCategories(post);
                return postCats.some(cat => currentCategories.includes(cat));
              }).slice(0, 3);
              setRelatedPosts(related);
            }
          }
        } else {
          setError("Blog post not found");
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
  }, [slug]);

  // Scroll spy effect to highlight active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for header

      // Find the active section
      for (let i = tableOfContents.length - 1; i >= 0; i--) {
        const section = contentRefs.current[tableOfContents[i].id];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(tableOfContents[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [tableOfContents]);

  // Smooth scroll to section
  const scrollToSection = (id) => {
    const element = contentRefs.current[id];
    if (element) {
      const offsetTop = element.offsetTop - 100; // Offset for header
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center text-red-400">
            <p className="text-lg">{error || "Blog post not found"}</p>
            <Link to="/blogs" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
              ← Back to Blogs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#00081F] pt-24 xl:pt-30">
      <div className="px-4 xl:px-12 2xl:px-22">
        <div className="bg-[#6246EC] md:h-68 rounded-[20px] backdrop-blur-xs flex flex-col justify-between relative bg-[url('/assets/images/blog/blog-dtl-bnr-bg.webp')] bg-no-repeat bg-bottom bg-cover mb-4 md:mb-15">
          <div className="absolute inset-0 bg-[#6246EC]/50 rounded-[20px]"></div> 
          <div className="flex justify-center items-center px-4 pt-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center relative w-full"
              >
                {/* Breadcrumb */}
                <div className="flex justify-center items-center mb-4 gap-4">
                  <div className="h-[2px] w-28 bg-linear-to-r from-[#434343]/0 to-[#FFBF3C] hidden md:block"></div>
                    <nav>
                      <ol className="flex items-center">
                        {/* Home link */}
                        <li>
                          <Link to="/blogs" className="text-sm font-medium text-white/70 hover:text-[#FFBF3C] tracking-wider transition-all duration-500 ease-in-out">
                            Blogs
                          </Link>
                        </li>
                        <li className="flex items-center">
                          <svg className="w-3 mx-1 shrink-[0]" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <path d="M4.06836 11.3594L8.76636 6.8817C8.81665 6.83153 8.85655 6.77194 8.88377 6.70634C8.91099 6.64074 8.925 6.5704 8.925 6.49938C8.925 6.42835 8.91099 6.35802 8.88377 6.29241C8.85655 6.22681 8.81665 6.16722 8.76636 6.11705L4.06836 1.63938" stroke="white" strokeOpacity="0.7" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-sm font-medium text-[#FFBF3C] capitalize tracking-wider line-clamp-1">{blogPost.title}</span> 
                        </li>
                      </ol>
                    </nav>
                  <div className="h-[2px] w-28 bg-linear-to-r from-[#FFBF3C] to-[#434343]/0 hidden md:block"></div>
                </div>
                {/* Title */}
                <h1 className="md:w-4xl mx-auto text-2xl md:text-3xl font-normal text-white mt-8.5 md:mt-9 mb-8 md:mb-6 leading-tight w-full">
                  {blogPost.title}
                </h1>
            </motion.div>
          </div>
          <div className="flex md:items-end items-center flex-col md:flex-row justify-center md:justify-between flex-wrap relative px-5.5 md:pb-5.5 pb-8 gap-8 md:gap-0">
            <div className="">
              {blogPost.author && (
                <div className="flex items-center gap-2.5">
                  {blogPost.author.avatar?.url ? (
                    <img 
                      src={blogPost.author.avatar.url.startsWith('http') ? blogPost.author.avatar.url : `${API_BASE}${blogPost.author.avatar.url}`} 
                      alt={blogPost.author.name}
                      className="w-9 md:w-11 h-9 md:h-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 md:w-11 h-9 md:h-11 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold text-xl">
                      {blogPost.author.name?.charAt(0) || 'A'}
                    </div>
                  )}
                  <div>
                    <p className="text-white  text-xl tracking-[-0.2px] font-semibold">{blogPost.author.name}</p>
                    {/* {blogPost.author.role && (
                      <p className="text-gray-400 text-sm">{blogPost.author.role}</p>
                    )}
                    {blogPost.author.handle && (
                      <p className="text-blue-400 text-sm">{blogPost.author.handle}</p>
                    )} */}
                  </div>
                </div>
              )}
            </div>
            <div className="">
              <div className="flex items-center gap-2.5">
                <img className="" src="/assets/images/blog/blog-calndr.svg" alt="calender icon" />
                <span className="text-base text-white font-medium tracking-[-0.16px]">{formatDate(blogPost.publishedAt)}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Hero Section */}
        <div className="relative h-62 md:h-127 overflow-hidden">
          {blogPost?.coverImage?.url ? (
            <img 
              src={blogPost.coverImage.url.startsWith('http') ? blogPost.coverImage.url : `${API_BASE}${blogPost.coverImage.url}`} 
              alt={blogPost.title}
              className="w-full h-full object-cover rounded-2xl"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          ) : null}
          <div 
            className={`w-full h-full rounded-2xl bg-gradient-to-br from-blue-900 to-purple-900 ${
              blogPost?.coverImage?.url ? 'hidden' : 'block'
            }`}
          ></div>
        </div>
      </div>
      {/* Main Content */}
      <div className="pt-12 md:pt-18">
        <div className="px-4 xl:px-12 2xl:px-22">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-32 md:pr-32 pb-12">
            {/* Table of Contents Sidebar */}
            {tableOfContents.length > 0 && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:w-72 flex-shrink-0"
              >
                <div className="sticky top-28">
                  <div 
                    className="rounded-xl p-4 border border-[#00304D]"
                    style={{ background: "linear-gradient(180deg, #001E35 0%, #00304D 100%)" }}
                  >
                    <h2 className="text-sm font-semibold text-[#DBF262] mb-6">
                      Table of Contents
                    </h2>
                    <nav>
                      <ul className="space-y-1">
                        {tableOfContents.map((heading) => (
                          <li key={heading.id}>
                            <button
                              onClick={() => scrollToSection(heading.id)}
                              className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 flex items-center justify-between gap-2 cursor-pointer group ${
                                activeSection === heading.id
                                  ? 'bg-[#1269CD] text-white'
                                  : 'text-gray-300 hover:bg-[#002642] hover:text-white'
                              }`}
                            >
                              <span className={`line-clamp-1 ${
                                heading.level === 'h3' ? 'pr-3' : ''
                              }`}>
                                {heading.text}
                              </span>
                              <ChevronRight 
                                className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                                  activeSection === heading.id ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'
                                }`}
                              />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                </div>
              </motion.aside>
            )}

            {/* Main Content Area */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1 mb-12"
            >
              {/* Excerpt */}
              {/* {blogPost.excerpt && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-green-400 mb-4">Overview</h2>
                  <p className="text-gray-300 text-lg leading-relaxed">{blogPost.excerpt}</p>
                </div>
              )} */}

              {/* Tags */}
              {/* {blogPost.tags && blogPost.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-green-400 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {blogPost.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                      >
                        {tag.tag}
                      </span>
                    ))}
                  </div>
                </div>
              )} */}

              {/* Content */}
              <div className="prose prose-invert max-w-none">
                {/* <h2 className="text-2xl font-bold text-green-400 mb-4">Content</h2> */}
                <div className="text-gray-300 leading-relaxed">
                  {blogPost.content ? (
                    typeof blogPost.content === 'string' ? (
                      <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
                    ) : (
                      <div className="space-y-6">
                        {blogPost.content.root?.children?.map((node, index) => {
                          // Handle paragraphs
                          if (node.type === 'paragraph') {
                            // Check if paragraph contains only an upload (image)
                            const hasOnlyUpload = node.children?.length === 1 && node.children[0]?.type === 'upload';
                            
                            if (hasOnlyUpload) {
                              // Render upload as a block-level image
                              const uploadNode = node.children[0];
                              let imageUrl = null;
                              let altText = 'Image';
                              
                              if (uploadNode.value) {
                                if (typeof uploadNode.value === 'object' && uploadNode.value.url) {
                                  imageUrl = uploadNode.value.url;
                                  altText = uploadNode.value.alt || uploadNode.value.filename || 'Image';
                                } else if (typeof uploadNode.value === 'string') {
                                  imageUrl = `${API_BASE}/api/media/file/${uploadNode.value}`;
                                }
                              }
                              
                              if (!imageUrl && uploadNode.fields) {
                                imageUrl = uploadNode.fields.url;
                                altText = uploadNode.fields.alt || 'Image';
                              }
                              
                              if (imageUrl) {
                                const fullImageUrl = imageUrl.startsWith('http') 
                                  ? imageUrl 
                                  : `${API_BASE}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
                                
                                return (
                                  <div key={index} className="my-8">
                                    <img 
                                      src={fullImageUrl}
                                      alt={altText}
                                      className="w-full h-auto rounded-lg object-cover"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                      }}
                                    />
                                  </div>
                                );
                              }
                            }
                            
                            return (
                              <p key={index} className="mb-6 leading-relaxed text-base text-[#C3C3C3]">
                                {node.children?.map((child, childIndex) => {
                                  if (child.type === 'text') {
                                    return <span key={childIndex}>{child.text}</span>;
                                  }
                                  if (child.type === 'link') {
                                    return (
                                      <a 
                                        key={childIndex} 
                                        href={child.url} 
                                        className="text-blue-400 hover:text-blue-300 underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {child.children?.[0]?.text || child.url}
                                      </a>
                                    );
                                  }
                                  if (child.type === 'strong' || child.format === 1) {
                                    return (
                                      <strong key={childIndex} className="font-semibold">
                                        {child.children?.[0]?.text || child.text}
                                      </strong>
                                    );
                                  }
                                  // Handle upload inside paragraph (inline image)
                                  if (child.type === 'upload') {
                                    let imageUrl = null;
                                    let altText = 'Image';
                                    
                                    if (child.value) {
                                      if (typeof child.value === 'object' && child.value.url) {
                                        imageUrl = child.value.url;
                                        altText = child.value.alt || child.value.filename || 'Image';
                                      } else if (typeof child.value === 'string') {
                                        imageUrl = `${API_BASE}/api/media/file/${child.value}`;
                                      }
                                    }
                                    
                                    if (!imageUrl && child.fields) {
                                      imageUrl = child.fields.url;
                                      altText = child.fields.alt || 'Image';
                                    }
                                    
                                    if (imageUrl) {
                                      const fullImageUrl = imageUrl.startsWith('http') 
                                        ? imageUrl 
                                        : `${API_BASE}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
                                      
                                      return (
                                        <img 
                                          key={childIndex}
                                          src={fullImageUrl}
                                          alt={altText}
                                          className="max-w-full h-auto rounded-lg my-4 inline-block"
                                          onError={(e) => {
                                            e.target.style.display = 'none';
                                          }}
                                        />
                                      );
                                    }
                                  }
                                  return null;
                                })}
                              </p>
                            );
                          }
                          
                          // Handle headings
                          if (node.type === 'heading') {
                            const level = node.tag || 'h2';
                            const text = node.children?.[0]?.text || '';
                            const id = slugify(text);
                            const headingClasses = {
                              h1: 'text-3xl font-normal text-[#DBF262] mb-6 scroll-mt-28',
                              h2: 'text-2xl md:text-3xl font-normal text-[#DBF262] mb-4 scroll-mt-28',
                              h3: 'text-xl md:text-2xl font-normal text-[#DBF262] mb-3 scroll-mt-28',
                              h4: 'text-lg font-normal text-white mb-2 scroll-mt-28',
                            };
                            const HeadingTag = level;
                            return (
                              <HeadingTag 
                                key={index} 
                                id={id}
                                ref={(el) => {
                                  if (el) contentRefs.current[id] = el;
                                }}
                                className={headingClasses[level] || headingClasses.h2}
                              >
                                {text}
                              </HeadingTag>
                            );
                          }
                          
                          // Handle lists
                          if (node.type === 'list') {
                            const listType = node.listType === 'bullet' ? 'ul' : 'ol';
                            const ListTag = listType;
                            return (
                              <ListTag key={index} className="list-disc list-inside mb-6 space-y-2 ml-4">
                                {node.children?.map((listItem, listIndex) => (
                                  <li key={listIndex} className="leading-relaxed">
                                    {listItem.children?.map((child, childIndex) => {
                                      if (child.type === 'text') {
                                        return <span key={childIndex}>{child.text}</span>;
                                      }
                                      if (child.type === 'link') {
                                        return (
                                          <a 
                                            key={childIndex} 
                                            href={child.url} 
                                            className="text-blue-400 hover:text-blue-300 underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {child.children?.[0]?.text || child.url}
                                          </a>
                                        );
                                      }
                                      return null;
                                    })}
                                  </li>
                                ))}
                              </ListTag>
                            );
                          }
                          
                          // Handle blockquotes
                          if (node.type === 'quote') {
                            return (
                              <blockquote key={index} className="border-l-4 border-blue-500 pl-4 italic text-gray-400 mb-6">
                                {node.children?.map((child, childIndex) => {
                                  if (child.type === 'text') {
                                    return <span key={childIndex}>{child.text}</span>;
                                  }
                                  return null;
                                })}
                              </blockquote>
                            );
                          }
                          
                          // Handle upload nodes (images)
                          if (node.type === 'upload') {
                            // Get image URL from the upload node
                            let imageUrl = null;
                            let altText = 'Image';
                            
                            // Check different possible structures for upload nodes
                            if (node.value) {
                              // If value is a populated media object
                              if (typeof node.value === 'object' && node.value.url) {
                                imageUrl = node.value.url;
                                altText = node.value.alt || node.value.filename || 'Image';
                              }
                              // If value is just an ID, we'd need to fetch it, but with depth=3 it should be populated
                              else if (typeof node.value === 'string') {
                                // This shouldn't happen with depth=3, but handle it
                                imageUrl = `${API_BASE}/api/media/file/${node.value}`;
                              }
                            }
                            
                            // Fallback: check fields property
                            if (!imageUrl && node.fields) {
                              imageUrl = node.fields.url;
                              altText = node.fields.alt || 'Image';
                            }
                            
                            if (imageUrl) {
                              // Construct full URL if needed
                              const fullImageUrl = imageUrl.startsWith('http') 
                                ? imageUrl 
                                : `${API_BASE}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
                              
                              return (
                                <div key={index} className="my-8">
                                  <img 
                                    src={fullImageUrl}
                                    alt={altText}
                                    className="w-full h-auto rounded-lg object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                </div>
                              );
                            }
                            
                            return null;
                          }
                          
                          return null;
                        })}
                      </div>
                    )
                  ) : (
                    <p>Content coming soon...</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        {/* Related Posts */}
        <div className="px-4 xl:px-12 2xl:px-22 bg-white">
          <div className="py-15">
            {relatedPosts.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-3xl font-medium text-[#003066] mb-10">Explore our other blogs</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {relatedPosts.map((post) => (
                    <Link 
                      key={post.id} 
                      to={`/blogs/${post.slug}`}
                      className="group"
                    >
                      <div className="bg-white p-4 pb-6 border border-[#EDEDED] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                        {/* Cover Image */}
                        <div className="relative h-48 overflow-hidden bg-[#E8E3E3] rounded-xl">
                          {post.coverImage?.url ? (
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
                              post.coverImage?.url ? 'hidden' : 'flex'
                            }`}
                          >
                            {(() => {
                              const getCategories = (p) => {
                                if (Array.isArray(p.category)) {
                                  return p.category.map(c => typeof c === 'string' ? c : c?.category || c).filter(Boolean);
                                }
                                return p.category ? [p.category] : [];
                              };
                              const cats = getCategories(post);
                              return cats.length > 0 ? cats[0].toUpperCase() : 'BLOG';
                            })()}
                          </div>
                          
                          {/* Most Viewed Tag */}
                          {post.featured && (
                            <div className="absolute top-1.5 right-1.5">
                              <span className="bg-[#DBF262] text-[#536109] px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm">
                                <span>👁</span> Most viewed
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col mt-3">
                          <h3 className="text-base font-semibold text-[#242424] tracking-[-0.16px] mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                            {post.title}
                          </h3>
                          <p className="text-sm text-[#000B15] opacity-60 mb-0 line-clamp-2 leading-relaxed flex-1">
                            {post.excerpt}
                          </p>
                          
                          {/* Tags */}
                          {/* {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {post.tags.slice(0, 3).map((tag, index) => (
                                <span 
                                  key={index}
                                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium"
                                >
                                  {tag.tag}
                                </span>
                              ))}
                            </div>
                          )} */}

                          {/* Author & Meta */}
                          <div className="flex items-center justify-between pt-4 mt-auto">
                            <div className="flex items-center gap-2">
                              {post.author?.avatar?.url ? (
                                <img 
                                  src={post.author.avatar.url.startsWith('http') ? post.author.avatar.url : `${API_BASE}${post.author.avatar.url}`} 
                                  alt={post.author.name}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-sm">
                                  {post.author?.name?.charAt(0) || 'A'}
                                </div>
                              )}
                              <span className="text-sm font-medium text-[#000B15]">{post.author?.name}</span>
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
                            {/* <div className="text-right">
                              <p className="text-xs text-gray-500">{formatDate(post.publishedAt)}</p>
                              <p className="text-xs text-gray-500">{post.readTime} min read</p>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Back to Blogs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center mt-12"
            >
              <Link 
                to="/blogs"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to All Blogs
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
