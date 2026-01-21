/**
 * Step 5: Banking Activity - Accounts (Optional)
 */

import { useForm, useFieldArray } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { BankAccountData } from '@/types/application-form.types';

interface BankAccountsStepProps {
  initialData?: BankAccountData[];
  onSave: (data: BankAccountData[]) => void;
}

const ACCOUNT_TYPES = [
  { value: 'SAVINGS', label: 'Savings' },
  { value: 'CURRENT', label: 'Current' },
  { value: 'FDR', label: 'FDR' },
  { value: 'DPS', label: 'DPS' },
  { value: 'OTHER', label: 'Other' },
];

const formSchema = z.object({
  accounts: z.array(z.object({
    id: z.string(),
    bankName: z.string().min(2).max(100),
    accountType: z.enum(['SAVINGS', 'CURRENT', 'FDR', 'DPS', 'OTHER']),
    accountNumber: z.string().min(5).max(30),
    branch: z.string().min(2).max(100),
  })).optional(),
});

type FormData = z.infer<typeof formSchema>;

export function BankAccountsStep({ initialData = [], onSave }: BankAccountsStepProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accounts: initialData.length > 0 ? initialData : [],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'accounts',
  });

  const handleFieldChange = () => {
    const values = form.getValues();
    if (values.accounts) {
      onSave(values.accounts as BankAccountData[]);
    }
  };

  const addAccount = () => {
    append({
      id: `acc-${Date.now()}`,
      bankName: '',
      accountType: 'SAVINGS',
      accountNumber: '',
      branch: '',
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onChange={handleFieldChange}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Existing Bank Accounts</h3>
            <p className="text-sm text-muted-foreground">
              This section is optional. Add any existing bank accounts you have.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={addAccount}>
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>

        {fields.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
            <p className="text-muted-foreground mb-4">No bank accounts added yet</p>
            <Button type="button" variant="outline" onClick={addAccount}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Account
            </Button>
          </div>
        )}

        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Account {index + 1}</h4>
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
                name={`accounts.${index}.bankName`}
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
                name={`accounts.${index}.accountType`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ACCOUNT_TYPES.map((type) => (
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

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name={`accounts.${index}.accountNumber`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Account number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`accounts.${index}.branch`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Branch name" />
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
