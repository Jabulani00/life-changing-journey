// Application constants and configuration
export const Constants = {
  // App Information
  APP_NAME: 'Life Changing Journey',
  APP_VERSION: '1.0.0',
  
  // API Endpoints
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  
  // Payment Configuration
  STRIPE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  
  // Contact Information
  CONTACT: {
    email: 'info@lifechangingjourney.co.za',
    phone: '+27 31 035 0208',
    address: 'Durban, KwaZulu-Natal, South Africa',
    website: 'https://www.lifechangingjourney.co.za',
  },

  /** Canonical production site URL (membership, legal, marketing). */
  SITE_URL: 'https://www.lifechangingjourney.co.za',

  /**
   * Base URL for the membership web app (opens `/plans` from the app).
   * Defaults to https://www.lifechangingjourney.co.za in all builds.
   * Set EXPO_PUBLIC_LCJ_WEB_URL only to point at local membership-web during dev.
   */
  PUBLIC_SITE_URL: (() => {
    const productionUrl = 'https://www.lifechangingjourney.co.za'
    const fromEnv =
      typeof process.env.EXPO_PUBLIC_LCJ_WEB_URL === 'string' && process.env.EXPO_PUBLIC_LCJ_WEB_URL
        ? process.env.EXPO_PUBLIC_LCJ_WEB_URL.replace(/\/$/, '')
        : ''
    return fromEnv || productionUrl
  })(),
  
  // Social Media Links
  SOCIAL_MEDIA: {
    facebook: 'https://www.facebook.com/share/1B7sqUfweq/',
    instagram: 'https://www.instagram.com/lifechanging_journey?igsh=ZjF5ZjBoZWU1NXQx',
    linkedin: 'https://linkedin.com/company/lifechangingjourney',
    youtube: 'https://www.youtube.com/@lifechangingjourney-h4j',
  },
  
  // Service Categories
  SERVICE_CATEGORIES: {
    MENTAL_WELLNESS: 'mental_wellness',
    SPIRITUAL_GROWTH: 'spiritual_growth',
    FINANCIAL_GUIDANCE: 'financial_guidance',
    HYPNOTHERAPY: 'hypnotherapy',
  },
  
  // Booking Statuses
  BOOKING_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  },
  
  // Donation Statuses
  DONATION_STATUS: {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded',
  },
  
  // Resource Types
  RESOURCE_TYPES: {
    ARTICLE: 'article',
    VIDEO: 'video',
    AUDIO: 'audio',
    PDF: 'pdf',
  },
  
  // Notification Types
  NOTIFICATION_TYPES: {
    BOOKING: 'booking',
    REMINDER: 'reminder',
    GENERAL: 'general',
    PROMOTION: 'promotion',
    EVENT: 'event',
    DAILY_WORD: 'daily_word',
    LIVE: 'live',
  },
  
  // Time Slots for Bookings
  TIME_SLOTS: [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  ],
  
  // Default Service Duration (in minutes)
  DEFAULT_SESSION_DURATION: 60,
  
  // Supported Languages
  SUPPORTED_LANGUAGES: [
    { code: 'en', name: 'English' },
    { code: 'zu', name: 'Zulu' },
    { code: 'af', name: 'Afrikaans' },
  ],
  
  // Error Messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',
    GENERIC_ERROR: 'Something went wrong. Please try again.',
  },
  
  // Success Messages
  SUCCESS_MESSAGES: {
    PROFILE_UPDATED: 'Profile updated successfully',
    BOOKING_CREATED: 'Booking created successfully',
    DONATION_COMPLETED: 'Thank you for your donation',
    MESSAGE_SENT: 'Message sent successfully',
  },
  
  // Validation Rules
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 6,
    MAX_MESSAGE_LENGTH: 1000,
    MAX_NAME_LENGTH: 100,
    PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  
  // Storage Keys
  STORAGE_KEYS: {
    USER_TOKEN: 'user_token',
    USER_PREFERENCES: 'user_preferences',
    ONBOARDING_COMPLETED: 'onboarding_completed',
    TERMS_ACCEPTED: 'lcj_terms_accepted_v1',
    LANGUAGE_PREFERENCE: 'language_preference',
  },
  
  // Default Values
  DEFAULTS: {
    CURRENCY: 'ZAR',
    COUNTRY: 'South Africa',
    TIMEZONE: 'Africa/Johannesburg',
    LANGUAGE: 'en',
  },
}
