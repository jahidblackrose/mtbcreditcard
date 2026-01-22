/**
 * Step 11: Auto Debit Instruction
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { autoDebitSchema, type AutoDebitFormData } from '@/lib/validation-schemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Banknote } from 'lucide-react';
import type { AutoDebitData } from '@/types/application-form.types';

interface AutoDebitStepProps {
  initialData?: Partial<AutoDebitData>;
  onSave: (data: AutoDebitData) => void;
}

export function AutoDebitStep({ initialData, onSave }: AutoDebitStepProps) {
  const form = useForm<AutoDebitFormData>({
    resolver: zodResolver(autoDebitSchema),
    defaultValues: {
      autoDebitPreference: initialData?.autoDebitPreference || 'MINIMUM_AMOUNT_DUE',
      accountName: initialData?.accountName || '',
      mtbAccountNumber: initialData?.mtbAccountNumber || '',
    },
    mode: 'onChange',
  });

  const handleFieldChange = () => {
    const values = form.getValues();
    if (form.formState.isValid) {
      onSave(values as AutoDebitData);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onChange={handleFieldChange}>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Auto Debit Instruction</h3>
          <p className="text-sm text-muted-foreground">
            Set up automatic payment from your MTB account to ensure timely bill payments.
          </p>
        </div>

        {/* Auto Debit Preference */}
        <FormField
          control={form.control}
          name="autoDebitPreference"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel>Auto Debit Preference</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleFieldChange();
                  }}
                  value={field.value}
                  className="grid gap-4 sm:grid-cols-2"
                >
                  <Card 
                    className={`cursor-pointer transition-all ${
                      field.value === 'MINIMUM_AMOUNT_DUE' 
                        ? 'border-primary ring-2 ring-primary bg-primary/5' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => {
                      field.onChange('MINIMUM_AMOUNT_DUE');
                      handleFieldChange();
                    }}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="MINIMUM_AMOUNT_DUE" id="minimum" />
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-primary" />
                          <CardTitle className="text-base">Minimum Amount Due</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Pay only the minimum required amount each month to maintain account standing.
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer transition-all ${
                      field.value === 'TOTAL_OUTSTANDING' 
                        ? 'border-primary ring-2 ring-primary bg-primary/5' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => {
                      field.onChange('TOTAL_OUTSTANDING');
                      handleFieldChange();
                    }}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="TOTAL_OUTSTANDING" id="total" />
                        <div className="flex items-center gap-2">
                          <Banknote className="h-5 w-5 text-primary" />
                          <CardTitle className="text-base">Total Outstanding</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Pay the full outstanding balance each month to avoid interest charges.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Account Details */}
        <div className="space-y-4 pt-4">
          <h4 className="font-medium">MTB Account Details</h4>
          
          <FormField
            control={form.control}
            name="accountName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Name as per bank account" />
                </FormControl>
                <FormDescription>
                  Name of the account holder
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mtbAccountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MTB Account Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your MTB account number"
                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                  />
                </FormControl>
                <FormDescription>
                  Your Mutual Trust Bank account for auto debit
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
