import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaMapMarkerAlt, FaBriefcase, FaClock } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_PAYLOAD_API_URL || "http://localhost:3011";

function JobCard({ job }) {
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

  return (
    <Link 
      to={`/preview/jobs/${job.slug}?preview=true&token=${new URLSearchParams(window.location.search).get('token') || ''}`} 
      className="block group bg-white rounded-xl overflow-hidden ring-1 ring-slate-200 hover:shadow-md"
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 mb-3">{job.title}</h3>
        <div className="flex items-center gap-4 text-sm text-slate-600">
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
      </div>
    </Link>
  );
}

export default function JobListPreview() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/job-openings?sort=-createdAt&limit=100&draft=true`);
        if (!res.ok) throw new Error(`Failed to load jobs (${res.status})`);
        const json = await res.json();
        if (!isMounted) return;
        setJobs(json?.docs || []);
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
    <div className="min-h-screen bg-[#001528] text-white">
      <div className="bg-yellow-100 text-yellow-900 px-4 py-2 text-center font-medium">Preview Mode - Draft jobs are shown</div>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Job Openings Preview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => <JobCard key={job.id} job={job} />)}
        </div>
      </div>
    </div>
  );
}

