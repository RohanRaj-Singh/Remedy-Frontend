export const APP_CONFIG = {
    name: 'Next App',
    description: 'A modern Next.js application',
    version: '1.0.0',
} as const;

export const API_ENDPOINTS = {
    users: '/users',
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout',
        refresh: '/auth/refresh',
    },
} as const;

export const ROUTES = {
    home: '/',
    login: '/login',
    register: '/register',
    profile: '/profile',
    dashboard: '/dashboard',
} as const;

export const PAGINATION = {
    defaultLimit: 10,
    maxLimit: 100,
} as const;

export const LOCAL_STORAGE_KEYS = {
    token: 'auth_token',
    user: 'user_data',
    theme: 'theme_preference',
} as const;
