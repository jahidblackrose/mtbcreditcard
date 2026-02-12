/**
 * MTB Credit Card Application - Landing Page
 * 
 * Premium banking landing with navy/gold theme.
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
import { CreditCard, Users, CheckCircle2, ArrowRight, Shield, Clock, Globe } from 'lucide-react';
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
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        {/* Hero Section */}
        <section className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-medium mb-4">
            <Shield className="h-3.5 w-3.5" />
            Secure Online Application
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
            Apply for an MTB Credit Card
          </h1>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Experience premium banking with MTB Credit Cards. Apply online in minutes 
            or visit any branch for assisted application.
          </p>
        </section>

        {error && (
          <ErrorMessage message={error} className="max-w-md mx-auto mb-8" />
        )}

        {/* Mode Selection */}
        <section className="mb-14">
          <h2 className="text-lg font-semibold text-foreground text-center mb-6">
            How would you like to apply?
          </h2>
          <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {/* Self Mode */}
            <Card 
              className="cursor-pointer hover:border-primary/40 hover:shadow-md transition-all group"
              onClick={() => handleModeSelect('SELF')}
            >
              <CardHeader className="pb-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">Self Application</CardTitle>
                <CardDescription className="text-[13px]">
                  Apply online from anywhere, anytime
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-[13px] text-muted-foreground mb-5">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success flex-shrink-0" />
                    Complete at your own pace
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success flex-shrink-0" />
                    Upload documents digitally
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success flex-shrink-0" />
                    Track status online
                  </li>
                </ul>
                <Button className="w-full" size="default">
                  Start Self Application
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Assisted Mode */}
            <Card 
              className="cursor-pointer hover:border-accent/40 hover:shadow-md transition-all group"
              onClick={() => navigate('/rm/login')}
            >
              <CardHeader className="pb-3">
                <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/15 transition-colors">
                  <Users className="h-5 w-5 text-accent" />
                </div>
                <CardTitle className="text-base">Assisted Application</CardTitle>
                <CardDescription className="text-[13px]">
                  For Bank Staff (RM Login Required)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-[13px] text-muted-foreground mb-5">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success flex-shrink-0" />
                    Expert guidance throughout
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success flex-shrink-0" />
                    Document verification on-spot
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success flex-shrink-0" />
                    No OTP required for customer
                  </li>
                </ul>
                <Button className="w-full" variant="outline">
                  RM Portal Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick Eligibility Check */}
        <section className="max-w-md mx-auto mb-14">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Eligibility Check</CardTitle>
              <CardDescription className="text-[13px]">
                Enter your monthly income to see eligible cards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="income" className="text-[13px]">Monthly Income (BDT)</Label>
                  <Input
                    id="income"
                    type="text"
                    placeholder="e.g., 50,000"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className="mt-1.5"
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

        {/* Card Products */}
        <section>
          <h2 className="text-lg font-semibold text-foreground text-center mb-6">
            Available Credit Cards
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cardProducts.slice(0, 4).map((card) => (
              <Card key={card.id} className="text-center hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center mx-auto mb-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-sm">{card.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-[13px] text-muted-foreground space-y-1">
                  <p>Annual Fee: ৳{card.annualFee}</p>
                  <p>Limit: ৳{card.creditLimitMin} - ৳{card.creditLimitMax}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Trust indicators */}
        <section className="mt-14 pt-8 border-t border-border">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <Shield className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-xs font-medium text-foreground">256-bit Encryption</p>
              <p className="text-[11px] text-muted-foreground">Your data is secure</p>
            </div>
            <div>
              <Clock className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-xs font-medium text-foreground">Quick Approval</p>
              <p className="text-[11px] text-muted-foreground">Get approved in minutes</p>
            </div>
            <div>
              <Globe className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-xs font-medium text-foreground">Global Acceptance</p>
              <p className="text-[11px] text-muted-foreground">Accepted worldwide</p>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
