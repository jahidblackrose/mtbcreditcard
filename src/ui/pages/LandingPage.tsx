/**
 * MTB Credit Card Application - Landing Page
 *
 * Entry point for both SELF and ASSISTED modes.
 * Displays card products and eligibility check.
 *
 * API: Uses landing.api.ts ONLY
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts';
import { LoadingSpinner, ErrorMessage } from '../components';
import { getCardProducts, checkEligibility } from '@/api/landing.api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Users, CheckCircle2, ArrowRight, Shield, Clock, Sparkles } from 'lucide-react';
import { env } from '@/config';
import type { CardProduct } from '@/types';

export function LandingPage() {
  const navigate = useNavigate();
  const [cardProducts, setCardProducts] = useState<CardProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [checkingEligibility, setCheckingEligibility] = useState(false);

  useEffect(() => {
    async function loadCardProducts() {
      const response = await getCardProducts();
      if (response.status === 200 && response.data) {
        setCardProducts(response.data);
      } else {
        setError(response.message);
      }
      setLoading(false);
    }
    loadCardProducts();
  }, []);

  const handleEligibilityCheck = async () => {
    setCheckingEligibility(true);
    const response = await checkEligibility(monthlyIncome);
    setCheckingEligibility(false);
    
    if (response.status === 200 && response.data) {
      if (response.data.eligible) {
        navigate('/apply', { state: { eligibleCards: response.data.eligibleCards } });
      } else {
        setError('Based on your income, you may not be eligible for our credit cards at this time.');
      }
    } else {
      setError(response.message);
    }
  };

  const handleModeSelect = (mode: 'SELF' | 'ASSISTED') => {
    navigate('/apply', { state: { mode } });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Development Mode Warning Banner */}
      {env.MODE === 'MOCK' && (
        <div className="bg-amber-500/10 border-b border-amber-500/30">
          <div className="container mx-auto px-4 py-3 flex items-center justify-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
              Development Mode - For testing purposes only
            </span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Quick & Easy Digital Application</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Your Perfect Credit Card
            <span className="block text-primary mt-2">Awaits You</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Experience seamless banking with MTB Credit Cards. Apply online in minutes
            or visit any branch for assisted application.
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-5 w-5 text-success" />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-5 w-5 text-primary" />
              <span>Quick Approval</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>No Hidden Charges</span>
            </div>
          </div>
        </section>

        {error && (
          <ErrorMessage message={error} className="max-w-md mx-auto mb-8" />
        )}

        {/* Mode Selection */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Choose Your Application Mode
            </h2>
            <p className="text-muted-foreground">
              Select how you'd like to proceed with your application
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Self Mode */}
            <Card
              className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50 group"
              onClick={() => handleModeSelect('SELF')}
            >
              {/* Popular Badge */}
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              </div>

              <CardHeader className="text-center pb-4">
                <div className="mx-auto bg-gradient-to-br from-primary/20 to-primary/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Self Application</CardTitle>
                <CardDescription className="text-base">
                  Apply online from anywhere, anytime
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {[
                    'Complete at your own pace',
                    'Save and resume later',
                    'Upload documents digitally',
                    'Track status online 24/7',
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full gap-2" size="lg">
                  Start Application
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Assisted Mode */}
            <Card
              className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-500/50 group"
              onClick={() => navigate('/rm/login')}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto bg-gradient-to-br from-blue-500/20 to-blue-500/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Branch Assistance</CardTitle>
                <CardDescription className="text-base">
                  Get guided help from our Relationship Managers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {[
                    'Expert guidance throughout',
                    'Document verification on-spot',
                    'No OTP required for customer',
                    'Priority processing',
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full gap-2 border-blue-500 text-blue-600 hover:bg-blue-500/10" size="lg">
                  RM Portal Login
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick Eligibility Check */}
        <section className="max-w-md mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Eligibility Check</CardTitle>
              <CardDescription>
                Enter your monthly income to see eligible cards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="income">Monthly Income (BDT)</Label>
                  <Input
                    id="income"
                    type="text"
                    placeholder="e.g., 50,000"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
                  onClick={handleEligibilityCheck}
                  disabled={checkingEligibility || !monthlyIncome}
                >
                  {checkingEligibility ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Checking...
                    </>
                  ) : (
                    'Check Eligibility'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Card Products Preview */}
        <section>
          <h2 className="text-xl font-semibold text-foreground text-center mb-6">
            Available Credit Cards
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cardProducts.slice(0, 4).map((card) => (
              <Card key={card.id} className="text-center">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{card.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Annual Fee: ৳{card.annualFee}</p>
                  <p>Limit: ৳{card.creditLimitMin} - ৳{card.creditLimitMax}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
