import { Helmet } from 'react-helmet-async';
import { getCanonicalUrl } from './routes';

interface PageMetaProps {
  title: string;
  description?: string;
  canonicalPath: string;
}

export function PageMeta({ title, description, canonicalPath }: PageMetaProps) {
  const fullTitle = title.includes('Maker Skills') ? title : `${title} | Maker Skills`;
  const canonicalUrl = getCanonicalUrl(canonicalPath);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
}
