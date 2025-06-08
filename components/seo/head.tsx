import { Metadata } from "next";

interface HeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  noIndex?: boolean;
  noFollow?: boolean;
  ogImage?: string;
}

export function generateMetadata({
  title,
  description,
  keywords,
  noIndex = false,
  noFollow = false,
  ogImage = "/og-image.png",
}: HeadProps): Metadata {
  const baseTitle = "PandaView - Database Schema Visualization & Security";
  const baseDescription = "Transform your database workflow with PandaView. Generate ERD diagrams, detect vulnerabilities, analyze performance, and optimize your database schema.";
  const baseKeywords = ["database visualization", "ERD diagrams", "database security", "schema analysis", "database optimization", "SQL visualization"];

  return {
    title: title ? `${title} | ${baseTitle}` : baseTitle,
    description: description || baseDescription,
    keywords: keywords || baseKeywords,
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: title ? `${title} | ${baseTitle}` : baseTitle,
      description: description || baseDescription,
      url: "https://pandaview.site",
      siteName: "PandaView",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title || baseTitle,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} | ${baseTitle}` : baseTitle,
      description: description || baseDescription,
      images: [ogImage],
    },
    alternates: {
      canonical: "https://pandaview.site",
    },
  };
} 