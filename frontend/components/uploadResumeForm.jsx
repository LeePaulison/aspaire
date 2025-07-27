'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormLabel, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { uploadResumeSchema } from '@/lib/schemas/resume';
import { useUserStore } from '@/store/userStore';

export function UploadResumeForm({ onSubmit }) {
  const user = useUserStore((s) => s.user);

  const form = useForm({
    resolver: zodResolver(uploadResumeSchema),
    defaultValues: {
      resumeFile: null,
      description: '',
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => onSubmit(data, user))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="resumeFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Dev Resume 2024" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Upload</Button>
      </form>
    </Form>
  );
}
