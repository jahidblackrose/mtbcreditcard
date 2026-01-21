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
import { CreditCard, Users, CheckCircle2, ArrowRight } from 'lucide-react';
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
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            MTB Credit Card Application
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience seamless banking with MTB Credit Cards. Apply online in minutes 
            or visit any branch for assisted application.
          </p>
        </section>

        {error && (
          <ErrorMessage message={error} className="max-w-md mx-auto mb-8" />
        )}

        {/* Mode Selection */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground text-center mb-6">
            How would you like to apply?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Self Mode */}
            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleModeSelect('SELF')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <CreditCard className="h-7 w-7 text-primary" />
                </div>
                <CardTitle>Self Application</CardTitle>
                <CardDescription>
                  Apply online from anywhere, anytime
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Complete at your own pace
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Upload documents digitally
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Track status online
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="default">
                  Start Self Application
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Assisted Mode */}
            <Card 
              className="cursor-pointer hover:border-accent transition-colors"
              onClick={() => navigate('/rm/login')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto bg-accent/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-7 w-7 text-accent" />
                </div>
                <CardTitle>Assisted Application</CardTitle>
                <CardDescription>
                  For Bank Staff (RM Login Required)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Expert guidance throughout
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Document verification on-spot
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    No OTP required for customer
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline">
                  RM Portal Login
                  <ArrowRight className="ml-2 h-4 w-4" />
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
                  className="w-full" 
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
