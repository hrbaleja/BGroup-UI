export const PATHS = {

  // Authentication Routes
  LOGIN: 'auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgotpassword',

  // Home Routes
  INDEX: '/',
  HOME: '/dashboard',

  // User and Profile Routes
  USER: '/user',
  PROFILE: '/profile',
  CREDENTIAL: '/credential',

  // Company and Financial Routes
  COMPANIES: '/companies',
  TRANSACTION: '/transaction',
  INCOME: '/income',
  OTHER_INCOME: '/others/income',

  // Account Routes     
  ACCOUNT: '/account',
  ACCOUNTNEW: '/new-account',

  // Settings Routes
  ERRORLOG: '/setting/errorlog',
  CONFIGURATION: '/setting/configuration',

  // General Routes
  PAGE_404: '404',
  ANY: '*',

  // Additional Content Routes
  PRODUCTS: '/products',
  BLOG: '/blog',

  CUSTOMER: '/account/:id',
};

export const CATEGORIES = {
  COMPANIES: 'Company',
  GENERAL: 'General',
  ACCOUNT: 'Account',
  OTHER: 'Other Options',
  SETTING: 'Settings '
}