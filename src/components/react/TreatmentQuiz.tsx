import { useState, useRef } from 'react';
import {
  Activity,
  Sparkles,
  Droplets,
  Monitor,
  Footprints,
  Heart,
  Flower2,
  Check,
  RotateCcw,
  Compass,
  CalendarHeart,
  ArrowLeft,
  BookOpen,
  Phone,
  Edit3,
  Zap,
  Smile,
  Flame,
  Feather,
  Move,
  Clock,
  Hourglass,
  type LucideIcon,
} from 'lucide-react';
import { bookingUrl } from '../../data/siteData';
import { photos } from '../../data/photos';

interface Option {
  id: string;
  label: string;
  description: string;
  icon?: LucideIcon;
}

interface Question {
  id: string;
  title: string;
  subtitle: string;
  multiSelect: boolean;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    id: 'goal',
    title: 'What brings you in today?',
    subtitle: 'Select all goals you would like to address during your session.',
    multiSelect: true,
    options: [
      {
        id: 'tension',
        label: 'Relieve Muscle Knots & Chronic Tension',
        description: 'Focused firm pressure on tight, overworked muscles to release stubborn pain.',
        icon: Activity,
      },
      {
        id: 'calm',
        label: 'Full-Body Relaxation & Stress Relief',
        description: 'Smooth, rhythmic strokes to calm a busy mind and unwind physical stress.',
        icon: Sparkles,
      },
      {
        id: 'head_spa',
        label: 'Signature Head Spa & Scalp Detox',
        description: 'Warm waterfall halo hydrotherapy, botanical steam mist, and soothing cranial massage.',
        icon: Droplets,
      },
      {
        id: 'desk',
        label: 'Desk & Screen Fatigue (Tech Neck)',
        description: 'Dedicated relief for stiff necks, tight shoulders, forearms, and wrists.',
        icon: Monitor,
      },
      {
        id: 'active',
        label: 'Post-Workout Recovery & Leg Soreness',
        description: 'Targeted leg work, deep compression, and gentle stretching for tired muscles.',
        icon: Footprints,
      },
      {
        id: 'couple',
        label: 'Side-by-Side Couples Sanctuary',
        description: 'Share a tranquil private suite together with personalized pressure for each guest.',
        icon: Heart,
      },
      {
        id: 'prenatal',
        label: 'Gentle Prenatal Care (Expectant Mothers)',
        description: 'Supportive side-lying cushioning to safely relieve lower back aches and swollen legs.',
        icon: Flower2,
      },
    ],
  },
  {
    id: 'area',
    title: 'Where is your body holding the most tightness?',
    subtitle: 'Select all areas where your therapist should dedicate extra attention.',
    multiSelect: true,
    options: [
      {
        id: 'neck_shoulders',
        label: 'Neck, Shoulders & Upper Back',
        description: 'Trapezius tension, shoulder blade knots, and neck stiffness.',
        icon: Zap,
      },
      {
        id: 'head_jaw',
        label: 'Head, Temples & Jaw (TMJ Tension)',
        description: 'Jaw clenching, temple pressure, and tension headaches.',
        icon: Smile,
      },
      {
        id: 'low_back',
        label: 'Lower Back, Hips & Glutes',
        description: 'Lumbar tightness, hip flexor stiffness, and sciatic discomfort.',
        icon: Flame,
      },
      {
        id: 'legs_feet',
        label: 'Legs, Calves & Tired Feet',
        description: 'Arch tension, calf tightness, and standing fatigue.',
        icon: Footprints,
      },
      {
        id: 'full_body',
        label: 'Balanced Head-to-Toe Relief',
        description: 'An even, full-body session touching every major muscle group.',
        icon: Compass,
      },
    ],
  },
  {
    id: 'pressure',
    title: 'What pressure level and modalities do you prefer?',
    subtitle: 'Select your preferred depth and any therapeutic elements you enjoy.',
    multiSelect: true,
    options: [
      {
        id: 'deep',
        label: 'Firm to Deep Pressure',
        description: 'Slow, firm strokes that work into deeper muscle layers and trigger points.',
        icon: Activity,
      },
      {
        id: 'gentle',
        label: 'Light to Medium Pressure',
        description: 'Smooth, soothing strokes for relaxation and gentle circulation.',
        icon: Feather,
      },
      {
        id: 'heat',
        label: 'Warm Basalt Stones or Herbal Heat',
        description: 'Penetrating heat to melt muscle stiffness before deeper bodywork.',
        icon: Flame,
      },
      {
        id: 'hydro',
        label: 'Warm Waterfall Scalp Hydrotherapy',
        description: 'Warm waterfall ring rinse, botanical steam, and cranial acupressure.',
        icon: Droplets,
      },
      {
        id: 'stretch',
        label: 'Assisted Stretching & Mobility',
        description: 'Gentle passive stretching to open tight hips and shoulders.',
        icon: Move,
      },
    ],
  },
  {
    id: 'duration',
    title: 'How much time do you have for your visit?',
    subtitle: 'Select your preferred session length.',
    multiSelect: false,
    options: [
      {
        id: '60',
        label: '60 Minutes (Focused Session)',
        description: 'Efficient and targeted — ideal for a focused problem area or quick restorative break.',
        icon: Clock,
      },
      {
        id: '90',
        label: '90 Minutes (Most Popular)',
        description: 'Our most requested duration — ample time for full-body balance plus problem area focus.',
        icon: Hourglass,
      },
      {
        id: '120',
        label: '120 Minutes (Ultimate Escape)',
        description: 'An unhurried, deeply immersive escape for comprehensive head-to-toe relaxation.',
        icon: Sparkles,
      },
    ],
  },
];

