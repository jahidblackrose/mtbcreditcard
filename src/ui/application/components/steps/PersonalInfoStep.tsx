/**
 * Step 2: Personal Information
 * With District/Thana dropdowns and DD-MON-YYYY date format
 */

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalInfoSchema, type PersonalInfoFormData } from '@/lib/validation-schemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { subYears } from 'date-fns';
import { cn } from '@/lib/utils';
import { BANGLADESH_DISTRICTS, getThanasByDistrict, formatDateDDMONYYYY } from '@/lib/bangladesh-locations';
import type { PersonalInfoData } from '@/types/application-form.types';

interface PersonalInfoStepProps {
  initialData?: Partial<PersonalInfoData>;
  onSave: (data: PersonalInfoData) => void;
}


const GENDERS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

const RELIGIONS = [
  { value: 'ISLAM', label: 'Islam' },
  { value: 'HINDUISM', label: 'Hinduism' },
  { value: 'CHRISTIANITY', label: 'Christianity' },
  { value: 'BUDDHISM', label: 'Buddhism' },
  { value: 'OTHER', label: 'Other' },
];

const MARITAL_STATUS = [
  { value: 'SINGLE', label: 'Single' },
  { value: 'MARRIED', label: 'Married' },
];

const EDUCATION_LEVELS = [
  { value: 'SSC', label: 'SSC' },
  { value: 'HSC', label: 'HSC' },
  { value: 'GRADUATE', label: 'Graduate' },
  { value: 'POST_GRADUATE', label: 'Post Graduate' },
  { value: 'PHD', label: 'PhD' },
  { value: 'OTHER', label: 'Other' },
];

const MAILING_ADDRESS_TYPES = [
  { value: 'PRESENT', label: 'Present Address' },
  { value: 'PERMANENT', label: 'Permanent Address' },
  { value: 'OFFICE', label: 'Office Address' },
];

const emptyAddress = {
  addressLine1: '',
  addressLine2: '',
  city: '',
  district: '',
  thana: '',
  postalCode: '',
  country: 'Bangladesh',
};

