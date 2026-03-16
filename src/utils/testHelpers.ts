/**
 * Test Helpers and Utilities
 * Common functions and utilities for testing
 */

import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a test query client
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

// Custom render function with providers
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const testQueryClient = createTestQueryClient();

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
}

// Mock localStorage
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach(key => delete store[key]);
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] || null,
  };
};

// Mock sessionStorage
export const mockSessionStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach(key => delete store[key]);
    },
  };
};

// Wait for async operations
export const waitForAsync = () =>
  new Promise(resolve => setTimeout(resolve, 0));

// Mock form data generator
export const generateMockFormData = () => ({
  cardType: 'VISA_PLATINUM',
  personalInfo: {
    fullName: 'John Doe',
    dateOfBirth: '1990-01-01',
    gender: 'MALE',
    motherName: 'Jane Smith',
    fatherName: 'Robert Doe',
    maritalStatus: 'SINGLE',
    nationality: 'BANGLADESHI',
    nidNumber: '1234567890123',
    mobileNumber: '01712345678',
    email: 'john.doe@example.com',
  },
  professionalInfo: {
    occupation: 'EMPLOYED',
    organizationName: 'Tech Company Ltd',
    designation: 'Software Engineer',
    annualIncome: '1200000',
    officeAddress: {
      addressLine1: '123 Gulshan Avenue',
      city: 'Dhaka',
      district: 'Dhaka',
      postalCode: '1212',
      country: 'Bangladesh',
    },
  },
  monthlyIncome: {
    monthlySalary: '100000',
    otherIncome: '20000',
    totalIncome: '120000',
  },
});

// Mock API responses
export const mockSuccessResponse = (data: any) => ({
  success: true,
  data,
  message: 'Success',
});

export const mockErrorResponse = (message: string) => ({
  success: false,
  error: message,
  message,
});

// Mock user session
export const mockUserSession = {
  isAuthenticated: true,
  user: {
    id: 'test-user-1',
    role: 'APPLICANT',
    mobileNumber: '01712345678',
    applicationId: 'APP-2026-001',
  },
  expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
};

// Mock RM session
export const mockRMSession = {
  isAuthenticated: true,
  user: {
    id: 'rm-001',
    role: 'RM',
    name: 'Ahmed Rahman',
    staffId: 'STAFF-001',
    branch: 'Gulshan Branch',
  },
  expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
};

// Step navigation helpers
export const goToNextStep = (currentStep: number) => currentStep + 1;
export const goToPreviousStep = (currentStep: number) => Math.max(1, currentStep - 1);

// Form validation helpers
export const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePhone = (phone: string) =>
  /^01[3-9]\d{8}$/.test(phone);

export const validateNID = (nid: string) =>
  /^\d{10,13}$/.test(nid);

// Mock timer utilities
export const advanceTimersByTime = (ms: number) => {
  jest.advanceTimersByTime(ms);
};

// Mock intersection observer
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;

  return mockIntersectionObserver;
};

// Mock match media
export const mockMatchMedia = (matches: boolean = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

// Performance measurement helpers
export const mockPerformanceNow = () => {
  let now = 0;
  jest.spyOn(performance, 'now').mockImplementation(() => now);
  return {
    setTime: (time: number) => { now = time; },
    advanceTime: (ms: number) => { now += ms; },
  };
};

// Console spy helpers
export const spyOnConsole = (method: 'log' | 'error' | 'warn') =>
  jest.spyOn(console, method).mockImplementation(() => {});

// Export all helpers
export default {
  renderWithProviders,
  createTestQueryClient,
  mockLocalStorage,
  mockSessionStorage,
  waitForAsync,
  generateMockFormData,
  mockSuccessResponse,
  mockErrorResponse,
  mockUserSession,
  mockRMSession,
  goToNextStep,
  goToPreviousStep,
  validateEmail,
  validatePhone,
  validateNID,
  advanceTimersByTime,
  mockIntersectionObserver,
  mockMatchMedia,
  mockPerformanceNow,
  spyOnConsole,
};
