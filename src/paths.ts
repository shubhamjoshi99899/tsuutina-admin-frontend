export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    app_layout: '/dashboard/app-layout',
    carousel: '/dashboard/carousel',
    directory: '/dashboard/directory',
    history: '/dashboard/history',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    forms: '/dashboard/forms',
    settings: '/dashboard/settings',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
