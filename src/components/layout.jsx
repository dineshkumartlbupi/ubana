import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import CookieConsent from "./CookieConsent";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <CookieConsent />
    </>
  );
}
