import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export default function SEO({ title, description, keywords, image, url }: SEOProps) {
  useEffect(() => {
    // Update Title
    const fullTitle = `${title} | Cita-citaku - Platform Eksplorasi Karir`;
    document.title = fullTitle;

    // Helper to update or create meta tags
    const updateMetaTag = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    // Standard Meta Tags
    updateMetaTag('description', description);
    if (keywords) updateMetaTag('keywords', keywords);

    // Open Graph / Facebook
    updateMetaTag('og:type', 'website', 'property');
    updateMetaTag('og:title', fullTitle, 'property');
    updateMetaTag('og:description', description, 'property');
    if (image) updateMetaTag('og:image', image, 'property');
    if (url) updateMetaTag('og:url', url, 'property');

    // Twitter
    updateMetaTag('twitter:card', 'summary_large_image', 'property');
    updateMetaTag('twitter:title', fullTitle, 'property');
    updateMetaTag('twitter:description', description, 'property');
    if (image) updateMetaTag('twitter:image', image, 'property');

  }, [title, description, keywords, image, url]);

  return null; // This component doesn't render anything
}
