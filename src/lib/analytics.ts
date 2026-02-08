/**
 * Analytics utility for tracking user interactions
 * Uses Vercel Analytics with custom event tracking
 */

import { track } from '@vercel/analytics';

/**
 * Track quiz-related events
 */
export const trackQuizEvent = {
  /**
   * Quiz started from a specific location
   */
  started: (location: 'hero' | 'cta-section' | 'footer' | 'direct' | 'homepage') => {
    track('quiz_started', { location });
  },

  /**
   * User progressed to a new step in the quiz
   */
  stepCompleted: (stepNumber: number, stepName: string, answer?: string | string[]) => {
    track('quiz_step_completed', {
      step_number: stepNumber,
      step_name: stepName,
      answer: Array.isArray(answer) ? answer.join(',') : answer,
    });
  },

  /**
   * User abandoned the quiz
   */
  abandoned: (stepNumber: number, timeSpent: number) => {
    track('quiz_abandoned', {
      step_number: stepNumber,
      time_spent_seconds: timeSpent,
    });
  },

  /**
   * Quiz completed and submitted
   */
  completed: (answers: any, timeSpent: number) => {
    track('quiz_completed', {
      total_time_seconds: timeSpent,
      has_email: !!answers.email,
      experienced_failure: answers.experiencedFailure,
      role: answers.role,
    });
  },
};

/**
 * Track CTA button clicks
 */
export const trackCTAClick = (
  buttonText: string,
  location: string,
  destination?: string
) => {
  track('cta_clicked', {
    button_text: buttonText,
    location,
    destination,
  });
};

/**
 * Track navigation events
 */
export const trackNavigation = {
  /**
   * Internal link clicked
   */
  internalLink: (linkText: string, destination: string) => {
    track('internal_link_clicked', {
      link_text: linkText,
      destination,
    });
  },

  /**
   * External link clicked
   */
  externalLink: (linkText: string, destination: string) => {
    track('external_link_clicked', {
      link_text: linkText,
      destination,
    });
  },

  /**
   * Scroll depth milestone reached
   */
  scrollDepth: (depth: 25 | 50 | 75 | 100, page: string) => {
    track('scroll_depth', {
      depth_percent: depth,
      page,
    });
  },
};

/**
 * Track case study interactions
 */
export const trackCaseStudy = {
  /**
   * Case study expanded/viewed
   */
  viewed: (caseStudyName: string) => {
    track('case_study_viewed', {
      case_study: caseStudyName,
    });
  },

  /**
   * Case study link clicked
   */
  linkClicked: (caseStudyName: string, linkType: string) => {
    track('case_study_link_clicked', {
      case_study: caseStudyName,
      link_type: linkType,
    });
  },
};

/**
 * Track form interactions
 */
export const trackForm = {
  /**
   * Form started (user focused on first field)
   */
  started: (formName: string) => {
    track('form_started', {
      form_name: formName,
    });
  },

  /**
   * Form submitted
   */
  submitted: (formName: string, success: boolean) => {
    track('form_submitted', {
      form_name: formName,
      success,
    });
  },

  /**
   * Form error occurred
   */
  error: (formName: string, errorMessage: string) => {
    track('form_error', {
      form_name: formName,
      error: errorMessage,
    });
  },
};

/**
 * Track page engagement
 */
export const trackEngagement = {
  /**
   * Time spent on page before leaving
   */
  timeOnPage: (page: string, seconds: number) => {
    track('time_on_page', {
      page,
      seconds,
    });
  },

  /**
   * Video or media interaction
   */
  mediaInteraction: (
    mediaType: 'video' | 'audio' | 'animation',
    action: 'play' | 'pause' | 'complete',
    mediaId?: string
  ) => {
    track('media_interaction', {
      media_type: mediaType,
      action,
      media_id: mediaId,
    });
  },
};

/**
 * Track demand / interest signals for features that don't exist yet.
 * Every click on a "coming soon" card or link is a vote for that feature.
 */
export const trackDemand = {
  /**
   * User clicked a "coming soon" feature card
   */
  featureClicked: (
    feature: string,
    location: string,
    variant?: string
  ) => {
    track('demand_feature_clicked', {
      feature,
      location,
      variant: variant ?? 'default',
    });
  },

  /**
   * User submitted their email on a coming-soon page
   */
  waitlistSignup: (feature: string) => {
    track('demand_waitlist_signup', { feature });
  },

  /**
   * Which A/B variant was shown to the user
   */
  variantShown: (testName: string, variant: string) => {
    track('ab_variant_shown', {
      test_name: testName,
      variant,
    });
  },
};

/**
 * Track email capture
 */
export const trackEmailCapture = {
  /**
   * Email submitted successfully
   */
  submitted: (source: string) => {
    track('email_captured', {
      source,
    });
  },

  /**
   * Newsletter signup
   */
  newsletterSignup: (location: string) => {
    track('newsletter_signup', {
      location,
    });
  },
};
