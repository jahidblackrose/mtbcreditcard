/**
 * Step 4: Monthly Income Details
 */

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { monthlyIncomeSchema, type MonthlyIncomeFormData } from '@/lib/validation-schemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2 } from 'lucide-react';
import type { MonthlyIncomeData } from '@/types/application-form.types';

interface MonthlyIncomeStepProps {
  initialData?: Partial<MonthlyIncomeData>;
  onSave: (data: MonthlyIncomeData) => void;
}

export function MonthlyIncomeStep({ initialData, onSave }: MonthlyIncomeStepProps) {
  const form = useForm<MonthlyIncomeFormData>({
    resolver: zodResolver(monthlyIncomeSchema),
    defaultValues: {
      isSalaried: initialData?.isSalaried ?? true,
      salariedIncome: initialData?.salariedIncome || {
        grossSalary: '',
        totalDeduction: '',
        netSalary: '',
      },
      businessIncome: initialData?.businessIncome || {
        grossIncome: '',
        totalExpenses: '',
        netIncome: '',
      },
      additionalIncomeSources: initialData?.additionalIncomeSources || [],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'additionalIncomeSources',
  });

  const isSalaried = form.watch('isSalaried');

  const handleFieldChange = () => {
    const values = form.getValues();
    if (form.formState.isValid) {
      onSave(values as MonthlyIncomeData);
    }
  };

  const formatAmount = (value: string) => {
    return value.replace(/[^0-9.]/g, '');
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onChange={handleFieldChange}>
        {/* Employment Type Toggle */}
        <FormField
          control={form.control}
          name="isSalaried"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Employment Type</FormLabel>
                <FormDescription>
                  {field.value ? 'Salaried Person' : 'Business / Self-employed'}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Salaried Income Section */}
        {isSalaried && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Salaried Income (BDT)</h3>
            
            <FormField
              control={form.control}
              name="salariedIncome.grossSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gross Salary</FormLabel>
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
              name="salariedIncome.totalDeduction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Deduction</FormLabel>
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
                  <FormDescription>Tax, PF, Insurance, etc.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salariedIncome.netSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Net Salary</FormLabel>
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
                  <FormDescription>Take-home salary after deductions</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Business Income Section */}
        {!isSalaried && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Income (BDT)</h3>
            
            <FormField
              control={form.control}
              name="businessIncome.grossIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gross Income</FormLabel>
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
              name="businessIncome.totalExpenses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Expenses</FormLabel>
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
              name="businessIncome.netIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Net Income</FormLabel>
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
        )}

        <Separator />

        {/* Additional Income Sources */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Additional Income Sources (if any)</h3>
            {fields.length < 3 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ source: '', amount: '' })}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Source
              </Button>
            )}
          </div>

          {fields.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Click "Add Source" to add additional income sources like rental income, investments, etc.
            </p>
          )}

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-4 items-start p-4 border rounded-lg">
              <div className="flex-1 grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`additionalIncomeSources.${index}.source`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source {index + 1}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Rental Income" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`additionalIncomeSources.${index}.amount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (BDT)</FormLabel>
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

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-8 text-destructive hover:text-destructive"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </form>
    </Form>
  );
}
