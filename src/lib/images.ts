import { getImage } from 'astro:assets';
import type { Photo } from '../data/photos';

/** Responsive widths + sizes shared by the Story and Head Spa carousels. */
const CAROUSEL_WIDTHS = [480, 768, 1000, 1400];
const CAROUSEL_SIZES = '(min-width:1024px) 50vw, 100vw';

export interface Slide {
  src: string;
  srcset: string;
  alt: string;
}

/**
 * Optimize carousel photos at build time and shape them for the ImageCarousel
 * island. Both carousels use identical widths/sizes, so this keeps the two
 * call sites from drifting.
 */
export async function carouselSlides(list: readonly Photo[]): Promise<Slide[]> {
  return Promise.all(
    list.map(async ({ src, alt }) => {
      const img = await getImage({
        src,
        widths: CAROUSEL_WIDTHS,
        sizes: CAROUSEL_SIZES,
        format: 'webp',
      });
      return { src: img.src, srcset: img.srcSet.attribute, alt };
    }),
  );
}

/**
 * Build schema.org ImageObject entries for a set of photos.
 *
 * `width` must be one of the widths the page already renders, so the URL points
 * at a variant that really exists in the build instead of emitting an extra
 * file nothing requests. Captions reuse each photo's alt text, so the rendered
 * markup and the structured data always say the same thing.
 */
export async function imageObjects(
  list: readonly Photo[],
  site: URL,
  width: number,
): Promise<Record<string, unknown>[]> {
  return Promise.all(
    list.map(async (photo) => {
      const img = await getImage({ src: photo.src, width, format: 'webp' });
      const contentUrl = new URL(img.src, site).href;
      const height = Math.round((photo.src.height / photo.src.width) * width);
      return {
        '@type': 'ImageObject',
        '@id': `${contentUrl}#image`,
        contentUrl,
        url: contentUrl,
        name: photo.name,
        caption: photo.alt,
        description: photo.alt,
        width,
        height,
      };
    }),
  );
}
