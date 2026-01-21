/**
 * Step 1: Card & Credit Limit Details
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cardSelectionSchema, type CardSelectionFormData } from '@/lib/validation-schemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import type { CardSelectionData } from '@/types/application-form.types';

interface CardSelectionStepProps {
  initialData?: Partial<CardSelectionData>;
  onSave: (data: CardSelectionData) => void;
}

const CARD_NETWORKS = [
  { value: 'MASTERCARD', label: 'Mastercard' },
  { value: 'VISA', label: 'Visa' },
  { value: 'UNIONPAY', label: 'UnionPay' },
];

const CARD_TIERS = [
  { value: 'CLASSIC', label: 'Classic' },
  { value: 'GOLD', label: 'Gold' },
  { value: 'PLATINUM', label: 'Platinum' },
  { value: 'TITANIUM', label: 'Titanium' },
  { value: 'SIGNATURE', label: 'Signature' },
  { value: 'WORLD', label: 'World' },
];

const CARD_CATEGORIES = [
  { value: 'REGULAR', label: 'Regular' },
  { value: 'YAQEEN', label: 'Yaqeen (Islamic)' },
  { value: 'CO_BRANDED', label: 'Co-Branded' },
];

export function CardSelectionStep({ initialData, onSave }: CardSelectionStepProps) {
  const form = useForm<CardSelectionFormData>({
    resolver: zodResolver(cardSelectionSchema),
    defaultValues: {
      cardNetwork: initialData?.cardNetwork || undefined,
      cardTier: initialData?.cardTier || undefined,
      cardCategory: initialData?.cardCategory || undefined,
      expectedCreditLimit: initialData?.expectedCreditLimit || '',
    },
    mode: 'onChange',
  });

  // Auto-save on valid change
  const handleFieldChange = () => {
    const values = form.getValues();
    if (form.formState.isValid) {
      onSave(values as CardSelectionData);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onChange={handleFieldChange}>
        {/* Card Network Selection */}
        <div className="grid gap-4 sm:grid-cols-3">
          {CARD_NETWORKS.map((network) => (
            <Card
              key={network.value}
              className={`cursor-pointer transition-all hover:border-primary ${
                form.watch('cardNetwork') === network.value
                  ? 'border-primary bg-primary/5 ring-2 ring-primary'
                  : ''
              }`}
              onClick={() => {
                form.setValue('cardNetwork', network.value as any);
                handleFieldChange();
              }}
            >
              <CardContent className="flex flex-col items-center justify-center p-6">
                <CreditCard className="h-8 w-8 mb-2 text-primary" />
                <span className="font-medium">{network.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        <FormField
          control={form.control}
          name="cardNetwork"
          render={() => (
            <FormItem className="hidden">
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Card Tier */}
        <FormField
          control={form.control}
          name="cardTier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Tier</FormLabel>
              <Select onValueChange={(val) => { field.onChange(val); handleFieldChange(); }} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select card tier" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CARD_TIERS.map((tier) => (
                    <SelectItem key={tier.value} value={tier.value}>
                      {tier.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Card Category */}
        <FormField
          control={form.control}
          name="cardCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Category</FormLabel>
              <Select onValueChange={(val) => { field.onChange(val); handleFieldChange(); }} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select card category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CARD_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Expected Credit Limit */}
        <FormField
          control={form.control}
          name="expectedCreditLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expected Credit Limit (BDT)</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">৳</span>
                  <Input
                    {...field}
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 100000"
                    className="pl-8"
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      field.onChange(value);
                      handleFieldChange();
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
              <p className="text-xs text-muted-foreground">Minimum: BDT 50,000</p>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
