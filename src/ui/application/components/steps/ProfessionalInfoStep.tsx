/**
 * Step 3: Professional Information
 * Enhanced with consistent UX patterns
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Briefcase, Building2, MapPin, Calendar } from 'lucide-react';
import { professionalInfoSchema, type ProfessionalInfoFormData } from '@/lib/validation-schemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { StepFormWrapper, FormSection, FieldRow } from '@/components';
import type { ProfessionalInfoData } from '@/types/application-form.types';

interface ProfessionalInfoStepProps {
  initialData?: Partial<ProfessionalInfoData>;
  onSave: (data: ProfessionalInfoData) => void;
}

const CUSTOMER_SEGMENTS = [
  { value: 'SALARIED', label: 'Salaried Person' },
  { value: 'BUSINESS_PERSON', label: 'Business Person' },
  { value: 'SELF_EMPLOYED', label: 'Self-employed Professional' },
  { value: 'LANDLORD', label: 'Landlord' },
  { value: 'OTHER', label: 'Others' },
];

const emptyAddress = {
  addressLine1: '',
  addressLine2: '',
  city: '',
  district: '',
  postalCode: '',
  country: 'Bangladesh',
};

export function ProfessionalInfoStep({ initialData, onSave }: ProfessionalInfoStepProps) {
  const form = useForm<ProfessionalInfoFormData>({
    resolver: zodResolver(professionalInfoSchema),
    defaultValues: {
      customerSegment: initialData?.customerSegment || undefined,
      organizationName: initialData?.organizationName || '',
      parentGroup: initialData?.parentGroup || '',
      department: initialData?.department || '',
      designation: initialData?.designation || '',
      officeAddress: initialData?.officeAddress || emptyAddress,
      lengthOfServiceYears: initialData?.lengthOfServiceYears || 0,
      lengthOfServiceMonths: initialData?.lengthOfServiceMonths || 0,
      totalExperienceYears: initialData?.totalExperienceYears || 0,
      totalExperienceMonths: initialData?.totalExperienceMonths || 0,
      previousEmployer: initialData?.previousEmployer || '',
      previousDesignation: initialData?.previousDesignation || '',
    },
    mode: 'onChange',
  });

  const handleFieldChange = () => {
    const values = form.getValues();
    if (form.formState.isValid) {
      onSave(values as ProfessionalInfoData);
    }
  };

  return (
    <StepFormWrapper form={form}
      stepNumber={3}
      title="Professional Information"
      description="Please provide your employment and professional details"
      hint="Your employment information helps us verify your income stability. Please provide accurate current employment details."
    >
      <Form {...form}>
        <form className="space-y-6" onChange={handleFieldChange}>
        {/* Customer Segment */}
        <FormField
          control={form.control}
          name="customerSegment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Segment</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your segment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CUSTOMER_SEGMENTS.map((seg) => (
                    <SelectItem key={seg.value} value={seg.value}>{seg.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Organization Details */}
        <FormSection
          title="Organization Details"
          description="Information about your current employment"
          icon={<Building2 className="h-5 w-5" />}
        >
          <FormField
            control={form.control}
            name="organizationName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name of Current Organization</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Company/Business name" />
                </FormControl>
                <FormDescription>Your current employer or business name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FieldRow>
            <FormField
              control={form.control}
              name="parentGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Group (if any)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Parent company name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Finance, IT, HR" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldRow>

          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Your job title" />
                </FormControl>
                <FormDescription>Your current position or role</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <Separator />

        {/* Office Address */}
        <FormSection
          title="Office Address"
          description="Your current workplace location"
          icon={<MapPin className="h-5 w-5" />}
        >
          <FormField
            control={form.control}
            name="officeAddress.addressLine1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 1</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Office address" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="officeAddress.addressLine2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 2 (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Additional details" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FieldRow>
            <FormField
              control={form.control}
              name="officeAddress.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="City" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="officeAddress.district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="District" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldRow>

          <FieldRow>
            <FormField
              control={form.control}
              name="officeAddress.postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="4 digits"
                      maxLength={4}
                      onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="officeAddress.country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Bangladesh" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldRow>
        </FormSection>

        <Separator />

        {/* Experience */}
        <FormSection
          title="Experience"
          description="Your employment history and tenure"
          icon={<Calendar className="h-5 w-5" />}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Length of Service / Business</label>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="lengthOfServiceYears"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type="number"
                            min={0}
                            max={50}
                            placeholder="0"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            Years
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lengthOfServiceMonths"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type="number"
                            min={0}
                            max={11}
                            placeholder="0"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            Months
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Total Experience</label>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="totalExperienceYears"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type="number"
                            min={0}
                            max={60}
                            placeholder="0"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            Years
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="totalExperienceMonths"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type="number"
                            min={0}
                            max={11}
                            placeholder="0"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            Months
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </FormSection>

        <Separator />

        {/* Previous Employment */}
        <FormSection
          title="Previous Employment (if any)"
          description="Your previous work experience"
          icon={<Briefcase className="h-5 w-5" />}
        >
          <FieldRow>
            <FormField
              control={form.control}
              name="previousEmployer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Previous Employer</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Previous company name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="previousDesignation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Previous Designation</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Previous job title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldRow>
        </FormSection>
        </form>
      </Form>
    </StepFormWrapper>
  );
}
