import { pasteResumeSchema } from '@/lib/schemas/resume';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Form, FormField, FormLabel, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/ui/button';

export function PasteResumeForm({ onSubmit }) {
  const user = useUserStore((s) => s.user);

  const form = useForm({
    resolver: zodResolver(pasteResumeSchema),
    defaultValues: {
      resumeContent: '',
      description: '',
      partial: false,
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
          name="resumeContent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paste Resume</FormLabel>
              <FormControl>
                <Textarea rows={8} {...field} />
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
                <Input placeholder="e.g. Backend Resume" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="partial"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormLabel>Partial?</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