interface QuizRecommendationItem {
  title: string;
  badge: string;
  matchScore: number;
  duration: string;
  price: string;
  photo?: string;
  whyFit: string;
  inclusions: string[];
  bookingUrl: string;
  articleSlug?: string;
  articleTitle?: string;
}

interface QuizResult {
  primary: QuizRecommendationItem;
  alternatives: [QuizRecommendationItem, QuizRecommendationItem];
}

function calculateResult(answers: Record<string, string[]>): QuizResult {
  const goals = answers['goal'] || ['tension'];
  const areas = answers['area'] || ['neck_shoulders'];
  const pressures = answers['pressure'] || ['deep'];
  const duration = answers['duration']?.[0] || '90';

  // Prenatal safety priority: If prenatal is selected, prenatal massage is always #1
  if (goals.includes('prenatal')) {
    return {
      primary: {
        title: 'Prenatal Massage',
        badge: '99% Match for Maternal Comfort',
        matchScore: 99,
        duration: duration === '90' ? '90 min' : '60 min',
        price: duration === '90' ? '$120' : '$80',
        photo: photos.couplesRoom.src.src,
        whyFit:
          'Tailored specifically for expectant mothers with supportive side-lying cushions that safely ease lower back aches, relieve hip tightness, and reduce leg fatigue.',
        inclusions: [
          'Safe side-lying positioning with supportive body cushions',
          'Gentle lumbar and hip sciatic relief',
          'Circulatory leg massage to ease swelling and fatigue',
          'Nurturing certified maternal care',
        ],
        bookingUrl: bookingUrl('s:20874198'),
        articleSlug: 'prenatal-massage-guide',
        articleTitle: 'Nurturing the Mother: Guide to Prenatal Massage',
      },
      alternatives: [
        {
          title: 'Swedish Massage (Gentle Flow)',
          badge: '92% Match · Light & Restorative',
          matchScore: 92,
          duration: '60 min',
          price: '$75',
          whyFit:
            'Gentle, light effleurage strokes without intense pressure, designed to soothe tired muscles and restore full-body circulatory calm.',
          inclusions: [
            'Flowing full-body relaxation strokes',
            'Nourishing botanical massage oil',
            'Soothing nervous system relief',
            'Zero post-massage soreness or discomfort',
          ],
          bookingUrl: bookingUrl('s:20874160'),
        },
        {
          title: 'Head & TMJ Tension Release',
          badge: '88% Match · Cranial & Facial Soothing',
          matchScore: 88,
          duration: '45 min',
          price: '$75',
          whyFit:
            'Safe cranial and temple acupressure with a warm herbal eye mask to release facial clenching, jaw strain, and stress headaches.',
          inclusions: [
            'Targeted cranial and temple acupressure',
            'Gentle jaw and cheek tension release',
            'Warming herbal eye mask',
            'Upper neck and shoulder relaxation',
          ],
          bookingUrl: bookingUrl('s:20888530'),
        },
      ],
    };
  }

  // Couples priority: If couple is selected
  if (goals.includes('couple')) {
    return {
      primary: {
        title: duration === '90' ? 'Couples Massage · 90 min' : 'Couples Massage · 60 min',
        badge: '98% Match for Shared Relaxation',
        matchScore: 98,
        duration: duration === '90' ? '90 min' : '60 min',
        price: duration === '90' ? '$210' : '$140',
        photo: photos.couplesRoom.src.src,
        whyFit:
          'Unwind side-by-side with your partner or friend in our serene private suite. Each guest chooses their own preferred modality (Swedish or Deep Tissue) and custom pressure.',
        inclusions: [
          'Private serene couples treatment suite',
          'Two skilled therapists in synchronized harmony',
          'Customized modality per guest (Swedish or Deep Tissue)',
          'Built-in 10% couples discount',
        ],
        bookingUrl: bookingUrl(duration === '90' ? 'p:1651756' : 'p:1651755'),
      },
      alternatives: [
        {
          title: 'Head-to-Toe Retreat Premier',
          badge: '93% Match · Ultimate Sanctuary Duo',
          matchScore: 93,
          duration: '90 min',
          price: '$135',
          whyFit:
            'If booking individual back-to-back sessions or gifting, this full ritual combines customized massage with scalp therapy, hand masks, and foot scrub.',
          inclusions: [
            'Full-body customized pressure massage',
            'Head, scalp & TMJ therapy',
            'Nourishing hand mask treatment',
            'Botanical foot exfoliating scrub',
          ],
          bookingUrl: bookingUrl('s:20888388'),
        },
        {
          title: 'Stone & Scent Combo',
          badge: '90% Match · Warm Basalt Escape',
          matchScore: 90,
          duration: '90 min',
          price: '$125',
          whyFit:
            'Full-body relaxation infused with heated volcanic basalt stones and calming pure essential aromatherapy oils to melt every trace of stress.',
          inclusions: [
            'Full-body Swedish or combination massage',
            'Heated volcanic basalt stone therapy',
            'Pure organic essential oil blend',
            'Foot reflexology integration',
          ],
          bookingUrl: bookingUrl('s:20888346'),
        },
      ],
    };
  }

  // Multi-select weighted scoring
  interface Candidate {
    id: string;
    score: number;
    title: string;
    badge: string;
    duration: string;
    price: string;
    photo?: string;
    whyFit: string;
    inclusions: string[];
    bookingUrl: string;
    articleSlug?: string;
    articleTitle?: string;
  }

  const candidates: Candidate[] = [
    // 1. Signature Head Spa & Body Massage
    {
      id: 'head_spa_body',
      score:
        (goals.includes('head_spa') ? 35 : 0) +
        (pressures.includes('hydro') ? 30 : 0) +
        (areas.includes('head_jaw') ? 25 : 0) +
        (goals.includes('calm') ? 15 : 0) +
        (duration === '90' || duration === '120' ? 10 : 0),
      title: 'Signature Head Spa & Body Massage',
      badge: 'Total Scalp & Body Renewal',
      duration: duration === '120' ? '120 min' : '90 min',
      price: duration === '120' ? '$155' : '$125',
      photo: photos.headSpaWash.src.src,
      whyFit:
        'The complete sanctuary pairing: our full head spa basin ritual with warm waterfall halo rinse and botanical steam mist, plus a customized full-body massage with warm hot stones.',
      inclusions: [
        'Scalp exfoliation, deep cleanse & botanical steam',
        'Warm waterfall halo hydrotherapy rinse',
        'Targeted acupressure across scalp, neck & shoulders',
        'Customized full-body massage with warm hot stones',
      ],
      bookingUrl: bookingUrl('s:20874453'),
      articleSlug: 'head-spa-scalp-therapy-benefits',
      articleTitle: 'The Signature Head Spa Ritual: Scalp Health & Calm',
    },
    // 2. Signature Head Spa (Standalone)
    {
      id: 'head_spa_standalone',
      score:
        (goals.includes('head_spa') ? 35 : 0) +
        (pressures.includes('hydro') ? 30 : 0) +
        (areas.includes('head_jaw') ? 20 : 0) +
        (duration === '60' ? 15 : 0),
      title: 'Signature Head Spa',
      badge: 'Scalp Detox & Mental Reset',
      duration: '60 min',
      price: 'From $85',
      photo: photos.headSpaWash.src.src,
      whyFit:
        'Deep scalp cleansing, warm botanical steam, and cranial acupressure topped off with our iconic waterfall halo ring to relieve mental chatter, headaches, and tension.',
      inclusions: [
        'Scalp detox & purifying botanical wash',
        'Warm waterfall halo ring rinse',
        'Targeted cranial and temple acupressure',
        'Argan oil infusion & keratin conditioning',
      ],
      bookingUrl: bookingUrl('s:20874427'),
      articleSlug: 'head-spa-scalp-therapy-benefits',
      articleTitle: 'The Signature Head Spa Ritual: Scalp Health & Calm',
    },
    // 3. Head & TMJ Tension Release
    {
      id: 'head_tmj',
      score:
        (areas.includes('head_jaw') ? 35 : 0) +
        (goals.includes('desk') ? 20 : 0) +
        (goals.includes('tension') ? 15 : 0),
      title: duration === '60' ? 'Head & TMJ Pain Relief' : 'Head & TMJ Tension Release',
      badge: 'Targeted Cranial & Jaw Relief',
      duration: duration === '60' ? '60 min' : '45 min',
      price: duration === '60' ? '$95' : '$75',
      photo: photos.sanctuaryRoom.src.src,
      whyFit:
        'Focused dry therapy designed specifically for teeth grinding, jaw clenching, and temple strain. Releases deep tension in the masseter muscles and cranial base.',
      inclusions: [
        'Jaw joint & cheek muscular release',
        'Temple & brow acupressure',
        'Warming herbal eye mask',
        'Upper neck & occipital ridge relief',
      ],
      bookingUrl: bookingUrl(duration === '60' ? 's:20888564' : 's:20888530'),
    },
    // 4. Computer Relief Combo
    {
      id: 'computer_relief',
      score:
        (goals.includes('desk') ? 35 : 0) +
        (areas.includes('neck_shoulders') ? 25 : 0) +
        (pressures.includes('deep') ? 15 : 0) +
        (pressures.includes('heat') ? 10 : 0),
      title: 'Computer Relief Combo',
      badge: 'Postural & Screen Fatigue Match',
      duration: duration === '120' ? '120 min' : duration === '60' ? '60 min' : '90 min',
      price: duration === '120' ? '$150' : duration === '60' ? '$90' : '$120',
      photo: photos.sanctuarySuite.src.src,
      whyFit:
        'Engineered specifically for desk workers. Combines focused forearm, wrist, and hand work with deep tissue upper back therapy and warm stones to dissolve tech neck.',
      inclusions: [
        'Dedicated massage for shoulders, arms, wrists & hands',
        'Deep tissue work targeting upper back knots',
        'Herbal heat pack or soothing hot stones',
        'Pain-relieving ointment or Tiger Balm',
      ],
      bookingUrl:
        duration === '60'
          ? 'https://www.fresha.com/book-now/forest-spa-kbi5ew52/services?lid=2689228&oiid=sv%3A23950414&share=true&pId=2602780'
          : duration === '120'
          ? 'https://www.fresha.com/book-now/forest-spa-kbi5ew52/services?lid=2689228&oiid=sv%3A23950438&share=true&pId=2602780'
          : 'https://www.fresha.com/book-now/forest-spa-kbi5ew52/services?lid=2689228&oiid=sv%3A23950422&share=true&pId=2602780',
      articleSlug: 'tech-neck-desk-fatigue',
      articleTitle: "Defeating 'Tech Neck' & Screen Fatigue",
    },
    // 5. Upper Body Tension Release
    {
      id: 'upper_body',
      score:
        (areas.includes('neck_shoulders') ? 30 : 0) +
        (goals.includes('tension') ? 20 : 0) +
        (pressures.includes('deep') ? 15 : 0) +
        (duration === '60' ? 10 : 0),
      title: 'Upper Body Tension Release',
      badge: 'Concentrated Knot & Shoulder Relief',
      duration: '60 min',
      price: '$90',
      photo: photos.sanctuarySuite.src.src,
      whyFit:
        'Devotes 100% of your session to stubborn trapezius knots, shoulder blade tension, and neck stiffness without spreading time thin.',
      inclusions: [
        'Dedicated upper back & shoulder therapy',
        'Deep trigger point knot release',
        'Hot stones or herbal heat pack',
        'Gentle neck decompression & stretch',
      ],
      bookingUrl: bookingUrl('s:20888511'),
    },
    // 6. Runner Rescue Combo
    {
      id: 'runner_rescue',
      score:
        (goals.includes('active') ? 35 : 0) +
        (areas.includes('legs_feet') ? 30 : 0) +
        (pressures.includes('stretch') ? 20 : 0),
      title: 'Runner Rescue Combo',
      badge: 'Active Leg & Foot Recovery',
      duration: duration === '60' ? '60 min' : '90 min',
      price: duration === '60' ? '$90' : '$125',
      photo: photos.sanctuaryRoom.src.src,
      whyFit:
        'Designed for runners, hikers, and active people. Focuses heavily on the quads, hamstrings, IT bands, and calves with warm stones and assisted stretching.',
      inclusions: [
        'Leg-focused deep massage (quads, hamstrings, glutes & IT bands)',
        'Foot reflexology and arch tension release',
        'Passive body stretching to improve mobility',
        'Hot stones & soothing pain liniment',
      ],
      bookingUrl:
        duration === '60'
          ? 'https://www.fresha.com/book-now/forest-spa-kbi5ew52/services?lid=2689228&oiid=sv%3A23950454&share=true&pId=2602780'
          : 'https://www.fresha.com/book-now/forest-spa-kbi5ew52/services?lid=2689228&oiid=sv%3A23950466&share=true&pId=2602780',
    },
    // 7. Sports Massage
    {
      id: 'sports_massage',
      score:
        (goals.includes('active') ? 30 : 0) +
        (pressures.includes('stretch') ? 25 : 0) +
        (areas.includes('legs_feet') ? 15 : 0),
      title: 'Sports Massage',
      badge: 'Athletic Muscle Flushing & Mobility',
      duration: '60–90 min',
      price: 'From $75',
      photo: photos.sanctuaryRoom.src.src,
      whyFit:
        'A dynamic session blending deep compression, friction strokes, and assisted stretching to flush lactic acid, loosen tight joints, and restore flexibility.',
      inclusions: [
        'Targeted athletic muscle work',
        'Assisted passive stretching',
        'Lactic acid flushing strokes',
        'Joint range-of-motion enhancement',
      ],
      bookingUrl: bookingUrl('s:20874176'),
    },
    // 8. Head-to-Toe Retreat Premier
    {
      id: 'head_to_toe',
      score:
        (areas.includes('full_body') ? 25 : 0) +
        (goals.includes('calm') ? 20 : 0) +
        (pressures.includes('heat') ? 15 : 0) +
        (duration === '90' || duration === '120' ? 20 : 0),
      title: duration === '120' ? 'Head-to-Toe Retreat (Prestige)' : 'Head-to-Toe Retreat (Premier)',
      badge: 'Complete Full-Body Escape',
      duration: duration === '120' ? '120 min' : '90 min',
      price: duration === '120' ? '$160' : '$135',
      photo: photos.heroAmbiance.src.src,
      whyFit:
        'Our most comprehensive sanctuary package. Combines full-body massage with targeted head/scalp/TMJ therapy, nourishing hand mask, and revitalizing foot scrub.',
      inclusions: [
        'Full-body massage tailored to your preferred depth',
        'Head, scalp & TMJ massage with soothing eye mask',
        'Nourishing hand massage with hydrating hand mask',
        'Foot massage with botanical exfoliating scrub',
        'Pure essential oil aromatherapy',
      ],
      bookingUrl: bookingUrl(duration === '120' ? 's:20888407' : 's:20888388'),
    },
    // 9. Stone & Scent Combo
    {
      id: 'stone_scent',
      score:
        (pressures.includes('heat') ? 30 : 0) +
        (goals.includes('calm') ? 20 : 0) +
        (areas.includes('full_body') ? 15 : 0),
      title: duration === '90' ? 'Stone & Scent Combo (Premier)' : 'Stone & Scent Combo (Preferred)',
      badge: 'Warm Basalt Heat & Aromatherapy',
      duration: duration === '90' ? '90 min' : '60 min',
      price: duration === '90' ? '$125' : '$90',
      photo: photos.heroAmbiance.src.src,
      whyFit:
        'Combines full-body massage with heated volcanic basalt stones and pure essential oils to melt away stubborn stiffness with soothing, deep-penetrating warmth.',
      inclusions: [
        'Full-body custom massage of your choice',
        'Heated volcanic basalt stone therapy',
        'Calming botanical aromatherapy oils',
        'Foot reflexology with exfoliating scrub',
      ],
      bookingUrl: bookingUrl(duration === '90' ? 's:20888346' : 's:20888277'),
    },
    // 10. Deep Tissue Massage
    {
      id: 'deep_tissue',
      score:
        (pressures.includes('deep') ? 35 : 0) +
        (goals.includes('tension') ? 25 : 0) +
        (areas.includes('low_back') ? 15 : 0) +
        (areas.includes('neck_shoulders') ? 10 : 0),
      title: 'Deep Tissue Massage',
      badge: 'Deep Muscle & Knot Breakdown',
      duration: duration === '120' ? '120 min' : duration === '90' ? '90 min' : '60 min',
      price: duration === '120' ? '$155' : duration === '90' ? '$115' : '$80',
      photo: photos.sanctuaryRoom.src.src,
      whyFit:
        'Deliberate, firm pressure focused on deeper muscle layers and trigger points to release chronic stiffness, postural knots, and restore comfortable movement.',
      inclusions: [
        'Therapeutic focus on stubborn muscle knots and adhesions',
        'Customized pressure calibrated to your comfort',
        'Occipital, shoulder, and lower back tension release',
        'Enhanceable with hot stones or Tiger Balm at checkout',
      ],
      bookingUrl: bookingUrl('s:20874167'),
      articleSlug: 'deep-tissue-vs-swedish',
      articleTitle: 'Deep Tissue vs. Swedish Massage: How to Choose',
    },
    // 11. Swedish Massage
    {
      id: 'swedish',
      score:
        (pressures.includes('gentle') ? 35 : 0) +
        (goals.includes('calm') ? 25 : 0) +
        (areas.includes('full_body') ? 15 : 0) +
        5, // baseline
      title: 'Swedish Massage',
      badge: 'Classic Restorative Relaxation',
      duration: duration === '120' ? '120 min' : duration === '90' ? '90 min' : '60 min',
      price: duration === '120' ? '$145' : duration === '90' ? '$110' : '$75',
      photo: photos.sanctuaryRoom.src.src,
      whyFit:
        'Long, flowing effleurage strokes and gentle rhythmic kneading that loosen tight muscles, boost healthy circulation, and leave you feeling deeply rested and calm.',
      inclusions: [
        'Flowing full-body relaxation strokes',
        'Nourishing botanical massage oil',
        'Gentle nervous system and stress relief',
        'Zero post-massage soreness or discomfort',
      ],
      bookingUrl: bookingUrl('s:20874160'),
      articleSlug: 'deep-tissue-vs-swedish',
      articleTitle: 'Deep Tissue vs. Swedish Massage: How to Choose',
    },
  ];

  candidates.sort((a, b) => b.score - a.score);

  const top = candidates[0];
  const second = candidates[1] || candidates[0];
  const third = candidates[2] || candidates[1] || candidates[0];

  return {
    primary: {
      title: top.title,
      badge: `98% Match · ${top.badge}`,
      matchScore: 98,
      duration: top.duration,
      price: top.price,
      photo: top.photo,
      whyFit: top.whyFit,
      inclusions: top.inclusions,
      bookingUrl: top.bookingUrl,
      articleSlug: top.articleSlug,
      articleTitle: top.articleTitle,
    },
    alternatives: [
      {
        title: second.title,
        badge: `93% Match · ${second.badge}`,
        matchScore: 93,
        duration: second.duration,
        price: second.price,
        photo: second.photo,
        whyFit: second.whyFit,
        inclusions: second.inclusions,
        bookingUrl: second.bookingUrl,
        articleSlug: second.articleSlug,
        articleTitle: second.articleTitle,
      },
      {
        title: third.title,
        badge: `89% Match · ${third.badge}`,
        matchScore: 89,
        duration: third.duration,
        price: third.price,
        photo: third.photo,
        whyFit: third.whyFit,
        inclusions: third.inclusions,
        bookingUrl: third.bookingUrl,
        articleSlug: third.articleSlug,
        articleTitle: third.articleTitle,
      },
    ],
  };
}

