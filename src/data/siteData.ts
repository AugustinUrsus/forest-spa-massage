/**
 * Forest Spa — single source of truth for site content.
 *
 * Service catalog, packages, monthly special, and memberships mirror the live
 * Fresha menu (venue slug `forest-spa-poway-14168-poway-road-msk4ljro`,
 * pId 2602780). Every booking link deep-links to the exact item via its Fresha
 * offer id, e.g. `s:20891732` (Hot Stone) → …/booking?offerItemId=s:20891732.
 *
 * ── To update the MONTHLY SPECIAL each month: edit the `monthlySpecial` object
 *    below (name, price, value, duration, inclusions, and the Fresha `id`).
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
  headline: 'Experience the best massage therapy in Poway, San Diego.',
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

export const navLinks: NavLink[] = [
  { label: 'Services', href: `${baseUrl}#services` },
  { label: 'Packages', href: `${baseUrl}#packages` },
  { label: 'Monthly Special', href: `${baseUrl}#specials` },
  { label: 'Head Spa', href: `${baseUrl}#head-spa` },
  { label: 'Membership', href: `${baseUrl}#membership` },
  { label: 'Gift Cards', href: `${baseUrl}#gift-cards` },
  { label: 'Directions', href: `${baseUrl}#location` },
];

/* -------------------------------------------------------------------------- */
/*  Monthly Special — THE headline offer. Update this each month.             */
/* -------------------------------------------------------------------------- */

export const monthlySpecial = {
  /** Short month label shown in the eyebrow, e.g. "July". */
  month: 'This Month',
  headline: 'The Monthly Special',
  name: 'Stone & Scent Combo · Premier',
  id: 's:24804390',
  price: 120,
  value: 150,
  duration: '90 min',
  summary:
    'Our most-loved seasonal escape — a full-body ritual of massage, warm stones, foot reflexology, and aromatherapy at a limited-time price.',
  inclusions: [
    '60-min body massage — Swedish, Sports, Thai, Deep Tissue, or Lomi Lomi',
    '30-min foot reflexology with scrub',
    'Warm hot stones',
    'Aromatherapy / essential oil',
  ],
} as const;

/** Standing offers that run alongside the monthly special. */
export const standingOffers = [
  {
    icon: 'Coins',
    title: 'Cash Discount at Checkout',
    description: 'Pay with cash and enjoy a free hot stone or essential oil add-on with your service.',
    id: 's:22810448',
  },
  {
    icon: 'Sunrise',
    title: 'Early Bird — 10% Off',
    description: 'Mon–Thu before 11:30 am. Cannot be combined with other promotions.',
    id: 's:22684381',
  },
  {
    icon: 'Users',
    title: '10% Off Couple Sessions',
    description: 'Share the calm — book any session for two and save together.',
    id: 'p:1651755',
  },
] as const;

/* -------------------------------------------------------------------------- */
/*  Packages (combos with tiers) — the signature value offering               */
/* -------------------------------------------------------------------------- */

