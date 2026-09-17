import HeroSection from "./_components/hero/HeroSection";
import StatsBar from "./_components/stats/StatsBar";
import DestinationsSection from "./_components/destinations/DestinationsSection";
import ServicesSection from "./_components/services/ServicesSection";
import TestPrepSection from "./_components/test-prep/TestPrepSection";
import SuccessStories from "./_components/success-stories/SuccessStories";
import GallerySection from "./_components/gallery/GallerySection";
import AboutSection from "./_components/about/AboutSection";
import FAQSection from "./_components/faq/FAQSection";
import CTASection from "./_components/cta/CTASection";
import ContactSection from "./_components/contact/ContactSection";
import LandingPopup from "@/_globalcomponents/LandingPopup";
import {
  getCompany,
  getSiteConfig,
  getDestinations,
  getServices,
  getTestimonials,
  getTeam,
  getFaqs,
  getGalleryImages,
  getPopupConfig,
} from "@/lib/content";

export default async function HomePage() {
  const [company, siteConfig, destinations, services, testimonials, team, faqs, galleryImages, popupConfig] =
    await Promise.all([
      getCompany(),
      getSiteConfig(),
      getDestinations(),
      getServices(),
      getTestimonials(),
      getTeam(),
      getFaqs(),
      getGalleryImages(),
      getPopupConfig(),
    ]);

  return (
    <>
      <LandingPopup config={popupConfig} />
      <HeroSection />
      <StatsBar stats={siteConfig.stats} />
      <DestinationsSection destinations={destinations} />
      <ServicesSection services={services} />
      <TestPrepSection services={services} />
      <SuccessStories testimonials={testimonials} siteConfig={siteConfig} />
      <GallerySection images={galleryImages} />
      <AboutSection company={company} team={team} />
      <FAQSection faqs={faqs} />
      <CTASection />
      <ContactSection company={company} />
    </>
  );
}
