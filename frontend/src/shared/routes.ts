export const SITE_URL = 'https://www.makerskills.tn';

export const routes = {
  formation: (slug: string) => `/formations/${slug}`,
  participate: (slug: string) => `/partcipate/${slug}`,
  blog: (slug: string) => `/blogs/${slug}`,
  product: (slug: string) => `/shop/${slug}`,
  labReservation: (slug: string) => `/lab40/${slug}/reservation`,
};

export const isObjectId = (value: string): boolean =>
  /^[a-f\d]{24}$/i.test(value);

export interface SlugEntity {
  _id?: string;
  id?: string;
  slug?: string;
}

export function getEntitySlug(entity: SlugEntity): string {
  return entity.slug || entity._id || entity.id || '';
}

export function getCanonicalUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
