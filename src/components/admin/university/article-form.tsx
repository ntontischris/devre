'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  createKbArticleSchema,
  type CreateKbArticleInput,
} from '@/lib/schemas/kb-article';
import { createKbArticle, updateKbArticle } from '@/lib/actions/kb-articles';
import { Button } from '@/components/ui/button';
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
import { Switch } from '@/components/ui/switch';
import { TiptapEditor } from '@/components/shared/tiptap-editor';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/shared/loading-spinner';

interface Category {
  id: string;
  title: string;
  slug: string;
}

interface Article {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  content: string;
  summary: string | null;
  video_urls: string[];
  published: boolean;
  sort_order: number;
}

interface ArticleFormProps {
  article?: Article | null;
  categories: Category[];
}

export function ArticleForm({ article, categories }: ArticleFormProps) {
  const router = useRouter();
  const t = useTranslations('university');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoUrls, setVideoUrls] = useState<string[]>(article?.video_urls ?? []);
  const isEditing = !!article;

  const form = useForm<CreateKbArticleInput>({
    resolver: zodResolver(createKbArticleSchema),
    defaultValues: {
      category_id: article?.category_id ?? '',
      title: article?.title ?? '',
      slug: article?.slug ?? '',
      content: article?.content ?? '',
      summary: article?.summary ?? '',
      video_urls: article?.video_urls ?? [],
      published: article?.published ?? false,
      sort_order: article?.sort_order ?? 0,
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

  const handleAddVideoUrl = () => {
    const newUrls = [...videoUrls, ''];
    setVideoUrls(newUrls);
    form.setValue('video_urls', newUrls);
  };

  const handleRemoveVideoUrl = (index: number) => {
    const newUrls = videoUrls.filter((_, i) => i !== index);
    setVideoUrls(newUrls);
    form.setValue('video_urls', newUrls);
  };

  const handleVideoUrlChange = (index: number, value: string) => {
    const newUrls = [...videoUrls];
    newUrls[index] = value;
    setVideoUrls(newUrls);
    form.setValue('video_urls', newUrls);
  };

  const onSubmit = async (data: CreateKbArticleInput) => {
    setIsSubmitting(true);

    // Filter out empty video URLs
    const cleanedData = {
      ...data,
      video_urls: (data.video_urls ?? []).filter((url) => url.trim() !== ''),
    };

    const result = isEditing && article
      ? await updateKbArticle(article.id, cleanedData)
      : await createKbArticle(cleanedData);

    setIsSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(isEditing ? 'Article updated' : 'Article created');
    router.push('/admin/university');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectCategory')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.title}
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., How to create a project" {...field} />
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
                <Input placeholder="how-to-create-a-project" {...field} />
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
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Summary</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('articleSummaryPlaceholder')}
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
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <TiptapEditor
                  content={field.value as string}
                  onChange={field.onChange}
                  placeholder={t('articleContentPlaceholder')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Video URLs (Optional)</FormLabel>
          <FormDescription>
            Add YouTube or Vimeo URLs to embed videos in the article
          </FormDescription>
          {videoUrls.map((url, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => handleVideoUrlChange(index, e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleRemoveVideoUrl(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddVideoUrl}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Video URL
          </Button>
        </div>

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
              <FormDescription>Lower numbers appear first</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Published</FormLabel>
                <FormDescription>
                  Make this article visible to employees
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/university')}
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
              'Update Article'
            ) : (
              'Create Article'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
