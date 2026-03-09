/**
 * Dark Patterns Taxonomy — derived from academic research on deceptive UI design.
 *
 * Source: "Unmasking Dark Patterns: A Machine Learning Approach to Detecting
 * Deceptive Design in E-commerce Websites" (arXiv:2406.01608v1, May 2024)
 * + additional taxonomy from Mathur et al. (2019), Gray et al. (2023),
 *   and AIDUI (Mansur et al., 2023).
 *
 * Used by the checklist, MCP tools, and the dark-pattern-scanner skill.
 */

export type DarkPatternCategory =
  | 'Forced Action'
  | 'Misdirection'
  | 'Obstruction'
  | 'Scarcity'
  | 'Sneaking'
  | 'Social Proof'
  | 'Urgency';

export type DarkPatternSeverity = 'critical' | 'high' | 'medium';

export interface DarkPatternType {
  id: string;
  category: DarkPatternCategory;
  name: string;
  description: string;
  severity: DarkPatternSeverity;
  /** Concrete text/UI examples that trigger this pattern */
  examples: string[];
  /** Regex-friendly keywords to search for in UI text */
  keywords: string[];
  /** How to fix or avoid this pattern */
  prevention: string[];
}

/**
 * Complete dark patterns taxonomy with 35 specific pattern types across 7 categories.
 */