export const packages: Package[] = [
  {
    name: 'Head-to-Toe Retreat',
    icon: 'Sparkles',
    blurb: 'Our most complete escape — full-body massage plus scalp, hand, and foot rituals.',
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
          '20-min foot massage with foot scrub',
          '10-min stretching',
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
    name: 'Signature Head Spa & Body',
    icon: 'Droplets',
    blurb: 'Our signature scalp revival paired with a customized body massage.',
    tiers: [
      {
        tier: 'Signature',
        id: 's:20891638',
        price: 125,
        value: 185,
        duration: '90–120 min',
        inclusions: [
          'Relaxing head, neck & shoulder massage',
          'Scalp exfoliation & nourishing cleanse',
          'Keratin-infused conditioner + halo water ring treatment',
          'Steam therapy with optional herbal treatment',
          'Argan-oil scalp care & calming aromatherapy',
          'Customized body massage with hot stone therapy',
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
          'Essential oil',
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
          'Essential oil',
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
      { name: 'Swedish Massage', id: 's:20874160', priceLabel: 'from $75', duration: '60–120 min', description: 'Gentle, flowing strokes that relax muscles, improve circulation, and melt away stress.' },
      { name: 'Deep Tissue Massage', id: 's:20874167', priceLabel: 'from $80', duration: '60–120 min', description: 'Firm, deliberate pressure that reaches deeper muscle to relieve chronic tension.' },
      { name: 'Sports Massage', id: 's:20874176', priceLabel: 'from $75', duration: '60–120 min', description: 'Targeted techniques that boost flexibility, circulation, and muscle recovery.' },
      { name: 'Thai Massage', id: 's:20874194', priceLabel: 'from $80', duration: '60–90 min', description: 'Acupressure, assisted stretches, and rhythmic compression to restore energy flow.' },
      { name: 'Prenatal Massage', id: 's:20874198', priceLabel: 'from $80', duration: '60–90 min', description: 'Gentle, soothing relief thoughtfully tailored to the comfort of expecting mothers.' },
      { name: 'Lomi Lomi Massage', id: 's:20874314', priceLabel: 'from $80', duration: '60–90 min', description: 'Rooted in Hawaiian tradition — rhythmic, flowing strokes that embrace and heal.' },
      { name: 'Lymphatic Massage', id: 's:20986382', priceLabel: 'from $80', duration: '60–90 min', description: 'Gentle drainage that reduces swelling and encourages the body to release trapped fluid.' },
      { name: 'Foot Massage', id: 's:20874333', priceLabel: 'from $60', duration: '60–90 min', description: 'Relieves tension, improves circulation, and refreshes you from the ground up.' },
      { name: 'Upper Body Massage', id: 's:20874242', priceLabel: 'from $80', duration: '60–120 min', description: 'Focused relief for tight shoulders, neck stiffness, and upper-back discomfort.' },
      { name: 'Couples Massage · 60 min', id: 'p:1651755', priceLabel: '$140', duration: '60 min', description: 'Unwind side by side with your partner in a serene, shared setting.' },
      { name: 'Couples Massage · 90 min', id: 'p:1651756', priceLabel: '$210', duration: '90 min', description: 'A longer, intimate escape for two — relaxation shared and doubled.' },
      { name: 'Four Hands Massage · 60 min', id: 'p:1739449', priceLabel: '$140', duration: '60 min', description: 'Two skilled therapists in perfect sync for an immersive, deeply restorative escape.' },
      { name: 'Four Hands Massage · 90 min', id: 'p:1739449', priceLabel: '$210', duration: '90 min', description: 'A longer four-hands session — two therapists moving in harmony for total surrender.', url: 'https://www.fresha.com/a/forest-spa-poway-14168-poway-road-msk4ljro/booking?allOffer=true&pId=2602780&cartId=59721975-9437-4504-a094-0bbf72d7e5d6' },
    ],
  },
  {
    id: 'head-spa',
    label: 'Head Spa',
    icon: 'Droplets',
    blurb: 'A full reset for your scalp and nervous system — our signature specialty.',
    services: [
      { name: 'Signature Head Spa', id: 's:20874427', priceLabel: 'from $85', duration: '60–90 min', description: 'Scalp revival — cleansing, therapeutic scalp massage, and nourishing treatment that restores calm.' },
      { name: 'Signature Head Spa & Body Massage', id: 's:20874453', priceLabel: 'from $125', duration: '90–120 min', description: 'Our full scalp revival ritual paired with a customized body massage.' },
      { name: 'Headache Relief Add-on', id: 's:21174593', priceLabel: '$25', duration: '15 min', description: 'Acupressure, targeted pressure points, and pain-relieving serum to ease headaches.' },
      { name: 'TMJ Pain Relief Add-On', id: 's:21174605', priceLabel: 'from $30', duration: '15–30 min', description: 'Head & scalp, jaw, and neck & shoulder massage with pain-relieving ointment or Tiger Balm and a soothing eye mask.' },
    ],
  },
  {
    id: 'add-ons',
    label: 'Add-ons',
    icon: 'Flower2',
    blurb: 'Enhance any massage with a finishing touch — most are woven into your session at no extra time. Standalone booking times are shown below.',
    services: [
      { name: 'Hot Stone', id: 's:20891732', priceLabel: '$20', duration: '15 min', description: 'Soothing warmth that melts away tension and eases muscle stiffness.' },
      { name: 'Cupping', id: 's:20891771', priceLabel: '$25', duration: '15 min', description: 'Suction therapy that relieves tightness, boosts circulation, and promotes healing.' },
      { name: 'Aromatherapy', id: 's:20891784', priceLabel: '$20', duration: '15 min', description: 'Essential oils woven into your session to calm the mind and elevate the senses.' },
      { name: 'Head & TMJ Pain Relief Add-On', id: 's:20888524', priceLabel: 'from $30', duration: '15–30 min', description: 'Head & scalp, jaw, and neck & shoulder massage with pain-relieving ointment or Tiger Balm and a soothing eye mask.' },
      { name: 'Stretch', id: 's:20891783', priceLabel: '$20', duration: '15 min', description: 'Guided assisted stretching to improve flexibility, mobility, and release.' },
      { name: 'Foot Exfoliation', id: 's:20891750', priceLabel: '$20', duration: '15 min', description: 'Exfoliation and scrub that softens skin, relieves tension, and restores moisture.' },
      { name: 'Back Exfoliation', id: 's:20891751', priceLabel: '$25', duration: '15 min', description: 'Exfoliation and scrub to release tension and smooth the skin on your back.' },
      { name: 'Hand Exfoliation', id: 's:21012158', priceLabel: '$20', duration: '15 min', description: 'A nourishing cream buffs away dryness for soft, renewed hands.' },
      { name: 'Hand Mask', id: 's:20891745', priceLabel: '$25', duration: '15 min', description: 'A hydrating, rejuvenating mask that leaves hands silky and refreshed.' },
      { name: 'Jade Cooling Eye Mask', id: 's:20891794', priceLabel: '$20', duration: '15 min', description: 'A cooling jade mask to reduce puffiness and soothe tired eyes.' },
      { name: 'Pain Relief Ointment', id: 's:20891789', priceLabel: '$20', duration: '15 min', description: 'A fast-acting formula that eases muscle soreness and joint stiffness.' },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Memberships                                                               */
/* -------------------------------------------------------------------------- */

export const membershipIntro = {
  eyebrow: 'Membership',
  title: 'Relax monthly — your membership covers itself',
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
  title: 'Refresh your mind with our signature Head Spa',
  intro:
    'Your scalp works harder than you think. Daily stress, pollution, and product buildup lead to tension, dryness, and lackluster hair. Our head spa treatments go beyond basic massage — they are a full reset for your scalp and nervous system.',
  benefits: [
    'Relieves tension in scalp muscles — a major source of headaches',
    'Detoxifies pores to prevent irritation and thinning',
    'Boosts circulation for healthier hair growth',
    'Restores moisture balance without weighing hair down',
    'Induces deep calm through rhythmic massage techniques',
  ],
  closer: 'It’s not just self-care — it’s smart hair care with instant relaxation benefits.',
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
  title: 'A biophilic retreat in the heart of Poway',
  paragraphs: [
    'Forest Spa was created as an oasis of biophilic healing — a warm, nature-inspired space where the pace of the outside world falls away the moment you step inside.',
    'Our skilled therapists tailor every session to your unique wellness needs, bringing you the luxury of true relaxation without the luxury price tag. Discover the art of healing in our serene retreat, and let nature and nurture work their magic.',
  ],
} as const;

export const amenities = [
  { icon: 'CircleParking', title: 'Free Parking', description: 'Complimentary on-site and street parking, every visit.' },
  { icon: 'HeartHandshake', title: 'LGBTQ-Friendly', description: 'An inclusive, transgender-safe space where everyone is welcome.' },
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
  title: 'Forest Spa | Best Massage & Head Spa in Poway, San Diego',
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
      heading: 'Collection of Personal Information',
      body: 'To better serve you, Forest Spa may collect personally identifiable information — including but not limited to your first and last name, email address, and phone number. We only collect personal information when it is voluntarily provided by you, such as when you submit payment details for a purchase. Your information is used primarily to communicate with you about requested services.',
    },
    {
      heading: 'Use of Personal Information',
      body: 'Forest Spa uses your personal information to operate and deliver requested services, and to inform you of other products or offerings from Forest Spa and its affiliates.',
    },
    {
      heading: 'Sharing Information with Third Parties',
      body: 'Forest Spa does not sell, rent, or lease customer lists. We may share data with trusted partners for service delivery; these parties are contractually obligated to maintain confidentiality and may only use your data to provide services to Forest Spa. We may disclose personal information if legally required or to help ensure user and public safety.',
    },
    {
      heading: 'Automatically Collected Information',
      body: 'Technical data such as your IP address, browser type, domain names, access times, and referring websites may be collected automatically. This information helps us maintain service quality and analyze site usage.',
    },
    {
      heading: 'Use of Cookies',
      body: 'The Forest Spa website uses cookies to enhance your experience. Cookies are small text files stored on your device that streamline processes like billing or registration. You may adjust your browser settings to decline cookies, though some features may be limited.',
    },
    {
      heading: 'External Links',
      body: 'Our site may link to third-party websites. Forest Spa is not responsible for their content or privacy practices. We encourage you to review the privacy policies of any external sites you visit.',
    },
    {
      heading: 'Right to Deletion',
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
