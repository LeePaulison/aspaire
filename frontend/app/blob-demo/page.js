'use client';

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const FormSchema = z.object({
  file: z.any().refine((val) => val instanceof File, {
    message: 'A file is required.',
  }),
});

export default function BlobDemoPage() {
  const [uploadResult, setUploadResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      file: undefined,
    },
  });

  async function onSubmit(data) {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('file', data.file);

      const res = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        alert('Upload failed: ' + errorText);
        return;
      }

      const result = await res.json();
      setUploadResult(result);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className='max-w-xl mx-auto mt-10'>
      <Card>
        <CardHeader>
          <h2 className='text-lg font-semibold mx-auto'>S3 Storage Demo</h2>
        </CardHeader>
        <CardContent className='text-center'>
          <p className='mb-4'>This page is used to demonstrate blob storage functionality.</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='file'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload File</FormLabel>
                    <FormControl>
                      <Input
                        type='file'
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          if (file && file.size > 10 * 1024 * 1024) {
                            alert('File too large (max 10 MB)');
                            return;
                          }
                          field.onChange(file);
                        }}
                      />
                    </FormControl>
                    <FormDescription>Upload a file to the blob storage.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Uploading...' : 'Upload'}
              </Button>
            </form>
          </Form>

          {uploadResult && (
            <div className='mt-6 p-4 border rounded bg-green-50 text-green-800'>
              <p className='font-semibold mb-2'>Upload successful!</p>
              <pre className='text-xs'>{JSON.stringify(uploadResult, null, 2)}</pre>
            </div>
          )}

          {uploadResult && (
            <Button
              className='mt-4'
              onClick={async () => {
                const res = await fetch(`/api/get-resume-url?key=${encodeURIComponent(uploadResult.key)}`);
                const data = await res.json();
                window.open(data.signedUrl, '_blank');
              }}
            >
              Download File
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
