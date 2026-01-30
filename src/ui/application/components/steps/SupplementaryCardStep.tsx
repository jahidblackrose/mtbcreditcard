/**
 * Step 8: Supplementary Card Information (Optional)
 * 
 * Matches Official MTB Paper Form exactly with all fields:
 * - Full Name
 * - Name on Card (max 22 chars)
 * - Relationship (checkbox style): Brother / Daughter / Parent / Sister / Son / Other
 * - Date of Birth
 * - Gender: Female / Male / Others
 * - Mother's Name
 * - Father's Name
 * - Spouse's Name
 * - Present Address (textarea)
 * - Permanent Address (textarea)
 * - NID / Birth Certificate Number
 * - TIN
 * - Contact Number
 * - E-mail
 * - Passport Number
 * - Passport Issue Date
 * - Passport Expiry Date
 * - Spending Limit (%)
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { TailwindDatePicker } from '@/components/ui/tailwind-date-picker';
import { MobileFormCard, MobileFormSection } from '@/ui/mobile/components/MobileFormCard';
import { subYears } from 'date-fns';
import { CreditCard, User, Users, MapPin, FileText, Phone, Percent, X } from 'lucide-react';
import type { SupplementaryCardData } from '@/types/application-form.types';

interface SupplementaryCardStepProps {
  initialData?: Partial<SupplementaryCardData>;
  hasSupplementaryCard: boolean;
  onToggle: (has: boolean) => void;
  onSave: (data: SupplementaryCardData) => void;
}

// Relationship options - EXACTLY as per paper form
const RELATIONSHIPS = [
  { id: 'BROTHER', label: 'Brother' },
  { id: 'DAUGHTER', label: 'Daughter' },
  { id: 'PARENT', label: 'Parent' },
  { id: 'SISTER', label: 'Sister' },
  { id: 'SON', label: 'Son' },
  { id: 'OTHER', label: 'Other' },
] as const;

// Gender options - EXACTLY as per paper form
const GENDERS = [
  { id: 'FEMALE', label: 'Female' },
  { id: 'MALE', label: 'Male' },
  { id: 'OTHER', label: 'Others' },
] as const;

// Full validation schema matching paper form
const supplementarySchema = z.object({
  fullName: z.string().min(2, 'Full name is required').max(100),
  nameOnCard: z.string().min(2, 'Name on card is required').max(22, 'Maximum 22 characters'),
  relationship: z.string().min(1, 'Please select a relationship'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Please select gender'),
  motherName: z.string().min(2, "Mother's name is required"),
  fatherName: z.string().min(2, "Father's name is required"),
  spouseName: z.string().optional(),
  presentAddress: z.string().min(10, 'Present address is required'),
  permanentAddress: z.string().min(10, 'Permanent address is required'),
  nidOrBirthCertNo: z.string().min(10, 'NID/Birth Certificate number is required'),
  tin: z.string().optional(),
  contactNumber: z.string().regex(/^01\d{9}$/, 'Must be 11 digits starting with 01'),
  email: z.string().email('Invalid email address'),
  passportNumber: z.string().optional(),
  passportIssueDate: z.string().optional(),
  passportExpiryDate: z.string().optional(),
  spendingLimitPercentage: z.number().min(1).max(100),
});

type SupplementaryFormData = z.infer<typeof supplementarySchema>;

export function SupplementaryCardStep({ 
  initialData, 
  hasSupplementaryCard, 
  onToggle, 
  onSave 
}: SupplementaryCardStepProps) {
  const maxDOB = subYears(new Date(), 18);

  const form = useForm<SupplementaryFormData>({
    resolver: zodResolver(supplementarySchema),
    defaultValues: {
      fullName: initialData?.fullName || '',
      nameOnCard: initialData?.nameOnCard || '',
      relationship: initialData?.relationship || '',
      dateOfBirth: initialData?.dateOfBirth || '',
      gender: initialData?.gender || '',
      motherName: (initialData as any)?.motherName || '',
      fatherName: initialData?.fatherName || '',
      spouseName: initialData?.spouseName || '',
      presentAddress: typeof initialData?.presentAddress === 'string' 
        ? initialData.presentAddress 
        : initialData?.presentAddress?.addressLine1 || '',
      permanentAddress: typeof initialData?.permanentAddress === 'string'
        ? initialData.permanentAddress
        : initialData?.permanentAddress?.addressLine1 || '',
      nidOrBirthCertNo: initialData?.nidOrBirthCertNo || '',
      tin: initialData?.tin || '',
      contactNumber: '',
      email: '',
      passportNumber: initialData?.passportNumber || '',
      passportIssueDate: initialData?.passportIssueDate || '',
      passportExpiryDate: initialData?.passportExpiryDate || '',
      spendingLimitPercentage: initialData?.spendingLimitPercentage || 50,
    },
    mode: 'onChange',
  });

  const spendingLimit = form.watch('spendingLimitPercentage');

  const handleFieldChange = () => {
    const values = form.getValues();
    if (form.formState.isValid) {
      onSave(values as unknown as SupplementaryCardData);
    }
  };

  // Show invitation screen if not adding supplementary card
  if (!hasSupplementaryCard) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <CreditCard className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Supplementary Card</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Would you like to add a supplementary card holder? This allows a family member to have their own card linked to your account.
        </p>
        <Button onClick={() => onToggle(true)} className="mobile-cta-button">
          <User className="mr-2 h-4 w-4" />
          Add Supplementary Card
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
          This step is optional. You can skip it if not needed.
        </p>
      </div>
    );
  }

  // Full form matching paper form exactly - Same design as other steps
  return (
    <Form {...form}>
      <form className="space-y-4" onChange={handleFieldChange}>
        {/* Header with Remove option */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Supplementary Card Holder
          </h3>
          <Button 
            type="button"
            variant="ghost" 
            size="sm" 
            onClick={() => onToggle(false)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>

        {/* Section 1: Basic Information */}
        <MobileFormCard>
          <MobileFormSection title="Basic Information">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Full legal name as per NID" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name on Card */}
            <FormField
              control={form.control}
              name="nameOnCard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name on Card (max 22 characters) *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="NAME AS ON CARD"
                      className="uppercase"
                      maxLength={22}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/22 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Relationship - Checkbox Style as per paper form */}
            <FormField
              control={form.control}
              name="relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship *</FormLabel>
                  <div className="flex flex-wrap gap-3 pt-2">
                    {RELATIONSHIPS.map((rel) => (
                      <label
                        key={rel.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={field.value === rel.id}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange(rel.id);
                              handleFieldChange();
                            }
                          }}
                        />
                        <span className="text-sm">{rel.label}</span>
                      </label>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Date of Birth */}
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth *</FormLabel>
                    <TailwindDatePicker
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(date?.toISOString() || '');
                        handleFieldChange();
                      }}
                      maxDate={maxDOB}
                      placeholder="DD/MM/YYYY"
                    />
                    <FormDescription>Must be at least 18 years old</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender - Checkbox Style as per paper form */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender *</FormLabel>
                    <div className="flex flex-wrap gap-3 pt-2">
                      {GENDERS.map((g) => (
                        <label
                          key={g.id}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={field.value === g.id}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange(g.id);
                                handleFieldChange();
                              }
                            }}
                          />
                          <span className="text-sm">{g.label}</span>
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </MobileFormSection>
        </MobileFormCard>

        {/* Section 2: Family Information */}
        <MobileFormCard>
          <MobileFormSection title="Family Information">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="motherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mother's Name *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Mother's full name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fatherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Father's Name *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Father's full name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="spouseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spouse's Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Spouse's full name (if applicable)" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </MobileFormSection>
        </MobileFormCard>

        {/* Section 3: Address Information */}
        <MobileFormCard>
          <MobileFormSection title="Address Information">
            <FormField
              control={form.control}
              name="presentAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Present Address *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter complete present address"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="permanentAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permanent Address *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter complete permanent address"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </MobileFormSection>
        </MobileFormCard>

        {/* Section 4: Identity Documents */}
        <MobileFormCard>
          <MobileFormSection title="Identity Documents">
            <FormField
              control={form.control}
              name="nidOrBirthCertNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NID / Birth Certificate Number *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter NID or Birth Certificate number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TIN (Tax Identification Number)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="12-digit TIN (if any)"
                      maxLength={12}
                      onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="passportNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passport Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Passport number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passportIssueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passport Issue Date</FormLabel>
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

              <FormField
                control={form.control}
                name="passportExpiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passport Expiry Date</FormLabel>
                    <TailwindDatePicker
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(date?.toISOString() || '');
                        handleFieldChange();
                      }}
                      minDate={new Date()}
                      placeholder="DD/MM/YYYY"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </MobileFormSection>
        </MobileFormCard>

        {/* Section 5: Contact Information */}
        <MobileFormCard>
          <MobileFormSection title="Contact Information">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number *</FormLabel>
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

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="email@example.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </MobileFormSection>
        </MobileFormCard>

        {/* Section 6: Spending Limit */}
        <MobileFormCard>
          <MobileFormSection title="Spending Limit">
            <FormField
              control={form.control}
              name="spendingLimitPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spending Limit Percentage *</FormLabel>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">{spendingLimit}%</span>
                      <span className="text-sm text-muted-foreground">of primary card limit</span>
                    </div>
                    <Slider
                      value={[field.value]}
                      onValueChange={(values) => {
                        field.onChange(values[0]);
                        handleFieldChange();
                      }}
                      min={10}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>10%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  <FormDescription>
                    Set the maximum spending limit for the supplementary card holder
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </MobileFormSection>
        </MobileFormCard>
      </form>
    </Form>
  );
}
