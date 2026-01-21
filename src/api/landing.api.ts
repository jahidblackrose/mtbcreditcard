/**
 * MTB Credit Card Application - Landing Page API
 * 
 * API adapter for the landing/home page.
 * Contains card products and eligibility check.
 * 
 * MODE: MOCK implementation
 */

import { env } from '@/config';
import { http } from './httpClient';
import type { ApiResponse, CardProduct } from '@/types';

// ============================================
// MOCK DATA
// ============================================

const MOCK_CARD_PRODUCTS: CardProduct[] = [
  {
    id: 'visa-classic-001',
    type: 'VISA_CLASSIC',
    name: 'MTB Visa Classic',
    annualFee: '1,500',
    interestRate: '24.00',
    creditLimitMin: '50,000',
    creditLimitMax: '200,000',
    benefits: [
      'No joining fee',
      'EMI facilities',
      'Airport lounge access (2/year)',
      'Fuel surcharge waiver',
    ],
  },
  {
    id: 'visa-gold-001',
    type: 'VISA_GOLD',
    name: 'MTB Visa Gold',
    annualFee: '3,000',
    interestRate: '22.00',
    creditLimitMin: '100,000',
    creditLimitMax: '500,000',
    benefits: [
      'No joining fee',
      'EMI facilities',
      'Airport lounge access (4/year)',
      'Fuel surcharge waiver',
      'Travel insurance',
      'Reward points on every purchase',
    ],
  },
  {
    id: 'visa-platinum-001',
    type: 'VISA_PLATINUM',
    name: 'MTB Visa Platinum',
    annualFee: '5,000',
    interestRate: '20.00',
    creditLimitMin: '300,000',
    creditLimitMax: '1,500,000',
    benefits: [
      'No joining fee',
      'Premium EMI facilities',
      'Unlimited airport lounge access',
      'Fuel surcharge waiver',
      'Comprehensive travel insurance',
      '2X reward points on every purchase',
      'Concierge services',
    ],
  },
  {
    id: 'mc-gold-001',
    type: 'MASTERCARD_GOLD',
    name: 'MTB Mastercard Gold',
    annualFee: '3,500',
    interestRate: '21.00',
    creditLimitMin: '100,000',
    creditLimitMax: '600,000',
    benefits: [
      'No joining fee',
      'EMI facilities',
      'Airport lounge access (4/year)',
      'Fuel surcharge waiver',
      'Mastercard Priceless experiences',
    ],
  },
];

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Fetches all available card products
 */
export async function getCardProducts(): Promise<ApiResponse<CardProduct[]>> {
  if (env.MODE === 'MOCK') {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      status: 200,
      message: 'Card products retrieved successfully',
      data: MOCK_CARD_PRODUCTS,
    };
  }

  return http.get<CardProduct[]>('/cards/products');
}

/**
 * Quick eligibility check based on income
 */
export async function checkEligibility(
  monthlyIncome: string
): Promise<ApiResponse<{ eligible: boolean; eligibleCards: CardProduct[] }>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const incomeValue = parseFloat(monthlyIncome.replace(/,/g, ''));
    
    if (isNaN(incomeValue) || incomeValue < 25000) {
      return {
        status: 200,
        message: 'Eligibility check completed',
        data: {
          eligible: false,
          eligibleCards: [],
        },
      };
    }

    // Filter cards based on income (simplified logic)
    const eligibleCards = MOCK_CARD_PRODUCTS.filter(card => {
      const minLimit = parseFloat(card.creditLimitMin.replace(/,/g, ''));
      return incomeValue * 3 >= minLimit;
    });

    return {
      status: 200,
      message: 'Eligibility check completed',
      data: {
        eligible: eligibleCards.length > 0,
        eligibleCards,
      },
    };
  }

  return http.post('/eligibility/check', { monthlyIncome });
}
