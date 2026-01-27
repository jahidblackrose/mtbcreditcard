/**
 * Supplementary Card Form - Matches Official Paper Form Exactly
 * 
 * All fields from the official MTB Credit Card Application form:
 * - Full Name
 * - Name on Card (max 22 chars)
 * - Relationship (checkbox style)
 * - Date of Birth
 * - Gender
 * - Mother's Name
 * - Father's Name
 * - Spouse's Name
 * - Present Address (textarea)
 * - Permanent Address (textarea)
 * - NID / Birth Certificate No
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
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleDatePicker } from '@/components/ui/simple-date-picker';
import { subYears } from 'date-fns';
import { User, Phone, Mail, FileText, CreditCard } from 'lucide-react';

// Relationship options as per paper form
const RELATIONSHIPS = [
  { id: 'brother', label: 'Brother' },
  { id: 'daughter', label: 'Daughter' },
  { id: 'parent', label: 'Parent' },
  { id: 'sister', label: 'Sister' },
  { id: 'son', label: 'Son' },
  { id: 'other', label: 'Other' },
] as const;

// Gender options
const GENDERS = [
  { id: 'female', label: 'Female' },
  { id: 'male', label: 'Male' },
  { id: 'others', label: 'Others' },
] as const;

// Validation schema matching paper form requirements
const supplementaryFormSchema = z.object({
  fullName: z.string().min(2, 'Full name is required').max(100),
  nameOnCard: z.string().min(2).max(22, 'Maximum 22 characters allowed'),
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

type SupplementaryFormData = z.infer<typeof supplementaryFormSchema>;

interface SupplementaryCardFormProps {
  onSubmit: (data: SupplementaryFormData) => void;
  onCancel: () => void;
  initialData?: Partial<SupplementaryFormData>;
}

export function SupplementaryCardForm({
  onSubmit,
  onCancel,
  initialData,
}: SupplementaryCardFormProps) {
  const maxDOB = subYears(new Date(), 18);

  const form = useForm<SupplementaryFormData>({
    resolver: zodResolver(supplementaryFormSchema),
    defaultValues: {
      fullName: initialData?.fullName || '',
      nameOnCard: initialData?.nameOnCard || '',
      relationship: initialData?.relationship || '',
      dateOfBirth: initialData?.dateOfBirth || '',
      gender: initialData?.gender || '',
      motherName: initialData?.motherName || '',
      fatherName: initialData?.fatherName || '',
      spouseName: initialData?.spouseName || '',
      presentAddress: initialData?.presentAddress || '',
      permanentAddress: initialData?.permanentAddress || '',
      nidOrBirthCertNo: initialData?.nidOrBirthCertNo || '',
      tin: initialData?.tin || '',
      contactNumber: initialData?.contactNumber || '',
      email: initialData?.email || '',
      passportNumber: initialData?.passportNumber || '',
      passportIssueDate: initialData?.passportIssueDate || '',
      passportExpiryDate: initialData?.passportExpiryDate || '',
      spendingLimitPercentage: initialData?.spendingLimitPercentage || 50,
    },
    mode: 'onChange',
  });

  const spendingLimit = form.watch('spendingLimitPercentage');

  const handleSubmit = (data: SupplementaryFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

            {/* Relationship - Checkbox Style */}
            <FormField
              control={form.control}
              name="relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship *</FormLabel>
                  <div className="flex flex-wrap gap-4 pt-2">
                    {RELATIONSHIPS.map((rel) => (
                      <label
                        key={rel.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={field.value === rel.id}
                          onCheckedChange={(checked) => {
                            if (checked) field.onChange(rel.id);
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
                    <SimpleDatePicker
                      value={field.value}
                      onChange={(date) => field.onChange(date?.toISOString() || '')}
                      maxDate={maxDOB}
                      placeholder="DD-MM-YYYY"
                    />
                    <FormDescription>Must be at least 18 years old</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender - Checkbox Style */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender *</FormLabel>
                    <div className="flex flex-wrap gap-4 pt-2">
                      {GENDERS.map((g) => (
                        <label
                          key={g.id}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={field.value === g.id}
                            onCheckedChange={(checked) => {
                              if (checked) field.onChange(g.id);
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
          </CardContent>
        </Card>

        {/* Family Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Family Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Address Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        {/* Identity Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              Identity Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <Separator />

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
                    <SimpleDatePicker
                      value={field.value}
                      onChange={(date) => field.onChange(date?.toISOString() || '')}
                      maxDate={new Date()}
                      placeholder="DD-MM-YYYY"
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
                    <SimpleDatePicker
                      value={field.value}
                      onChange={(date) => field.onChange(date?.toISOString() || '')}
                      minDate={new Date()}
                      placeholder="DD-MM-YYYY"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        {/* Spending Limit */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5" />
              Spending Limit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="spendingLimitPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spending Limit: {spendingLimit}%</FormLabel>
                  <FormControl>
                    <Slider
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                      min={1}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                  </FormControl>
                  <FormDescription>
                    Percentage of primary cardholder's credit limit
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 mobile-cta-button"
            disabled={!form.formState.isValid}
          >
            Submit Application
          </Button>
        </div>
      </form>
    </Form>
  );
}
