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
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    id: 'goal',
    title: 'What is your primary wellness goal today?',
    subtitle: 'Choose what your body and mind are asking for most right now.',
    options: [
      {
        id: 'tension',
        label: 'Release Deep Knots & Chronic Tension',
        description: 'Targeted deep pressure to dissolve stubborn muscle stiffness and pain.',
        icon: Activity,
      },
      {
        id: 'calm',
        label: 'Pure Relaxation & Stress Relief',
        description: 'Smooth, rhythmic strokes to quiet the mind and reset your nervous system.',
        icon: Sparkles,
      },
      {
        id: 'head_spa',
        label: 'Scalp Revival, Head Spa & Mental Detox',
        description: 'Botanical steam, halo water-ring hydrotherapy and cranial acupressure.',
        icon: Droplets,
      },
      {
        id: 'desk',
        label: 'Desk Fatigue, Tech Neck & Screen Strain',
        description: 'Targeted relief for tight shoulders, forearms, wrists, and neck.',
        icon: Monitor,
      },
      {
        id: 'active',
        label: 'Athletic Recovery & Leg Soreness',
        description: 'Focused leg work, assisted stretching, and muscular rejuvenation.',
        icon: Footprints,
      },
      {
        id: 'couple',
        label: 'Shared Sanctuary for Two',
        description: 'Unwind side-by-side with a loved one in our ambient couples suite.',
        icon: Heart,
      },
      {
        id: 'prenatal',
        label: 'Gentle Maternal & Pregnancy Care',
        description: 'Safe side-lying comfort to relieve lower back pain and leg swelling.',
        icon: Flower2,
      },
    ],
  },
  {
    id: 'area',
    title: 'Where is your body holding the most discomfort?',
    subtitle: 'We will ensure your therapist dedicates focused attention to this zone.',
    options: [
      {
        id: 'neck_shoulders',
        label: 'Neck, Shoulders & Upper Back',
        description: 'Trapezius tightness, stiff neck, and shoulder blade knots.',
        icon: Zap,
      },
      {
        id: 'head_jaw',
        label: 'Head, Temples & Jaw (TMJ / Clenching)',
        description: 'Teeth grinding, temple headaches, and cranial tension.',
        icon: Smile,
      },
      {
        id: 'low_back',
        label: 'Lower Back, Hips & Glutes',
        description: 'Sciatic tenderness, pelvic stiffness, and lumbar fatigue.',
        icon: Flame,
      },
      {
        id: 'legs_feet',
        label: 'Legs, Calves & Tired Feet',
        description: 'Plantar aches, calf cramps, and standing fatigue.',
        icon: Footprints,
      },
      {
        id: 'full_body',
        label: 'Full-Body Exhaustion',
        description: 'An overall feeling of heaviness needing complete head-to-toe renewal.',
        icon: Compass,
      },
    ],
  },
  {
    id: 'pressure',
    title: 'What therapy style and pressure do you prefer?',
    subtitle: 'Every session is personalized, but this sets your baseline.',
    options: [
      {
        id: 'deep',
        label: 'Firm & Deliberate (Deep Pressure)',
        description: 'Slow, firm strokes that work into deeper muscle layers and trigger points.',
        icon: Activity,
      },
      {
        id: 'gentle',
        label: 'Gentle & Flowing (Light to Medium)',
        description: 'Smooth effleurage strokes that cradle the nervous system without soreness.',
        icon: Feather,
      },
      {
        id: 'heat',
        label: 'Warming Heat (Basalt Stones / Botanical Packs)',
        description: 'Deep penetrating heat to melt away stiffness before muscles are worked.',
        icon: Flame,
      },
      {
        id: 'hydro',
        label: 'Hydrotherapy & Scalp Water-Ring',
        description: 'Warm waterfall streams, soothing steam, and scalp hair revival.',
        icon: Droplets,
      },
      {
        id: 'stretch',
        label: 'Dynamic Stretch & Acupressure',
        description: 'Assisted yoga-style passive stretching to unlock joint mobility.',
        icon: Move,
      },
    ],
  },
  {
    id: 'duration',
    title: 'How much time do you have to retreat?',
    subtitle: 'Select your preferred window of calm.',
    options: [
      {
        id: '60',
        label: '45 – 60 Minutes (Focused Reset)',
        description: 'Efficient and targeted — ideal for busy schedules or localized pain.',
        icon: Clock,
      },
      {
        id: '90',
        label: '90 Minutes (The Sweet Spot)',
        description: 'Our most popular length — ample time for full-body balance plus deep problem-area focus.',
        icon: Hourglass,
      },
      {
        id: '120',
        label: '120 Minutes (Ultimate Sanctuary)',
        description: 'An unhurried, deeply immersive escape for total top-to-toe surrender.',
        icon: Sparkles,
      },
    ],
  },
];

