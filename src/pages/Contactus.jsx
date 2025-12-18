import React from 'react'
import useSEO from "../utils/useSEO";
import ContactSection from '../components/contact/contactbanner'
// import FAQSection from '../components/contact/Faq'
// import ContactForm from '../components/contact/contactform'
function Contact() {
  useSEO({
    title: "Get in Touch for Ubona's Cloud-Based Call Center Solutions",
    description: "Reach out to Ubona to learn about our interactive voice response system, customer support chatbots, and AI for omni channel customer interaction solutions."
  });
  return (
    <div className="w-full bg-[#00081F] py-12 px-4 md:px-12 mb-8 md:mb-0">
      <ContactSection/>
      {/* <ContactForm/> */}
      {/* <FAQSection/> */}
    </div>
  )
}

export default Contact
