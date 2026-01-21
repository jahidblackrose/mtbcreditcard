/**
 * Final Step: Declaration & Submit
 */

import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, FileText, Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface DeclarationSubmitStepProps {
  termsAccepted: boolean;
  declarationAccepted: boolean;
  onTermsChange: (accepted: boolean) => void;
  onDeclarationChange: (accepted: boolean) => void;
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
}: DeclarationSubmitStepProps) {
  const form = useForm({
    defaultValues: {
      termsAccepted,
      declarationAccepted,
    },
  });

  return (
    <Form {...form}>
      <form className="space-y-6">
        {/* Important Notice */}
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-800 dark:text-amber-200">Important</h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
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
            
            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        onTermsChange(checked as boolean);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">
                      I have read and agree to the Terms & Conditions
                    </FormLabel>
                    <FormDescription>
                      You must accept the terms to proceed with your application
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
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
            
            <FormField
              control={form.control}
              name="declarationAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        onDeclarationChange(checked as boolean);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">
                      I confirm that all information provided is accurate and I accept the declaration
                    </FormLabel>
                    <FormDescription>
                      This declaration is mandatory for application submission
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