interface QuizResult {
  title: string;
  badge: string;
  matchScore: number;
  duration: string;
  price: string;
  photo: string;
  whyFit: string;
  inclusions: string[];
  bookingUrl: string;
  articleSlug?: string;
  articleTitle?: string;
  secondaryTitle: string;
  secondaryDuration: string;
  secondaryPrice: string;
  secondaryUrl: string;
}

function calculateResult(answers: Record<string, string>): QuizResult {
  const goal = answers['goal'] || 'tension';
  const area = answers['area'] || 'neck_shoulders';
  const pressure = answers['pressure'] || 'deep';
  const duration = answers['duration'] || '90';

  // Maternal safety priority
  if (goal === 'prenatal') {
    return {
      title: 'Prenatal Massage',
      badge: '99% Match for Maternal Comfort',
      matchScore: 99,
      duration: duration === '90' ? '90 min' : '60 min',
      price: duration === '90' ? '$120' : '$80',
      photo: photos.couplesRoom.src.src,
      whyFit:
        'Designed specifically for expectant mothers with ergonomic side-lying cushions that safely relieve lower back compression, ease hip tightness, and reduce swelling.',
      inclusions: [
        'Safe side-lying positioning with supportive body cushions',
        'Gentle lumbar and hip sciatic relief',
        'Circulatory leg massage to ease swelling and fatigue',
        'Nurturing maternal certified care',
      ],
      bookingUrl: bookingUrl('s:20874198'),
      articleSlug: 'prenatal-massage-guide',
      articleTitle: 'Nurturing the Mother: Guide to Prenatal Massage',
      secondaryTitle: 'Swedish Massage (Gentle)',
      secondaryDuration: '60–90 min',
      secondaryPrice: 'From $75',
      secondaryUrl: bookingUrl('s:20874160'),
    };
  }

  if (goal === 'couple') {
    return {
      title: duration === '90' ? 'Couples Massage · 90 min' : 'Couples Massage · 60 min',
      badge: '98% Match for Shared Relaxation',
      matchScore: 98,
      duration: duration === '90' ? '90 min' : '60 min',
      price: duration === '90' ? '$210' : '$140',
      photo: photos.couplesRoom.src.src,
      whyFit:
        'Unwind side-by-side with your partner or friend in our ambient private suite. Each person can choose their individual preferred modality (Swedish or Deep Tissue) and pressure.',
      inclusions: [
        'Private serene couples treatment suite',
        'Two skilled therapists in synchronized harmony',
        'Customized modality per guest (Swedish or Deep Tissue)',
        'Built-in 10% couples discount',
      ],
      bookingUrl: bookingUrl(duration === '90' ? 'p:1651756' : 'p:1651755'),
      secondaryTitle: 'Head-to-Toe Retreat Premier',
      secondaryDuration: '90 min',
      secondaryPrice: '$135',
      secondaryUrl: bookingUrl('s:20888388'),
    };
  }

  if (goal === 'head_spa' || area === 'head_jaw' || pressure === 'hydro') {
    if (duration === '90' || duration === '120') {
      return {
        title: 'Signature Head Spa & Body Massage',
        badge: '99% Match for Total Scalp & Body Renewal',
        matchScore: 99,
        duration: duration === '120' ? '120 min' : '90 min',
        price: duration === '120' ? '$155' : '$125',
        photo: photos.headSpaWash.src.src,
        whyFit:
          'The ultimate fusion of scalp wellness and muscular relaxation. Features our full head spa basin treatment with halo waterfall rinse, paired with a customized body massage and warm stones.',
        inclusions: [
          'Scalp exfoliation, deep cleanse & botanical steam',
          'Mesmerizing halo water-ring hydrotherapy rinse',
          'Acupressure along scalp, neck & shoulder meridians',
          'Customized full-body massage with warm hot stones',
        ],
        bookingUrl: bookingUrl('s:20874453'),
        articleSlug: 'head-spa-scalp-therapy-benefits',
        articleTitle: 'The Signature Head Spa Ritual: Science & Scalp Health',
        secondaryTitle: 'Head & TMJ Pain Relief',
        secondaryDuration: '60 min',
        secondaryPrice: '$95',
        secondaryUrl: bookingUrl('s:20888564'),
      };
    } else {
      return {
        title: 'Signature Head Spa',
        badge: '97% Match for Scalp & Mental Reset',
        matchScore: 97,
        duration: '60 min',
        price: 'From $85',
        photo: photos.headSpaWash.src.src,
        whyFit:
          'Deep scalp cleansing, warm botanical steam, and cranial acupressure topped off with our iconic halo water ring to relieve mental chatter, headaches, and tension.',
        inclusions: [
          'Scalp detox & purifying botanical wash',
          'Warm halo waterfall ring rinse',
          'Targeted cranial and temple acupressure',
          'Argan oil infusion & keratin conditioning',
        ],
        bookingUrl: bookingUrl('s:20874427'),
        articleSlug: 'head-spa-scalp-therapy-benefits',
        articleTitle: 'The Signature Head Spa Ritual: Scalp Health & Calm',
        secondaryTitle: 'Head & TMJ Pain Relief',
        secondaryDuration: '45 min',
        secondaryPrice: '$75',
        secondaryUrl: bookingUrl('s:20888530'),
      };
    }
  }

  if (goal === 'desk' || (area === 'neck_shoulders' && pressure === 'deep')) {
    return {
      title: 'Computer Relief Combo',
      badge: '98% Match for Screen & Posture Fatigue',
      matchScore: 98,
      duration: duration === '120' ? '120 min' : duration === '60' ? '60 min' : '90 min',
      price: duration === '120' ? '$150' : duration === '60' ? '$90' : '$120',
      photo: photos.sanctuarySuite.src.src,
      whyFit:
        'Engineered specifically for desk workers. Combines focused forearm, wrist, and hand work with deep tissue upper back therapy and warm stones to dissolve tech neck.',
      inclusions: [
        'Dedicated massage for shoulders, arms, wrists & hands',
        'Deep tissue or Thai bodywork targeting upper back knots',
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
      secondaryTitle: 'Upper Body Tension Release',
      secondaryDuration: '60 min',
      secondaryPrice: '$90',
      secondaryUrl: bookingUrl('s:20888511'),
    };
  }

  if (goal === 'active' || area === 'legs_feet') {
    return {
      title: 'Runner Rescue Combo',
      badge: '97% Match for Active Leg Recovery',
      matchScore: 97,
      duration: duration === '60' ? '60 min' : '90 min',
      price: duration === '60' ? '$90' : '$125',
      photo: photos.sanctuaryRoom.src.src,
      whyFit:
        'Designed for runners, hikers, and active individuals. Focuses heavily on the quads, hamstrings, IT bands, and calves with warm stones and assisted stretching.',
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
      secondaryTitle: 'Sports Massage',
      secondaryDuration: '60–90 min',
      secondaryPrice: 'From $75',
      secondaryUrl: bookingUrl('s:20874176'),
    };
  }

  if (pressure === 'heat' || area === 'full_body') {
    if (duration === '90' || duration === '120') {
      return {
        title: 'Head-to-Toe Retreat (Premier)',
        badge: '98% Match for Complete Full-Body Escape',
        matchScore: 98,
        duration: duration === '120' ? '120 min' : '90 min',
        price: duration === '120' ? '$160' : '$135',
        photo: photos.heroAmbiance.src.src,
        whyFit:
          'Our most comprehensive sanctuary combo. Layers full-body massage with targeted head/scalp/TMJ therapy, nourishing hand mask, and revitalizing foot scrub.',
        inclusions: [
          'Full-body massage tailored to your preferred depth',
          'Head, scalp & TMJ massage with soothing eye mask',
          'Nourishing hand massage with hydrating hand mask',
          'Foot massage with botanical exfoliating scrub',
          'Pure essential oil aromatherapy',
        ],
        bookingUrl: bookingUrl(duration === '120' ? 's:20888407' : 's:20888388'),
        secondaryTitle: 'Stone & Scent Combo',
        secondaryDuration: '90 min',
        secondaryPrice: '$125',
        secondaryUrl: bookingUrl('s:20888346'),
      };
    } else {
      return {
        title: 'Stone & Scent Combo (Preferred)',
        badge: '96% Match for Warm Muscle Relief',
        matchScore: 96,
        duration: '60 min',
        price: '$90',
        photo: photos.heroAmbiance.src.src,
        whyFit:
          'Combines a full-body massage with warm basalt stone therapy, foot reflexology, and essential oils to melt stubborn stiffness with soothing heat.',
        inclusions: [
          '50-min body massage of your choice',
          '10-min foot reflexology with scrub',
          'Soothing heated volcanic basalt stones',
          'Calming botanical aromatherapy oils',
        ],
        bookingUrl: bookingUrl('s:20888277'),
        secondaryTitle: 'Swedish Massage with Hot Stones',
        secondaryDuration: '60 min',
        secondaryPrice: '$95',
        secondaryUrl: bookingUrl('s:20874160'),
      };
    }
  }

  // Fallback based on pressure: Deep vs Swedish
  if (pressure === 'deep') {
    return {
      title: 'Deep Tissue Massage',
      badge: '97% Match for Persistent Tension',
      matchScore: 97,
      duration: duration === '120' ? '120 min' : duration === '90' ? '90 min' : '60 min',
      price: duration === '120' ? '$155' : duration === '90' ? '$115' : '$80',
      photo: photos.sanctuaryRoom.src.src,
      whyFit:
        'Deliberate, firm pressure focused on deeper muscle layers to release chronic stiffness, postural knots, and restore comfortable movement.',
      inclusions: [
        'Therapeutic focus on stubborn muscle knots and adhesions',
        'Customized pressure calibrated to your comfort',
        'Occipital, shoulder, and lower back tension release',
        'Enhanceable with hot stones or Tiger Balm at checkout',
      ],
      bookingUrl: bookingUrl('s:20874167'),
      articleSlug: 'deep-tissue-vs-swedish',
      articleTitle: 'Deep Tissue vs. Swedish Massage: How to Choose',
      secondaryTitle: 'Upper Body Tension Release',
      secondaryDuration: '60 min',
      secondaryPrice: '$90',
      secondaryUrl: bookingUrl('s:20888511'),
    };
  }

  return {
    title: 'Swedish Massage',
    badge: '98% Match for Restorative Calm',
    matchScore: 98,
    duration: duration === '120' ? '120 min' : duration === '90' ? '90 min' : '60 min',
    price: duration === '120' ? '$145' : duration === '90' ? '$110' : '$75',
    photo: photos.sanctuaryRoom.src.src,
    whyFit:
      'Long, gliding effleurage strokes and gentle rhythmic kneading that relax muscles, enhance healthy circulation, and gently downshift your nervous system into deep calm.',
    inclusions: [
      'Flowing full-body relaxation strokes',
      'Nourishing botanical massage oil',
      'Gentle nervous system and stress relief',
      'Zero post-massage soreness or discomfort',
    ],
    bookingUrl: bookingUrl('s:20874160'),
    articleSlug: 'deep-tissue-vs-swedish',
    articleTitle: 'Deep Tissue vs. Swedish Massage: How to Choose',
    secondaryTitle: 'Stone & Scent Combo',
    secondaryDuration: '60 min',
    secondaryPrice: '$90',
    secondaryUrl: bookingUrl('s:20888277'),
  };
}

interface Props {
  baseUrl?: string;
}

export default function TreatmentQuiz({ baseUrl = '/' }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const question = QUESTIONS[currentStep];
  const progressPercent = Math.round(((currentStep + (isCompleted ? 1 : 0)) / QUESTIONS.length) * 100);

  const handleSelectOption = (optionId: string) => {
    setSelectedOptionId(optionId);

    // 280ms tactile confirmation pause: shows selection ring before advancing
    setTimeout(() => {
      const updated = { ...answers, [question.id]: optionId };
      setAnswers(updated);
      setSelectedOptionId(null);

      if (currentStep < QUESTIONS.length - 1) {
        setCurrentStep((prev) => prev + 1);
        if (typeof window !== 'undefined' && window.fsTrack) {
          window.fsTrack('quiz_step', {
            step: currentStep + 1,
            question: question.id,
            answer: optionId,
          });
        }
      } else {
        setIsCompleted(true);
        if (typeof window !== 'undefined' && window.fsTrack) {
          window.fsTrack('quiz_complete', {
            goal: updated.goal,
            area: updated.area,
            pressure: updated.pressure,
            duration: updated.duration,
          });
        }
      }

      // Smooth scroll back to top of quiz card
      requestAnimationFrame(() => {
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }, 280);
  };

  const handleBack = () => {
    if (isCompleted) {
      setIsCompleted(false);
    } else if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
  };

  const result = isCompleted ? calculateResult(answers) : null;

  return (
    <div ref={containerRef} className="mx-auto w-full max-w-2xl scroll-mt-24">
      {/* Quiz card container */}
      <div className="surface-card overflow-hidden p-6 sm:p-10 shadow-xl border border-black/10">
        {/* Header bar */}
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-black/5 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#574a2a]">
            <Compass size={16} className="text-[#476048]" aria-hidden="true" />
            <span>Treatment Finder Quiz</span>
          </div>

          <span className="text-xs font-medium text-ink-soft">
            {isCompleted ? 'Recommendation' : `Step ${currentStep + 1} of ${QUESTIONS.length}`}
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
              <h2 className="display-heading text-2xl sm:text-3xl font-semibold text-ink">
                {question.title}
              </h2>
              <p className="mt-2 text-sm text-ink-soft">{question.subtitle}</p>
            </div>

            {/* Semantic Radio Group for Options */}
            <div role="radiogroup" aria-label={question.title} className="space-y-3">
              {question.options.map((option) => {
                const Icon = option.icon ?? Sparkles;
                const isSelected = (selectedOptionId ?? answers[question.id]) === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleSelectOption(option.id)}
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
                        'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors mt-0.5',
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

            {/* Back Button with 44px Minimum Touch Target */}
            {currentStep > 0 && (
              <div className="mt-8 pt-4 border-t border-black/5">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 text-xs font-semibold text-ink-soft hover:text-bronze transition-colors focus-visible:outline-2 focus-visible:outline-bronze"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                  <span>← Previous Question</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Result View */
          result && (
            <div style={{ animation: 'reveal-in 0.4s var(--ease-out-soft) both' }}>
              {/* Dynamic Photo Header in Result Card */}
              {result.photo && (
                <div className="relative mb-6 -mx-6 -mt-6 sm:-mx-10 sm:-mt-10 h-48 sm:h-56 overflow-hidden rounded-t-[var(--radius-card)]">
                  <img
                    src={result.photo}
                    alt={result.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cloud via-transparent to-black/30" />
                  <span className="absolute bottom-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-charcoal/85 px-3.5 py-1 text-xs font-semibold text-gold backdrop-blur">
                    <Sparkles size={14} aria-hidden="true" /> {result.badge}
                  </span>
                </div>
              )}

              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="display-heading text-3xl sm:text-4xl font-semibold text-ink">
                  {result.title}
                </h2>
                <div className="rounded-full bg-sand/60 px-3.5 py-1 text-xs font-semibold text-[#574a2a]">
                  {result.duration} · {result.price}
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-ink-soft rounded-xl bg-sand/40 p-4 border border-black/5">
                <strong className="block font-semibold text-ink mb-1">Why this suits your body:</strong>
                {result.whyFit}
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
                  {result.inclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink-soft">
                      <Check size={16} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[#476048]" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Conversion Buttons: Primary Booking + Phone Inquire + Adjust */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={result.bookingUrl}
                  target="_blank"
                  rel="noopener"
                  data-book={`quiz:${result.title}`}
                  className="btn btn-primary flex-1 justify-center py-3.5 text-sm shadow-md"
                  aria-label={`Reserve ${result.title} on Fresha`}
                >
                  <CalendarHeart size={18} aria-hidden="true" /> Reserve Session · Instant Confirmation
                </a>

                <a
                  href="tel:+18582882600"
                  data-call={`quiz:${result.title}`}
                  className="btn btn-outline justify-center py-3.5 text-sm"
                  aria-label="Call Forest Spa to consult or book by phone"
                >
                  <Phone size={16} aria-hidden="true" /> Call to Consult
                </a>
              </div>

              {/* Secondary Actions */}
              <div className="mt-3 flex items-center justify-between gap-4 text-xs">
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

              {/* Secondary Recommendation & Reading */}
              <div className="mt-8 border-t border-black/5 pt-6 space-y-4">
                {result.articleSlug && (
                  <div className="flex items-start gap-3 rounded-xl bg-cloud p-3.5 border border-black/5 shadow-xs">
                    <BookOpen size={18} className="mt-0.5 shrink-0 text-bronze" aria-hidden="true" />
                    <div className="text-xs">
                      <span className="block font-semibold text-ink">Recommended Reading:</span>
                      <a
                        href={`${baseUrl}journal/${result.articleSlug}/`}
                        className="font-medium text-bronze hover:underline"
                      >
                        {result.articleTitle || 'Read our in-depth wellness article →'}
                      </a>
                    </div>
                  </div>
                )}

                <div className="rounded-xl border border-black/5 bg-sand/20 p-4 text-xs text-ink-soft">
                  <span className="font-semibold text-ink">Also great for your needs: </span>
                  <a
                    href={result.secondaryUrl}
                    target="_blank"
                    rel="noopener"
                    data-book={`quiz-secondary:${result.secondaryTitle}`}
                    className="font-medium text-bronze hover:underline"
                  >
                    {result.secondaryTitle} ({result.secondaryDuration} · {result.secondaryPrice}) →
                  </a>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