export const DARK_PATTERNS: DarkPatternType[] = [
  // ── Forced Action ──────────────────────────────────────────────────
  {
    id: 'forced-continuity',
    category: 'Forced Action',
    name: 'Forced Continuity',
    description:
      'Free trials that silently convert to paid subscriptions without clear notice or easy cancellation.',
    severity: 'critical',
    examples: [
      'Your free trial ends tomorrow. Your card will be charged $49.99/mo.',
      'By signing up, you agree to auto-renewal at full price.',
    ],
    keywords: [
      'free trial',
      'auto-renew',
      'automatically charged',
      'subscription will continue',
      'cancel anytime',
    ],
    prevention: [
      'Show clear opt-in checkbox for paid conversion (unchecked by default)',
      'Send reminder email before trial-to-paid conversion',
      'Provide one-click cancellation',
    ],
  },
  {
    id: 'forced-registration',
    category: 'Forced Action',
    name: 'Forced Registration',
    description:
      'Requiring account creation to access content or complete an action that should not need an account.',
    severity: 'high',
    examples: [
      'Create an account to view this article',
      'Sign up to see your search results',
      'Register to continue browsing',
    ],
    keywords: [
      'sign up to',
      'create an account to',
      'register to',
      'log in to continue',
      'must have an account',
    ],
    prevention: [
      'Allow guest checkout / guest browsing',
      'Only require accounts when genuinely needed (e.g., order history)',
    ],
  },
  {
    id: 'forced-sharing',
    category: 'Forced Action',
    name: 'Forced Social Sharing',
    description:
      'Requiring users to share content on social media or invite friends to access features.',
    severity: 'high',
    examples: [
      'Share on Facebook to unlock this feature',
      'Invite 3 friends to continue',
      'Tweet about us to get your discount',
    ],
    keywords: [
      'share to unlock',
      'invite friends to',
      'share on.*to get',
      'tweet to unlock',
    ],
    prevention: [
      'Never gate features behind social sharing',
      'Make sharing optional with clear benefits',
    ],
  },
  {
    id: 'forced-consent',
    category: 'Forced Action',
    name: 'Forced Consent / Privacy Zuckering',
    description:
      'Pre-checking consent boxes, bundling unrelated permissions, or making privacy settings confusing so users share more data than intended.',
    severity: 'critical',
    examples: [
      'By continuing, you agree to share your data with our partners',
      'Pre-checked: "I consent to marketing emails and third-party data sharing"',
    ],
    keywords: [
      'by continuing you agree',
      'pre-checked',
      'share.*with.*partners',
      'consent to.*marketing',
    ],
    prevention: [
      'All consent checkboxes unchecked by default',
      'Separate consent for unrelated data uses',
      'Plain-language privacy controls',
    ],
  },
  {
    id: 'gamification-coercion',
    category: 'Forced Action',
    name: 'Gamification Coercion',
    description:
      'Using points, streaks, or rewards to pressure users into daily engagement or purchases they would not otherwise make.',
    severity: 'medium',
    examples: [
      'Your 30-day streak will reset if you don\'t log in today!',
      'You\'ll lose 500 points if you don\'t purchase by midnight',
    ],
    keywords: [
      'streak will reset',
      'lose.*points',
      'daily reward expires',
      'claim before it\'s gone',
    ],
    prevention: [
      'Allow pausing streaks without penalty',
      'Don\'t threaten loss of earned rewards',
    ],
  },

  // ── Misdirection ───────────────────────────────────────────────────
  {
    id: 'visual-misdirection',
    category: 'Misdirection',
    name: 'Visual Misdirection',
    description:
      'Using colour, size, or placement to draw attention away from unfavourable options (e.g., making "Accept All" bright and "Manage Preferences" grey).',
    severity: 'high',
    examples: [
      'Big bright "Accept All Cookies" button next to tiny grey "Manage" link',
      'Colourful "Upgrade" button, greyed-out "Continue with Free"',
    ],
    keywords: [],
    prevention: [
      'Give equal visual weight to accept/reject options',
      'Follow WCAG contrast guidelines for all interactive elements',
    ],
  },
  {
    id: 'trick-questions',
    category: 'Misdirection',
    name: 'Trick Questions',
    description:
      'Using confusing double-negatives or ambiguous wording so users accidentally opt into something.',
    severity: 'high',
    examples: [
      'Uncheck this box if you would prefer not to not receive emails',
      'I do not wish to unsubscribe from marketing communications',
    ],
    keywords: [
      'do not wish to not',
      'uncheck.*if you.*not',
      'prefer not to not',
    ],
    prevention: [
      'Use plain, affirmative language for options',
      'Test copy with real users for comprehension',
    ],
  },
  {
    id: 'bait-and-switch',
    category: 'Misdirection',
    name: 'Bait and Switch',
    description:
      'Advertising one thing but delivering another — e.g., showing a low price that changes at checkout, or a "free" product that requires purchases.',
    severity: 'critical',
    examples: [
      'Headline says "$9.99" but checkout shows $29.99 after fees',
      '"Free" app that requires in-app purchases to function',
    ],
    keywords: [
      'starting at',
      'as low as',
      'from.*\\$',
      'plus.*fees',
      'additional charges apply',
    ],
    prevention: [
      'Show all-inclusive pricing upfront',
      'Display total cost including fees before checkout',
    ],
  },
  {
    id: 'disguised-ads',
    category: 'Misdirection',
    name: 'Disguised Ads',
    description:
      'Advertisements styled to look like content, navigation, or download buttons.',
    severity: 'high',
    examples: [
      'Download button that is actually an ad',
      '"Recommended" section that is paid placement without disclosure',
    ],
    keywords: ['sponsored', 'promoted', 'ad', 'partner content'],
    prevention: [
      'Clearly label all advertisements with "Ad" or "Sponsored"',
      'Visual separation between content and ads',
    ],
  },
  {
    id: 'false-hierarchy',
    category: 'Misdirection',
    name: 'False Hierarchy',
    description:
      'Presenting options with misleading visual hierarchy so the company-preferred option looks like the only choice or the "recommended" one.',
    severity: 'medium',
    examples: [
      '"Most Popular" badge on the most expensive plan',
      'Pre-selecting the premium option in a radio group',
    ],
    keywords: [
      'most popular',
      'recommended',
      'best value',
      'best seller',
    ],
    prevention: [
      'Don\'t pre-select options that cost more',
      'Use genuine popularity/sales data for "popular" labels',
    ],
  },

  // ── Obstruction ────────────────────────────────────────────────────
  {
    id: 'hard-to-cancel',
    category: 'Obstruction',
    name: 'Hard to Cancel (Roach Motel)',
    description:
      'Making it easy to subscribe but extremely difficult to cancel — requiring phone calls, multiple pages, or hidden cancel buttons.',
    severity: 'critical',
    examples: [
      'To cancel, call our support line (Mon-Fri 9-5 EST only)',
      'Cancel button hidden under Account > Settings > Billing > Advanced > Cancel',
    ],
    keywords: [
      'call.*to cancel',
      'contact.*support.*cancel',
      'cannot cancel online',
    ],
    prevention: [
      'Cancellation must be as easy as sign-up (FTC Click-to-Cancel rule)',
      'Provide self-service cancellation in account settings',
    ],
  },
  {
    id: 'confirmation-shaming',
    category: 'Obstruction',
    name: 'Confirmshaming',
    description:
      'Using guilt-tripping language on decline buttons to shame users into accepting. E.g., "No thanks, I don\'t want to save money."',
    severity: 'high',
    examples: [
      '"No thanks, I prefer paying full price"',
      '"I don\'t want to be smarter"',
      '"No, I hate saving money"',
    ],
    keywords: [
      'no thanks.*I don\'t',
      'I prefer.*paying',
      'I don\'t want to.*save',
      'I hate',
    ],
    prevention: [
      'Use neutral decline text: "No, thanks" or "Dismiss"',
      'Never guilt-trip or shame users for declining',
    ],
  },
  {
    id: 'exit-obstruction',
    category: 'Obstruction',
    name: 'Exit Obstruction',
    description:
      'Showing multiple confirmation dialogs, countdown timers, or guilt-trip popups when users try to leave or close a page.',
    severity: 'high',
    examples: [
      'Are you SURE you want to leave? You\'ll lose your discount!',
      'Wait! Before you go... [3 more popups]',
    ],
    keywords: [
      'are you sure.*leave',
      'before you go',
      'wait.*don\'t leave',
      'you\'ll lose',
    ],
    prevention: [
      'Allow clean exit with at most one non-manipulative confirmation',
      'Save cart state so users can return',
    ],
  },
  {
    id: 'complex-process',
    category: 'Obstruction',
    name: 'Unnecessarily Complex Process',
    description:
      'Adding unnecessary steps to processes users want to complete quickly (e.g., multi-page unsubscribe flows, surveys before cancellation).',
    severity: 'medium',
    examples: [
      '5-step unsubscribe flow with survey, confirmation email, and 48-hour wait',
      'To delete your account, email us, wait 30 days, then confirm again',
    ],
    keywords: [
      'processing.*days',
      'waiting period',
      'additional steps required',
    ],
    prevention: [
      'Minimize steps for user-initiated actions',
      'Immediate effect for unsubscribe/delete requests',
    ],
  },

  // ── Scarcity ───────────────────────────────────────────────────────
  {
    id: 'false-stock-count',
    category: 'Scarcity',
    name: 'False Low Stock Warning',
    description:
      'Showing fake "only X left in stock" messages to create purchase urgency.',
    severity: 'high',
    examples: [
      'Only 2 left in stock!',
      'Hurry — almost sold out!',
      'Low stock: only 1 remaining',
    ],
    keywords: [
      'only.*left',
      'almost sold out',
      'low stock',
      'limited stock',
      'selling fast',
      'few remaining',
    ],
    prevention: [
      'Only show stock counts when they are real and verifiable',
      'Never fabricate scarcity numbers',
    ],
  },
  {
    id: 'false-popularity',
    category: 'Scarcity',
    name: 'False High Demand',
    description:
      'Showing fake "X people viewing this" or "Y people bought this today" messages.',
    severity: 'high',
    examples: [
      '23 people are looking at this right now',
      'Booked 5 times in the last hour!',
      '142 people have this in their cart',
    ],
    keywords: [
      'people.*looking at',
      'people.*viewing',
      'bought.*today',
      'in their cart',
      'booked.*last.*hour',
    ],
    prevention: [
      'Only show real-time metrics if they are genuine',
      'Disclose methodology for popularity claims',
    ],
  },
  {
    id: 'false-limited-edition',
    category: 'Scarcity',
    name: 'False Limited Edition / Exclusivity',
    description:
      'Labelling items as "limited edition" or "exclusive" when they are standard inventory.',
    severity: 'medium',
    examples: [
      'Exclusive offer — won\'t come back!',
      'Limited edition — get yours before they\'re gone forever',
    ],
    keywords: [
      'limited edition',
      'exclusive offer',
      'won\'t come back',
      'once.*gone',
    ],
    prevention: [
      'Only use "limited edition" for genuinely limited runs',
      'Be transparent about actual availability',
    ],
  },

  // ── Sneaking ───────────────────────────────────────────────────────
  {
    id: 'hidden-costs',
    category: 'Sneaking',
    name: 'Hidden Costs',
    description:
      'Revealing extra fees (shipping, service fees, taxes, tips) only at the final checkout step.',
    severity: 'critical',
    examples: [
      'Item shown as $20, but checkout shows $20 + $8.99 shipping + $3.50 service fee',
      'Price does not include mandatory "processing fee" revealed at payment',
    ],
    keywords: [
      'service fee',
      'processing fee',
      'handling fee',
      'additional.*fee',
      'shipping.*calculated at checkout',
    ],
    prevention: [
      'Show all-in pricing from the beginning',
      'Display shipping/fee estimates before checkout',
    ],
  },
  {
    id: 'sneak-into-basket',
    category: 'Sneaking',
    name: 'Sneak into Basket',
    description:
      'Automatically adding extra items (warranties, insurance, accessories) to the shopping cart without user action.',
    severity: 'critical',
    examples: [
      'Product protection plan auto-added to cart',
      'Donation pre-added at checkout',
      'Extra item added: "You may also need..."',
    ],
    keywords: [
      'added to your cart',
      'also added',
      'protection plan',
      'warranty included',
    ],
    prevention: [
      'Never add unrequested items to the cart',
      'Offer add-ons as opt-in suggestions, not defaults',
    ],
  },
  {
    id: 'hidden-subscription',
    category: 'Sneaking',
    name: 'Hidden Subscription',
    description:
      'Defaulting to recurring subscription instead of one-time purchase, often with a pre-selected "Subscribe & Save" toggle.',
    severity: 'critical',
    examples: [
      '"Subscribe & Save" pre-selected instead of one-time buy',
      'Default option is monthly subscription, one-time purchase hidden',
    ],
    keywords: [
      'subscribe.*save',
      'recurring.*default',
      'auto.*delivery',
      'delivered every',
    ],
    prevention: [
      'Default to one-time purchase',
      'Make subscription option clearly distinct and opt-in',
    ],
  },
  {
    id: 'drip-pricing',
    category: 'Sneaking',
    name: 'Drip Pricing',
    description:
      'Showing a low initial price, then gradually adding mandatory charges through the purchase funnel.',
    severity: 'high',
    examples: [
      'Flight advertised at $99, becomes $187 after taxes, seat selection, and baggage',
      'Hotel room $79/night → $125 after resort fee, cleaning fee, and city tax',
    ],
    keywords: [
      'starting.*from',
      'additional charges',
      'resort fee',
      'cleaning fee',
      'mandatory.*fee',
    ],
    prevention: [
      'Show total cost upfront including all mandatory fees',
      'If fees vary, show a representative total estimate',
    ],
  },

  // ── Social Proof ───────────────────────────────────────────────────
  {
    id: 'fake-testimonials',
    category: 'Social Proof',
    name: 'Fake Testimonials / Reviews',
    description:
      'Displaying fabricated reviews, AI-generated testimonials, or cherry-picked ratings to build false trust.',
    severity: 'critical',
    examples: [
      '5-star review from "John D." that appears on multiple unrelated products',
      '"Verified Purchase" badge on reviews that were incentivized or fake',
    ],
    keywords: [
      'verified.*review',
      'verified.*purchase',
      '★★★★★',
      'customers love',
    ],
    prevention: [
      'Only display genuine, verifiable reviews',
      'Disclose any incentivized reviews',
      'Use third-party review platforms for authenticity',
    ],
  },
  {
    id: 'fake-activity',
    category: 'Social Proof',
    name: 'Fake Activity Notifications',
    description:
      'Showing fake real-time purchase or signup notifications ("Sarah from NY just bought...") to create herd pressure.',
    severity: 'high',
    examples: [
      '"John from California just purchased this item 2 minutes ago"',
      '"Sarah from New York just signed up!"',
      'Pop-up: "Mike just claimed his discount"',
    ],
    keywords: [
      'just purchased',
      'just bought',
      'just signed up',
      'someone.*just',
      'minutes ago',
    ],
    prevention: [
      'Only show real, verified activity notifications',
      'Disclose if notifications are simulated or delayed',
    ],
  },
  {
    id: 'misleading-metrics',
    category: 'Social Proof',
    name: 'Misleading Success Metrics',
    description:
      'Displaying inflated or misleading statistics ("10 million users!", "99% satisfaction") without verifiable basis.',
    severity: 'medium',
    examples: [
      '"Trusted by 10 million users" (actually 10M downloads, not active users)',
      '"99% customer satisfaction" (based on a 50-person survey)',
    ],
    keywords: [
      'trusted by.*million',
      '% satisfaction',
      'customers served',
      'users worldwide',
    ],
    prevention: [
      'Qualify statistics with source and methodology',
      'Use auditable, third-party-verified metrics',
    ],
  },
  {
    id: 'authority-manipulation',
    category: 'Social Proof',
    name: 'False Authority / Endorsement',
    description:
      'Implying endorsement by celebrities, experts, or institutions that have not actually endorsed the product.',
    severity: 'critical',
    examples: [
      '"As seen on CNN" when CNN only mentioned the industry, not the product',
      '"Recommended by doctors" without specifying which doctors or studies',
    ],
    keywords: [
      'as seen on',
      'recommended by',
      'endorsed by',
      'featured in',
      'doctor.*recommended',
    ],
    prevention: [
      'Only claim endorsements that are real and documented',
      'Link to actual source of endorsement',
    ],
  },

  // ── Urgency ────────────────────────────────────────────────────────
  {
    id: 'fake-countdown',
    category: 'Urgency',
    name: 'Fake Countdown Timer',
    description:
      'Displaying countdown timers that reset on page refresh or are not tied to any real deadline.',
    severity: 'critical',
    examples: [
      'Countdown timer: "Offer expires in 2:34:12" (resets on refresh)',
      '"Flash sale ends in..." (same timer every day)',
    ],
    keywords: [
      'expires in',
      'offer ends in',
      'countdown',
      'flash sale',
      'ends.*today',
    ],
    prevention: [
      'Only show timers tied to genuine deadlines',
      'Timers must not reset on refresh',
    ],
  },
  {
    id: 'fake-urgency-text',
    category: 'Urgency',
    name: 'False Urgency Language',
    description:
      'Using high-pressure language ("Act NOW!", "Last chance!", "Don\'t miss out!") without a genuine time constraint.',
    severity: 'high',
    examples: [
      'ACT NOW before it\'s too late!',
      'LAST CHANCE — offer disappears forever!',
      'Don\'t miss out! Buy now!',
    ],
    keywords: [
      'act now',
      'last chance',
      'don\'t miss out',
      'hurry',
      'limited time',
      'before it\'s too late',
      'offer.*disappears',
    ],
    prevention: [
      'Only use urgency language for genuine time-limited offers',
      'Include verifiable end dates',
    ],
  },
  {
    id: 'fake-deal-expiry',
    category: 'Urgency',
    name: 'Fake Deal / Coupon Expiry',
    description:
      'Showing coupon codes or "special deals" with artificial expiry dates that keep renewing.',
    severity: 'high',
    examples: [
      '"Use code SAVE20 — expires tonight!" (same code valid next week)',
      '"Today only: 50% off" (runs every day)',
    ],
    keywords: [
      'today only',
      'expires tonight',
      'valid until.*today',
      'use code.*expires',
    ],
    prevention: [
      'Only show real expiry dates for genuine promotions',
      'Log and audit promotion durations',
    ],
  },
  {
    id: 'pressure-selling',
    category: 'Urgency',
    name: 'Pressure Selling',
    description:
      'Combining urgency cues (timers, stock counts, activity notifications) to create overwhelming purchase pressure.',
    severity: 'high',
    examples: [
      '"Only 1 left! 15 people are viewing this. Timer: 4:59 remaining"',
      '"Your cart will expire in 10 minutes — 3 others want this item"',
    ],
    keywords: [
      'cart.*expire',
      'others.*want this',
      'selling out',
      'reserve.*now',
    ],
    prevention: [
      'Limit urgency cues to one genuine signal per page',
      'Never combine fabricated scarcity, fake activity, and fake timers',
    ],
  },
];

/**
 * Helper: group dark patterns by category.
 */
export function getDarkPatternsByCategory(): Record<DarkPatternCategory, DarkPatternType[]> {
  const grouped = {} as Record<DarkPatternCategory, DarkPatternType[]>;
  for (const dp of DARK_PATTERNS) {
    if (!grouped[dp.category]) grouped[dp.category] = [];
    grouped[dp.category].push(dp);
  }
  return grouped;
}

/**
 * Helper: search dark patterns by text query.
 */
export function searchDarkPatterns(query: string): DarkPatternType[] {
  const q = query.toLowerCase();
  return DARK_PATTERNS.filter(
    (dp) =>
      dp.name.toLowerCase().includes(q) ||
      dp.description.toLowerCase().includes(q) ||
      dp.category.toLowerCase().includes(q) ||
      dp.examples.some((e) => e.toLowerCase().includes(q)) ||
      dp.keywords.some((k) => k.toLowerCase().includes(q))
  );
}
