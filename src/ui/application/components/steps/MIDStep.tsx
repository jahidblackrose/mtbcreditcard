/**
 * Step 12: Most Important Document (MID) - Declarations & Document Checklist
 */

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { midSchema, type MIDFormData } from '@/lib/validation-schemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Check, AlertCircle } from 'lucide-react';
import type { MIDData, DeclarationItem, DocumentChecklistItem } from '@/types/application-form.types';

interface MIDStepProps {
  initialData?: Partial<MIDData>;
  onSave: (data: MIDData) => void;
}

const DEFAULT_DECLARATIONS: DeclarationItem[] = [
  {
    id: 'dec-1',
    question: 'Are you a politically exposed person (PEP) or related to one?',
    answer: null,
  },
  {
    id: 'dec-2',
    question: 'Have you ever been declared bankrupt or have any pending bankruptcy proceedings?',
    answer: null,
  },
  {
    id: 'dec-3',
    question: 'Have you ever been convicted of any criminal offense?',
    answer: null,
  },
  {
    id: 'dec-4',
    question: 'Have you ever had a credit card or loan facility cancelled by a bank?',
    answer: null,
  },
  {
    id: 'dec-5',
    question: 'Is any litigation currently pending against you?',
    answer: null,
  },
  {
    id: 'dec-6',
    question: 'Have you ever been subject to any disciplinary action by your employer?',
    answer: null,
  },
];

const DEFAULT_DOCUMENT_CHECKLIST: DocumentChecklistItem[] = [
  { id: 'doc-1', documentType: 'NID', label: 'National ID Card (Both Sides)', required: true, uploaded: false },
  { id: 'doc-2', documentType: 'PHOTOGRAPH', label: 'Passport Size Photograph', required: true, uploaded: false },
  { id: 'doc-3', documentType: 'SALARY_SLIP', label: 'Latest Salary Slip / Pay Statement', required: true, uploaded: false },
  { id: 'doc-4', documentType: 'BANK_STATEMENT', label: 'Last 6 Months Bank Statement', required: true, uploaded: false },
  { id: 'doc-5', documentType: 'TIN_CERTIFICATE', label: 'TIN Certificate (if applicable)', required: false, uploaded: false },
  { id: 'doc-6', documentType: 'PASSPORT', label: 'Passport Copy (if available)', required: false, uploaded: false },
  { id: 'doc-7', documentType: 'UTILITY_BILL', label: 'Utility Bill (Address Proof)', required: false, uploaded: false },
  { id: 'doc-8', documentType: 'TRADE_LICENSE', label: 'Trade License (for Business)', required: false, uploaded: false },
];

export function MIDStep({ initialData, onSave }: MIDStepProps) {
  const form = useForm<MIDFormData>({
    resolver: zodResolver(midSchema),
    defaultValues: {
      declarations: initialData?.declarations || DEFAULT_DECLARATIONS,
      documentChecklist: initialData?.documentChecklist || DEFAULT_DOCUMENT_CHECKLIST,
    },
    mode: 'onChange',
  });

  const { fields: declarationFields, update: updateDeclaration } = useFieldArray({
    control: form.control,
    name: 'declarations',
  });

  const { fields: documentFields, update: updateDocument } = useFieldArray({
    control: form.control,
    name: 'documentChecklist',
  });

  const handleFieldChange = () => {
    const values = form.getValues();
    if (form.formState.isValid) {
      onSave(values as MIDData);
    }
  };

  const handleDeclarationChange = (index: number, answer: boolean) => {
    updateDeclaration(index, {
      ...declarationFields[index],
      answer,
    });
    handleFieldChange();
  };

  const handleDocumentUpload = (index: number) => {
    // Mock upload - in real implementation, this would open file picker
    updateDocument(index, {
      ...documentFields[index],
      uploaded: !documentFields[index].uploaded,
      fileUrl: documentFields[index].uploaded ? undefined : 'mock-uploaded-url',
    });
    handleFieldChange();
  };

  const requiredDocsComplete = documentFields
    .filter(d => d.required)
    .every(d => d.uploaded);

  const allDeclarationsAnswered = declarationFields.every(d => d.answer !== null);

  return (
    <Form {...form}>
      <form className="space-y-6">
        {/* Declarations Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Declarations</CardTitle>
              {allDeclarationsAnswered ? (
                <span className="flex items-center text-sm text-green-600">
                  <Check className="h-4 w-4 mr-1" />
                  Complete
                </span>
              ) : (
                <span className="flex items-center text-sm text-amber-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Required
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {declarationFields.map((field, index) => (
              <div key={field.id} className="space-y-3">
                <p className="text-sm">{field.question}</p>
                <RadioGroup
                  value={field.answer === null ? undefined : field.answer ? 'yes' : 'no'}
                  onValueChange={(val) => handleDeclarationChange(index, val === 'yes')}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id={`${field.id}-yes`} />
                    <label htmlFor={`${field.id}-yes`} className="text-sm cursor-pointer">
                      Yes
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id={`${field.id}-no`} />
                    <label htmlFor={`${field.id}-no`} className="text-sm cursor-pointer">
                      No
                    </label>
                  </div>
                </RadioGroup>
                {index < declarationFields.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Document Checklist Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Document Checklist</CardTitle>
              {requiredDocsComplete ? (
                <span className="flex items-center text-sm text-green-600">
                  <Check className="h-4 w-4 mr-1" />
                  Required Docs Uploaded
                </span>
              ) : (
                <span className="flex items-center text-sm text-amber-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Upload Required Docs
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Required Documents */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Required Documents</h4>
                {documentFields.filter(d => d.required).map((field, index) => {
                  const originalIndex = documentFields.findIndex(d => d.id === field.id);
                  return (
                    <div
                      key={field.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        field.uploaded ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={field.uploaded}
                          onCheckedChange={() => handleDocumentUpload(originalIndex)}
                        />
                        <div>
                          <p className="text-sm font-medium">{field.label}</p>
                          <p className="text-xs text-muted-foreground">Required</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant={field.uploaded ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => handleDocumentUpload(originalIndex)}
                      >
                        {field.uploaded ? (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Uploaded
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-1" />
                            Upload
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>

              <Separator />

              {/* Optional Documents */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Optional Documents</h4>
                {documentFields.filter(d => !d.required).map((field, index) => {
                  const originalIndex = documentFields.findIndex(d => d.id === field.id);
                  return (
                    <div
                      key={field.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        field.uploaded ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={field.uploaded}
                          onCheckedChange={() => handleDocumentUpload(originalIndex)}
                        />
                        <div>
                          <p className="text-sm font-medium">{field.label}</p>
                          <p className="text-xs text-muted-foreground">Optional</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant={field.uploaded ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => handleDocumentUpload(originalIndex)}
                      >
                        {field.uploaded ? (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Uploaded
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-1" />
                            Upload
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
