/**
 * Forest Spa — single source of truth for site content.
 *
 * Service catalog, packages, monthly special, and memberships mirror the live
 * Fresha menu (venue slug `forest-spa-poway-14168-poway-road-msk4ljro`,
 * pId 2602780). Every booking link deep-links to the exact item via its Fresha
 * offer id, e.g. `s:20891732` (Hot Stone) → …/booking?offerItemId=s:20891732.
 *
 * ── To update the MONTHLY SPECIAL each month: edit the `monthlySpecial` object
 *    below (month, headline, name/shortName, `options` price tiers, validity,
 *    inclusions, and the Fresha `url`).
 */

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface Service {
  name: string;
  /** Fresha offer id (e.g. "s:20874160" or "p:1651755") → deep booking link. */
  id: string;
  priceLabel: string;
  duration: string | null;
  description: string;
  /** Optional explicit booking URL; overrides the id-based deep link. */
  url?: string;
  /** Add-ons only: price when woven into a massage at no added time. The
   *  standalone `priceLabel` (with its `duration`) runs $10 more. */
  inSessionPrice?: string;
  /** Quick bullet points highlighting key benefits and techniques. */
  highlights?: string[];
  /** Who will benefit most from this treatment. */
  idealFor?: string;
  /** In-depth description of the sensory experience and therapy methodology. */
  whatToExpect?: string;
  /** Optional slug to a related wellness journal article. */
  articleSlug?: string;
}

export interface ServiceCategory {
  id: string;
  label: string;
  blurb: string;
  icon: string;
  services: Service[];
}

export interface PackageTier {
  tier: string;
  id: string;
  price: number;
  value: number | null;
  duration: string | null;
  inclusions: string[];
  /** Optional explicit booking URL; overrides the id-based deep link. */
  url?: string;
}

export interface Package {
  name: string;
  icon: string;
  blurb: string;
  tiers: PackageTier[];
}

export interface Membership {
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  description: string;
  perks: string[];
  joinUrl: string;
  featured?: boolean;
}

export interface NavLink {
  label: string;
  href: string;
}

/* -------------------------------------------------------------------------- */
/*  Business (NAP + brand)                                                    */
/* -------------------------------------------------------------------------- */

export const business = {
  name: 'Forest Spa',
  legalName: 'Forest Spa',
  category: 'Massage Spa & Head Spa Sanctuary',
  tagline: 'Unwind. Recharge. Revive.',
  headline: 'Experience The Best Massage Therapy In Poway, San Diego.',
  subhead:
    'Rejuvenate your mind, body & soul in our nature-inspired sanctuary — restorative massage and specialized head spa therapies for total mind-body renewal.',
  description:
    'A nature-inspired sanctuary in Poway providing restorative massage and specialized head spa therapies for total mind-body rejuvenation.',
  priceRange: '$$',

  phone: '(858) 288-2600',
  phoneHref: 'tel:+18582882600',
  phoneE164: '+1-858-288-2600',
  email: 'forestspa206@gmail.com',

  address: {
    street: '14168 Poway Rd, Ste 206',
    streetSimple: '14168 Poway Road',
    locality: 'Poway',
    region: 'CA',
    postalCode: '92064',
    country: 'US',
    full: '14168 Poway Rd, Ste 206, Poway, CA 92064',
  },

  geo: { lat: 32.95595, lng: -117.03555 },

  hours: {
    display: 'Mon – Sun · 9:00 AM – 9:00 PM',
    openTime: '09:00',
    closeTime: '21:00',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },

  social: {
    instagram: 'https://www.instagram.com/forestspamassage',
    facebook: 'https://www.facebook.com/profile.php?id=61577147368576',
  },
} as const;

/* -------------------------------------------------------------------------- */
/*  Booking (Fresha) — deep links per item                                    */
/* -------------------------------------------------------------------------- */

const FRESHA_VENUE = 'https://www.fresha.com/a/forest-spa-poway-14168-poway-road-msk4ljro';
const FRESHA_PID = '2602780';

/** Deep link that pre-selects a specific Fresha offer by its id. */
export function bookingUrl(offerId: string): string {
  return `${FRESHA_VENUE}/booking?offerItemId=${offerId}&share=true&pId=${FRESHA_PID}&dppub=true`;
}

export const booking = {
  /** Generic "Book Now" — the all-offer venue page so guests can choose an
   *  individual or a group/couple appointment. */
  primary: `${FRESHA_VENUE}/all-offer?venue=true&pId=${FRESHA_PID}`,
  /** Signature Head Spa menu (used by the Head Spa section CTA). */
  headSpa: `${FRESHA_VENUE}/booking?menu=true&share=true&pId=${FRESHA_PID}&dppub=true&cartId=d9914c31-a56f-435c-9710-ffbb4460e710`,
  giftCards: `${FRESHA_VENUE}/gift-cards?pId=${FRESHA_PID}`,
} as const;

export const maps = {
  directions:
    'https://www.google.com/maps/dir/?api=1&destination=Forest+Spa+14168+Poway+Rd+Ste+206+Poway+CA+92064',
  embed:
    'https://www.google.com/maps?q=Forest%20Spa%2C%2014168%20Poway%20Rd%20Ste%20206%2C%20Poway%2C%20CA%2092064&output=embed',
} as const;

/* -------------------------------------------------------------------------- */
/*  Analytics — env-gated (PUBLIC_ vars inlined at build)                     */
/* -------------------------------------------------------------------------- */

export const analytics = {
  ga4Id: import.meta.env.PUBLIC_GA4_ID ?? '',
  metaPixelId: import.meta.env.PUBLIC_META_PIXEL_ID ?? '',
  googleAdsId: import.meta.env.PUBLIC_GOOGLE_ADS_ID ?? '',
  adsBookingLabel: import.meta.env.PUBLIC_GOOGLE_ADS_BOOKING_LABEL ?? '',
} as const;

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                */
/* -------------------------------------------------------------------------- */

/** Base-aware internal links (works under a project base path or a custom domain).
 *  BASE_URL may or may not carry a trailing slash depending on config, so normalize. */
export const baseUrl = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

export interface NavDropdownItem {
  label: string;
  href: string;
  description?: string;
  badge?: string;
}

export type PrimaryNavItem =
  | {
      type: 'link';
      label: string;
      href: string;
      badge?: string;
    }
  | {
      type: 'dropdown';
      label: string;
      id: string;
      href: string;
      items: NavDropdownItem[];
    };

/**
 * Streamlined 4-Pillar Primary Desktop Navigation:
 * Reduces 9 flat tabs down to 4 focused luxury pillars.
 * Prevents cognitive overwhelm, maximizes booking attention, and protects the logo.
 */
