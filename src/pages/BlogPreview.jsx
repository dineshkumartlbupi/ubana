import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { renderRichTextContent } from "../utils/richTextRenderer.jsx";
import { getImageUrl } from "../utils/imageUtils.jsx";

const API_BASE = import.meta.env.VITE_PAYLOAD_API_URL || "http://localhost:3011";

export default function BlogPreview() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const url = slug
          ? `${API_BASE}/api/blog-posts?where[slug][equals]=${slug}&limit=1&draft=true&depth=3`
          : `${API_BASE}/api/blog-posts?limit=1&draft=true&depth=3`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to load blog (${res.status})`);
        const json = await res.json();
        if (!isMounted) return;
        if (json?.docs?.length) setPost(json.docs[0]); else setError('Not found');
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
  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-yellow-100 text-yellow-900 px-4 py-2 text-center font-medium">Preview Mode</div>
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>
        {post.coverImage?.url && (
          <img src={getImageUrl(post.coverImage.url)} alt={post.title} className="w-full h-[420px] object-cover rounded-xl mb-8" />
        )}
        <p className="text-gray-600 text-lg mb-6">{post.excerpt}</p>
        <div className="prose max-w-none">
          {renderRichTextContent(post.content)}
        </div>
      </div>
    </div>
  );
}


