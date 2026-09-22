import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { getSeoSettings, getCompany } from "@/lib/content";
export const dynamic = "force-dynamic";

const FALLBACK_TITLE = "Kingsland Abroad — Your Gateway to Global Education";
const FALLBACK_DESCRIPTION =
  "Nepal's premier education consultancy guiding ambitious students to world-class universities in Australia, UK, Canada, USA & Europe since 2010.";
const FALLBACK_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://kingsabroad.com";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const siteUrl = seo?.siteUrl || FALLBACK_SITE_URL;
  const title = seo?.defaultMetaTitle || FALLBACK_TITLE;
  const description = seo?.defaultMetaDescription || FALLBACK_DESCRIPTION;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${title.split("—")[0].trim()}`,
    },
    description,
    keywords: [
      "education consultancy Nepal",
      "study abroad Nepal",
      "study in Australia",
      "study in UK",
      "study in Canada",
      "IELTS coaching Nepal",
      "visa assistance Nepal",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      url: siteUrl,
      ...(seo?.ogImage ? { images: [{ url: seo.ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(seo?.twitterHandle ? { site: `@${seo.twitterHandle}` } : {}),
      ...(seo?.ogImage ? { images: [seo.ogImage] } : {}),
    },
    verification: {
      ...(seo?.googleSiteVerification
        ? { google: seo.googleSiteVerification }
        : {}),
      ...(seo?.bingSiteVerification
        ? { other: { "msvalidate.01": seo.bingSiteVerification } }
        : {}),
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [seo, company] = await Promise.all([getSeoSettings(), getCompany()]);
  const siteUrl = seo?.siteUrl || FALLBACK_SITE_URL;

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: company?.name || "Kingsland Abroad",
    url: siteUrl,
    ...(company?.logo &&
    "imageUrl" in (company.logo as any) &&
    (company.logo as any).imageUrl
      ? { logo: (company.logo as any).imageUrl }
      : {}),
    ...(company?.description ? { description: company.description } : {}),
    ...(company?.contact?.phone?.primary
      ? { telephone: company.contact.phone.primary }
      : {}),
    ...(company?.contact?.email?.general
      ? { email: company.contact.email.general }
      : {}),
    ...(company?.address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: company.address.street,
            addressLocality:
              company.address.municipality || company.address.district,
            addressRegion: company.address.province,
            addressCountry: company.address.country,
          },
        }
      : {}),
    ...(company?.socialMedia
      ? {
          sameAs: Object.values(company.socialMedia).filter(Boolean),
        }
      : {}),
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body className="overflow-x-hidden bg-white">
        {children}
        {seo?.googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${seo.googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${seo.googleAnalyticsId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
