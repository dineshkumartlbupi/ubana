import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link} from "react-router-dom";
import { getCodeList } from "country-list";
import Swal from "sweetalert2";
import Dots from "../../../public/assets/images/Dots.webp";
import ButtonArrow from "../buttonArrow";

const API_BASE = import.meta.env.VITE_PAYLOAD_API_URL || "http://localhost:3011";

const JobDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [otherJobs, setOtherJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [hoveredCard, setHoveredCard] = useState(null);

    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [rect, setRect] = useState(null);

    const handleEnter = (e) => {
        setRect(e.currentTarget.getBoundingClientRect());
        setIsHovered(true);
    };

    const handleLeave = () => {
        setIsHovered(false);
        setRect(null);
    };

    const handleMouse = (e) => {
        if (!rect) return;
        setCoords({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        });
    };

     const countries = getCodeList();
     const countryArray = Object.entries(countries).sort((a, b) => {
       if (a[1] === "India") return -1;
       if (b[1] === "India") return 1;
       return a[1].localeCompare(b[1]);
     });

    const [formData, setFormData] = useState({
        fullName: "",
        country: "IN",
        phone: "",
        email: "",
        experience: "",
        expectedCTC: "",
        message: "",
        resume: null,
    });

    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({
        fullName: false,
        phone: false,
        email: false,
        resume: false,
    });

    useEffect(() => {
        let isMounted = true;
        async function loadJob() {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE}/api/job-openings?where[slug][equals]=${slug}&limit=1`);
                if (!res.ok) throw new Error(`Failed to load job (${res.status})`);
                const json = await res.json();
                
                if (!isMounted) return;
                
                if (json.docs && json.docs.length > 0) {
                    setJob(json.docs[0]);
                    
                    // Fetch other jobs (excluding current)
                    const otherRes = await fetch(`${API_BASE}/api/job-openings?where[status][equals]=published&where[id][not_equals]=${json.docs[0].id}&limit=6&sort=-publishedAt`);
                    if (otherRes.ok) {
                        const otherJson = await otherRes.json();
                        setOtherJobs(otherJson.docs || []);
                    }
                } else {
                    setError("Job not found");
                }
            } catch (e) {
                if (!isMounted) return;
                console.error('Error loading job:', e);
                setError(e?.message || "Failed to load job");
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        if (slug) {
            loadJob();
        }
        return () => {
            isMounted = false;
        };
    }, [slug]);

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

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (e.target.type === 'file') {
            // Handle file input
            const file = files && files.length > 0 ? files[0] : null;
            setFormData({
                ...formData,
                [name]: file,
            });
        } else {
            // Handle text inputs
            setFormData({
                ...formData,
                [name]: value,
            });
        }
        // Clear error for this field when user starts typing/uploading
        if (errors[name]) {
            setErrors({ ...errors, [name]: false });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setSubmitted(true);

        // Validate required fields and set errors
        // Check if resume is a valid File object
        const hasResume = formData.resume !== null && 
                         formData.resume !== undefined && 
                         formData.resume instanceof File;
        
        const newErrors = {
            fullName: !formData.fullName || !formData.fullName.trim(),
            email: !formData.email || !formData.email.trim(),
            phone: !formData.phone || !formData.phone.trim(),
            resume: !hasResume,
        };
        setErrors(newErrors);

        // Check if there are any errors and show individual popups
        if (newErrors.fullName) {
            Swal.fire({
                icon: "error",
                title: "Required Field",
                text: "Please enter your Full Name.",
                showConfirmButton: true,
            });
            return;
        }

        if (newErrors.phone) {
            Swal.fire({
                icon: "error",
                title: "Required Field",
                text: "Please enter your Phone Number.",
                showConfirmButton: true,
            });
            return;
        }

        if (newErrors.email) {
            Swal.fire({
                icon: "error",
                title: "Required Field",
                text: "Please enter your Email address.",
                showConfirmButton: true,
            });
            return;
        }

        if (newErrors.resume) {
            Swal.fire({
                icon: "error",
                title: "Resume Required",
                text: "Please upload your Resume (PDF, DOC, or DOCX) to continue.",
                confirmButtonText: "OK",
                confirmButtonColor: "#FFBF3C",
                showConfirmButton: true,
            });
            return;
        }

        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null) {
                formDataToSend.append(key, value);
            }
        });
        formDataToSend.append("jobTitle", job?.title || "");

        try {
            const res = await fetch(`${API_BASE}/api/job-apply`, {
                method: "POST",
                body: formDataToSend,
            });

            const data = await res.json();

            if (res.ok && data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Application submitted!",
                    html: `<p style="font-size: 0.9rem;">Thank you for applying. Our team will get back to you soon.</p>`,
                    showConfirmButton: false,
                    showCloseButton: true,
                    closeButtonHtml: "&times;",
                    timer: 6000,
                    customClass: {
                        popup: "rounded-xl shadow-lg",
                        title: "text-green-600 text-lg",
                    },
                });

                setFormData({
                    fullName: "",
                    country: "IN",
                    phone: "",
                    email: "",
                    experience: "",
                    expectedCTC: "",
                    message: "",
                    resume: null,
                });
                setSubmitted(false);
                setErrors({
                    fullName: false,
                    phone: false,
                    email: false,
                    resume: false,
                });

                e.target.reset();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed to submit",
                    text: data.message || "Please try again later.",
                    showConfirmButton: true,
                });
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: "error",
                title: "Something went wrong",
                text: "Please check your internet connection or try again later.",
                showConfirmButton: true,
            });
        }
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
                                <p key={index} className="text-[#C3C3C3] mb-4 text-base leading-relaxed">
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
                                h2: 'text-2xl font-normal text-[#DBF262] mb-6 mt-10',
                                h3: 'text-xl font-semibold text-[#DBF262] mb-2 mt-8',
                                h4: 'text-lg font-normal text-[#C3C3C3] mb-2 mt-6',
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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#00081F] text-white">
                <div className="container mx-auto px-4 py-20">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFBF3C] mx-auto mb-4"></div>
                        <p className="text-gray-300">Loading job details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen bg-[#00081F] text-white">
                <div className="container mx-auto px-4 py-20">
                    <div className="text-center text-red-400">
                        <p className="text-lg">{error || "Job not found"}</p>
                        <button
                            onClick={() => navigate("/careers")}
                            className="mt-4 text-[#DBF262] hover:underline"
                        >
                            ← Back to Careers
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="min-h-screen bg-[#00081F] text-white ">
                <div className="px-4 xl:px-12 2xl:px-22 pt-24 md:pt-[120px] ">
                    <div className="relative bg-[#1269CD] rounded-[20px] overflow-hidden h-[350px] md:h-[400px] flex justify-center text-center px-4 py-8 md:p-10">
                        <div className="absolute top-50 md:top-50 opacity-80 left-0 w-full h-auto pointer-events-none">
                            <img src={Dots} alt="banner-img" className="w-full object-contain" />
                        </div>
                        <div className="relative z-10 w-full md:max-w-3xl flex flex-col justify-between">
                            <div className="">
                                <div className="flex justify-center items-center mb-6 md:mb-11 gap-3 md:gap-6">
                                    <div className="h-[2px] w-14 md:w-28 bg-linear-to-r from-[#FFFFFF00] to-[#FFBF3C]"></div>
                                    <p className="text-sm text-white font-medium tracking-wider flex items-center gap-2">
                                        <Link to="/careers" className="hover:text-[#FFBF3C] transition-all ease-in-out duration-500">Careers </Link>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                <path d="M3.56836 10.8594L8.26636 6.3817C8.31665 6.33153 8.35655 6.27195 8.38377 6.20634C8.41099 6.14074 8.425 6.0704 8.425 5.99938C8.425 5.92835 8.41099 5.85802 8.38377 5.79241C8.35655 5.72681 8.31665 5.66722 8.26636 5.61706L3.56836 1.13938" stroke="white" stroke-opacity="0.7" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </span> <span className="text-[#FFBF3C] max-w-[120px] md:max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap inline-block">{job.title}</span>
                                    </p>
                                    <div className="h-[2px] w-14 md:w-28 bg-linear-to-r from-[#FFBF3C] to-[#FFFFFF00]"></div>
                                </div>
                                <h1 className="text-2xl md:text-[2.125rem] font-normal text-[#ffff] leading-tight">
                                    {job.title}
                                </h1>
                            </div>
                            <div className="mt-7.5 flex items-center justify-center flex-wrap md:gap-16 gap-6">
                                <p className="w-full md:w-auto text-base font-normal text-white flex items-center justify-center gap-2">
                                    <svg className="text-[#FAD892]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="none">
                                        <g clipPath="url(#clip0_922_10811)">
                                            <path d="M7.99788 7.66495C9.44413 7.66495 10.6208 6.48848 10.6208 5.04242C10.6208 3.59636 9.44413 2.41992 7.99788 2.41992C6.55163 2.41992 5.375 3.59636 5.375 5.04242C5.375 6.48848 6.55163 7.66495 7.99788 7.66495ZM7.99788 3.3573C8.92719 3.3573 9.68325 4.11327 9.68325 5.04242C9.68325 5.97161 8.92722 6.72758 7.99788 6.72758C7.06853 6.72758 6.3125 5.97161 6.3125 5.04242C6.3125 4.11327 7.06856 3.3573 7.99788 3.3573Z" fill="#FAD892"/>
                                            <path d="M5.14339 9.75409C5.85386 10.7159 5.56842 10.3418 7.61483 13.2636C7.80083 13.5302 8.19636 13.5314 8.38342 13.264C10.4391 10.3284 10.1562 10.7002 10.8551 9.75406C11.5631 8.79556 12.2952 7.80444 12.6964 6.643C13.2771 4.96172 13.0261 3.29819 11.9897 1.95881C11.9897 1.95881 11.9897 1.95878 11.9897 1.95878C11.0404 0.73225 9.54861 0 7.99927 0C6.44992 0 4.95817 0.73225 4.00883 1.95884C2.97249 3.29822 2.72149 4.96178 3.30217 6.64306C3.7033 7.80447 4.43542 8.79559 5.14339 9.75409ZM4.75027 2.53247C5.52333 1.53369 6.73792 0.937375 7.99927 0.937375C9.26061 0.937375 10.4752 1.53369 11.2483 2.53247L11.2482 2.53244C12.0847 3.61344 12.2842 4.96462 11.8102 6.33706C11.4559 7.36294 10.7671 8.29541 10.101 9.19719C9.58239 9.89928 9.73761 9.68453 7.99927 12.1763C6.26274 9.68703 6.41599 9.89906 5.89752 9.19719C5.23142 8.29541 4.54264 7.36291 4.1883 6.33706C3.7143 4.96459 3.91386 3.61344 4.75027 2.53247Z" fill="#FAD892"/>
                                            <path d="M5.52964 11.7868C5.39139 11.568 5.10189 11.5026 4.88301 11.6409L3.5502 12.4827C3.25945 12.6663 3.25917 13.0913 3.5502 13.2752L7.7502 15.9279C7.90311 16.0245 8.09798 16.0245 8.25085 15.9279L12.4509 13.2752C12.7416 13.0915 12.7419 12.6665 12.4509 12.4827L11.118 11.6409C10.8991 11.5026 10.6096 11.568 10.4714 11.7868C10.3331 12.0057 10.3985 12.2951 10.6174 12.4334L11.3228 12.8789L8.00051 14.9773L4.67823 12.8789L5.38367 12.4334C5.60254 12.2952 5.66789 12.0057 5.52964 11.7868Z" fill="#FAD892"/>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_922_10811">
                                            <rect width="16" height="16" fill="white"/>
                                            </clipPath>
                                        </defs>
                                    </svg> {job.location}
                                </p>
                                <p className="text-base font-normal text-white flex items-center gap-2">
                                    <svg className="text-[#FAD892]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="none">
                                        <g clipPath="url(#clip0_922_10818)">
                                            <path d="M16 4.83594C16 4.06053 15.3692 3.42969 14.5938 3.42969H12.0938V2.42103C12.0938 1.60731 11.4318 0.945312 10.6181 0.945312H5.38197C4.56825 0.945312 3.90625 1.60731 3.90625 2.42103V3.42969H1.40625C0.630844 3.42969 0 4.06053 0 4.83594V7.05459C0 7.46803 0.134625 7.98362 0.625 8.48938V13.6484C0.625 14.4238 1.25584 15.0547 2.03125 15.0547H13.9688C14.7442 15.0547 15.375 14.4238 15.375 13.6484V8.48938C15.8652 7.98391 16 7.46847 16 7.05459V4.83594ZM4.84375 2.42103C4.84375 2.12425 5.08519 1.88281 5.38197 1.88281H10.6181C10.9148 1.88281 11.1563 2.12425 11.1563 2.42103V3.42969H4.84375V2.42103ZM0.9375 4.83594C0.9375 4.57747 1.14778 4.36719 1.40625 4.36719H14.5938C14.8522 4.36719 15.0625 4.57747 15.0625 4.83594V7.05459C15.0625 8.20797 12.8498 9.14919 9.625 9.39578V8.96094C9.625 8.70206 9.41512 8.49219 9.15625 8.49219H6.84375C6.58488 8.49219 6.375 8.70206 6.375 8.96094V9.39563C3.15316 9.14872 0.9375 8.20503 0.9375 7.05459V4.83594ZM8.6875 9.42969V10.0391C8.6875 10.3751 8.41413 10.6484 8.07812 10.6484H7.92188C7.58588 10.6484 7.3125 10.3751 7.3125 10.0391V9.42969H8.6875ZM13.9688 14.1172H2.03125C1.77278 14.1172 1.5625 13.9069 1.5625 13.6484V9.17734C2.95825 9.89256 4.42506 10.1683 6.40425 10.3379C6.54391 11.0483 7.17119 11.5859 7.92188 11.5859H8.07812C8.82887 11.5859 9.45619 11.0482 9.59578 10.3378C11.2307 10.2194 12.7066 9.91928 13.7843 9.48322C14.0266 9.38516 14.2434 9.28272 14.4375 9.17725V13.6484C14.4375 13.9069 14.2272 14.1172 13.9688 14.1172Z" fill="#FAD892"/>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_922_10818">
                                            <rect width="16" height="16" fill="white"/>
                                            </clipPath>
                                        </defs>
                                    </svg> {job.employmentType}
                                </p>
                                <p className="text-base font-normal text-white flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="none">
                                        <g clipPath="url(#clip0_922_10822)">
                                            <path d="M8 16C12.4107 16 16 12.4107 16 8C16 3.58934 12.4107 0 8 0C3.5893 0 0 3.58934 0 8C0 12.4107 3.58934 16 8 16ZM8 1.06665C11.824 1.06665 14.9334 4.17597 14.9334 8C14.9334 11.824 11.824 14.9334 8 14.9334C4.17597 14.9334 1.06665 11.824 1.06665 8C1.06665 4.17597 4.17602 1.06665 8 1.06665Z" fill="#FAD892"/>
                                            <path d="M10.3335 10.5486C10.4321 10.6285 10.5494 10.6659 10.6668 10.6659C10.8241 10.6659 10.9788 10.5966 11.0828 10.4659C11.2668 10.2366 11.2294 9.90055 11.0001 9.71654L8.53345 7.74321V3.73254C8.53345 3.43921 8.29346 3.19922 8.00012 3.19922C7.70678 3.19922 7.4668 3.43921 7.4668 3.73254V7.99923C7.4668 8.16191 7.54148 8.3139 7.66679 8.41521L10.3335 10.5486Z" fill="#FAD892"/>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_922_10822">
                                            <rect width="16" height="16" fill="white"/>
                                            </clipPath>
                                        </defs>
                                    </svg> {getTimeAgo(job.publishedAt)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="px-4 xl:px-12 2xl:px-22 py-12 lg:py-25 flex flex-col lg:flex-row gap-20">
                    <div className="flex-1">
                        {renderRichText(job.overview)}
                        
                        {job.keyResponsibilities && job.keyResponsibilities.length > 0 && (
                            <>
                                <h2 className="text-2xl font-normal text-[#DBF262] mb-6 mt-10">Key Responsibilities:</h2>
                                {job.keyResponsibilities.map((section, sectionIndex) => (
                                    <div key={sectionIndex} className="mb-6">
                                        {section.sectionTitle && (
                                            <h4 className="text-gray-200 font-regular text-xl mt-10 mb-2">{section.sectionTitle}:</h4>
                                        )}
                                        {section.items && section.items.length > 0 && (
                                            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
                                                {section.items.map((item, itemIndex) => (
                                                    <li key={itemIndex} className="text-base mb-4">{item.item}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </>
                        )}

                        {job.whatYouNeed && job.whatYouNeed.length > 0 && (
                            <>
                                <h2 className="text-2xl font-semibold text-[#DBF262] mb-3 mt-10">What You'll Need:</h2>
                                <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
                                    {job.whatYouNeed.map((req, index) => (
                                        <li key={index} className="text-base mb-4">{req.requirement}</li>
                                    ))}
                                </ul>
                            </>
                        )}

                        {job.preferredQualifications && job.preferredQualifications.length > 0 && (
                            <>
                                <h2 className="text-2xl font-semibold text-[#DBF262] mb-3 mt-10">Preferred Qualifications:</h2>
                                <ul className="list-disc list-inside space-y-2 text-gray-300">
                                    {job.preferredQualifications.map((qual, index) => (
                                        <li key={index} className="text-base mb-4">{qual.qualification}</li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                    <aside className="w-full lg:w-1/3">
                        <div
                            className="relative rounded-2xl border border-[#1A2A45] p-4 md:p-8 shadow-md overflow-hidden"
                            style={{
                                background:
                                    "linear-gradient(180deg, rgba(0,22,44,0.95) 0%, rgba(18,105,205,0.95) 100%)",
                            }}
                        >
                            <div className="relative z-10">
                                <h4 className="text-2xl font-semibold text-[#DBF262] opacity-90 mb-4">
                                    Get in touch
                                </h4>
                                <p className="text-sm text-white/70 mb-6 md:mb-10">
                                    Please fill out the form below and we'll get back to you.
                                </p>

                                <form className="space-y-3" onSubmit={handleSubmit}>
                                    <div>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Full Name"
                                            className="w-full px-4 py-3 rounded-md bg-[#08254e] border border-[#1b437a] text-white placeholder-gray-400 focus:border-white outline-0 hover:shadow-md transition-all ease-in-out duration-500"
                                        />
                                        {submitted && errors.fullName && (
                                            <span className="text-red-400 text-xs mt-1 block">* Required</span>
                                        )}
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-3">
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="w-full md:w-1/6 border border-[#1b437a] bg-[#08254e] text-white rounded-md py-2 px-2 focus:border-white outline-0 hover:shadow-md transition-all ease-in-out duration-500"
                                        >
                                            {countryArray.map(([code, name]) => (
                                                <option key={code} value={code} className="text-black bg-[#fff]">
                                                    {name}
                                                </option>
                                                ))}
                                             </select>

                                        <div className="relative w-full md:w-1/2">
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="Phone Number"
                                                className="w-full pl-3 py-2.5 rounded-md focus:bg-[#08254e]  bg-[#08254e] border border-[#1b437a] text-white placeholder-gray-400 focus:border-white outline-0 hover:shadow-md transition-all ease-in-out duration-500"
                                            />
                                            {submitted && errors.phone && (
                                                <span className="text-red-400 text-xs mt-1 block">* Required</span>
                                            )}
                                        </div>

                                        <div className="relative w-full md:w-2/4">
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Email"
                                                className="w-full pl-3 py-2.5 rounded-md bg-[#08254e] border border-[#1b437a] text-white placeholder-gray-400 focus:border-white outline-0 hover:shadow-md transition-all ease-in-out duration-500"
                                            />
                                            {submitted && errors.email && (
                                                <span className="text-red-400 text-xs mt-1 block">* Required</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-3">
                                        <input
                                            type="text"
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleChange}
                                            placeholder="Years of Experience"
                                            className="w-2/2 md:w-1/2 px-3 py-3 rounded-md bg-[#08254e] border border-[#1b437a] text-white placeholder-gray-400 focus:border-white outline-0 hover:shadow-md transition-all ease-in-out duration-500"
                                        />
                                        <input
                                            type="text"
                                            name="expectedCTC"
                                            value={formData.expectedCTC}
                                            onChange={handleChange}
                                            placeholder="Expected CTC"
                                            className="w-2/2 md:w-1/2 px-3 py-3 rounded-md bg-[#08254e] border border-[#1b437a] text-white placeholder-gray-400 focus:border-white outline-0 hover:shadow-md transition-all ease-in-out duration-500"
                                        />
                                    </div>

                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Message"
                                        rows="4"
                                        className="w-full px-3 py-3 rounded-md bg-[#08254e] border border-[#1b437a] text-white placeholder-gray-400 focus:border-white outline-0 hover:shadow-md transition-all ease-in-out duration-500"
                                    ></textarea>

                                    <div className="mb-8 md:mb-13">
                                        <label
                                            className="border-2 border-dashed border-[#FFFFFFE5] opacity-70 rounded-lg p-6 text-center text-gray-300 cursor-pointer h-[150px] flex flex-col items-center justify-center hover:border-[#DBF262] transition-all duration-300"
                                        >
                                            <input
                                                type="file"
                                                name="resume"
                                                onChange={handleChange}
                                                className="hidden"
                                                accept=".pdf,.doc,.docx"
                                            />
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M21.5517 14.4746C21.3528 14.4746 21.162 14.5536 21.0214 14.6943C20.8807 14.8349 20.8017 15.0257 20.8017 15.2246V17.7859C20.8017 18.3896 20.5619 18.9685 20.135 19.3954C19.7081 19.8223 19.1292 20.0621 18.5255 20.0621H5.47547C4.87177 20.0621 4.2928 19.8223 3.86592 19.3954C3.43904 18.9685 3.19922 18.3896 3.19922 17.7859V15.2246C3.19922 15.0257 3.1202 14.8349 2.97955 14.6943C2.8389 14.5536 2.64813 14.4746 2.44922 14.4746C2.25031 14.4746 2.05954 14.5536 1.91889 14.6943C1.77824 14.8349 1.69922 15.0257 1.69922 15.2246V17.7859C1.70021 18.7871 2.09838 19.747 2.80635 20.455C3.51432 21.1629 4.47425 21.5611 5.47547 21.5621H18.5255C19.5267 21.5611 20.4866 21.1629 21.1946 20.455C21.9026 19.747 22.3007 18.7871 22.3017 17.7859V15.2246C22.3017 15.0257 22.2227 14.8349 22.082 14.6943C21.9414 14.5536 21.7506 14.4746 21.5517 14.4746Z" fill="#FFBF3C"/>
                                                <path d="M8.25053 7.98722L11.2505 4.98722V16.1247C11.2505 16.3236 11.3296 16.5144 11.4702 16.655C11.6109 16.7957 11.8016 16.8747 12.0005 16.8747C12.1994 16.8747 12.3902 16.7957 12.5309 16.655C12.6715 16.5144 12.7505 16.3236 12.7505 16.1247V4.99847L15.7505 7.99847C15.8202 8.06815 15.9029 8.12343 15.994 8.16114C16.085 8.19885 16.1826 8.21826 16.2812 8.21826C16.3797 8.21826 16.4773 8.19885 16.5683 8.16114C16.6594 8.12343 16.7421 8.06815 16.8118 7.99847C16.8815 7.92879 16.9367 7.84606 16.9745 7.75501C17.0122 7.66397 17.0316 7.56639 17.0316 7.46784C17.0316 7.3693 17.0122 7.27172 16.9745 7.18067C16.9367 7.08963 16.8815 7.0069 16.8118 6.93722L12.533 2.65847C12.4288 2.55734 12.2993 2.4861 12.158 2.45222C12.0366 2.42987 11.9117 2.43694 11.7936 2.47282C11.6755 2.50871 11.5677 2.57237 11.4793 2.65847L7.20053 6.92597C7.08146 7.06924 7.01998 7.25171 7.02805 7.43782C7.03612 7.62394 7.11317 7.8004 7.2442 7.93283C7.37522 8.06526 7.55084 8.14418 7.73687 8.15424C7.92289 8.16429 8.106 8.10475 8.25053 7.98722Z" fill="#FFBF3C"/>
                                            </svg>
                                            <p className="text-sm text-[#FAD892] mt-2.5">
                                                Drag file here or{" "}
                                                <span className="">click here</span> to upload
                                            </p>
                                            {formData.resume && (
                                                <p className="text-xs mt-2 text-[#DBF262]">
                                                    {formData.resume.name}
                                                </p>
                                            )}
                                        </label>
                                        {submitted && errors.resume && (
                                            <span className="text-red-400 text-xs mt-1 block">* Required - Please upload your resume (PDF, DOC, or DOCX)</span>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-3 rounded-full text-[#2D2D2D] hover:bg-white bg-[#FFBF3C] font-semibold shadow-md hover:shadow-lg cursor-pointer hover:scale-105 transition-all ease-in-out duration-500"
                                    >
                                        Apply Now
                                    </button>

                                    <p className="text-xs text-white/60 mt-3 text-center leading-relaxed">
                                        We will only use your personal information as outlined in our{" "}
                                        <Link to="/privacy-policy" className="text-[#DBF262] hover:underline">
                                            Privacy Policy
                                        </Link>
                                        . You can manage or withdraw your consent any time by emailing{" "}
                                        <a
                                            href="mailto:info@ubona.com"
                                            className="text-[#DBF262] hover:underline"
                                        >
                                            info@ubona.com
                                        </a>
                                        .
                                    </p>
                                </form>
                            </div>
                        </div>
                    </aside>
                </section>

            </div>

            {otherJobs.length > 0 && (
                <>
                    <div className="w-full px-4 xl:px-12 2xl:px-22 pt-15 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <h2 className="text-3xl text-medium text-[#003066]">Other Job Opening </h2>
                    </div>
                    <div className="w-full px-4 xl:px-12 2xl:px-22 pt-10 mb-15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {otherJobs.map((otherJob) => {
                            const isHovered = hoveredCard === otherJob.id;
                            return (
                                <div
                                    key={otherJob.id}
                                    onMouseEnter={() => setHoveredCard(otherJob.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    className={`w-full rounded-2xl transition-all duration-300 p-4 md:p-8 shadow-md border border-white/1 bg-[#1269CD]`}
                                >
                                    <h3
                                        className={`text-lg font-semibold leading-tight mb-3.5 transition-colors duration-300 ${isHovered ? "text-[#E1EFEB]" : "text-[#E1EFEB]"
                                        }`}
                                    >
                                        {otherJob.title}
                                    </h3>

                                    <hr className="mb-4 transition-colors duration-300 border-[#102126]/15" />

                                    <div className="flex items-center justify-between gap-5 text-sm mb-3.5 transition-colors duration-300 text-white">
                                        <div className="flex items-center gap-2 text-sm font-normal text-white">
                                            <svg className="text-[#FAD892]" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <g clipPath="url(#clip0_922_10811)">
                                                    <path d="M7.99788 7.66495C9.44413 7.66495 10.6208 6.48848 10.6208 5.04242C10.6208 3.59636 9.44413 2.41992 7.99788 2.41992C6.55163 2.41992 5.375 3.59636 5.375 5.04242C5.375 6.48848 6.55163 7.66495 7.99788 7.66495ZM7.99788 3.3573C8.92719 3.3573 9.68325 4.11327 9.68325 5.04242C9.68325 5.97161 8.92722 6.72758 7.99788 6.72758C7.06853 6.72758 6.3125 5.97161 6.3125 5.04242C6.3125 4.11327 7.06856 3.3573 7.99788 3.3573Z" fill="#FAD892"/>
                                                    <path d="M5.14339 9.75409C5.85386 10.7159 5.56842 10.3418 7.61483 13.2636C7.80083 13.5302 8.19636 13.5314 8.38342 13.264C10.4391 10.3284 10.1562 10.7002 10.8551 9.75406C11.5631 8.79556 12.2952 7.80444 12.6964 6.643C13.2771 4.96172 13.0261 3.29819 11.9897 1.95881C11.9897 1.95881 11.9897 1.95878 11.9897 1.95878C11.0404 0.73225 9.54861 0 7.99927 0C6.44992 0 4.95817 0.73225 4.00883 1.95884C2.97249 3.29822 2.72149 4.96178 3.30217 6.64306C3.7033 7.80447 4.43542 8.79559 5.14339 9.75409ZM4.75027 2.53247C5.52333 1.53369 6.73792 0.937375 7.99927 0.937375C9.26061 0.937375 10.4752 1.53369 11.2483 2.53247L11.2482 2.53244C12.0847 3.61344 12.2842 4.96462 11.8102 6.33706C11.4559 7.36294 10.7671 8.29541 10.101 9.19719C9.58239 9.89928 9.73761 9.68453 7.99927 12.1763C6.26274 9.68703 6.41599 9.89906 5.89752 9.19719C5.23142 8.29541 4.54264 7.36291 4.1883 6.33706C3.7143 4.96459 3.91386 3.61344 4.75027 2.53247Z" fill="#FAD892"/>
                                                    <path d="M5.52964 11.7868C5.39139 11.568 5.10189 11.5026 4.88301 11.6409L3.5502 12.4827C3.25945 12.6663 3.25917 13.0913 3.5502 13.2752L7.7502 15.9279C7.90311 16.0245 8.09798 16.0245 8.25085 15.9279L12.4509 13.2752C12.7416 13.0915 12.7419 12.6665 12.4509 12.4827L11.118 11.6409C10.8991 11.5026 10.6096 11.568 10.4714 11.7868C10.3331 12.0057 10.3985 12.2951 10.6174 12.4334L11.3228 12.8789L8.00051 14.9773L4.67823 12.8789L5.38367 12.4334C5.60254 12.2952 5.66789 12.0057 5.52964 11.7868Z" fill="#FAD892"/>
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_922_10811">
                                                    <rect width="16" height="16" fill="white"/>
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                            <span className="text-white">{otherJob.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-normal text-white">
                                            <svg className="text-[#FAD892]" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <g clipPath="url(#clip0_922_10818)">
                                                    <path d="M16 4.83594C16 4.06053 15.3692 3.42969 14.5938 3.42969H12.0938V2.42103C12.0938 1.60731 11.4318 0.945312 10.6181 0.945312H5.38197C4.56825 0.945312 3.90625 1.60731 3.90625 2.42103V3.42969H1.40625C0.630844 3.42969 0 4.06053 0 4.83594V7.05459C0 7.46803 0.134625 7.98362 0.625 8.48938V13.6484C0.625 14.4238 1.25584 15.0547 2.03125 15.0547H13.9688C14.7442 15.0547 15.375 14.4238 15.375 13.6484V8.48938C15.8652 7.98391 16 7.46847 16 7.05459V4.83594ZM4.84375 2.42103C4.84375 2.12425 5.08519 1.88281 5.38197 1.88281H10.6181C10.9148 1.88281 11.1563 2.12425 11.1563 2.42103V3.42969H4.84375V2.42103ZM0.9375 4.83594C0.9375 4.57747 1.14778 4.36719 1.40625 4.36719H14.5938C14.8522 4.36719 15.0625 4.57747 15.0625 4.83594V7.05459C15.0625 8.20797 12.8498 9.14919 9.625 9.39578V8.96094C9.625 8.70206 9.41512 8.49219 9.15625 8.49219H6.84375C6.58488 8.49219 6.375 8.70206 6.375 8.96094V9.39563C3.15316 9.14872 0.9375 8.20503 0.9375 7.05459V4.83594ZM8.6875 9.42969V10.0391C8.6875 10.3751 8.41413 10.6484 8.07812 10.6484H7.92188C7.58588 10.6484 7.3125 10.3751 7.3125 10.0391V9.42969H8.6875ZM13.9688 14.1172H2.03125C1.77278 14.1172 1.5625 13.9069 1.5625 13.6484V9.17734C2.95825 9.89256 4.42506 10.1683 6.40425 10.3379C6.54391 11.0483 7.17119 11.5859 7.92188 11.5859H8.07812C8.82887 11.5859 9.45619 11.0482 9.59578 10.3378C11.2307 10.2194 12.7066 9.91928 13.7843 9.48322C14.0266 9.38516 14.2434 9.28272 14.4375 9.17725V13.6484C14.4375 13.9069 14.2272 14.1172 13.9688 14.1172Z" fill="#FAD892"/>
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_922_10818">
                                                    <rect width="16" height="16" fill="white"/>
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                            <span className="text-white">{otherJob.employmentType}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-normal text-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <g clipPath="url(#clip0_922_10822)">
                                                    <path d="M8 16C12.4107 16 16 12.4107 16 8C16 3.58934 12.4107 0 8 0C3.5893 0 0 3.58934 0 8C0 12.4107 3.58934 16 8 16ZM8 1.06665C11.824 1.06665 14.9334 4.17597 14.9334 8C14.9334 11.824 11.824 14.9334 8 14.9334C4.17597 14.9334 1.06665 11.824 1.06665 8C1.06665 4.17597 4.17602 1.06665 8 1.06665Z" fill="#FAD892"/>
                                                    <path d="M10.3335 10.5486C10.4321 10.6285 10.5494 10.6659 10.6668 10.6659C10.8241 10.6659 10.9788 10.5966 11.0828 10.4659C11.2668 10.2366 11.2294 9.90055 11.0001 9.71654L8.53345 7.74321V3.73254C8.53345 3.43921 8.29346 3.19922 8.00012 3.19922C7.70678 3.19922 7.4668 3.43921 7.4668 3.73254V7.99923C7.4668 8.16191 7.54148 8.3139 7.66679 8.41521L10.3335 10.5486Z" fill="#FAD892"/>
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_922_10822">
                                                    <rect width="16" height="16" fill="white"/>
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                            <span>{getTimeAgo(otherJob.publishedAt)}</span>
                                        </div>
                                    </div>
                                    <hr className="mb-4 transition-colors duration-300 border-[#102126]/15" />
                                    <div className="flex justify-end">
                                        <Link
                                            to={`/job/${otherJob.slug}`}
                                            onMouseEnter={handleEnter}
                                            onMouseMove={handleMouse}
                                            onMouseLeave={handleLeave}
                                            className={`relative flex items-center justify-center pl-4 py-1 pr-1 w-auto text-base font-normal rounded-full leading-[34px] md:bg-transparent bg-[#FFBF3C] border border-[#FFBF3C] overflow-hidden group transition-all ease-in-out duration-500`}
                                            >
                                            {/* Bubble */}
                                            <span
                                                className="absolute rounded-full pointer-events-none group-hover:bg-[#FFBF3C] -translate-1/2 scale-0 group-hover:scale-100 transition-all duration-500 ease-in-out"
                                                style={{
                                                width: "400px",
                                                height: "400px",
                                                top: coords.y,
                                                left: coords.x,
                                                }}
                                            ></span>

                                            {/* Content */}
                                            <span
                                                className="relative flex items-center justify-center pr-11 md:pr-0 w-full gap-3 z-10 transition-all duration-500 text-black md:text-[#FFBF3C] group-hover:text-black"
                                            >
                                                View Details
                                                <span className="absolute right-0 md:static md:w-0 w-8.5 md:h-0 h-8.5 group-hover:w-8.5 group-hover:h-8.5 bg-[#001935]/50 rounded-full backdrop-blur-md flex items-center justify-center scale-100 md:scale-0 group-hover:scale-100 transition-all duration-500 ease-in-out">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                                                    <path d="M16.1938 8.12561L11.3915 3.32329C11.2621 3.19832 11.0888 3.12917 10.9089 3.13073C10.7291 3.1323 10.557 3.20445 10.4298 3.33165C10.3026 3.45884 10.2304 3.63091 10.2289 3.81079C10.2273 3.99067 10.2965 4.16397 10.4214 4.29336L14.0527 7.9246H1.98787C1.80591 7.9246 1.63142 7.99688 1.50276 8.12554C1.3741 8.2542 1.30182 8.4287 1.30182 8.61065C1.30182 8.7926 1.3741 8.9671 1.50276 9.09576C1.63142 9.22442 1.80591 9.2967 1.98787 9.2967H14.0527L10.4214 12.9279C10.3559 12.9912 10.3036 13.0669 10.2677 13.1506C10.2317 13.2343 10.2128 13.3244 10.212 13.4154C10.2112 13.5065 10.2286 13.5969 10.2631 13.6812C10.2976 13.7655 10.3485 13.8421 10.4129 13.9065C10.4773 13.9709 10.5539 14.0219 10.6383 14.0564C10.7226 14.0909 10.8129 14.1082 10.904 14.1074C10.9951 14.1066 11.0851 14.0877 11.1688 14.0518C11.2525 14.0158 11.3282 13.9635 11.3915 13.898L16.1938 9.09568C16.3224 8.96703 16.3947 8.79256 16.3947 8.61065C16.3947 8.42873 16.3224 8.25427 16.1938 8.12561Z" fill="white"/>
                                                </svg>
                                                </span>
                                            </span>
                                            </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default JobDetails;
