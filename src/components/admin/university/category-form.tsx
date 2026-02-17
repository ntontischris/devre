'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import {
  createKbCategorySchema,
  type CreateKbCategoryInput,
} from '@/lib/schemas/kb-category';
import { createKbCategory, updateKbCategory } from '@/lib/actions/kb-categories';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/shared/loading-spinner';

interface Category {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  sort_order: number;
  parent_id: string | null;
}

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  categories: Category[];
  onSuccess: () => void;
}

export function CategoryForm({
  open,
  onOpenChange,
  category,
  categories,
  onSuccess,
}: CategoryFormProps) {
  const t = useTranslations('university');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!category;

  const form = useForm<CreateKbCategoryInput>({
    resolver: zodResolver(createKbCategorySchema),
    defaultValues: {
      title: '',
      description: '',
      slug: '',
      sort_order: 0,
      parent_id: null,
    },
  });

  // Auto-generate slug from title
  const watchTitle = form.watch('title');
  useEffect(() => {
    if (!isEditing && watchTitle) {
      const slug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      form.setValue('slug', slug);
    }
  }, [watchTitle, isEditing, form]);

  // Load category data when editing
  useEffect(() => {
    if (category) {
      form.reset({
        title: category.title,
        description: category.description ?? '',
        slug: category.slug,
        sort_order: category.sort_order,
        parent_id: category.parent_id,
      });
    } else {
      form.reset({
        title: '',
        description: '',
        slug: '',
        sort_order: 0,
        parent_id: null,
      });
    }
  }, [category, form]);

  const onSubmit = async (data: CreateKbCategoryInput) => {
    setIsSubmitting(true);

    const result = isEditing && category
      ? await updateKbCategory(category.id, data)
      : await createKbCategory(data);

    setIsSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(isEditing ? 'Category updated' : 'Category created');
    onOpenChange(false);
    form.reset();
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Category' : 'New Category'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update category details'
              : 'Create a new knowledge base category'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Getting Started" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="getting-started" {...field} />
                  </FormControl>
                  <FormDescription>
                    URL-friendly identifier (lowercase, hyphens only)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('categoryDescriptionPlaceholder')}
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parent_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Category (Optional)</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === 'none' ? null : value)}
                    value={field.value ?? 'none'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectParentCategory')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {categories
                        .filter((c) => c.id !== category?.id)
                        .map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.title}
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
              name="sort_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      name={field.name}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      value={field.value as number}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Lower numbers appear first
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    <span>Saving...</span>
                  </div>
                ) : isEditing ? (
                  'Update'
                ) : (
                  'Create'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
