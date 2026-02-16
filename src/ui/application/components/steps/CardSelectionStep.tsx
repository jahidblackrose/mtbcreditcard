/**
 * Step 1: Card & Credit Limit Details
 * Using standard FormSection pattern like ProfessionalInfoStep
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard, Sparkles } from 'lucide-react';
import { cardSelectionSchema, type CardSelectionFormData } from '@/lib/validation-schemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { StepFormWrapper, FormSection, FieldRow } from '@/components';
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

  const handleFieldChange = () => {
    const values = form.getValues();
    if (form.formState.isValid) {
      onSave(values as CardSelectionData);
    }
  };

  return (
    <StepFormWrapper form={form}
      stepNumber={1}
      title="Card Selection"
      description="Choose your preferred credit card"
      hint="Your selection helps us recommend the best card for your needs"
    >
      <Form {...form}>
        <form className="space-y-6" onChange={handleFieldChange}>
          {/* Card Type Selection */}
          <FormSection
            title="Card Type"
            description="Select your preferred card network, tier, and category"
            icon={<CreditCard className="h-5 w-5" />}
          >
            <FieldRow>
              <FormField
                control={form.control}
                name="cardNetwork"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Card Network</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select network" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CARD_NETWORKS.map((network) => (
                          <SelectItem key={network.value} value={network.value}>
                            {network.label}
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
                name="cardTier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Card Tier</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tier" />
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
            </FieldRow>

            <FormField
              control={form.control}
              name="cardCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Card Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CARD_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Choose between regular, Islamic, or co-branded cards</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          {/* Credit Limit */}
          <FormSection
            title="Credit Limit"
            description="Specify your expected credit limit"
            icon={<Sparkles className="h-5 w-5" />}
          >
            <FormField
              control={form.control}
              name="expectedCreditLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Expected Credit Limit (BDT)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="50000" />
                  </FormControl>
                  <FormDescription>Minimum credit limit: BDT 50,000</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>
        </form>
      </Form>
    </StepFormWrapper>
  );
}