export function PersonalInfoStep({ initialData, onSave }: PersonalInfoStepProps) {
  // Date picker open states
  const [dobOpen, setDobOpen] = useState(false);
  const [passportIssueDateOpen, setPassportIssueDateOpen] = useState(false);
  const [passportExpiryDateOpen, setPassportExpiryDateOpen] = useState(false);

  // Date constraints
  const maxDateOfBirth = subYears(new Date(), 18);
  const minDateOfBirth = new Date('1900-01-01');

  const form = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      nameOnCard: initialData?.nameOnCard || '',
      nationality: initialData?.nationality || 'Bangladeshi',
      gender: initialData?.gender || undefined,
      dateOfBirth: initialData?.dateOfBirth || '',
      religion: initialData?.religion || undefined,
      fatherName: initialData?.fatherName || '',
      motherName: initialData?.motherName || '',
      maritalStatus: initialData?.maritalStatus || undefined,
      spouseName: initialData?.spouseName || '',
      spouseProfession: initialData?.spouseProfession || '',
      nidNumber: initialData?.nidNumber || '',
      tin: initialData?.tin || '',
      passportNumber: initialData?.passportNumber || '',
      passportIssueDate: initialData?.passportIssueDate || '',
      passportExpiryDate: initialData?.passportExpiryDate || '',
      permanentAddress: initialData?.permanentAddress || emptyAddress,
      presentAddress: initialData?.presentAddress || emptyAddress,
      sameAsPermanent: initialData?.sameAsPermanent || false,
      mailingAddressType: initialData?.mailingAddressType || 'PRESENT',
      mobileNumber: initialData?.mobileNumber || '',
      email: initialData?.email || '',
      educationalQualification: initialData?.educationalQualification || undefined,
    },
    mode: 'onChange',
  });

  const maritalStatus = form.watch('maritalStatus');
  const sameAsPermanent = form.watch('sameAsPermanent');
  const permanentDistrict = form.watch('permanentAddress.district');
  const presentDistrict = form.watch('presentAddress.district');

  // Get thanas based on selected district
  const permanentThanas = useMemo(() => getThanasByDistrict(permanentDistrict || ''), [permanentDistrict]);
  const presentThanas = useMemo(() => getThanasByDistrict(presentDistrict || ''), [presentDistrict]);

  const handleFieldChange = () => {
    const values = form.getValues();
    if (form.formState.isValid) {
      onSave(values as PersonalInfoData);
    }
  };

  // Copy permanent to present when checkbox is checked
  const handleSameAsPermanent = (checked: boolean) => {
    form.setValue('sameAsPermanent', checked);
    if (checked) {
      const permanentAddress = form.getValues('permanentAddress');
      form.setValue('presentAddress', { ...permanentAddress });
    }
    handleFieldChange();
  };

  // Reset thana when district changes - using type-safe approach
  const handlePermanentDistrictChange = (value: string) => {
    form.setValue('permanentAddress.district', value);
    form.setValue('permanentAddress.thana', '');
    handleFieldChange();
  };

  const handlePresentDistrictChange = (value: string) => {
    form.setValue('presentAddress.district', value);
    form.setValue('presentAddress.thana', '');
    handleFieldChange();
  };

  return (
    <Form {...form}>
      <form className="space-y-8" onChange={handleFieldChange}>
        {/* Basic Information */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
          
          <FormField
            control={form.control}
            name="nameOnCard"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name on Card (BLOCK LETTERS) *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="JOHN DOE"
                    className="uppercase"
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  />
                </FormControl>
                <FormDescription>Name as you want it to appear on your card</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nationality *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background border shadow-lg z-[100]">
                      {GENDERS.map((g) => (
                        <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth *</FormLabel>
                  <Popover open={dobOpen} onOpenChange={setDobOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal justify-start",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                          {field.value ? formatDateDDMONYYYY(new Date(field.value)) : <span>Select date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-background border shadow-xl z-[200]" align="start" sideOffset={4}>
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => {
                          field.onChange(date?.toISOString() || '');
                          setDobOpen(false);
                        }}
                        disabled={(date) => date > maxDateOfBirth || date < minDateOfBirth}
                        defaultMonth={field.value ? new Date(field.value) : maxDateOfBirth}
                        fromYear={1900}
                        toYear={maxDateOfBirth.getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    You must be at least 18 years old
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="religion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Religion *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select religion" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background border shadow-lg z-[100]">
                      {RELIGIONS.map((r) => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Family Information */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-foreground">Family Information</h3>
          
          <div className="grid gap-5 sm:grid-cols-2">
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
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="maritalStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marital Status *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background border shadow-lg z-[100]">
                      {MARITAL_STATUS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {maritalStatus === 'MARRIED' && (
              <>
                <FormField
                  control={form.control}
                  name="spouseName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spouse's Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Spouse's full name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          {maritalStatus === 'MARRIED' && (
            <FormField
              control={form.control}
              name="spouseProfession"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spouse's Profession</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Doctor, Engineer, Homemaker" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <Separator />

        {/* Identity Documents */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-foreground">Identity Documents</h3>
          
          <FormField
            control={form.control}
            name="nidNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NID Number *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="10, 13, or 17 digit NID"
                    maxLength={17}
                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="tin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TIN (if any)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="12 digit TIN"
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
                  <FormLabel>Passport Number (if any)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Passport number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="passportIssueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Passport Issue Date</FormLabel>
                  <Popover open={passportIssueDateOpen} onOpenChange={setPassportIssueDateOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal justify-start",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                          {field.value ? formatDateDDMONYYYY(new Date(field.value)) : <span>Select date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-background border shadow-xl z-[200]" align="start" sideOffset={4}>
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => {
                          field.onChange(date?.toISOString() || '');
                          setPassportIssueDateOpen(false);
                        }}
                        disabled={(date) => date > new Date()}
                        defaultMonth={field.value ? new Date(field.value) : new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passportExpiryDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Passport Expiry Date</FormLabel>
                  <Popover open={passportExpiryDateOpen} onOpenChange={setPassportExpiryDateOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal justify-start",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                          {field.value ? formatDateDDMONYYYY(new Date(field.value)) : <span>Select date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-background border shadow-xl z-[200]" align="start" sideOffset={4}>
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => {
                          field.onChange(date?.toISOString() || '');
                          setPassportExpiryDateOpen(false);
                        }}
                        disabled={(date) => date < new Date()}
                        defaultMonth={field.value ? new Date(field.value) : new Date()}
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

        {/* Permanent Address */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-foreground">Permanent Address</h3>
          
          <FormField
            control={form.control}
            name="permanentAddress.addressLine1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 1 *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="House/Flat, Road, Area" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="permanentAddress.addressLine2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 2 (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Additional address details" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="permanentAddress.district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District *</FormLabel>
                  <Select 
                    onValueChange={handlePermanentDistrictChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background border shadow-lg z-[100] max-h-[200px]">
                      {BANGLADESH_DISTRICTS.map((d) => (
                        <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="permanentAddress.thana"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thana/Upazila *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={!permanentDistrict}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={permanentDistrict ? "Select thana" : "Select district first"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background border shadow-lg z-[100] max-h-[200px]">
                      {permanentThanas.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="permanentAddress.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City/Town *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="City or town name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="permanentAddress.postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="4 digit postal code"
                      maxLength={4}
                      onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="permanentAddress.country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country *</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Present Address */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Present Address</h3>
            <FormField
              control={form.control}
              name="sameAsPermanent"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={handleSameAsPermanent}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal cursor-pointer">
                    Same as Permanent
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>

          {!sameAsPermanent && (
            <>
              <FormField
                control={form.control}
                name="presentAddress.addressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1 *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="House/Flat, Road, Area" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="presentAddress.addressLine2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2 (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Additional address details" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="presentAddress.district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District *</FormLabel>
                      <Select 
                        onValueChange={handlePresentDistrictChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select district" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-background border shadow-lg z-[100] max-h-[200px]">
                          {BANGLADESH_DISTRICTS.map((d) => (
                            <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="presentAddress.thana"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thana/Upazila *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={!presentDistrict}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={presentDistrict ? "Select thana" : "Select district first"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-background border shadow-lg z-[100] max-h-[200px]">
                          {presentThanas.map((t) => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="presentAddress.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City/Town *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="City or town name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="presentAddress.postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="4 digit postal code"
                          maxLength={4}
                          onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="presentAddress.country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        <Separator />

        {/* Mailing Preference */}
        <FormField
          control={form.control}
          name="mailingAddressType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mailing Address *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mailing address" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-background border shadow-lg z-[100]">
                  {MAILING_ADDRESS_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Where should we send your card and statements?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* Contact & Education */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-foreground">Contact & Education</h3>
          
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
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
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="your@email.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="educationalQualification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Educational Qualification *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select qualification" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background border shadow-lg z-[100]">
                    {EDUCATION_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
