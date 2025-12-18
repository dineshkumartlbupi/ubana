import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getImageUrl } from "../utils/imageUtils.jsx";

const API_BASE = import.meta.env.VITE_PAYLOAD_API_URL || "http://localhost:3011";

function BlogCard({ post }) {
  return (
    <Link to={`/preview/blogs/${post.slug}?preview=true`} className="block group bg-white rounded-xl overflow-hidden ring-1 ring-slate-200 hover:shadow-md">
      <div className="h-48 overflow-hidden">
        {post?.coverImage?.url ? (
          <img src={getImageUrl(post.coverImage.url)} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <div className="w-full h-full bg-slate-100" />
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600">{post.title}</h3>
        <p className="text-slate-600 text-sm mt-2 line-clamp-3">{post.excerpt}</p>
      </div>
    </Link>
  );
}

export default function BlogListPreview() {
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/blog-posts?sort=-createdAt&limit=24&draft=true`);
        if (!res.ok) throw new Error(`Failed to load blogs (${res.status})`);
        const json = await res.json();
        if (!isMounted) return;
        setPosts(json?.docs || []);
      } catch (e) {
        if (!isMounted) return;
        setError(e?.message || 'Failed to load');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false };
  }, [searchParams]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading preview…</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-yellow-100 text-yellow-900 px-4 py-2 text-center font-medium">Preview Mode - Draft blogs are shown</div>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(p => <BlogCard key={p.id} post={p} />)}
        </div>
      </div>
    </div>
  );
}


