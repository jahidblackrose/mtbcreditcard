/**
 * Step 1: Card & Credit Limit Details - Mobile Banking App Style
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cardSelectionSchema, type CardSelectionFormData } from '@/lib/validation-schemas';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { CreditCard, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CardSelectionData } from '@/types/application-form.types';
import { MobileFormCard, MobileFormSection } from '@/ui/mobile/components';

interface CardSelectionStepProps {
  initialData?: Partial<CardSelectionData>;
  onSave: (data: CardSelectionData) => void;
}

const CARD_NETWORKS = [
  { value: 'MASTERCARD', label: 'Mastercard', icon: '💳' },
  { value: 'VISA', label: 'Visa', icon: '💳' },
  { value: 'UNIONPAY', label: 'UnionPay', icon: '💳' },
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

  const selectedNetwork = form.watch('cardNetwork');
  const selectedTier = form.watch('cardTier');
  const selectedCategory = form.watch('cardCategory');

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
        <MobileFormSection title="SELECT CARD NETWORK">
          <div className="space-y-2">
            {CARD_NETWORKS.map((network) => {
              const isSelected = selectedNetwork === network.value;
              return (
                <button
                  key={network.value}
                  type="button"
                  onClick={() => {
                    form.setValue('cardNetwork', network.value as any);
                    handleFieldChange();
                  }}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 rounded-xl',
                    'bg-card border transition-all duration-200',
                    'text-left',
                    isSelected
                      ? 'border-success ring-1 ring-success'
                      : 'border-border/50 hover:border-border'
                  )}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    isSelected ? 'bg-success/15' : 'bg-muted'
                  )}>
                    <CreditCard className={cn(
                      'h-5 w-5',
                      isSelected ? 'text-success' : 'text-muted-foreground'
                    )} />
                  </div>
                  <span className={cn(
                    'flex-1 text-base font-medium',
                    isSelected ? 'text-foreground' : 'text-foreground/80'
                  )}>
                    {network.label}
                  </span>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
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
        </MobileFormSection>

        {/* Card Tier Selection */}
        <MobileFormSection title="SELECT CARD TIER">
          <div className="space-y-2">
            {CARD_TIERS.map((tier) => {
              const isSelected = selectedTier === tier.value;
              return (
                <button
                  key={tier.value}
                  type="button"
                  onClick={() => {
                    form.setValue('cardTier', tier.value as any);
                    handleFieldChange();
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 p-4 rounded-xl',
                    'bg-card border transition-all duration-200',
                    'text-left',
                    isSelected
                      ? 'border-success ring-1 ring-success'
                      : 'border-border/50 hover:border-border'
                  )}
                >
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                      'transition-all duration-200',
                      isSelected
                        ? 'border-success bg-success'
                        : 'border-muted-foreground/40'
                    )}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className={cn(
                    'text-base font-medium',
                    isSelected ? 'text-foreground' : 'text-foreground/80'
                  )}>
                    {tier.label}
                  </span>
                </button>
              );
            })}
          </div>
        </MobileFormSection>

        {/* Card Category Selection */}
        <MobileFormSection title="SELECT CARD CATEGORY">
          <div className="flex gap-2">
            {CARD_CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category.value;
              return (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => {
                    form.setValue('cardCategory', category.value as any);
                    handleFieldChange();
                  }}
                  className={cn(
                    'flex-1 py-3 px-4 rounded-xl text-sm font-medium',
                    'border transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-success/30',
                    isSelected
                      ? 'bg-success/15 border-success text-success'
                      : 'bg-card border-border/50 text-foreground/70 hover:border-border'
                  )}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </MobileFormSection>

        {/* Expected Credit Limit */}
        <MobileFormSection title="CREDIT LIMIT">
          <MobileFormCard>
            <FormField
              control={form.control}
              name="expectedCreditLimit"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">৳</span>
                      <input
                        {...field}
                        type="text"
                        inputMode="numeric"
                        placeholder="Enter expected limit (min. 50,000)"
                        className={cn(
                          'w-full bg-transparent rounded-xl',
                          'pl-10 pr-4 py-3.5 text-base text-foreground',
                          'placeholder:text-muted-foreground/60',
                          'focus:outline-none',
                          'transition-all duration-200'
                        )}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          field.onChange(value);
                          handleFieldChange();
                        }}
                      />
                    </div>
                  </FormControl>
                  <p className="text-xs text-muted-foreground px-1 mt-2">
                    Minimum credit limit: BDT 50,000
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </MobileFormCard>
        </MobileFormSection>
      </form>
    </Form>
  );
}
