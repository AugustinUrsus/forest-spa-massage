import type { Photo } from './photos';
import { photos } from './photos';

export interface ServiceTierOption {
  duration: string;
  price: string;
  priceNum: number;
  description: string;
  freshaUrl?: string;
  isPopular?: boolean;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServicePageData {
  slug: string;
  name: string;
  seoTitle: string;
  metaDescription: string;
  eyebrow: string;
  headline: string;
  subhead: string;
  photo: Photo;
  durationLabel: string;
  priceLabel: string;
  intensity: string;
  roomType: string;
  primaryOfferId: string;
  customBookingUrl?: string;
  highlights: string[];
  idealFor: string[];
  techniqueSummary: string[];
  tiers: ServiceTierOption[];
  faqs: ServiceFAQ[];
  articleSlug?: string;
  relatedServiceSlugs: string[];
}

export const servicePages: ServicePageData[] = [
  {
    slug: 'deep-tissue-massage',
    name: 'Deep Tissue Massage',
    seoTitle: 'Deep Tissue Massage in Poway, CA | Chronic Pain & Knot Relief | Forest Spa',
    metaDescription:
      'Experience therapeutic Deep Tissue Massage in Poway, San Diego at Forest Spa. Relieve chronic tension, stubborn knots, and desk fatigue with certified specialists.',
    eyebrow: 'Therapeutic Bodywork in Poway, CA',
    headline: 'Deep Tissue Massage in Poway, San Diego',
    subhead:
      'Firm, deliberate therapeutic pressure designed to dissolve chronic postural tension, release stubborn knots, and restore complete range of motion.',
    photo: photos.heroAmbiance,
    durationLabel: '60–120 min',
    priceLabel: 'from $80',
    intensity: 'Firm to Deep Pressure',
    roomType: 'Private Treatment Suite',
    primaryOfferId: 's:20874167',
    highlights: [
      'Targeted deep myofascial release & sustained trigger point compression',
      'Dissolves chronic adhesions along neck, trapezius, and lumbar spine',
      'Stimulates intramuscular blood circulation and cellular recovery',
      'Customized pressure depth tuned continuously to your comfort',
    ],
    idealFor: [
      'Desk professionals suffering from "tech neck" and rounded shoulder strain',
      'Athletes, runners, and active individuals recovering from physical training',
      'Persistent lower back ache, sciatic nerve tension, or gluteal tightness',
      'Anyone who finds standard Swedish pressure insufficient for muscular knots',
    ],
    techniqueSummary: [
      'Unlike a standard relaxation massage, Deep Tissue focuses on the inner layers of your muscles, tendons, and protective fascia. Your certified therapist applies deliberate, slow friction and sustained compression using fingers, thumbs, forearms, and elbows along tense muscle fibers.',
      'Sessions begin with gentle warming effleurage to prepare the outer tissues, followed by progressively deeper pressure to address stubborn knots without triggering defensive muscle guarding. Communication is key — you remain in total control of pressure depth at every moment.',
    ],
    tiers: [
      {
        duration: '60 min',
        price: '$80',
        priceNum: 80,
        description: 'Targeted focus on primary tension areas (upper back, neck & shoulders).',
      },
      {
        duration: '90 min',
        price: '$120',
        priceNum: 120,
        description: 'Our most popular session: comprehensive full-body recovery with extra time for stubborn knots.',
        isPopular: true,
      },
      {
        duration: '120 min',
        price: '$160',
        priceNum: 160,
        description: 'Exhaustive head-to-toe deep tension release and full muscular decompression.',
      },
    ],
    faqs: [
      {
        question: 'Does deep tissue massage have to hurt to be effective?',
        answer:
          'Not at all. While you may feel intense sensations as stubborn knots release ("good hurt"), therapy should never cause sharp or unbearable discomfort. Our therapists tune pressure continuously to your comfort level so your body never tenses up in defense.',
      },
      {
        question: 'What should I do after my deep tissue massage?',
        answer:
          'Drink plenty of water to help your tissues rehydrate. Taking a warm bath with Epsom salts and avoiding strenuous workouts for the remainder of the day helps minimize any temporary post-session soreness.',
      },
      {
        question: 'How often should I receive deep tissue therapy?',
        answer:
          'For chronic desk posture tension or athletic recovery, a session every 2 to 4 weeks is ideal for maintaining mobility, keeping fascia loose, and preventing knots from reforming.',
      },
    ],
    articleSlug: 'deep-tissue-vs-swedish',
    relatedServiceSlugs: ['swedish-massage', 'head-spa', 'couples-massage'],
  },
  {
    slug: 'swedish-massage',
    name: 'Swedish Massage',
    seoTitle: 'Swedish Massage in Poway, CA | Pure Relaxation & Stress Relief | Forest Spa',
    metaDescription:
      'Melt away stress with soothing Swedish Massage at Forest Spa in Poway, San Diego. Flowing strokes, botanical oils, and serene ambiance for total mind-body calm.',
    eyebrow: 'Classic Gentle Relaxation',
    headline: 'Swedish Massage in Poway, San Diego',
    subhead:
      'Gentle, continuous gliding strokes and rhythmic kneading designed to calm the central nervous system, improve circulation, and melt daily mental burnout.',
    photo: photos.sanctuarySuite,
    durationLabel: '60–120 min',
    priceLabel: 'from $75',
    intensity: 'Light to Medium Pressure',
    roomType: 'Private Treatment Suite',
    primaryOfferId: 's:20874160',
    highlights: [
      'Classic long, flowing effleurage strokes and gentle circular kneading',
      'Soothes an overactive nervous system and lowers stress hormones',
      'Enhances venous blood return and whole-body lymphatic drainage',
      'Smooth botanical massage oils warming the skin and senses',
    ],
    idealFor: [
      'First-time spa guests seeking a comforting, non-intimidating experience',
      'High-stress executives, students, and parents experiencing mental exhaustion',
      'Those who prefer gentle, restorative touch rather than deep muscular friction',
      'Anyone struggling with restlessness, mild sleep issues, or bodily fatigue',
    ],
    techniqueSummary: [
      'Swedish massage is the global gold standard for pure relaxation bodywork. Your certified therapist utilizes five foundational modalities — effleurage (smooth gliding), petrissage (gentle kneading), friction, tapotement, and gentle vibration — to warm and lengthen muscle fibers.',
      'Each stroke is synchronized in the direction of blood flow returning to the heart, promoting vascular circulation and easing systemic muscular stiffness without discomfort.',
    ],
    tiers: [
      {
        duration: '60 min',
        price: '$75',
        priceNum: 75,
        description: 'Complete full-body gentle relaxation and peaceful stress relief.',
      },
      {
        duration: '90 min',
        price: '$110',
        priceNum: 110,
        description: 'Unhurried full-body serenity with extra time for cranial and foot relaxation.',
        isPopular: true,
      },
      {
        duration: '120 min',
        price: '$150',
        priceNum: 150,
        description: 'The ultimate deep relaxation escape for complete mental and physical restoration.',
      },
    ],
    faqs: [
      {
        question: 'What is the main difference between Swedish and Deep Tissue?',
        answer:
          'Swedish massage focuses primarily on nervous system relaxation and circulatory flow using light-to-medium flowing strokes. Deep Tissue uses slower, firmer pressure targeting deeper muscle layers and fascia to release chronic knots and adhesions.',
      },
      {
        question: 'Can I request firmer pressure during a Swedish massage?',
        answer:
          'Absolutely. While Swedish is traditionally gentle, our therapists are happy to adjust to medium or medium-firm pressure upon request.',
      },
    ],
    articleSlug: 'deep-tissue-vs-swedish',
    relatedServiceSlugs: ['deep-tissue-massage', 'head-spa', 'couples-massage'],
  },
  {
    slug: 'head-spa',
    name: 'Signature Head Spa',
    seoTitle: 'Signature Head Spa in Poway, CA | Scalp Revival & Waterfall Halo | Forest Spa',
    metaDescription:
      'Experience Forest Spa’s Signature Head Spa in Poway, San Diego. Warm botanical steam, scalp acupressure, argan oil therapy & mesmerizing waterfall halo hydrotherapy.',
    eyebrow: 'Signature Sanctuary Ritual',
    headline: 'Signature Head Spa in Poway, San Diego',
    subhead:
      'A transformative sensory reset for your scalp and nervous system — featuring warm botanical steam, head & neck acupressure, and our iconic halo waterfall rinse.',
    photo: photos.headSpaBasin,
    durationLabel: '60–90 min',
    priceLabel: 'from $85',
    intensity: 'Gentle Scalp Acupressure & Hydrotherapy',
    roomType: 'Specialized Ergonomic Head Spa Suite',
    primaryOfferId: 's:20874427',
    highlights: [
      'Continuous halo water-ring hydrotherapy with soothing circular warm rain',
      'Warm botanical mist opening hair follicles and softening scalp buildup',
      'Clarifying scalp exfoliation and deep-conditioning argan oil treatment',
      'Targeted acupressure on cranium, temples, neck, and shoulders',
    ],
    idealFor: [
      'Scalp dryness, excess oil, product buildup, or flaking',
      'Chronic tension headaches, screen eye strain, and mental fatigue',
      'Those suffering from sleeplessness, anxiety, or racing thoughts',
      'Anyone looking for a unique, deeply calming sensory wellness experience',
    ],
    techniqueSummary: [
      'Recline into our custom head spa basin while warm botanical steam opens follicles and softens dried sebum. Your specialist performs gentle scalp exfoliation, followed by a botanical clarifying wash and therapeutic cranial acupressure.',
      'Next, rich argan oil and keratin conditioner are worked through your hair lengths while your neck and shoulders receive soothing massage. The highlight of the ritual is our halo water-ring: continuous streams of warm, purified water cascade rhythmically over your forehead and hairline, creating an auditory and tactile lullaby that melts tension.',
    ],
    tiers: [
      {
        duration: '60 min',
        price: '$85',
        priceNum: 85,
        description: 'Complete signature head spa ritual with steam, exfoliation, acupressure & halo rinse.',
      },
      {
        duration: '90 min',
        price: '$125',
        priceNum: 125,
        description: 'Extended luxury scalp revival paired with upper body massage and deep conditioning.',
        isPopular: true,
      },
    ],
    faqs: [
      {
        question: 'Does the Head Spa include hair drying or styling?',
        answer:
          'We provide clean towels, hair dryers, and vanity mirrors so you can gently dry your hair before leaving.',
      },
      {
        question: 'Is the Head Spa safe for color-treated or chemically treated hair?',
        answer:
          'Yes, we use gentle, sulfate-free botanical cleansers and nourishing conditioners that protect color while deeply hydrating the hair cuticle.',
      },
      {
        question: 'How often should I get a head spa treatment?',
        answer:
          'Once every 3 to 4 weeks aligns with your scalp’s natural skin cell turnover cycle, keeping follicles clear and promoting optimal relaxation.',
      },
    ],
    articleSlug: 'head-spa-scalp-therapy-benefits',
    relatedServiceSlugs: ['deep-tissue-massage', 'swedish-massage', 'couples-massage'],
  },
  {
    slug: 'couples-massage',
    name: 'Couples Massage',
    seoTitle: 'Couples Massage in Poway, CA | Private Suite for Two | Forest Spa',
    metaDescription:
      'Unwind side by side with a couples massage at Forest Spa in Poway, San Diego. Private suite, customized modalities for each guest, and built-in 10% savings.',
    eyebrow: 'Shared Wellness in Private Suite',
    headline: 'Couples Massage in Poway, San Diego',
    subhead:
      'Unwind side by side in our serene, private couples suite. Two licensed therapists personalize pressure and modalities for each guest, with built-in 10% savings.',
    photo: photos.couplesRoom,
    durationLabel: '60–90 min',
    priceLabel: 'from $140 for two',
    intensity: 'Individually Customized per Guest',
    roomType: 'Private Ambient Couples Suite',
    primaryOfferId: 'p:1651755',
    highlights: [
      'Dedicated private couples sanctuary with soft ambient lighting and aromatics',
      'Two licensed massage therapists working in synchronized harmony',
      'Complete individual freedom: choose Swedish, Deep Tissue, or Sports',
      'Built-in 10% couples discount on both 60-min and 90-min sessions',
    ],
    idealFor: [
      'Partners celebrating anniversaries, birthdays, or weekend getaways',
      'Close friends, mothers and daughters, or companions seeking shared calm',
      'Pairs who want to relax together without sacrificing individual pressure preferences',
      'A memorable, stress-free gift of wellness and mindful connection',
    ],
    techniqueSummary: [
      'You and your companion relax side by side on two heated massage tables dressed in crisp sage-green linens. There is no need to compromise on style: one guest can enjoy firm, knot-releasing Deep Tissue while the other enjoys flowing Swedish relaxation.',
      'Your therapists communicate with you individually before and during the session to guarantee optimal comfort, temperature, and technique.',
    ],
    tiers: [
      {
        duration: '60 min',
        price: '$140 for two',
        priceNum: 140,
        description: 'Synchronized side-by-side restorative massage in our private couples suite.',
      },
      {
        duration: '90 min',
        price: '$210 for two',
        priceNum: 210,
        description: 'Our most popular couples escape: 90 full minutes of unhurried deep decompression.',
        isPopular: true,
      },
    ],
    faqs: [
      {
        question: 'Can my partner and I choose different massage styles?',
        answer:
          'Yes! Each guest communicates directly with their dedicated therapist to select their desired modality (Swedish or Deep Tissue) and pressure level.',
      },
      {
        question: 'Does couples massage have to be for romantic couples?',
        answer:
          'Not at all! Our couples suite is welcoming to friends, siblings, mothers and daughters, or anyone who wants to enjoy a peaceful shared spa day.',
      },
      {
        question: 'How far in advance should we book?',
        answer:
          'Because couples sessions require coordinating two therapists and our private suite, we recommend booking at least a few days in advance, especially for weekends.',
      },
    ],
    articleSlug: 'couples-massage-guide',
    relatedServiceSlugs: ['deep-tissue-massage', 'swedish-massage', 'head-spa'],
  },
  {
    slug: 'prenatal-massage',
    name: 'Prenatal Massage',
    seoTitle: 'Prenatal Massage in Poway, CA | Certified Maternal Care | Forest Spa',
    metaDescription:
      'Safe, nurturing Prenatal Massage in Poway, San Diego at Forest Spa. Relieve lower back ache, hip tension & swelling with supportive side-lying cushions.',
    eyebrow: 'Gentle Care for Expecting Mothers',
    headline: 'Prenatal Massage in Poway, San Diego',
    subhead:
      'Gentle, soothing relief thoughtfully tailored to maternal anatomy — relieving lower back ache, hip stiffness, and swollen ankles with supportive side-lying cushions.',
    photo: photos.sanctuarySuite,
    durationLabel: '60–90 min',
    priceLabel: 'from $80',
    intensity: 'Gentle, Safe Maternal Pressure',
    roomType: 'Comfort-Cushioned Private Suite',
    primaryOfferId: 's:20874198',
    highlights: [
      'Specialized supportive side-lying bolster system keeping spine in neutral alignment',
      'Relieves maternal lumbar strain, piriformis tightness, and sciatic nerve ache',
      'Gentle lymphatic drainage to reduce fluid retention in ankles and feet',
      'Certified therapists trained strictly in pregnancy contraindications',
    ],
    idealFor: [
      'Expecting mothers in their 2nd or 3rd trimester seeking safe body relief',
      'Relieving aching hips, lower back compression, and pelvis tightness',
      'Mothers suffering from fatigue, leg cramps, or pregnancy-related insomnia',
      'A nurturing self-care retreat before baby arrives',
    ],
    techniqueSummary: [
      'Expectant mothers are comfortably positioned side-lying with supportive pillows supporting the belly, back, and knees to eliminate pressure on the pelvic joints and vena cava. Gentle circulatory effleurage and targeted gluteal friction relieve sciatic pressure and tension in the lumbar muscles.',
      'Therapists avoid contraindicated acupressure points on the ankles and hands, ensuring total peace of mind throughout your visit.',
    ],
    tiers: [
      {
        duration: '60 min',
        price: '$80',
        priceNum: 80,
        description: 'Focused relief on lower back, hips, shoulders, and tired feet.',
      },
      {
        duration: '90 min',
        price: '$120',
        priceNum: 120,
        description: 'Unhurried full-body maternal pampering with extra time for leg and neck comfort.',
        isPopular: true,
      },
    ],
    faqs: [
      {
        question: 'When is prenatal massage safe to receive?',
        answer:
          'Prenatal massage is safe and highly recommended during the second and third trimesters. If you are experiencing a high-risk pregnancy, we recommend consulting your OB-GYN prior to scheduling.',
      },
      {
        question: 'Will I be lying on my stomach?',
        answer:
          'No. We position mothers in a comfortable, supportive side-lying position with soft bolsters, which is recognized by medical professionals as the safest and most relaxing position for both mother and baby.',
      },
    ],
    articleSlug: 'prenatal-massage-guide',
    relatedServiceSlugs: ['swedish-massage', 'head-spa', 'couples-massage'],
  },
];