interface Props {
  baseUrl?: string;
}

export default function TreatmentQuiz({ baseUrl = '/' }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({
    goal: [],
    area: [],
    pressure: [],
    duration: ['90'],
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const question = QUESTIONS[currentStep];
  const currentSelections = answers[question.id] || [];
  const progressPercent = Math.round(((currentStep + (isCompleted ? 1 : 0)) / QUESTIONS.length) * 100);

  const handleToggleOption = (optionId: string) => {
    if (question.multiSelect) {
      setAnswers((prev) => {
        const list = prev[question.id] || [];
        const nextList = list.includes(optionId)
          ? list.filter((id) => id !== optionId)
          : [...list, optionId];
        return { ...prev, [question.id]: nextList };
      });
    } else {
      // Single select
      setAnswers((prev) => ({ ...prev, [question.id]: [optionId] }));
    }
  };

  const handleNextStep = () => {
    if (currentSelections.length === 0) return;

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      if (typeof window !== 'undefined' && window.fsTrack) {
        window.fsTrack('quiz_step', {
          step: currentStep + 1,
          question: question.id,
          answer: currentSelections.join(','),
        });
      }
    } else {
      setIsCompleted(true);
      if (typeof window !== 'undefined' && window.fsTrack) {
        window.fsTrack('quiz_complete', {
          goal: (answers.goal || []).join(','),
          area: (answers.area || []).join(','),
          pressure: (answers.pressure || []).join(','),
          duration: (answers.duration || []).join(','),
        });
      }
    }

    requestAnimationFrame(() => {
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleBack = () => {
    if (isCompleted) {
      setIsCompleted(false);
    } else if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setAnswers({
      goal: [],
      area: [],
      pressure: [],
      duration: ['90'],
    });
    setCurrentStep(0);
    setIsCompleted(false);
  };

  const result = isCompleted ? calculateResult(answers) : null;

  return (
    <div ref={containerRef} className="mx-auto w-full max-w-3xl scroll-mt-24">
      {/* Quiz card container */}
      <div className="surface-card overflow-hidden p-6 sm:p-10 shadow-xl border border-black/10">
        {/* Header bar */}
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-black/5 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#574a2a]">
            <Compass size={16} className="text-[#476048]" aria-hidden="true" />
            <span>Treatment Finder Quiz</span>
          </div>

          <span className="text-xs font-medium text-ink-soft">
            {isCompleted ? 'Personalized Recommendations' : `Step ${currentStep + 1} of ${QUESTIONS.length}`}
          </span>
        </div>

        {/* Accessible Progress Bar */}
        <div
          role="progressbar"
          aria-label="Quiz progress"
          aria-valuenow={isCompleted ? 100 : progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mb-8 h-2 w-full overflow-hidden rounded-full bg-sand/60"
        >
          <div
            className="h-full bg-bronze transition-all duration-400 ease-out"
            style={{ width: `${isCompleted ? 100 : progressPercent}%` }}
          />
        </div>

        {!isCompleted ? (
          <div>
            <div className="mb-8">
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <h2 className="display-heading text-2xl sm:text-3xl font-semibold text-ink">
                  {question.title}
                </h2>
                {question.multiSelect && (
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#476048] bg-sage/15 px-2.5 py-0.5 rounded-full">
                    Select all that apply
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-ink-soft">{question.subtitle}</p>
            </div>

            {/* Semantic Options List */}
            <div className="space-y-3">
              {question.options.map((option) => {
                const Icon = option.icon ?? Sparkles;
                const isSelected = currentSelections.includes(option.id);

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleToggleOption(option.id)}
                    className={[
                      'group flex w-full cursor-pointer items-start gap-4 rounded-xl border p-4 text-left transition-all duration-200',
                      isSelected
                        ? 'border-bronze bg-bronze/10 shadow-sm ring-2 ring-bronze'
                        : 'border-black/10 bg-cloud/80 hover:border-bronze/50 hover:bg-sand/30 hover:shadow-sm',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors',
                        isSelected
                          ? 'bg-bronze text-cream'
                          : 'bg-sage/20 text-[#476048] group-hover:bg-sage/30',
                      ].join(' ')}
                      aria-hidden="true"
                    >
                      <Icon size={20} strokeWidth={1.8} />
                    </span>

                    <div className="flex-1">
                      <span className="block text-sm font-semibold text-ink group-hover:text-bronze transition-colors">
                        {option.label}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-ink-soft">
                        {option.description}
                      </span>
                    </div>

                    <span
                      className={[
                        'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors mt-0.5',
                        isSelected
                          ? 'border-bronze bg-bronze text-cream'
                          : 'border-black/20 group-hover:border-bronze text-transparent',
                      ].join(' ')}
                      aria-hidden="true"
                    >
                      <Check size={14} strokeWidth={2.5} />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between gap-4 border-t border-black/5 pt-5">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 text-xs font-semibold text-ink-soft hover:text-bronze transition-colors focus-visible:outline-2 focus-visible:outline-bronze"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                  <span>← Previous</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNextStep}
                disabled={currentSelections.length === 0}
                className="btn btn-primary px-6 py-2.5 text-xs font-semibold shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
              >
                {currentStep < QUESTIONS.length - 1 ? (
                  <>
                    <span>Continue</span>
                    {currentSelections.length > 0 && (
                      <span className="rounded-full bg-cream/25 px-2 py-0.5 text-[11px] font-bold">
                        {currentSelections.length}
                      </span>
                    )}
                    <span>→</span>
                  </>
                ) : (
                  <>
                    <span>View My Recommendations →</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Result View */
          result && (
            <div style={{ animation: 'reveal-in 0.4s var(--ease-out-soft) both' }}>
              {/* Dynamic Photo Header in Primary Result Card */}
              {result.primary.photo && (
                <div className="relative mb-6 -mx-6 -mt-6 sm:-mx-10 sm:-mt-10 h-48 sm:h-56 overflow-hidden rounded-t-[var(--radius-card)]">
                  <img
                    src={result.primary.photo}
                    alt={result.primary.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cloud via-transparent to-black/30" />
                  <span className="absolute bottom-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-charcoal/85 px-3.5 py-1 text-xs font-semibold text-gold backdrop-blur">
                    <Sparkles size={14} aria-hidden="true" /> {result.primary.badge}
                  </span>
                </div>
              )}

              {/* Primary Match Card */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#574a2a] bg-sand/60 px-2.5 py-0.5 rounded-full">
                    Top Recommendation
                  </span>
                </div>

                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="display-heading text-3xl sm:text-4xl font-semibold text-ink">
                    {result.primary.title}
                  </h2>
                  <div className="rounded-full bg-sand/60 px-3.5 py-1 text-xs font-semibold text-[#574a2a]">
                    {result.primary.duration} · {result.primary.price}
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-ink-soft rounded-xl bg-sand/40 p-4 border border-black/5">
                  <strong className="block font-semibold text-ink mb-1">Why this suits your body best:</strong>
                  {result.primary.whyFit}
                </p>

                {/* Standing Perks & Savings Microcopy */}
                <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-medium text-[#476048] bg-sage/12 p-3 rounded-xl border border-sage/20">
                  <span>🎁 Pay Cash at checkout: free hot stone or essential oil add-on</span>
                  <span>•</span>
                  <span>☀️ Early Bird: 10% off Mon–Thu before 11:30 am</span>
                </div>

                {/* Inclusions */}
                <div className="mt-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                    Treatment Inclusions
                  </h3>
                  <ul className="mt-3 space-y-2.5">
                    {result.primary.inclusions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink-soft">
                        <Check size={16} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[#476048]" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Conversion Buttons: Primary Booking + Phone Inquire */}
                <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <a
                    href={result.primary.bookingUrl}
                    target="_blank"
                    rel="noopener"
                    data-book={`quiz:${result.primary.title}`}
                    className="btn btn-primary flex-1 justify-center py-3.5 text-sm shadow-md"
                    aria-label={`Reserve ${result.primary.title} on Fresha`}
                  >
                    <CalendarHeart size={18} aria-hidden="true" /> Reserve Session · Instant Confirmation
                  </a>

                  <a
                    href="tel:+18582882600"
                    data-call={`quiz:${result.primary.title}`}
                    className="btn btn-outline justify-center py-3.5 text-sm"
                    aria-label="Call Forest Spa to consult or book by phone"
                  >
                    <Phone size={16} aria-hidden="true" /> Call to Consult
                  </a>
                </div>
              </div>

              {/* Close Alternatives Section */}
              <div className="mt-10 border-t border-black/10 pt-8">
                <div className="mb-5 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#574a2a]">
                      More Tailored Choices
                    </span>
                    <h3 className="display-heading text-xl sm:text-2xl font-semibold text-ink mt-0.5">
                      Close Alternative Treatments
                    </h3>
                  </div>
                  <p className="text-xs text-ink-soft">
                    2 other therapies tailored to your answers
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.alternatives.map((alt) => (
                    <div
                      key={alt.title}
                      className="flex flex-col justify-between rounded-2xl border border-black/10 bg-cloud/90 p-5 shadow-xs transition-all duration-300 hover:border-bronze/50 hover:shadow-md"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="inline-flex items-center gap-1 rounded-full bg-sand/70 px-2.5 py-0.5 text-[11px] font-semibold text-[#574a2a]">
                            <Sparkles size={12} className="text-[#476048]" />
                            {alt.badge}
                          </span>
                          <span className="text-xs font-semibold text-ink-soft">
                            {alt.duration} · {alt.price}
                          </span>
                        </div>

                        <h4 className="display-heading text-lg font-semibold text-ink">
                          {alt.title}
                        </h4>

                        <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                          {alt.whyFit}
                        </p>

                        <div className="mt-4 pt-3 border-t border-black/5">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft mb-2">
                            Key Inclusions:
                          </p>
                          <ul className="space-y-1.5">
                            {alt.inclusions.slice(0, 3).map((inc, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-ink-soft">
                                <Check size={14} className="mt-0.5 shrink-0 text-[#476048]" strokeWidth={2.5} />
                                <span className="line-clamp-1">{inc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-black/5">
                        <a
                          href={alt.bookingUrl}
                          target="_blank"
                          rel="noopener"
                          data-book={`quiz-alt:${alt.title}`}
                          className="btn btn-outline w-full justify-center py-2.5 text-xs font-semibold hover:border-bronze hover:bg-bronze hover:text-cream transition-all shadow-xs"
                          aria-label={`Reserve ${alt.title} on Fresha`}
                        >
                          <CalendarHeart size={14} /> Book {alt.title} →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secondary Actions: Adjust Answers & Retake Quiz */}
              <div className="mt-8 pt-4 border-t border-black/10 flex items-center justify-between gap-4 text-xs">
                <button
                  type="button"
                  onClick={handleBack}
                  className="cursor-pointer font-medium text-ink-soft hover:text-bronze transition-colors flex items-center gap-1.5 py-2"
                >
                  <Edit3 size={14} aria-hidden="true" /> Adjust My Answers
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="cursor-pointer font-medium text-ink-soft hover:text-bronze transition-colors flex items-center gap-1.5 py-2"
                >
                  <RotateCcw size={14} aria-hidden="true" /> Retake Quiz
                </button>
              </div>

              {/* Recommended Reading */}
              {result.primary.articleSlug && (
                <div className="mt-6 flex items-start gap-3 rounded-xl bg-cloud p-3.5 border border-black/5 shadow-xs">
                  <BookOpen size={18} className="mt-0.5 shrink-0 text-bronze" aria-hidden="true" />
                  <div className="text-xs">
                    <span className="block font-semibold text-ink">Recommended Reading:</span>
                    <a
                      href={`${baseUrl}journal/${result.primary.articleSlug}/`}
                      className="font-medium text-bronze hover:underline"
                    >
                      {result.primary.articleTitle || 'Read our in-depth wellness article →'}
                    </a>
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
