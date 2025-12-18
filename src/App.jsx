import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Layout from "./components/layout";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import OurSolution from "./pages/OurSolution";
import OurSolutionSub from "./pages/OurSolutionSub";
import OurSolutionFeatures from "./pages/OurSolutionFeatures";
import Contact from "./pages/Contactus";
import Privacy from "./pages/privacy";
import TermsOfUse from "./pages/termsofuse";
import { PageTransitionProvider } from "./components/pageTransitionProvider";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import BlogListPreview from "./pages/BlogListPreview";
import BlogPreview from "./pages/BlogPreview";
import News from "./pages/News";
import NewsPreview from "./pages/NewsPreview";
import NewsListPreview from "./pages/NewsListPreview";
import CaseStudies from "./pages/CaseStudies";
import CaseStudyDetail from "./pages/CaseStudyDetail";
import CaseStudyPrint from "./pages/CaseStudyPrint";
import CaseStudiesPreview from "./pages/CaseStudiesPreview";
import CaseStudyPreview from "./pages/CaseStudyPreview";
import "sweetalert2/dist/sweetalert2.min.css";
import Carrers from "./pages/carrers";
import JobDetails from "./components/carrers/jobdetails";
import JobListPreview from "./pages/JobListPreview";
import JobPreview from "./pages/JobPreview";
import Faq from "./pages/Faq";

function App() {
  return (
    <>
      {/* <PageTransitionProvider> */}
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/our-solutions" element={<OurSolution />} />
              <Route path="/our-solutions/:slug/key-features" element={<OurSolutionFeatures />} />
              <Route path="/our-solutions/:slug" element={<OurSolutionSub />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/terms-and-conditions" element={<TermsOfUse />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:slug" element={<BlogDetail />} />
                <Route path="/preview/blogs" element={<BlogListPreview />} />
                <Route path="/preview/blogs/:slug" element={<BlogPreview />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
            <Route path="/case-studies/:slug/print" element={<CaseStudyPrint />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/all" element={<News />} />
            <Route path="/preview/news" element={<NewsListPreview />} />
            <Route path="/preview/news/:slug" element={<NewsPreview />} />
                <Route path="/preview/case-studies" element={<CaseStudiesPreview />} />
                <Route path="/preview/case-studies/:slug" element={<CaseStudyPreview />} />
                <Route path="/careers" element={<Carrers/>} />  
                 <Route path="/job/:slug" element={<JobDetails />} />
                 <Route path="/preview/jobs" element={<JobListPreview />} />
                 <Route path="/preview/jobs/:slug" element={<JobPreview />} />
            <Route path="/faq" element={<Faq />} />
          </Routes>
        </Layout>
      {/* </PageTransitionProvider> */}
    </>
  );
}
export default App;