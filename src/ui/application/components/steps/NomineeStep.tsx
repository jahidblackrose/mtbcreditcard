/**
 * Step 7: MTB Protection Plan (MPP) - Nominee
 * Enhanced with consistent UX patterns
 */

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserShield, User, ShieldCheck, UserCircle } from 'lucide-react';
import { nomineeSchema, type NomineeFormData } from '@/lib/validation-schemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { TailwindDatePicker } from '@/components/ui/tailwind-date-picker';
import { StepFormWrapper, FormSection, FieldRow, FieldTripleRow } from '@/components';
import { FaceCapture } from '@/ui/application/components/FaceCapture';
import type { NomineeData } from '@/types/application-form.types';

interface NomineeStepProps {
  initialData?: Partial<NomineeData>;
  onSave: (data: NomineeData) => void;
  onFormReady?: (form: any) => void;
}

const RELATIONSHIPS = [
  { value: 'SPOUSE', label: 'Spouse' },
  { value: 'PARENT', label: 'Parent' },
  { value: 'SON', label: 'Son' },
  { value: 'DAUGHTER', label: 'Daughter' },
  { value: 'OTHER', label: 'Other' },
];

const MPP_DECLARATION = `I hereby apply for MTB Protection Plan (MPP) and agree to the terms and conditions. I understand that in case of my demise, the outstanding dues on my credit card will be settled by the insurance company as per the MPP policy terms. I authorize MTB to share my personal information with the insurance partner for processing this protection plan.`;

export function NomineeStep({ initialData, onSave, onFormReady }: NomineeStepProps) {
  const form = useForm<NomineeFormData>({
    resolver: zodResolver(nomineeSchema),
    defaultValues: {
      nomineeName: initialData?.nomineeName || '',
      relationship: initialData?.relationship || undefined,
      dateOfBirth: initialData?.dateOfBirth || '',
      contactAddress: initialData?.contactAddress || '',
      mobileNumber: initialData?.mobileNumber || '',
      photoUrl: initialData?.photoUrl || '',
      declarationAccepted: initialData?.declarationAccepted || false,
    },
    mode: 'onChange',
  });

  // Expose form to parent when ready
  useEffect(() => {
    if (onFormReady) {
      onFormReady(form);
    }
  }, [form, onFormReady]);

  const handleFieldChange = () => {
    const values = form.getValues();
    if (form.formState.isValid) {
      onSave(values as NomineeData);
    }
  };

  const handlePhotoCapture = (photoData: string) => {
    form.setValue('photoUrl', photoData);
    handleFieldChange();
  };

  return (
    <StepFormWrapper form={form}
      stepNumber={7}
      title="Nominee Information"
      description="Please provide your nominee details for MTB Protection Plan"
      hint="A nominee is someone who will receive your credit card benefits in case of unforeseen circumstances. This is required for all applicants."
    >
      <Form {...form}>
        <form className="space-y-6" onChange={handleFieldChange}>
        <FormSection
          description="Details about your nominee for MTB Protection Plan"
          icon={<UserCircle className="h-5 w-5" />}
        >
          <FormField
            control={form.control}
            name="nomineeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name of Nominee</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Full name of nominee" />
                </FormControl>
                <FormDescription>Legal name as per NID</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {RELATIONSHIPS.map((rel) => (
                        <SelectItem key={rel.value} value={rel.value}>
                          {rel.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth</FormLabel>
                  <TailwindDatePicker
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(date?.toISOString() || '');
                      handleFieldChange();
                    }}
                    maxDate={new Date()}
                    placeholder="DD/MM/YYYY"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="contactAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Address</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Full contact address of nominee"
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="01XXXXXXXXX"
                    maxLength={11}
                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                  />
                </FormControl>
                <FormDescription>11 digits starting with 01</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <Separator />

        {/* Nominee Photo */}
        <FormSection
          title="Nominee Photo"
          description="Upload a clear photo of your nominee"
          icon={<User className="h-5 w-5" />}
        >
          <FormField
            control={form.control}
            name="photoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passport Size Photo</FormLabel>
                <FormControl>
                  <FaceCapture
                    onCapture={handlePhotoCapture}
                    currentPhoto={field.value}
                    label="Capture Nominee Photo"
                  />
                </FormControl>
                <FormDescription>
                  Take a clear passport-size photo of the nominee
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <Separator />

        {/* MPP Declaration */}
        <FormSection
          title="MPP Declaration"
          description="Please read and accept the MTB Protection Plan terms"
          icon={<ShieldCheck className="h-5 w-5" />}
        >
          <div className="p-4 bg-muted rounded-lg text-sm">
            {MPP_DECLARATION}
          </div>

          <FormField
            control={form.control}
            name="declarationAccepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I accept the MPP declaration and terms
                  </FormLabel>
                  <FormDescription>
                    This is required to proceed with your application
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>
        </form>
      </Form>
    </StepFormWrapper>
  );
}
