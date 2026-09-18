import type { ImageMetadata } from 'astro';

import heroAmbianceImg from '../assets/images/hero-ambiance.jpg';
import couplesRoomImg from '../assets/images/couples-room.jpg';
import sanctuary1Img from '../assets/images/sanctuary-1.jpg';
import sanctuary2Img from '../assets/images/sanctuary-2.jpg';
import headSpaBasinImg from '../assets/images/head-spa.jpg';
import headSpaWashImg from '../assets/images/head-spa-3.jpg';
import headSpaScalpImg from '../assets/images/head-spa-1.jpg';
import headSpaFaceImg from '../assets/images/head-spa-2.jpg';

/**
 * Photo metadata — the single source of truth for image SEO.
 *
 * `alt` is rendered as the alt attribute AND reused as the `caption` of the
 * matching schema.org ImageObject, so the two can never drift apart. `name`
 * is the short ImageObject title Google may show alongside an image result.
 *
 * Alt copy rules (owner-facing content, so treat it like the rest of the menu):
 *   - Describe what is actually in the frame — never keyword-stuff.
 *   - Mention Poway / San Diego only where it reads naturally, not on every
 *     photo, or it looks spammy to both readers and Google.
 *   - Use the studio's own vocabulary ("Signature Head Spa", "scalp therapy").
 *     The site does not market a "Japanese" head spa, so that phrase must not
 *     appear here even though it is a high-volume search term.
 */
export interface Photo {
  src: ImageMetadata;
  /** Rendered alt attribute; also the ImageObject caption. */
  alt: string;
  /** Short ImageObject title. */
  name: string;
}

export const photos = {
  heroAmbiance: {
    src: heroAmbianceImg,
    name: 'Forest Spa treatment room ambiance, Poway',
    alt: 'Candlelit massage room at Forest Spa in Poway with warm candles and an essential oil diffuser',
  },
  couplesRoom: {
    src: couplesRoomImg,
    name: 'Couples massage room, Forest Spa Poway',
    alt: 'Couples massage room at Forest Spa in Poway with two massage tables in sage-green linens',
  },
  sanctuarySuite: {
    src: sanctuary1Img,
    name: 'Couples suite, Forest Spa Poway',
    alt: 'Forest Spa couples suite with two massage tables dressed in sage-green linens and soft natural light',
  },
  sanctuaryRoom: {
    src: sanctuary2Img,
    name: 'Private massage room, Forest Spa Poway',
    alt: 'Private treatment room for deep tissue and Swedish massage at Forest Spa in Poway, San Diego',
  },
  headSpaWash: {
    src: headSpaWashImg,
    name: 'Head spa scalp cleanse, Forest Spa',
    alt: 'Nourishing scalp cleanse and lather in the head spa basin during a Forest Spa scalp therapy treatment',
  },
  headSpaScalp: {
    src: headSpaScalpImg,
    name: 'Scalp massage, Forest Spa head spa',
    alt: 'Soothing scalp and head massage during a Signature Head Spa treatment at Forest Spa in Poway',
  },
  headSpaFace: {
    src: headSpaFaceImg,
    name: 'Head and face massage, Forest Spa',
    alt: 'Relaxing head and face massage wrapped in a warm towel during a Forest Spa head spa session',
  },
  headSpaBasin: {
    src: headSpaBasinImg,
    name: 'Head spa gold basin, Forest Spa Poway',
    alt: 'Forest Spa head spa station in Poway with a gold waterfall basin and fresh flowers',
  },
} as const satisfies Record<string, Photo>;

/**
 * Story carousel order (owner-set): the original 4:3 couples-room shot leads,
 * then the two 16:9 sanctuary photos.
 */
export const storyPhotos: readonly Photo[] = [
  photos.couplesRoom,
  photos.sanctuarySuite,
  photos.sanctuaryRoom,
];

/** Head Spa carousel order (owner-set): scalp wash first, gold basin last. */
export const headSpaPhotos: readonly Photo[] = [
  photos.headSpaWash,
  photos.headSpaScalp,
  photos.headSpaFace,
  photos.headSpaBasin,
];
