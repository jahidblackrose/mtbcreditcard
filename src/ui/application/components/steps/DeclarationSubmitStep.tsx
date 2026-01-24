/**
 * Step 12: Declaration & Submit
 * Final step with terms, declaration, live photo, and submit
 */

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Camera, Check, FileText, Shield, Loader2 } from 'lucide-react';
import { FaceCapture } from '@/ui/application/components/FaceCapture';
import { cn } from '@/lib/utils';
import type { SupplementaryCardData } from '@/types/application-form.types';

interface DeclarationSubmitStepProps {
  termsAccepted: boolean;
  declarationAccepted: boolean;
  onTermsChange: (accepted: boolean) => void;
  onDeclarationChange: (accepted: boolean) => void;
  livePhoto: string | null;
  onLivePhotoCapture: (photo: string) => void;
  supplementaryCard?: SupplementaryCardData;
  hasSupplementaryCard: boolean;
}

const TERMS_AND_CONDITIONS = `
By submitting this application, I confirm that:

1. All information provided in this application is true, accurate, and complete to the best of my knowledge.

2. I authorize Mutual Trust Bank Limited (MTB) to verify any information provided and conduct necessary checks including but not limited to credit bureau inquiries.

3. I understand that providing false or misleading information may result in the rejection of my application or cancellation of any credit facility granted.

4. I agree to abide by the terms and conditions governing MTB credit card products, as may be amended from time to time.

5. I understand that the bank reserves the right to approve or reject this application at its sole discretion.

6. I consent to receive communications from MTB regarding my credit card and related products/services via SMS, email, or phone.
`;

const DECLARATION_TEXT = `
I hereby declare that:

• I am not a politically exposed person (PEP) unless otherwise disclosed in this application.

• I have not been declared bankrupt and there are no bankruptcy proceedings pending against me.

• All sources of income disclosed in this application are legitimate and legally obtained.

• I will inform the bank immediately of any material changes to the information provided in this application.

• I have read and understood the Key Fact Statement (KFS) for the credit card product I am applying for.

• I authorize the bank to debit my MTB account for any dues arising from the credit card facility.
`;

export function DeclarationSubmitStep({
  termsAccepted,
  declarationAccepted,
  onTermsChange,
  onDeclarationChange,
  livePhoto,
  onLivePhotoCapture,
  supplementaryCard,
  hasSupplementaryCard,
}: DeclarationSubmitStepProps) {
  const [localTerms, setLocalTerms] = useState(termsAccepted);
  const [localDeclaration, setLocalDeclaration] = useState(declarationAccepted);

  const handleTermsChange = (checked: boolean) => {
    setLocalTerms(checked);
    onTermsChange(checked);
  };

  const handleDeclarationChange = (checked: boolean) => {
    setLocalDeclaration(checked);
    onDeclarationChange(checked);
  };

  const isReadyToSubmit = localTerms && localDeclaration && livePhoto !== null;

  return (
    <div className="space-y-6">
      {/* Live Photo Verification */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Camera className="h-5 w-5 text-primary" />
            Live Photo Verification
          </CardTitle>
          <CardDescription>
            Please capture a live photo for identity verification before final submission
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FaceCapture
            onCapture={onLivePhotoCapture}
            currentPhoto={livePhoto || undefined}
            label="Capture Live Photo for Verification"
          />
          {!livePhoto && (
            <p className="text-sm text-destructive mt-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Live photo is required for submission
            </p>
          )}
        </CardContent>
      </Card>

      {/* Supplementary Card Summary */}
      {hasSupplementaryCard && supplementaryCard && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5" />
              Supplementary Cardholder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <p className="font-medium">{supplementaryCard.fullName || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Relationship:</span>
                <p className="font-medium">{supplementaryCard.relationship || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Name on Card:</span>
                <p className="font-medium">{supplementaryCard.nameOnCard || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Spending Limit:</span>
                <p className="font-medium">{supplementaryCard.spendingLimitPercentage || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Important Notice */}
      <Card className="border-warning/50 bg-warning/5">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <AlertTriangle className="h-6 w-6 text-warning flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-foreground">Important</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Please read the following terms and declaration carefully before submitting your application.
                By proceeding, you confirm that you have read, understood, and agree to all terms.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms & Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            Terms & Conditions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-h-48 overflow-y-auto p-4 bg-muted rounded-lg text-sm whitespace-pre-line">
            {TERMS_AND_CONDITIONS}
          </div>
          
          <div className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg">
            <Checkbox
              id="terms"
              checked={localTerms}
              onCheckedChange={handleTermsChange}
            />
            <div className="space-y-1 leading-none">
              <label htmlFor="terms" className="font-medium cursor-pointer">
                I have read and agree to the Terms & Conditions
              </label>
              <p className="text-sm text-muted-foreground">
                You must accept the terms to proceed with your application
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Declaration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5" />
            Declaration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-h-48 overflow-y-auto p-4 bg-muted rounded-lg text-sm whitespace-pre-line">
            {DECLARATION_TEXT}
          </div>
          
          <div className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg">
            <Checkbox
              id="declaration"
              checked={localDeclaration}
              onCheckedChange={handleDeclarationChange}
            />
            <div className="space-y-1 leading-none">
              <label htmlFor="declaration" className="font-medium cursor-pointer">
                I confirm that all information provided is accurate and I accept the declaration
              </label>
              <p className="text-sm text-muted-foreground">
                This declaration is mandatory for application submission
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submission Readiness Checklist */}
      <Card className={cn(
        "border-2 transition-colors",
        isReadyToSubmit
          ? "border-success bg-success/5" 
          : "border-muted"
      )}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              isReadyToSubmit 
                ? "bg-success text-success-foreground" 
                : "bg-muted text-muted-foreground"
            )}>
              <Check className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold">
                {isReadyToSubmit 
                  ? "Ready to Submit!" 
                  : "Complete the checklist to submit"}
              </h4>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li className="flex items-center gap-2">
                  {livePhoto ? (
                    <Check className="h-3 w-3 text-success" />
                  ) : (
                    <span className="h-3 w-3 rounded-full border border-muted-foreground" />
                  )}
                  Live photo captured
                </li>
                <li className="flex items-center gap-2">
                  {localTerms ? (
                    <Check className="h-3 w-3 text-success" />
                  ) : (
                    <span className="h-3 w-3 rounded-full border border-muted-foreground" />
                  )}
                  Terms accepted
                </li>
                <li className="flex items-center gap-2">
                  {localDeclaration ? (
                    <Check className="h-3 w-3 text-success" />
                  ) : (
                    <span className="h-3 w-3 rounded-full border border-muted-foreground" />
                  )}
                  Declaration accepted
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
