/**
 * Step 6: Banking Activity - Credit Cards/Loans (Optional)
 */

import { useForm, useFieldArray } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CreditFacilityData } from '@/types/application-form.types';

interface CreditFacilitiesStepProps {
  initialData?: CreditFacilityData[];
  onSave: (data: CreditFacilityData[]) => void;
}

const FACILITY_TYPES = [
  { value: 'CREDIT_CARD', label: 'Credit Card' },
  { value: 'HOME_LOAN', label: 'Home Loan' },
  { value: 'CAR_LOAN', label: 'Car Loan' },
  { value: 'PERSONAL_LOAN', label: 'Personal Loan' },
  { value: 'OTHER', label: 'Other' },
];

const formSchema = z.object({
  facilities: z.array(z.object({
    id: z.string(),
    bankName: z.string().min(2).max(100),
    facilityType: z.enum(['CREDIT_CARD', 'HOME_LOAN', 'CAR_LOAN', 'PERSONAL_LOAN', 'OTHER']),
    accountNumber: z.string().min(5).max(30),
    limit: z.string().regex(/^\d+(\.\d{1,2})?$/),
    monthlyInstallment: z.string().regex(/^\d+(\.\d{1,2})?$/),
  })).optional(),
});

type FormData = z.infer<typeof formSchema>;

export function CreditFacilitiesStep({ initialData = [], onSave }: CreditFacilitiesStepProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facilities: initialData.length > 0 ? initialData : [],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'facilities',
  });

  const handleFieldChange = () => {
    const values = form.getValues();
    if (values.facilities) {
      onSave(values.facilities as CreditFacilityData[]);
    }
  };

  const formatAmount = (value: string) => {
    return value.replace(/[^0-9.]/g, '');
  };

  const addFacility = () => {
    append({
      id: `fac-${Date.now()}`,
      bankName: '',
      facilityType: 'CREDIT_CARD',
      accountNumber: '',
      limit: '',
      monthlyInstallment: '',
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onChange={handleFieldChange}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Existing Credit Facilities</h3>
            <p className="text-sm text-muted-foreground">
              This section is optional. Add any existing credit cards or loans.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={addFacility}>
            <Plus className="h-4 w-4 mr-2" />
            Add Facility
          </Button>
        </div>

        {fields.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
            <p className="text-muted-foreground mb-4">No credit facilities added yet</p>
            <Button type="button" variant="outline" onClick={addFacility}>
              <Plus className="h-4 w-4 mr-2" />
              Add Credit Card / Loan
            </Button>
          </div>
        )}

        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Facility {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name={`facilities.${index}.bankName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Mutual Trust Bank" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`facilities.${index}.facilityType`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Facility</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FACILITY_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name={`facilities.${index}.accountNumber`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card No / Loan Account No</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Account or card number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name={`facilities.${index}.limit`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Limit (BDT)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">৳</span>
                        <Input
                          {...field}
                          type="text"
                          inputMode="numeric"
                          placeholder="0"
                          className="pl-8"
                          onChange={(e) => field.onChange(formatAmount(e.target.value))}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`facilities.${index}.monthlyInstallment`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Installment (BDT)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">৳</span>
                        <Input
                          {...field}
                          type="text"
                          inputMode="numeric"
                          placeholder="0"
                          className="pl-8"
                          onChange={(e) => field.onChange(formatAmount(e.target.value))}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
      </form>
    </Form>
  );
}
