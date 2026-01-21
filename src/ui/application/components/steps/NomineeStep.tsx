/**
 * Step 7: MTB Protection Plan (MPP) - Nominee
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nomineeSchema, type NomineeFormData } from '@/lib/validation-schemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { FaceCapture } from '../FaceCapture';
import type { NomineeData } from '@/types/application-form.types';

interface NomineeStepProps {
  initialData?: Partial<NomineeData>;
  onSave: (data: NomineeData) => void;
}

const RELATIONSHIPS = [
  { value: 'SPOUSE', label: 'Spouse' },
  { value: 'PARENT', label: 'Parent' },
  { value: 'SON', label: 'Son' },
  { value: 'DAUGHTER', label: 'Daughter' },
  { value: 'OTHER', label: 'Other' },
];

const MPP_DECLARATION = `I hereby apply for MTB Protection Plan (MPP) and agree to the terms and conditions. I understand that in case of my demise, the outstanding dues on my credit card will be settled by the insurance company as per the MPP policy terms. I authorize MTB to share my personal information with the insurance partner for processing this protection plan.`;

export function NomineeStep({ initialData, onSave }: NomineeStepProps) {
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
    <Form {...form}>
      <form className="space-y-6" onChange={handleFieldChange}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Nominee Information</h3>
          
          <FormField
            control={form.control}
            name="nomineeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name of Nominee</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Full name of nominee" />
                </FormControl>
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date?.toISOString() || '')}
                        disabled={(date) => date > new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Nominee Photo */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Nominee Photo</h3>
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
        </div>

        <Separator />

        {/* MPP Declaration */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">MPP Declaration</h3>
          
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
        </div>
      </form>
    </Form>
  );
}
