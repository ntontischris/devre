'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { FileText, Wand2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import dynamic from 'next/dynamic';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const TiptapEditor = dynamic(
  () => import('@/components/shared/tiptap-editor').then((mod) => mod.TiptapEditor),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[200px] border rounded-lg">
        <LoadingSpinner size="md" />
      </div>
    ),
  },
);
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ContractPreview } from './contract-preview';
import { createContract, getContractTemplates } from '@/lib/actions/contracts';
import { createContractSchema } from '@/lib/schemas/contract';
import { z } from 'zod';
import type { Contract, ContractTemplate, Project } from '@/types';

const formSchema = createContractSchema.extend({
  expires_at: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ContractCreatorProps {
  project: Project & { client?: { contact_name?: string; company_name?: string } };
  onSuccess: (contract: Contract) => void;
  onCancel: () => void;
}

export function ContractCreator({ project, onSuccess, onCancel }: ContractCreatorProps) {
  const t = useTranslations('contracts');
  const [step, setStep] = useState<'template' | 'edit' | 'preview'>('template');
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_id: project.id,
      client_id: project.client_id,
      title: '',
      content: '',
      expires_at: '',
    },
  });

  const loadTemplates = useCallback(async () => {
    const result = await getContractTemplates();
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setTemplates(result.data ?? []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleTemplateSelect = (template: ContractTemplate) => {

    // Auto-fill placeholders
    let filledContent = template.content;
    const replacements: Record<string, string> = {
      '{client_name}': project.client?.contact_name || 'Client Name',
      '{company_name}': project.client?.company_name || 'Company Name',
      '{project_title}': project.title || 'Project Title',
      '{date}': format(new Date(), 'MMMM d, yyyy'),
      '{amount}': project.budget ? `$${project.budget.toLocaleString()}` : '$0',
    };

    Object.entries(replacements).forEach(([placeholder, value]) => {
      filledContent = filledContent.replace(new RegExp(placeholder, 'g'), value);
    });

    setContent(filledContent);
    setValue('title', template.title);
    setValue('template_id', template.id);
    setStep('edit');
  };

  const handleStartBlank = () => {
    setContent('');
    setValue('title', `${project.title} - Contract`);
    setStep('edit');
  };

  const handleBack = () => {
    if (step === 'edit') setStep('template');
    if (step === 'preview') setStep('edit');
  };

  const handlePreview = () => {
    setStep('preview');
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    const contractData = {
      ...data,
      content,
    };

    const result = await createContract(contractData);

    if (result.error) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }

    toast.success(t('contractCreatedSuccess'));
    onSuccess(result.data!);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (step === 'template') {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Select a Template</h3>
          <p className="text-sm text-muted-foreground">
            Choose a template to auto-fill contract details, or start from scratch
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-dashed"
            onClick={handleStartBlank}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Blank Contract
              </CardTitle>
              <CardDescription>Start with an empty contract</CardDescription>
            </CardHeader>
          </Card>

          {templates.map((template) => (
            <Card
              key={template.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleTemplateSelect(template)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  {template.title}
                </CardTitle>
                <CardDescription>{(template as any).description || 'No description'}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'preview') {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Preview Contract</h3>
          <p className="text-sm text-muted-foreground">
            Review the contract before saving
          </p>
        </div>

        <ContractPreview
          title={project.title}
          content={content}
          status="draft"
          createdAt={new Date().toISOString()}
        />

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            Back to Edit
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
              Save Draft
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Edit Contract</h3>
        <p className="text-sm text-muted-foreground">
          Customize the contract content and set expiry date
        </p>
      </div>

      <div>
        <Label htmlFor="title">Contract Title</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="e.g., Website Development Agreement"
        />
        {errors.title && (
          <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="expires_at">Expiry Date (Optional)</Label>
        <Input
          id="expires_at"
          type="date"
          {...register('expires_at')}
        />
        {errors.expires_at && (
          <p className="text-sm text-red-600 mt-1">{errors.expires_at.message}</p>
        )}
      </div>

      <div>
        <Label>Contract Content</Label>
        <div className="border rounded-md">
          <TiptapEditor
            content={content}
            onChange={setContent}
            placeholder={t('writeContractContent')}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={handleBack}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
            Save Draft
          </Button>
        </div>
      </div>
    </form>
  );
}
