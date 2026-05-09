import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function SEO({ 
  title = "Cita-citaku | Temukan Karier & Masa Depanmu", 
  description = "Platform edukasi untuk membantu siswa menemukan jurusan kuliah dan karier impian melalui tes RIASEC dan AI Counselor.",
  keywords = "cita-citaku, eksplorasi karir, tes riasec indonesia, roadmap belajar, masa depan",
  image = "https://cita-citaku.vercel.app/og-image.png", 
  url = "https://cita-citaku.vercel.app",
  type = "website"
}: SEOProps) {
  const siteTitle = title.includes("Cita-citaku") ? title : `${title} | Cita-citaku`;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{siteTitle}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />

      {/* Facebook Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <link rel="canonical" href={url} />
    </Helmet>
  );
}
