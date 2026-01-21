/**
 * Step 10: Image & Signature Upload
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { imageSignatureSchema, type ImageSignatureFormData } from '@/lib/validation-schemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaceCapture } from '../FaceCapture';
import { SignatureCapture } from '../SignatureCapture';
import type { ImageSignatureData } from '@/types/application-form.types';

interface ImageSignatureStepProps {
  initialData?: Partial<ImageSignatureData>;
  hasSupplementary: boolean;
  onSave: (data: ImageSignatureData) => void;
}

export function ImageSignatureStep({ initialData, hasSupplementary, onSave }: ImageSignatureStepProps) {
  const form = useForm<ImageSignatureFormData>({
    resolver: zodResolver(imageSignatureSchema),
    defaultValues: {
      primaryApplicantPhoto: initialData?.primaryApplicantPhoto || '',
      supplementaryApplicantPhoto: initialData?.supplementaryApplicantPhoto || '',
      primaryApplicantSignature: initialData?.primaryApplicantSignature || '',
      supplementaryApplicantSignature: initialData?.supplementaryApplicantSignature || '',
    },
    mode: 'onChange',
  });

  const handleFieldChange = () => {
    const values = form.getValues();
    if (form.formState.isValid) {
      onSave(values as ImageSignatureData);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        {/* Primary Applicant */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Primary Applicant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="primaryApplicantPhoto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passport Size Photo</FormLabel>
                  <FormControl>
                    <FaceCapture
                      onCapture={(data) => {
                        field.onChange(data);
                        handleFieldChange();
                      }}
                      currentPhoto={field.value}
                      label="Capture Your Photo"
                    />
                  </FormControl>
                  <FormDescription>
                    Take a clear passport-size photo with face visible
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="primaryApplicantSignature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Signature</FormLabel>
                  <FormControl>
                    <SignatureCapture
                      onCapture={(data) => {
                        field.onChange(data);
                        handleFieldChange();
                      }}
                      currentSignature={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    Draw your signature in the box below
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Supplementary Applicant */}
        {hasSupplementary && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Supplementary Card Holder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="supplementaryApplicantPhoto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passport Size Photo</FormLabel>
                    <FormControl>
                      <FaceCapture
                        onCapture={(data) => {
                          field.onChange(data);
                          handleFieldChange();
                        }}
                        currentPhoto={field.value}
                        label="Capture Supplementary Card Holder Photo"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name="supplementaryApplicantSignature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Signature</FormLabel>
                    <FormControl>
                      <SignatureCapture
                        onCapture={(data) => {
                          field.onChange(data);
                          handleFieldChange();
                        }}
                        currentSignature={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}
      </form>
    </Form>
  );
}
