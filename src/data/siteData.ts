/**
 * Forest Spa — single source of truth for site content.
 *
 * Everything a non-developer might want to edit (copy, services, hours,
 * booking links, analytics IDs) lives here. Components import from this file;
 * nothing is hard-coded in markup.
 */

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface NavLink {
  label: string;
  href: string;
}

/** Icon names map to lucide-react components (see ServiceTabs / icon maps). */
export interface Service {
  name: string;
  description: string;
  icon: string;
  /** Optional Fresha deep link; falls back to the services booking URL. */
  bookUrl?: string;
}

export interface ServiceCategory {
  id: string;
  label: string;
  blurb: string;
  services: Service[];
}

export interface Promotion {
  icon: string;
  title: string;
  description: string;
}

export interface Amenity {
  icon: string;
  title: string;
  description: string;
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

  /** Uniform daily hours — Mon through Sun, 9:00 AM to 9:00 PM. */
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
/*  Booking (Fresha)                                                          */
/* -------------------------------------------------------------------------- */

export const booking = {
  /** Primary "Book Now" destination — all offers. */
  primary:
    'https://www.fresha.com/book-now/forest-spa-kbi5ew52/all-offer?share=true&pId=2602780',
  /** Service picker — used by per-service "Book this service" buttons. */
  services: 'https://www.fresha.com/book-now/forest-spa-kbi5ew52/services?share=true&pId=2602780',
  /** Gift cards. */
  giftCards:
    'https://www.fresha.com/book-now/forest-spa-kbi5ew52/gift-cards?share=true&pId=2602780',
} as const;

/** Google Maps directions + keyless embed for the location section. */
export const maps = {
  directions:
    'https://www.google.com/maps/dir/?api=1&destination=Forest+Spa+14168+Poway+Rd+Ste+206+Poway+CA+92064',
  embed:
    'https://www.google.com/maps?q=Forest%20Spa%2C%2014168%20Poway%20Rd%20Ste%20206%2C%20Poway%2C%20CA%2092064&output=embed',
} as const;

/* -------------------------------------------------------------------------- */
/*  Analytics — populated from env at build time (PUBLIC_ vars are inlined).  */
/*  Leave unset to disable; the tags simply won't render.                     */
/* -------------------------------------------------------------------------- */

export const analytics = {
  ga4Id: import.meta.env.PUBLIC_GA4_ID ?? '',
  metaPixelId: import.meta.env.PUBLIC_META_PIXEL_ID ?? '',
  /** Google Ads conversion ID, e.g. "AW-123456789". */
  googleAdsId: import.meta.env.PUBLIC_GOOGLE_ADS_ID ?? '',
  /** Google Ads "book" conversion label (the part after the slash in send_to). */
  adsBookingLabel: import.meta.env.PUBLIC_GOOGLE_ADS_BOOKING_LABEL ?? '',
} as const;

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                */
/* -------------------------------------------------------------------------- */

export const navLinks: NavLink[] = [
  { label: 'Services', href: '#services' },
  { label: 'Head Spa', href: '#head-spa' },
  { label: 'Specials', href: '#specials' },
  { label: 'Story', href: '#story' },
  { label: 'Location', href: '#location' },
];

/* -------------------------------------------------------------------------- */
/*  Promotions & offers                                                       */
/* -------------------------------------------------------------------------- */

export const promotions: Promotion[] = [
  {
    icon: 'Users',
    title: '10% OFF Couple Sessions',
    description: 'Share the calm — book any session for two and save together.',
  },
  {
    icon: 'BadgeDollarSign',
    title: 'Cash Discount at Checkout',
    description: 'Prefer to pay with cash? Enjoy a special discount in-studio.',
  },
];

/* -------------------------------------------------------------------------- */
/*  Services (grouped into three tabs)                                        */
/* -------------------------------------------------------------------------- */

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'signature',
    label: 'Signature Treatments',
    blurb: 'Our most distinctive therapies — designed for a deeper kind of reset.',
    services: [
      {
        name: 'Head Spa & Scalp Therapy',
        icon: 'Droplets',
        description:
          'A full reset for your scalp and nervous system — deep cleansing, therapeutic scalp massage, and nourishing treatment that relieves tension, boosts circulation, and restores calm.',
      },
      {
        name: 'TMJ Therapy',
        icon: 'Waves',
        description:
          'Targeted release for jaw tension, clenching, and the headaches they cause, through precise facial and cranial work.',
      },
      {
        name: 'Four Hands Massage',
        icon: 'HeartHandshake',
        description:
          'Two therapists moving in perfect synchrony — an immersive, deeply restorative escape for total surrender.',
      },
    ],
  },
  {
    id: 'massage',
    label: 'Massage Therapies',
    blurb: 'Every session is tailored to your body, from gentle relief to deep therapeutic work.',
    services: [
      {
        name: 'Deep Tissue Massage',
        icon: 'Activity',
        description:
          'Firm, focused pressure that unwinds chronic knots and stubborn muscle tension.',
      },
      {
        name: 'Swedish Massage',
        icon: 'Leaf',
        description:
          'Long, flowing strokes that melt away stress and leave the whole body at ease.',
      },
      {
        name: 'Thai Massage',
        icon: 'Wind',
        description:
          'Assisted stretching and rhythmic pressure to restore flexibility and energy flow.',
      },
      {
        name: 'Sports Massage',
        icon: 'Dumbbell',
        description:
          'Performance-focused work to speed recovery, prevent injury, and loosen tight muscle groups.',
      },
      {
        name: 'Prenatal Massage',
        icon: 'Baby',
        description:
          'Gentle, nurturing care thoughtfully tailored to the comfort of expecting mothers.',
      },
      {
        name: 'Reflexology',
        icon: 'Footprints',
        description:
          'Precise pressure-point work on the feet to relieve tension and rebalance the whole body.',
      },
    ],
  },
  {
    id: 'wellness',
    label: 'Add-ons & Wellness',
    blurb: 'Elevate any treatment with a restorative finishing touch.',
    services: [
      {
        name: 'Aromatherapy',
        icon: 'Flower2',
        description:
          'Botanical essential oils woven into your session to calm the mind and elevate the senses.',
      },
      {
        name: 'Cupping',
        icon: 'CircleDot',
        description:
          'Traditional suction therapy that eases tension, boosts circulation, and releases fascia.',
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Head Spa feature (signature story)                                        */
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

export const amenities: Amenity[] = [
  {
    icon: 'CircleParking',
    title: 'Free Parking',
    description: 'Complimentary on-site and street parking, every visit.',
  },
  {
    icon: 'HeartHandshake',
    title: 'LGBTQ-Friendly',
    description: 'An inclusive, transgender-safe space where everyone is welcome.',
  },
  {
    icon: 'Users',
    title: 'Couples Suite',
    description: 'A private room for two — perfect for a shared escape.',
  },
  {
    icon: 'Clock',
    title: 'Open 7 Days',
    description: 'Morning to night, 9:00 AM – 9:00 PM, every day of the week.',
  },
];

/* -------------------------------------------------------------------------- */
/*  Testimonials (authentic — do not fabricate)                               */
/* -------------------------------------------------------------------------- */

export const testimonials = [
  {
    quote:
      'The sublime massage technique at Forest Spa was truly transformative — every touch felt expertly tailored to melt away tension and restore balance.',
    author: 'Verified Guest',
  },
] as const;

/* -------------------------------------------------------------------------- */
/*  SEO defaults                                                              */
/* -------------------------------------------------------------------------- */

export const seo = {
  title: 'Forest Spa | Best Massage & Head Spa in Poway, San Diego',
  description:
    'Experience the best massage therapy in Poway, San Diego at Forest Spa. Restorative massage and specialized head spa therapies to rejuvenate your mind, body & soul.',
  ogImage: '/og-image.jpg',
  keywords: [
    'massage Poway',
    'head spa Poway',
    'massage San Diego',
    'scalp treatment Poway',
    'deep tissue massage Poway',
    'couples massage Poway',
    'day spa Poway',
  ],
} as const;
