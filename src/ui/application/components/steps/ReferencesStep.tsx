/**
 * Step 9: References (Mandatory - Two)
 * 
 * Fixed focus/cursor issues by using proper input styling
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { referencesSchema, type ReferencesFormData } from '@/lib/validation-schemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ReferencesData } from '@/types/application-form.types';

interface ReferencesStepProps {
  initialData?: Partial<ReferencesData>;
  onSave: (data: ReferencesData) => void;
}

const RELATIONSHIPS = [
  { value: 'COLLEAGUE', label: 'Colleague' },
  { value: 'FRIEND', label: 'Friend' },
  { value: 'RELATIVE', label: 'Relative' },
  { value: 'EMPLOYER', label: 'Employer' },
  { value: 'OTHER', label: 'Other' },
];

const emptyReference = {
  refereeName: '',
  relationship: undefined as any,
  mobileNumber: '',
  workAddress: '',
  residenceAddress: '',
};

// Reusable input component with guaranteed focus visibility
const ReferenceInput = ({ 
  field, 
  placeholder, 
  maxLength,
  error,
  onChange,
}: { 
  field: any; 
  placeholder: string; 
  maxLength?: number;
  error?: boolean;
  onChange?: (value: string) => void;
}) => (
  <input
    {...field}
    placeholder={placeholder}
    maxLength={maxLength}
    onChange={(e) => {
      const value = onChange ? (onChange(e.target.value), e.target.value) : e.target.value;
      field.onChange(onChange ? e.target.value.replace(/\D/g, '') : value);
    }}
    className={cn(
      // Base styles
      "flex h-10 w-full rounded-md border px-3 py-2",
      // White background with dark text for visibility
      "bg-white text-gray-900",
      // Placeholder
      "placeholder:text-gray-500",
      // Focus - ensure cursor and ring are visible
      "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
      // Caret color for cursor visibility
      "caret-gray-900",
      // Error state
      error 
        ? "border-destructive bg-destructive/5 focus:ring-destructive/30 focus:border-destructive" 
        : "border-input",
      // Transition
      "transition-all duration-200"
    )}
  />
);

export function ReferencesStep({ initialData, onSave }: ReferencesStepProps) {
  const form = useForm<ReferencesFormData>({
    resolver: zodResolver(referencesSchema),
    defaultValues: {
      reference1: initialData?.reference1 || emptyReference,
      reference2: initialData?.reference2 || emptyReference,
    },
    mode: 'onChange',
  });

  const handleFieldChange = () => {
    const values = form.getValues();
    if (form.formState.isValid) {
      onSave(values as ReferencesData);
    }
  };

  const ReferenceCard = ({ refNum }: { refNum: 1 | 2 }) => {
    const prefix = `reference${refNum}` as 'reference1' | 'reference2';
    const errors = form.formState.errors[prefix];
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reference {refNum}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name={`${prefix}.refereeName`}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Name of Referee</FormLabel>
                <FormControl>
                  <ReferenceInput 
                    field={field} 
                    placeholder="Full name" 
                    error={!!fieldState.error}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name={`${prefix}.relationship`}
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
              name={`${prefix}.mobileNumber`}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="tel"
                      inputMode="numeric"
                      placeholder="01XXXXXXXXX"
                      maxLength={11}
                      onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                      className={cn(
                        "flex h-10 w-full rounded-md border px-3 py-2",
                        "bg-white text-gray-900 placeholder:text-gray-500",
                        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
                        "caret-gray-900 transition-all duration-200",
                        fieldState.error 
                          ? "border-destructive bg-destructive/5 focus:ring-destructive/30 focus:border-destructive" 
                          : "border-input"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name={`${prefix}.workAddress`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work Address</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Office/workplace address"
                    rows={2}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`${prefix}.residenceAddress`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Residence Address</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Home/residence address"
                    rows={2}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    );
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onChange={handleFieldChange}>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">References</h3>
          <p className="text-sm text-muted-foreground">
            Please provide details of two references. These should be people who know you personally or professionally.
          </p>
        </div>

        <ReferenceCard refNum={1} />
        
        <Separator />
        
        <ReferenceCard refNum={2} />
      </form>
    </Form>
  );
}
