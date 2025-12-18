import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { FaMapMarkerAlt, FaBriefcase, FaClock } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_PAYLOAD_API_URL || "http://localhost:3011";

export default function JobPreview() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const url = slug
          ? `${API_BASE}/api/job-openings?where[slug][equals]=${slug}&limit=1&draft=true`
          : `${API_BASE}/api/job-openings?limit=1&draft=true`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to load job (${res.status})`);
        const json = await res.json();
        if (!isMounted) return;
        if (json?.docs?.length) setJob(json.docs[0]); else setError('Not found');
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

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 14) return "1 week ago";
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 60) return "1 month ago";
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const renderRichText = (content) => {
    if (!content) return null;
    
    if (typeof content === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }

    if (content.root?.children) {
      return (
        <div className="space-y-4">
          {content.root.children.map((node, index) => {
            if (node.type === 'paragraph') {
              return (
                <p key={index} className="text-gray-300 mb-4 leading-relaxed">
                  {node.children?.map((child, childIndex) => {
                    if (child.type === 'text') {
                      return <span key={childIndex}>{child.text}</span>;
                    }
                    if (child.type === 'link') {
                      return (
                        <a 
                          key={childIndex} 
                          href={child.url} 
                          className="text-[#DBF262] hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {child.children?.[0]?.text || child.url}
                        </a>
                      );
                    }
                    return null;
                  })}
                </p>
              );
            }
            if (node.type === 'heading') {
              const level = node.tag || 'h2';
              const HeadingTag = level;
              const headingClasses = {
                h1: 'text-2xl font-semibold text-[#DBF262] mb-3 mt-10',
                h2: 'text-2xl font-semibold text-[#DBF262] mb-3 mt-10',
                h3: 'text-xl font-semibold text-[#DBF262] mb-2 mt-8',
                h4: 'text-lg font-semibold text-gray-200 mb-2 mt-6',
              };
              return (
                <HeadingTag key={index} className={headingClasses[level] || headingClasses.h2}>
                  {node.children?.[0]?.text}
                </HeadingTag>
              );
            }
            if (node.type === 'list') {
              const ListTag = node.listType === 'bullet' ? 'ul' : 'ol';
              return (
                <ListTag key={index} className="list-disc list-inside space-y-2 text-gray-300 mb-4">
                  {node.children?.map((listItem, listIndex) => (
                    <li key={listIndex} className="mb-4">
                      {listItem.children?.map((child, childIndex) => {
                        if (child.type === 'text') {
                          return <span key={childIndex}>{child.text}</span>;
                        }
                        return null;
                      })}
                    </li>
                  ))}
                </ListTag>
              );
            }
            return null;
          })}
        </div>
      );
    }
    return null;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#00081F] text-white">Loading preview…</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600 bg-[#00081F]">{error}</div>;
  if (!job) return null;

  return (
    <div className="min-h-screen bg-[#00081F] text-white">
      <div className="bg-yellow-100 text-yellow-900 px-4 py-2 text-center font-medium">Preview Mode</div>
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">{job.title}</h1>
        
        <div className="flex items-center gap-6 text-sm mb-8">
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-[#FAD892]" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaBriefcase className="text-[#FAD892]" />
            <span>{job.employmentType}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-[#FAD892]" />
            <span>{getTimeAgo(job.publishedAt)}</span>
          </div>
        </div>

        <div className="bg-[#0E1E35] rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-[#DBF262] mb-4">Overview</h2>
          {renderRichText(job.overview)}
        </div>

        {job.keyResponsibilities && job.keyResponsibilities.length > 0 && (
          <div className="bg-[#0E1E35] rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#DBF262] mb-4">Key Responsibilities:</h2>
            {job.keyResponsibilities.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-6">
                {section.sectionTitle && (
                  <h4 className="text-gray-200 font-regular text-xl mt-6 mb-2">{section.sectionTitle}:</h4>
                )}
                {section.items && section.items.length > 0 && (
                  <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="mb-4">{item.item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {job.whatYouNeed && job.whatYouNeed.length > 0 && (
          <div className="bg-[#0E1E35] rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#DBF262] mb-4">What You'll Need:</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              {job.whatYouNeed.map((req, index) => (
                <li key={index} className="mb-4">{req.requirement}</li>
              ))}
            </ul>
          </div>
        )}

        {job.preferredQualifications && job.preferredQualifications.length > 0 && (
          <div className="bg-[#0E1E35] rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#DBF262] mb-4">Preferred Qualifications:</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              {job.preferredQualifications.map((qual, index) => (
                <li key={index} className="mb-4">{qual.qualification}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