export const primaryNav: PrimaryNavItem[] = [
  {
    type: 'dropdown',
    label: 'Treatments',
    id: 'treatments',
    href: `${baseUrl}#services`,
    items: [
      {
        label: 'Massage Therapies',
        href: `${baseUrl}#services`,
        description: 'Deep Tissue, Swedish, Hot Stone & Couples',
      },
      {
        label: 'Signature Head Spa',
        href: `${baseUrl}#head-spa`,
        description: 'Scalp waterfall halo, acupressure & steam',
        badge: 'Popular',
      },
      {
        label: 'Curated Massage Packages',
        href: `${baseUrl}#packages`,
        description: 'Head-to-toe multi-therapy escapes',
      },
      {
        label: 'Treatment Finder Quiz',
        href: `${baseUrl}quiz`,
        description: '60-second personalized recommendation',
        badge: 'Interactive',
      },
    ],
  },
  {
    type: 'link',
    label: 'Head Spa',
    href: `${baseUrl}#head-spa`,
  },
  {
    type: 'link',
    label: 'Specials',
    href: `${baseUrl}#specials`,
    badge: 'Oct',
  },
  {
    type: 'dropdown',
    label: 'Explore',
    id: 'explore',
    href: `${baseUrl}#story`,
    items: [
      {
        label: 'Treatment Quiz',
        href: `${baseUrl}quiz`,
        description: 'Match your fatigue & pressure preferences',
        badge: '60s Quiz',
      },
      {
        label: 'Wellness Journal',
        href: `${baseUrl}journal`,
        description: 'Therapist guides & restorative self-care',
      },
      {
        label: 'Forest Club Membership',
        href: `${baseUrl}#membership`,
        description: '$98/mo VIP benefits & rollover hours',
      },
      {
        label: 'Gift Cards',
        href: `${baseUrl}#gift-cards`,
        description: 'Digital gift cards for loved ones',
      },
      {
        label: 'Our Story',
        href: `${baseUrl}#story`,
        description: 'Meet our sanctuary & certified specialists',
      },
      {
        label: 'Location & Hours',
        href: `${baseUrl}#location`,
        description: '14168 Poway Rd, free parking & directions',
      },
    ],
  },
];

export interface MobileNavGroup {
  category: string;
  links: {
    label: string;
    href: string;
    sublabel?: string;
    badge?: string;
  }[];
}

export const mobileNavGroups: MobileNavGroup[] = [
  {
    category: 'Treatments & Rituals',
    links: [
      { label: 'Massage Therapies', href: `${baseUrl}#services`, sublabel: 'À la carte full-body menu' },
      { label: 'Signature Head Spa', href: `${baseUrl}#head-spa`, sublabel: 'Waterfall scalp ritual', badge: 'Signature' },
      { label: 'Curated Packages', href: `${baseUrl}#packages`, sublabel: 'Head-to-toe rituals' },
      { label: 'Monthly Special', href: `${baseUrl}#specials`, sublabel: 'October Gentle Belly Detox', badge: 'Special' },
    ],
  },
  {
    category: 'Personalized Care & Guides',
    links: [
      { label: 'Treatment Finder Quiz', href: `${baseUrl}quiz`, sublabel: 'Find your best fit in 60s' },
      { label: 'Wellness Journal', href: `${baseUrl}journal`, sublabel: 'Bodywork wisdom & self-care' },
    ],
  },
  {
    category: 'Sanctuary & Visit',
    links: [
      { label: 'Club Membership', href: `${baseUrl}#membership`, sublabel: 'Monthly VIP savings' },
      { label: 'Gift Cards', href: `${baseUrl}#gift-cards`, sublabel: 'Digital gift vouchers' },
      { label: 'Our Story', href: `${baseUrl}#story`, sublabel: 'About Forest Spa Poway' },
      { label: 'Location & Directions', href: `${baseUrl}#location`, sublabel: '14168 Poway Rd, Ste 206' },
    ],
  },
];

export const navLinks: NavLink[] = [
  { label: 'Services', href: `${baseUrl}#services` },
  { label: 'Packages', href: `${baseUrl}#packages` },
  { label: 'Monthly Special', href: `${baseUrl}#specials` },
  { label: 'Head Spa', href: `${baseUrl}#head-spa` },
  { label: 'Treatment Quiz', href: `${baseUrl}quiz` },
  { label: 'Journal', href: `${baseUrl}journal` },
  { label: 'Membership', href: `${baseUrl}#membership` },
  { label: 'Gift Cards', href: `${baseUrl}#gift-cards` },
  { label: 'Directions', href: `${baseUrl}#location` },
];

/* -------------------------------------------------------------------------- */
/*  Monthly Special — THE headline offer. Update this each month.             */
/* -------------------------------------------------------------------------- */

export const monthlySpecial = {
  /** Short month label shown in the eyebrow + hero ribbon, e.g. "August". */
  month: 'October',
  headline: 'The October Special',
  name: 'Gentle Belly Detox & Warm Botanical Relief',
  /** Condensed name for the hero ribbon, where the full name is too long. */
  shortName: 'Gentle Belly Detox',
  /** Prebuilt Fresha cart for this special (owner-supplied; no offerItemId). */
  url: `${FRESHA_VENUE}/booking?pId=${FRESHA_PID}&allOffer=true&cartId=61eb23a2-fd58-4983-817b-9275733f61b9`,
  /** Duration tiers. First entry is the headline price (hero ribbon, "from"). */
  options: [{ duration: '90 min', price: 135, value: 185 }],
  validity: 'Valid October 1 – October 31 only.',
  summary:
    'Say goodbye to bloating, menstrual cramps, and deep core tension. This signature 90-minute package combines a soothing full-body massage with specialized abdominal oil bodywork to support healthy digestion and lymphatic flow. We finish with a warm Mugwort Mineral Compress — a natural botanical heat therapy that deeply penetrates the belly to melt away cramps, ease cycle discomfort, and boost blood circulation. The ultimate comforting reset for your mind and body.',
  inclusions: [
    '90-min full body massage',
    'Abdominal therapy — specialized oil bodywork to support healthy digestion and lymphatic flow',
    'Essential oil',
    'Herbal detox heat pad — a warm Mugwort Mineral Compress to melt away cramps and boost circulation',
  ],
} as const;

/** Standing offers that run alongside the monthly special. */
export const standingOffers = [
  {
    icon: 'Coins',
    title: 'Cash Discount At Checkout',
    description: 'Pay with cash and enjoy a free hot stone or essential oil add-on with your service.',
    id: 's:22810448',
  },
  {
    icon: 'Sunrise',
    title: 'Early Bird — 10% Off',
    description: 'Mon–Thu before 11:30 am. Cannot be combined with other promotions.',
    id: 's:22684381',
  },
] as const;

