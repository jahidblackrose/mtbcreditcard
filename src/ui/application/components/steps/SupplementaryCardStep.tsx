/**
 * Step 8: Supplementary Card Information (Optional)
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supplementaryCardSchema, type SupplementaryCardFormData } from '@/lib/validation-schemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { SupplementaryCardData } from '@/types/application-form.types';

interface SupplementaryCardStepProps {
  initialData?: Partial<SupplementaryCardData>;
  hasSupplementaryCard: boolean;
  onToggle: (has: boolean) => void;
  onSave: (data: SupplementaryCardData) => void;
}

const RELATIONSHIPS = [
  { value: 'FATHER', label: 'Father' },
  { value: 'MOTHER', label: 'Mother' },
  { value: 'SON', label: 'Son' },
  { value: 'DAUGHTER', label: 'Daughter' },
  { value: 'SPOUSE', label: 'Spouse' },
  { value: 'OTHER', label: 'Other' },
];

const GENDERS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

const emptyAddress = {
  addressLine1: '',
  addressLine2: '',
  city: '',
  district: '',
  postalCode: '',
  country: 'Bangladesh',
};

export function SupplementaryCardStep({ 
  initialData, 
  hasSupplementaryCard, 
  onToggle, 
  onSave 
}: SupplementaryCardStepProps) {
  // Date picker states
  const [dobOpen, setDobOpen] = useState(false);
  const [passportExpiryOpen, setPassportExpiryOpen] = useState(false);

  const form = useForm<SupplementaryCardFormData>({
    resolver: zodResolver(supplementaryCardSchema),
    defaultValues: {
      fullName: initialData?.fullName || '',
      nameOnCard: initialData?.nameOnCard || '',
      relationship: initialData?.relationship || undefined,
      dateOfBirth: initialData?.dateOfBirth || '',
      gender: initialData?.gender || undefined,
      fatherName: initialData?.fatherName || '',
      motherName: initialData?.motherName || '',
      spouseName: initialData?.spouseName || '',
      presentAddress: initialData?.presentAddress || emptyAddress,
      permanentAddress: initialData?.permanentAddress || emptyAddress,
      sameAsPermanent: initialData?.sameAsPermanent || false,
      nidOrBirthCertNo: initialData?.nidOrBirthCertNo || '',
      tin: initialData?.tin || '',
      passportNumber: initialData?.passportNumber || '',
      passportIssueDate: initialData?.passportIssueDate || '',
      passportExpiryDate: initialData?.passportExpiryDate || '',
      spendingLimitPercentage: initialData?.spendingLimitPercentage || 50,
    },
    mode: 'onChange',
  });

  const sameAsPermanent = form.watch('sameAsPermanent');
  const spendingLimit = form.watch('spendingLimitPercentage');

  const handleFieldChange = () => {
    const values = form.getValues();
    if (form.formState.isValid) {
      onSave(values as SupplementaryCardData);
    }
  };

  const handleSameAsPermanent = (checked: boolean) => {
    form.setValue('sameAsPermanent', checked);
    if (checked) {
      const permanentAddress = form.getValues('permanentAddress');
      form.setValue('presentAddress', { ...permanentAddress });
    }
    handleFieldChange();
  };

  if (!hasSupplementaryCard) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Supplementary Card</h3>
        <p className="text-muted-foreground mb-6">
          Would you like to add a supplementary card holder?
        </p>
        <Button onClick={() => onToggle(true)}>
          Add Supplementary Card
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
          This step is optional. You can skip it if not needed.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onChange={handleFieldChange}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Supplementary Card Holder</h3>
          <Button variant="ghost" size="sm" onClick={() => onToggle(false)}>
            Remove
          </Button>
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Full legal name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nameOnCard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name on Card (BLOCK LETTERS)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="JOHN DOE"
                      className="uppercase"
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
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
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GENDERS.map((g) => (
                        <SelectItem key={g.value} value={g.value}>
                          {g.label}
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
                  <Popover open={dobOpen} onOpenChange={setDobOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(new Date(field.value), "PPP") : <span>Pick date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start" sideOffset={4}>
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => {
                          field.onChange(date?.toISOString() || '');
                          setDobOpen(false);
                        }}
                        disabled={(date) => date > new Date()}
                        defaultMonth={field.value ? new Date(field.value) : new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Family Info */}
        <div className="space-y-4">
          <h4 className="font-medium">Family Information</h4>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="fatherName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Father's Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Father's full name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="motherName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mother's Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Mother's full name" />
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
                <FormLabel>Spouse's Name (if applicable)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Spouse's full name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Identity */}
        <div className="space-y-4">
          <h4 className="font-medium">Identity Documents</h4>
          
          <FormField
            control={form.control}
            name="nidOrBirthCertNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NID / Birth Certificate No</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Document number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="tin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TIN (if any)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="12 digits"
                      maxLength={12}
                      onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passportNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passport No</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Passport number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passportExpiryDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Passport Expiry</FormLabel>
                  <Popover open={passportExpiryOpen} onOpenChange={setPassportExpiryOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(new Date(field.value), "PP") : <span>Expiry</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start" sideOffset={4}>
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => {
                          field.onChange(date?.toISOString() || '');
                          setPassportExpiryOpen(false);
                        }}
                        disabled={(date) => date < new Date()}
                        defaultMonth={field.value ? new Date(field.value) : new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Spending Limit */}
        <div className="space-y-4">
          <h4 className="font-medium">Spending Limit</h4>
          
          <FormField
            control={form.control}
            name="spendingLimitPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Spending Limit: {spendingLimit}%</FormLabel>
                <FormControl>
                  <Slider
                    value={[field.value]}
                    onValueChange={(vals) => {
                      field.onChange(vals[0]);
                      handleFieldChange();
                    }}
                    min={1}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                </FormControl>
                <FormDescription>
                  Percentage of your credit limit for the supplementary card
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
