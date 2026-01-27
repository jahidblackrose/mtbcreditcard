/**
 * Existing Applicant - Add Supplementary Card Flow
 * 
 * Steps:
 * A. Card Identification (PCI-DSS: first 6 + last 4 only)
 * B. OTP Verification
 * C. Basic Info Display
 * D. Supplementary Card Form
 */

import { useState } from 'react';
import { ArrowLeft, CreditCard, Shield, User, CheckCircle, Loader2, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { OtpVerificationScreen } from './OtpVerificationScreen';
import { SupplementaryCardForm } from './SupplementaryCardForm';

type FlowStep = 'identification' | 'otp' | 'info-display' | 'supplementary-form';

interface PrimaryCardInfo {
  cardholderName: string;
  maskedCardNumber: string;
  cardType: string;
}

interface ExistingApplicantSupplementaryProps {
  onBack: () => void;
  onComplete: () => void;
}

export function ExistingApplicantSupplementary({
  onBack,
  onComplete,
}: ExistingApplicantSupplementaryProps) {
  const [step, setStep] = useState<FlowStep>('identification');
  const [mobileNumber, setMobileNumber] = useState('');
  const [cardFirst6, setCardFirst6] = useState('');
  const [cardLast4, setCardLast4] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [primaryCardInfo, setPrimaryCardInfo] = useState<PrimaryCardInfo | null>(null);

  // Validation
  const isMobileValid = /^01\d{9}$/.test(mobileNumber);
  const isCardFirst6Valid = /^\d{6}$/.test(cardFirst6);
  const isCardLast4Valid = /^\d{4}$/.test(cardLast4);
  const canProceed = isMobileValid && isCardFirst6Valid && isCardLast4Valid;

  const handleIdentificationSubmit = async () => {
    if (!canProceed) return;
    
    setIsLoading(true);
    // Simulate API call to verify card and send OTP
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep('otp');
  };

  const handleOtpVerified = async () => {
    setIsLoading(true);
    // Simulate API call to fetch cardholder info
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response
    setPrimaryCardInfo({
      cardholderName: 'JOHN DOE',
      maskedCardNumber: `${cardFirst6}******${cardLast4}`,
      cardType: 'MTB Visa Platinum',
    });
    
    setIsLoading(false);
    setStep('info-display');
  };

  const handleResendOtp = async () => {
    // Mock resend
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  // Step A: Card Identification
  if (step === 'identification') {
    return (
      <div className="min-h-screen bg-background px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <CardTitle>Verify Your Identity</CardTitle>
              <CardDescription>
                Enter your card details for secure verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mobile Number */}
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="mobile"
                    placeholder="01XXXXXXXXX"
                    className="pl-10"
                    maxLength={11}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter your registered mobile number (11 digits)
                </p>
              </div>

              {/* Card Number - PCI-DSS Compliant */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CreditCard className="h-4 w-4" />
                  <span>Card Number (Partial)</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* First 6 digits */}
                  <div className="flex-1">
                    <Label htmlFor="card-first6" className="text-xs text-muted-foreground">
                      First 6 digits
                    </Label>
                    <Input
                      id="card-first6"
                      placeholder="XXXXXX"
                      maxLength={6}
                      className="text-center font-mono tracking-widest"
                      value={cardFirst6}
                      onChange={(e) => setCardFirst6(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>

                  {/* Masked middle */}
                  <div className="flex items-center justify-center px-2 py-3 text-muted-foreground font-mono">
                    ******
                  </div>

                  {/* Last 4 digits */}
                  <div className="flex-1">
                    <Label htmlFor="card-last4" className="text-xs text-muted-foreground">
                      Last 4 digits
                    </Label>
                    <Input
                      id="card-last4"
                      placeholder="XXXX"
                      maxLength={4}
                      className="text-center font-mono tracking-widest"
                      value={cardLast4}
                      onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  For security, we only ask for the first 6 and last 4 digits
                </p>
              </div>

              <Button
                onClick={handleIdentificationSubmit}
                disabled={!canProceed || isLoading}
                className="w-full mobile-cta-button"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Proceed to Verification'
                )}
              </Button>

              <Button
                variant="ghost"
                onClick={onBack}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Step B: OTP Verification
  if (step === 'otp') {
    return (
      <OtpVerificationScreen
        mobileNumber={mobileNumber}
        onVerify={handleOtpVerified}
        onResend={handleResendOtp}
        onBack={() => setStep('identification')}
      />
    );
  }

  // Step C: Primary Card Info Display
  if (step === 'info-display' && primaryCardInfo) {
    return (
      <div className="min-h-screen bg-background px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-14 h-14 bg-success/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-7 w-7 text-success" />
              </div>
              <CardTitle>Verification Successful</CardTitle>
              <CardDescription>
                Your identity has been verified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Card Summary */}
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Cardholder Name</p>
                        <p className="font-semibold">{primaryCardInfo.cardholderName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Card Number</p>
                        <p className="font-mono text-sm">{primaryCardInfo.maskedCardNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Card Type</p>
                        <p className="text-sm">{primaryCardInfo.cardType}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={() => setStep('supplementary-form')}
                className="w-full mobile-cta-button"
              >
                <User className="mr-2 h-4 w-4" />
                Add Supplementary Card
              </Button>

              <Button
                variant="ghost"
                onClick={onBack}
                className="w-full"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Step D: Supplementary Card Form
  if (step === 'supplementary-form') {
    return (
      <div className="min-h-screen bg-background px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setStep('info-display')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Add Supplementary Card</h1>
            <p className="text-muted-foreground">
              Fill in the supplementary cardholder details
            </p>
          </div>

          <SupplementaryCardForm
            onSubmit={(data) => {
              console.log('Supplementary card submitted:', data);
              onComplete();
            }}
            onCancel={() => setStep('info-display')}
          />
        </div>
      </div>
    );
  }

  return null;
}