/* -------------------------------------------------------------------------- */
/*  Packages (combos with tiers) — the signature value offering               */
/* -------------------------------------------------------------------------- */

export const packages: Package[] = [
  {
    name: 'Head-to-Toe Retreat',
    icon: 'Sparkles',
    blurb: 'Our most complete head-to-toe escape — full-body massage plus scalp, hand, and foot care.',
    tiers: [
      {
        tier: 'Premier',
        id: 's:20888388',
        price: 135,
        value: 170,
        duration: '90 min',
        inclusions: [
          '45-min body massage',
          '20-min head, scalp & TMJ massage with eye mask',
          '10-min hand massage with hand mask',
          '15-min foot massage with foot scrub',
          'Aromatherapy',
        ],
      },
      {
        tier: 'Prestige',
        id: 's:20888407',
        price: 160,
        value: 220,
        duration: '120 min',
        inclusions: [
          '60-min body massage',
          '20-min head, scalp & TMJ massage with eye mask',
          '10-min hand massage with hand mask',
          '30-min foot massage with foot scrub',
          'Aromatherapy',
        ],
      },
    ],
  },
  {
    name: 'Stone & Scent Combo',
    icon: 'Flame',
    blurb: 'Warm stones, foot reflexology, and aromatherapy layered over a full-body massage.',
    tiers: [
      {
        tier: 'Preferred',
        id: 's:20888277',
        price: 90,
        value: 110,
        duration: '60 min',
        inclusions: [
          '50-min body massage (your choice of modality)',
          '10-min foot reflexology with scrub',
          'Hot stones',
          'Aromatherapy / essential oil',
        ],
      },
      {
        tier: 'Premier',
        id: 's:20888346',
        price: 125,
        value: 150,
        duration: '90 min',
        inclusions: [
          '60-min body massage (your choice of modality)',
          '30-min foot reflexology with scrub',
          'Hot stones',
          'Aromatherapy / essential oil',
        ],
      },
      {
        tier: 'Prestige',
        id: 's:20888368',
        price: 155,
        value: 185,
        duration: '120 min',
        inclusions: [
          '90-min body massage (your choice of modality)',
          '30-min foot reflexology with scrub',
          'Hot stones',
          'Aromatherapy / essential oil',
        ],
      },
    ],
  },
  {
    name: 'Signature Head Spa & Body Massage',
    icon: 'Droplets',
    blurb: 'Our signature scalp revival paired with a customized body massage.',
    tiers: [
      {
        tier: 'Premier',
        id: 's:20891638',
        price: 125,
        value: 140,
        duration: '90 min',
        inclusions: [
          '45-min scalp therapy + 45-min body massage',
          'Relaxing head, neck & shoulder massage',
          'Scalp exfoliation & nourishing cleanse',
          'Keratin conditioner + halo water-ring rinse with steam',
          'Argan-oil scalp care & calming aromatherapy',
          'Customized body massage with hot-stone therapy',
        ],
      },
      {
        tier: 'Prestige',
        id: 's:20891638',
        price: 155,
        value: 185,
        duration: '120 min',
        inclusions: [
          '60-min scalp therapy + 60-min body massage',
          'Relaxing head, neck & shoulder massage',
          'Scalp exfoliation & nourishing cleanse',
          'Keratin conditioner + halo water-ring rinse with steam',
          'Argan-oil scalp care & calming aromatherapy',
          'Customized body massage with hot-stone therapy',
        ],
      },
    ],
  },
  {
    name: 'Head & TMJ Pain Relief',
    icon: 'Waves',
    blurb: 'Targeted work for jaw tension, clenching, and the headaches they cause.',
    tiers: [
      {
        tier: 'Preferred',
        id: 's:20888530',
        price: 75,
        value: 95,
        duration: '45 min',
        inclusions: [
          '15-min head & scalp massage',
          '20-min jaw massage',
          '10-min neck & shoulder massage',
          'Pain-relieving ointment or Tiger Balm',
          'Eye masks',
        ],
      },
      {
        tier: 'Premier',
        id: 's:20888564',
        price: 95,
        value: 125,
        duration: '60 min',
        inclusions: [
          '20-min head & scalp massage',
          '20-min jaw massage',
          '20-min neck & shoulder massage',
          'Pain-relieving ointment or Tiger Balm',
          'Eye masks',
        ],
      },
    ],
  },
  {
    name: 'Upper Body Tension Release',
    icon: 'Activity',
    blurb: 'Focused relief for tight shoulders, upper back, and neck.',
    tiers: [
      {
        tier: 'Preferred',
        id: 's:20888504',
        price: 70,
        value: 85,
        duration: '45 min',
        inclusions: [
          '30-min shoulder, upper & lower back massage',
          '15-min head & neck massage',
          'Hot stones or herbal heat pack',
          'Pain-relieving ointment or Tiger Balm',
        ],
      },
      {
        tier: 'Premier',
        id: 's:20888511',
        price: 90,
        value: 110,
        duration: '60 min',
        inclusions: [
          '45-min shoulder, upper & lower back massage',
          '15-min head & neck massage',
          'Hot stones or herbal heat pack',
          'Pain-relieving ointment or Tiger Balm',
        ],
      },
    ],
  },
  {
    name: 'Cupping Harmony',
    icon: 'CircleDot',
    blurb: 'Dynamic cupping and essential oils over a full-body massage.',
    tiers: [
      {
        tier: 'Preferred',
        id: 's:20888494',
        price: 90,
        value: 105,
        duration: '60 min',
        inclusions: [
          '60-min massage (your choice of modality)',
          'Dynamic cupping',
          'Essential oil or Pain relief oil',
        ],
      },
      {
        tier: 'Premier',
        id: 's:20888499',
        price: 125,
        value: 140,
        duration: '90 min',
        inclusions: [
          '90-min massage (your choice of modality)',
          'Dynamic cupping',
          'Essential oil or Pain relief oil',
        ],
      },
    ],
  },
  {
    name: 'Computer Relief',
    icon: 'Monitor',
    blurb: 'Targeted relief for the back, shoulders, and arms — ideal for desk- and screen-bound tension.',
    tiers: [
      {
        tier: 'Preferred',
        id: '',
        url: 'https://www.fresha.com/book-now/forest-spa-kbi5ew52/services?lid=2689228&oiid=sv%3A23950414&share=true&pId=2602780',
        price: 90,
        value: 105,
        duration: '60 min',
        inclusions: [
          '30-min shoulders, arms, wrist & hands targeted massage',
          '30-min deep tissue or Thai body massage',
          'Pain-relieving ointment or Tiger Balm',
          'Herbal heat pack or hot stones',
        ],
      },
      {
        tier: 'Premier',
        id: '',
        url: 'https://www.fresha.com/book-now/forest-spa-kbi5ew52/services?lid=2689228&oiid=sv%3A23950422&share=true&pId=2602780',
        price: 120,
        value: 140,
        duration: '90 min',
        inclusions: [
          '45-min shoulders, arms, wrist & hands targeted massage',
          '45-min deep tissue or Thai body massage',
          'Pain-relieving ointment or Tiger Balm',
          'Herbal heat pack or hot stones',
        ],
      },
      {
        tier: 'Prestige',
        id: '',
        url: 'https://www.fresha.com/book-now/forest-spa-kbi5ew52/services?lid=2689228&oiid=sv%3A23950438&share=true&pId=2602780',
        price: 150,
        value: 180,
        duration: '120 min',
        inclusions: [
          '45-min shoulders, arms, wrist & hands targeted massage',
          '30-min upper back or TMJ tension relief',
          '45-min deep tissue or Thai body massage',
          'Herbal heat pack or hot stones',
          'Pain-relieving ointment or Tiger Balm',
        ],
      },
    ],
  },
  {
    name: 'Runner Rescue',
    icon: 'Footprints',
    blurb: 'Built for active legs — leg-focused work, stretch, and recovery for runners and athletes.',
    tiers: [
      {
        tier: 'Preferred',
        id: '',
        url: 'https://www.fresha.com/book-now/forest-spa-kbi5ew52/services?lid=2689228&oiid=sv%3A23950454&share=true&pId=2602780',
        price: 90,
        value: 110,
        duration: '60 min',
        inclusions: [
          '25-min body massage (Swedish, Sports, or Deep Tissue)',
          '25-min leg-focused massage (quads, hamstrings, glutes, IT bands & calves)',
          '10-min body stretch',
          'Hot stones',
          'Pain-relieving ointment or Tiger Balm',
        ],
      },
      {
        tier: 'Premier',
        id: '',
        url: 'https://www.fresha.com/book-now/forest-spa-kbi5ew52/services?lid=2689228&oiid=sv%3A23950466&share=true&pId=2602780',
        price: 125,
        value: 145,
        duration: '90 min',
        inclusions: [
          '30-min body massage (Swedish, Sports, or Deep Tissue)',
          '40-min leg-focused massage (quads, hamstrings, glutes, IT bands & calves)',
          '10-min foot reflexology',
          '10-min body stretch',
          'Hot stones',
          'Pain-relieving ointment or Tiger Balm',
        ],
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  À-la-carte service catalog (grouped as on Fresha)                         */
/* -------------------------------------------------------------------------- */

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'massage',
    label: 'Massage',
    icon: 'Leaf',
    blurb: 'Every session is tailored to your body — from gentle relief to deep therapeutic work.',
    services: [
      {
        name: 'Swedish Massage',
        id: 's:20874160',
        priceLabel: 'from $75',
        duration: '60–120 min',
        description: 'Gentle, flowing strokes that relax muscles, improve circulation, and melt away stress.',
        highlights: ['Flowing effleurage & kneading', 'Gentle whole-body stress relief', 'Boosts circulation & lymphatic return', 'Custom light-to-medium pressure'],
        idealFor: 'First-time spa guests, high stress, mental burnout, and those seeking pure peaceful relaxation.',
        whatToExpect: 'Continuous, rhythmic gliding strokes with botanical massage oils designed to melt away daily stress and ease muscle fatigue.',
        articleSlug: 'deep-tissue-vs-swedish',
      },
      {
        name: 'Deep Tissue Massage',
        id: 's:20874167',
        priceLabel: 'from $80',
        duration: '60–120 min',
        description: 'Firm, deliberate pressure that reaches deeper muscle to relieve chronic tension.',
        highlights: ['Targeted deep pressure & slow strokes', 'Fascial adhesion & knot release', 'Occipital, trap & lumbar focus', 'Customized therapeutic depth'],
        idealFor: 'Chronic postural tension, stubborn muscle knots, desk strain, and those preferring firm therapeutic pressure.',
        whatToExpect: 'Deliberate, slow friction and sustained compression targeting deep connective muscle layers to release chronic stiffness and restore joint range of motion.',
        articleSlug: 'deep-tissue-vs-swedish',
      },
      {
        name: 'Sports Massage',
        id: 's:20874176',
        priceLabel: 'from $75',
        duration: '60–120 min',
        description: 'Targeted techniques that boost flexibility, circulation, and muscle recovery.',
        highlights: ['Dynamic compression & cross-fiber friction', 'Assisted mobility & range-of-motion work', 'Accelerates lactic acid clearance', 'Pre- and post-workout conditioning'],
        idealFor: 'Runners, athletes, fitness enthusiasts, and active bodies recovering from training or physical fatigue.',
        whatToExpect: 'An active, focused treatment blending rhythmic compression, assisted stretching, and deep friction to enhance flexibility and reduce muscle soreness.',
      },
      {
        name: 'Thai Massage',
        id: 's:20874194',
        priceLabel: 'from $80',
        duration: '60–90 min',
        description: 'Acupressure, assisted stretches, and rhythmic compression to restore energy flow.',
        highlights: ['Assisted yoga-style passive stretches', 'Energy line (Sen) acupressure', 'Unlocks tight hips, spine & chest', 'Revitalizing & posture-opening'],
        idealFor: 'Individuals feeling physically stiff, desk workers with tight hips, and anyone wanting deep flexibility opening.',
        whatToExpect: 'A clothed, dynamic session combining acupressure along natural energy pathways with guided, gentle yogic stretches that lengthen tight muscles.',
      },
      {
        name: 'Prenatal Massage',
        id: 's:20874198',
        priceLabel: 'from $80',
        duration: '60–90 min',
        description: 'Gentle, soothing relief thoughtfully tailored to the comfort of expecting mothers.',
        highlights: ['Supportive side-lying positioning & pillows', 'Eases lower back, hip & sciatic ache', 'Reduces ankle & leg fluid retention', 'Nurturing, certified maternal care'],
        idealFor: 'Expecting mothers in their 2nd or 3rd trimester seeking safe relief from pregnancy aches and fatigue.',
        whatToExpect: 'Gentle, therapeutic strokes designed specifically for maternal anatomy. Cushioned side-lying comfort relieves spinal compression while avoiding contraindicated pressure points.',
        articleSlug: 'prenatal-massage-guide',
      },
      {
        name: 'Lomi Lomi Massage',
        id: 's:20874314',
        priceLabel: 'from $80',
        duration: '60–90 min',
        description: 'Rooted in Hawaiian tradition — rhythmic, flowing strokes that embrace and heal.',
        highlights: ['Continuous ocean-wave forearm strokes', 'Harmonizes mind, body & breath', 'Seamless transitions across full body', 'Profoundly comforting & centering'],
        idealFor: 'Burnout, emotional fatigue, overthinking, and those who adore smooth, continuous fluid strokes.',
        whatToExpect: 'Long, fluid strokes using the therapist’s forearms and hands in continuous rhythmic waves, creating a cocoon of comfort that melts emotional tension.',
      },
      {
        name: 'Lymphatic Massage',
        id: 's:20986382',
        priceLabel: 'from $80',
        duration: '60–90 min',
        description: 'Gentle drainage that reduces swelling and encourages the body to release trapped fluid.',
        highlights: ['Feather-light directional pumping', 'Reduces post-travel puffiness & fluid retention', 'Stimulates lymphatic nodes & immunity', 'Ultra-gentle non-invasive technique'],
        idealFor: 'Post-flight swelling, sluggish circulation, water retention, and gentle body restoration.',
        whatToExpect: 'Very light, delicate rhythmic skin-stretching motions directed toward primary lymph nodes. Note: This is an ultra-light therapy with no deep muscular pressure.',
      },
      {
        name: 'Foot Massage',
        id: 's:20874333',
        priceLabel: 'from $60',
        duration: '60–90 min',
        description: 'Relieves tension, improves circulation, and refreshes you from the ground up.',
        highlights: ['Targeted reflexology pressure points', 'Relieves plantar fascia & heel fatigue', 'Eases calf and Achilles stiffness', 'Restores overall bodily balance'],
        idealFor: 'Those on their feet all day, walkers, runners, service professionals, and tired travelers.',
        whatToExpect: 'Focused thumb pressure and knuckle kneading along reflex zones in the soles, toes, ankles, and calves, releasing tension throughout your entire foundation.',
      },
      {
        name: 'Upper Body Massage',
        id: 's:20874242',
        priceLabel: 'from $80',
        duration: '60–120 min',
        description: 'Focused relief for tight shoulders, neck stiffness, and upper-back discomfort.',
        highlights: ['Zero wasted time — 100% upper body focus', 'Occipital ridge & levator scapulae release', 'Rotator cuff & rhomboid work', 'Relieves screen-induced tension headaches'],
        idealFor: 'Desk professionals, laptop users, drivers, and anyone who carries their stress in their neck and shoulders.',
        whatToExpect: 'Dedicated deep or medium pressure on the trapezius, shoulder blades, neck, and lower back to dissolve postural knots built up from screen time.',
        articleSlug: 'tech-neck-desk-fatigue',
      },
      {
        name: 'Couples Massage · 60 min',
        id: 'p:1651755',
        priceLabel: '$140',
        duration: '60 min',
        description: 'Unwind side by side with your partner in a serene, shared setting.',
        highlights: ['Private, tranquil couples suite', 'Two therapists working in harmony', 'Individual customized modality per guest', '10% built-in couple discount'],
        idealFor: 'Couples, close friends, parent-child retreats, anniversaries, and shared wellness milestones.',
        whatToExpect: 'Relax together side by side with soft ambient lighting and calming aromatics. Each guest chooses their own modality (Swedish or Deep Tissue) and pressure preferences.',
      },
      {
        name: 'Couples Massage · 90 min',
        id: 'p:1651756',
        priceLabel: '$210',
        duration: '90 min',
        description: 'A longer, intimate escape for two — relaxation shared and doubled.',
        highlights: ['90 full minutes of synchronized care', 'Allows deeper full-body decompression', 'Side-by-side serene ambient suite', 'Most popular option for special occasions'],
        idealFor: 'Partners wanting an unhurried, deeply immersive shared wellness escape.',
        whatToExpect: 'An extended, deeply grounding shared session with sufficient time to work through stubborn tension points while allowing both guests to drift into deep relaxation.',
      },
      {
        name: 'Four Hands Massage · 60 min',
        id: 'p:1739449',
        priceLabel: '$140',
        duration: '60 min',
        description: 'Two skilled therapists in perfect sync for an immersive, deeply restorative escape.',
        highlights: ['Two therapists working simultaneously', 'Choreographed synchronized strokes', 'Calms a busy, overactive mind', 'Twice the tension release in 60 minutes'],
        idealFor: 'Spa connoisseurs, high-stress executives, and anyone struggling to turn off their active mind.',
        whatToExpect: 'Two therapists coordinate identical movements across your body in harmony. With two therapists working together, your mind easily lets go of stress and drifts into deep relaxation.',
      },
      {
        name: 'Four Hands Massage · 90 min',
        id: 'p:1739449',
        priceLabel: '$210',
        duration: '90 min',
        description: 'A longer four-hands session — two therapists moving in harmony for total full-body relaxation.',
        url: 'https://www.fresha.com/a/forest-spa-poway-14168-poway-road-msk4ljro/booking?allOffer=true&pId=2602780&cartId=59721975-9437-4504-a094-0bbf72d7e5d6',
        highlights: ['Full 90 minutes of dual-therapist immersion', 'Comprehensive full-body synchronicity', 'The pinnacle of luxury therapeutic bodywork', 'Unforgettable restoration experience'],
        idealFor: 'Special self-care celebrations and total, uninterrupted sensory rejuvenation.',
        whatToExpect: 'An extended session of synchronized bodywork, soothing warmth, and seamless flow that leaves you feeling completely refreshed and light on your feet.',
      },
    ],
  },
  {
    id: 'head-spa',
    label: 'Head Spa',
    icon: 'Droplets',
    blurb: 'A full reset for your scalp and nervous system — our signature specialty.',
    services: [
      {
        name: 'Signature Head Spa',
        id: 's:20874427',
        priceLabel: 'from $85',
        duration: '60–90 min',
        description: 'Scalp revival — cleansing, therapeutic scalp massage, and nourishing treatment that restores calm.',
        highlights: ['Halo water-ring waterfall rinse', 'Warm botanical steam & scalp exfoliation', 'Acupressure on scalp, neck & shoulders', 'Argan oil infusion & keratin conditioning'],
        idealFor: 'Scalp dryness or buildup, tension headaches, insomnia, screen eye strain, and mental fatigue.',
        whatToExpect: 'Recline in our custom head spa basin while warm mist opens follicles. Enjoy gentle exfoliation, clarifying shampoo, nourishing keratin conditioner, neck massage, and the mesmerizing halo waterfall rinse.',
        articleSlug: 'head-spa-scalp-therapy-benefits',
      },
      {
        name: 'Signature Head Spa & Body Massage',
        id: 's:20874453',
        priceLabel: 'from $125',
        duration: '90–120 min',
        description: 'Our full scalp revival ritual paired with a customized body massage.',
        highlights: ['Full signature head spa basin treatment', 'Custom full-body therapeutic massage', 'Includes soothing hot stone therapy', 'The ultimate top-to-toe reset'],
        idealFor: 'Anyone wanting the complete Forest Spa experience — deep muscular relief combined with scalp serenity.',
        whatToExpect: 'Begin with or transition between our signature scalp revival ritual and a tailored body massage with warm basalt stones and calming aromatherapy for total renewal.',
        articleSlug: 'head-spa-scalp-therapy-benefits',
      },
      {
        name: 'Headache Relief Add-on',
        id: 's:21174593',
        priceLabel: '$25',
        duration: '15 min',
        description: 'Acupressure, targeted pressure points, and pain-relieving serum to ease headaches.',
        highlights: ['Occipital ridge & temple acupressure', 'Cooling botanical pain-relief serum', 'Releases neck and temple tension', '15 minutes of focused cranial work'],
        idealFor: 'Migraine-prone individuals, tension headaches, and long days under fluorescent office lights.',
        whatToExpect: 'Targeted fingertip pressure along the temples, forehead, and base of the skull, paired with cooling herbal balm to relieve head and neck pressure.',
        articleSlug: 'tmj-jaw-tension-relief',
      },
      {
        name: 'TMJ Pain Relief Add-On',
        id: 's:21174605',
        priceLabel: 'from $30',
        duration: '15–30 min',
        description: 'Head & scalp, jaw, and neck & shoulder massage with pain-relieving ointment or Tiger Balm and a soothing eye mask.',
        highlights: ['Masseter & temporalis jaw muscle release', 'Soothing weighted eye mask included', 'Relieves teeth clenching & jaw clicking', 'Includes Tiger Balm or pain-relieving ointment'],
        idealFor: 'Nighttime teeth grinders, stress clenchers, jaw stiffness, and facial tension sufferers.',
        whatToExpect: 'Specific neuromuscular trigger point release along the masseter, temporalis, cheekbones, and upper neck, paired with a soothing eye mask and therapeutic balm.',
        articleSlug: 'tmj-jaw-tension-relief',
      },
    ],
  },
  {
    id: 'add-ons',
    label: 'Add-ons',
    icon: 'Flower2',
    blurb: 'Enhance any massage with a finishing touch. Each add-on comes two ways — woven into your massage at no extra time, or booked on its own with its own time (for $10 more).',
    services: [
      {
        name: 'Hot Stone',
        id: 's:20891732',
        priceLabel: '$20',
        inSessionPrice: '$10',
        duration: '15 min',
        description: 'Soothing warmth that melts away tension and eases muscle stiffness.',
        highlights: ['Smooth heated volcanic basalt stones', 'Deep heat penetration softens fascia', 'Accelerates muscle release without pain'],
        idealFor: 'Deep muscle stiffness, winter chills, arthritis, and relaxing stubborn back tightness.',
        whatToExpect: 'Heated basalt stones are glided smoothly over tight muscles, warming the tissues so therapists can work deeper with greater comfort.',
      },
      {
        name: 'Cupping',
        id: 's:20891771',
        priceLabel: '$25',
        inSessionPrice: '$15',
        duration: '15 min',
        description: 'Suction therapy that relieves tightness, boosts circulation, and promotes healing.',
        highlights: ['Decompressive negative pressure suction', 'Draws fresh oxygenated blood to tissues', 'Releases stubborn myofascial adhesions'],
        idealFor: 'Athletic recovery, tight upper back/traps, stagnant knots, and chronic stiffness.',
        whatToExpect: 'Specialized cups create gentle suction over tight back muscles, loosening rigid fascia. Temporary harmless circular marks may appear for several days as stagnation clears.',
      },
      {
        name: 'Aromatherapy',
        id: 's:20891784',
        priceLabel: '$20',
        inSessionPrice: '$10',
        duration: '15 min',
        description: 'Essential oils woven into your session to calm the mind and elevate the senses.',
        highlights: ['100% pure therapeutic grade essential oils', 'Choice of calming lavender, eucalyptus or citrus', 'Inhaled & absorbed during massage'],
        idealFor: 'Anxiety, insomnia, mental chatter, respiratory openness, and multi-sensory grounding.',
        whatToExpect: 'Natural essential plant oils blended directly into your massage oil and diffused into the room to soothe the nervous system via olfactory pathways.',
      },
      {
        name: 'Head & TMJ Pain Relief Add-On',
        id: 's:20888524',
        priceLabel: 'from $30',
        duration: '15–30 min',
        description: 'Head & scalp, jaw, and neck & shoulder massage with pain-relieving ointment or Tiger Balm and a soothing eye mask.',
        highlights: ['Targeted jaw, temple & scalp trigger work', 'Includes cooling Tiger Balm or pain ointment', 'Calming eye mask included'],
        idealFor: 'Jaw clenching, teeth grinding, screen fatigue, and tension headaches.',
        whatToExpect: 'Neuromuscular work focusing on the jaw, neck, and scalp accompanied by herbal balm and a soothing eye mask for immediate tension relief.',
        articleSlug: 'tmj-jaw-tension-relief',
      },
      {
        name: 'Stretch',
        id: 's:20891783',
        priceLabel: '$20',
        inSessionPrice: '$10',
        duration: '15 min',
        description: 'Guided assisted stretching to improve flexibility, mobility, and release.',
        highlights: ['Assisted passive stretching techniques', 'Lengthens hamstrings, glutes & lower back', 'Increases synovial joint mobility'],
        idealFor: 'Runners, golfers, desk sitters, and anyone feeling compressed or inflexible.',
        whatToExpect: 'Your therapist gently takes your limbs through assisted passive stretches while your muscles remain fully relaxed, lengthening tight fibers.',
      },
      {
        name: 'Foot Exfoliation',
        id: 's:20891750',
        priceLabel: '$20',
        inSessionPrice: '$10',
        duration: '15 min',
        description: 'Exfoliation and scrub that softens skin, relieves tension, and restores moisture.',
        highlights: ['Natural botanical scrub granules', 'Buffs away rough dry skin & calluses', 'Deeply hydrating foot care finish'],
        idealFor: 'Tired, dry feet, sandal season, and soothing overworked soles.',
        whatToExpect: 'A gentle exfoliating scrub massaged into heels and soles, removing dry patches and stimulating nerve endings, followed by nourishing hydration.',
      },
      {
        name: 'Back Exfoliation',
        id: 's:20891751',
        priceLabel: '$25',
        inSessionPrice: '$15',
        duration: '15 min',
        description: 'Exfoliation and scrub to release tension and smooth the skin on your back.',
        highlights: ['Fine exfoliating sugar or salt scrub', 'Unclogs pores & stimulates dermal circulation', 'Leaves skin remarkably soft & glowing'],
        idealFor: 'Back acne prevention, seasonal skin renewal, and smoothing rough texture.',
        whatToExpect: 'An invigorating scrub buffed evenly across the back, gently removed and followed by rich moisturizing body oils.',
      },
      {
        name: 'Hand Exfoliation',
        id: 's:21012158',
        priceLabel: '$20',
        inSessionPrice: '$10',
        duration: '15 min',
        description: 'A nourishing cream buffs away dryness for soft, renewed hands.',
        highlights: ['Gentle buffing for weathered hands', 'Restores cutaneous moisture barrier', 'Includes soothing palm & finger massage'],
        idealFor: 'Dry, overwashed hands, gardeners, cooks, and keyboard users.',
        whatToExpect: 'A nourishing exfoliating polish massaged through fingers, palms, and cuticles, followed by restorative moisture.',
      },
      {
        name: 'Hand Mask',
        id: 's:20891745',
        priceLabel: '$25',
        inSessionPrice: '$15',
        duration: '15 min',
        description: 'A hydrating, rejuvenating mask that leaves hands silky and refreshed.',
        highlights: ['Intensive collagen & shea butter hydration', 'Penetrates deeply during your massage', 'Soothes cracked, fatigued hands'],
        idealFor: 'Mature skin, dry California weather, and hands needing deep nourishing therapy.',
        whatToExpect: 'Hydrating therapeutic treatment gloves slipped on during your body massage, locking in rich botanicals for silky smooth skin.',
      },
      {
        name: 'Jade Cooling Eye Mask',
        id: 's:20891794',
        priceLabel: '$20',
        inSessionPrice: '$10',
        duration: '15 min',
        description: 'A cooling jade mask to reduce puffiness and soothe tired eyes.',
        highlights: ['Natural polished gemstone coolness', 'Gentle weighted acupressure over eyes', 'Relieves sinus pressure & digital eye strain'],
        idealFor: 'Computer screen fatigue, puffy eyes, sinus congestion, and headache relief.',
        whatToExpect: 'A woven natural jade stone mask resting comfortably over your eyes, delivering immediate cooling relief to orbital capillaries.',
      },
      {
        name: 'Pain Relief Ointment',
        id: 's:20891789',
        priceLabel: '$20',
        inSessionPrice: '$10',
        duration: '15 min',
        description: 'A fast-acting formula that eases muscle soreness and joint stiffness.',
        highlights: ['Menthol, camphor & botanical herbal extracts', 'Creates dual cooling & warming sensation', 'Targeted application on stubborn knots'],
        idealFor: 'Acute muscle spasms, stiff neck, lower back ache, and joint discomfort.',
        whatToExpect: 'A therapeutic liniment worked deeply into problem areas, penetrating deep into muscle fibers to block pain signals and ease stiffness.',
      },
      {
        name: 'Herbal Detox Heat Pad',
        id: '',
        url: 'https://www.fresha.com/book-now/forest-spa-kbi5ew52/services?lid=2689228&oiid=sv%3A28584824&share=true&pId=2602780',
        priceLabel: '$15',
        duration: null,
        description: 'A soothing blend of mugwort (traditional warming herb) and minerals, heated to melt away toxins and boost circulation.',
        highlights: ['Natural mugwort (Aiye) botanical compress', 'Infused with therapeutic heat minerals', 'Relieves core bloating, cramps & cold abdomen'],
        idealFor: 'Digestive sluggishness, menstrual cramp relief, cold hands/feet, and deep core tension.',
        whatToExpect: 'A heated herbal mineral pack placed gently over your abdomen or lower back during bodywork, radiating continuous soothing warmth to relieve tension and cramps.',
        articleSlug: 'botanical-heat-abdominal-wellness',
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Memberships                                                               */
/* -------------------------------------------------------------------------- */

export const membershipIntro = {
  eyebrow: 'Membership',
  title: 'Relax Monthly — Your Membership Covers Itself',
  description:
    'Our members turn self-care into a habit and let their monthly massage more than pay for the membership. Start today and feel the difference from day one.',
} as const;

export const memberships: Membership[] = [
  {
    name: 'Membership',
    price: '$68',
    cadence: '/ month',
    tagline: 'Your membership covers it',
    description:
      'Your first 60-minute massage each month is completely free — so your membership pays for itself, and every other perk is a bonus.',
    perks: [
      'One free 60-min massage every month',
      'Member pricing on additional services',
      'Priority booking & rollover of unused visits',
      'Cancel anytime',
    ],
    joinUrl:
      'https://www.fresha.com/a/forest-spa-poway-14168-poway-road-msk4ljro/paid-plans/details?pId=2602780',
  },
  {
    name: 'Membership Plus',
    price: '$98',
    cadence: '/ month',
    tagline: 'Your monthly dose of luxury',
    description:
      'Enjoy a luxurious 90-minute massage each month for just $98 — a $115 value — plus every member benefit at no extra cost.',
    perks: [
      'One 90-min massage every month ($115 value)',
      'All standard member benefits',
      'Best per-minute value we offer',
      'Cancel anytime',
    ],
    joinUrl:
      'https://www.fresha.com/a/forest-spa-poway-14168-poway-road-msk4ljro/paid-plans/details?menu=true&pId=2602780&selected=3172024&share=true&skipFirstStep=true',
    featured: true,
  },
];

/* -------------------------------------------------------------------------- */
/*  Head Spa feature                                                          */
/* -------------------------------------------------------------------------- */

export const headSpa = {
  eyebrow: 'Signature Head Spa',
  title: 'Refresh Your Mind With Our Signature Head Spa',
  intro:
    'Daily stress, tension, and product buildup often collect around the scalp, temples, and neck. Our signature head spa therapies combine gentle exfoliation, botanical steam, and soothing acupressure with our warm waterfall halo rinse to leave your hair nourished and your mind completely refreshed.',
  benefits: [
    'Relieves tight muscles across the scalp, temples, and neck',
    'Cleanses and exfoliates buildup for a healthier scalp environment',
    'Gentle acupressure promotes healthy circulation',
    'Deep conditioning steam softens hair and restores hydration',
    'Warm waterfall halo rinse creates a deeply relaxing sensory reset',
  ],
  closer: 'Smart scalp care paired with head-to-toe relaxation.',
  services: [
    {
      name: 'The Signature Head Spa',
      id: 's:20874427',
      priceLabel: 'from $85',
      duration: '60–90 min',
      description:
        'A relaxing head, neck & shoulder massage, deep-cleansing scalp exfoliation, nourishing treatment, keratin conditioner with steam, and a soothing halo water-ring rinse.',
    },
    {
      name: 'Signature Head Spa & Body Massage',
      id: 's:20874453',
      priceLabel: 'from $125',
      duration: '90–120 min',
      description:
        'Our full scalp revival ritual paired with a customized full-body massage and warm hot-stone therapy — a complete head-to-body reset.',
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*  Brand story + amenities                                                   */
/* -------------------------------------------------------------------------- */

export const story = {
  eyebrow: 'Our Sanctuary',
  title: 'A Peaceful Retreat In The Heart Of Poway',
  paragraphs: [
    'Forest Spa was created as a peaceful, nature-inspired sanctuary where the rush of the outside world falls away the moment you step inside.',
    'Our licensed therapists tailor every massage and scalp session to your unique comfort and tension levels. We believe high-quality, restorative bodywork should be accessible, personal, and genuinely rejuvenating.',
  ],
} as const;

export const amenities = [
  { icon: 'CircleParking', title: 'Free Parking', description: 'Complimentary on-site and street parking, every visit.' },
  { icon: 'Users', title: 'Couples Suite', description: 'A private room for two — perfect for a shared escape.' },
  { icon: 'Clock', title: 'Open 7 Days', description: 'Morning to night, 9:00 AM – 9:00 PM, every day of the week.' },
] as const;

/* -------------------------------------------------------------------------- */
/*  Testimonials (authentic only — never fabricate). Add real 5-star reviews  */
/*  here (Google / Fresha). Keep them free of individual therapist names.     */
/* -------------------------------------------------------------------------- */

export interface Testimonial {
  quote: string;
  author: string;
  source?: string;
  rating?: number;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      'A hidden gem of relaxation! My husband and I had an incredible experience at Forest Spa. From the moment we walked in, we felt completely at ease — a small, quiet, and beautifully clean space that instantly calms you. Our massage was absolutely amazing… so relaxing that I actually fell asleep!',
    author: 'Sam T.',
    source: 'Local Guide · Google',
    rating: 5,
  },
  {
    quote:
      'Forest Spa is amazing. I started coming here during my pregnancy and got multiple prenatal massages — it was the only thing that gave my body relief. Now I come postpartum too. The packages are a great price and the variety of services is endless. My husband also came in for cupping and really enjoyed it.',
    author: 'Sierra G.',
    source: 'Google',
    rating: 5,
  },
  {
    quote:
      'My husband and I got the Scalp Revival and Body Massage package and it was amazing. The body massage had the perfect amount of pressure. The scalp revival gently scrubbed our scalps, and the conditioner with steam left our hair super soft. Totally worth the price — we will be back.',
    author: 'Sofia K.',
    source: 'Local Guide · Google',
    rating: 5,
  },
  {
    quote:
      'I had my first prenatal massage here and it was the greatest experience I’ve had in a while. I had some hip pain on my right side and instantly felt relief afterward. Definitely coming back during my pregnancy.',
    author: 'Helena Y.',
    source: 'Local Guide · Google',
    rating: 5,
  },
  {
    quote:
      'Hands down one of the best massages I’ve ever had — definitely top 5! The deep tissue work was incredible, and the TMJ massage was exactly what I needed. Really got into the knots and tension. Definitely coming back!',
    author: 'Tea S.',
    source: 'Google',
    rating: 5,
  },
];

/* -------------------------------------------------------------------------- */
/*  SEO defaults                                                              */
/* -------------------------------------------------------------------------- */

export const seo = {
  title: 'Forest Spa | Best Massage & Head Spa In Poway, San Diego',
  description:
    'Experience the best massage therapy in Poway, San Diego at Forest Spa. Restorative massage, specialized head spa therapies, packages, and memberships to rejuvenate your mind, body & soul.',
  ogImage: '/og-image.jpg',
  keywords: [
    'massage Poway',
    'head spa Poway',
    'massage San Diego',
    'scalp treatment Poway',
    'deep tissue massage Poway',
    'couples massage Poway',
    'massage packages Poway',
    'massage membership Poway',
    'day spa Poway',
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*  Terms & Conditions / Privacy Policy (migrated from the Wix site)          */
/* -------------------------------------------------------------------------- */

export const legal = {
  title: 'Terms & Conditions',
  intro:
    'Protecting your personal information is our top priority. This Privacy Policy governs data collection and usage for Forest Spa and its website. Unless otherwise stated, all references to Forest Spa include this website. By using the Forest Spa website, you consent to the practices outlined in this policy.',
  sections: [
    {
      heading: 'Collection Of Personal Information',
      body: 'To better serve you, Forest Spa may collect personally identifiable information — including but not limited to your first and last name, email address, and phone number. We only collect personal information when it is voluntarily provided by you, such as when you submit payment details for a purchase. Your information is used primarily to communicate with you about requested services.',
    },
    {
      heading: 'Use Of Personal Information',
      body: 'Forest Spa uses your personal information to operate and deliver requested services, and to inform you of other products or offerings from Forest Spa and its affiliates.',
    },
    {
      heading: 'Sharing Information With Third Parties',
      body: 'Forest Spa does not sell, rent, or lease customer lists. We may share data with trusted partners for service delivery; these parties are contractually obligated to maintain confidentiality and may only use your data to provide services to Forest Spa. We may disclose personal information if legally required or to help ensure user and public safety.',
    },
    {
      heading: 'Automatically Collected Information',
      body: 'Technical data such as your IP address, browser type, domain names, access times, and referring websites may be collected automatically. This information helps us maintain service quality and analyze site usage.',
    },
    {
      heading: 'Use Of Cookies',
      body: 'The Forest Spa website uses cookies to enhance your experience. Cookies are small text files stored on your device that streamline processes like billing or registration. You may adjust your browser settings to decline cookies, though some features may be limited.',
    },
    {
      heading: 'External Links',
      body: 'Our site may link to third-party websites. Forest Spa is not responsible for their content or privacy practices. We encourage you to review the privacy policies of any external sites you visit.',
    },
    {
      heading: 'Right To Deletion',
      body: 'Upon a verified request, we will delete your personal information unless retention is necessary to enable internal uses reasonably aligned with your expectations or to comply with a legal obligation.',
    },
    {
      heading: 'Children Under Thirteen',
      body: 'Forest Spa does not knowingly collect information from children under 13. Minors must obtain parental consent before using this site.',
    },
    {
      heading: 'Email Communications',
      body: 'You may receive emails from us for announcements, promotions, surveys, or updates. To unsubscribe, click the UNSUBSCRIBE link in any email.',
    },
    {
      heading: 'Policy Changes',
      body: 'Forest Spa reserves the right to update this policy. Significant changes will be communicated via email or a notice on our website. Continued use of our services constitutes acceptance of any modifications.',
    },
    {
      heading: 'Contact Us',
      body: 'For questions or concerns regarding this policy, please contact us at forestspa206@gmail.com.',
    },
  ],
} as const;
