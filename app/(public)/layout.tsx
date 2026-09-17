import Navbar from "@/_globalcomponents/Navbar";
import Footer from "@/_globalcomponents/Footer";
import WhatsAppButton from "@/_globalcomponents/shared/WhatsAppButton";
import { getCompany, getSiteConfig, getDestinations, getServices } from "@/lib/content";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [company, siteConfig, destinations, services] = await Promise.all([
    getCompany(),
    getSiteConfig(),
    getDestinations(),
    getServices(),
  ]);

  return (
    <>
      <Navbar company={company} siteConfig={siteConfig} destinations={destinations} services={services} />
      <main>{children}</main>
      <Footer company={company} siteConfig={siteConfig} destinations={destinations} />
      <WhatsAppButton />
    </>
  );
}
