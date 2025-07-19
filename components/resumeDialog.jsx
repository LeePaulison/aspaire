'use client';

import { useMutation } from '@apollo/client';
import { CREATE_FILE_RESUME, CREATE_PASTED_RESUME } from '@/graphql/mutations/resume';
import { useUserStore } from '@/store/userStore';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { UploadResumeForm } from '@/components/uploadResumeForm';
import { PasteResumeForm } from '@/components/pastedResumeForm';

export default function ResumeDialog() {
  const user = useUserStore((s) => s.user);
  const [createFileResume] = useMutation(CREATE_FILE_RESUME);
  const [createPastedResume] = useMutation(CREATE_PASTED_RESUME);

  const handleUpload = async (data, user) => {
    const { resumeFile, description } = data;

    if (!resumeFile || !user?.id) return;

    const formData = new FormData();
    formData.append('file', resumeFile);

    const uploadRes = await fetch('/api/upload-resume', {
      method: 'POST',
      body: formData,
    });

    if (!uploadRes.ok) {
      console.error('[handleUpload] Upload failed');
      return;
    }

    const uploaded = await uploadRes.json();

    // 2. Store metadata in GraphQL
    const input = {
      userId: user.id,
      s3Key: uploaded.key,
      originalFilename: uploaded.originalFilename,
      size: uploaded.size,
      contentType: uploaded.contentType,
      uploadedAt: new Date().toISOString(),
      sourceType: 'UPLOAD',
      description,
    };

    await createFileResume({ variables: { input } });
  };

  const handlePaste = async (data, user) => {
    const { resumeContent, description, partial } = data;

    if (!resumeContent || !user?.id) return;

    const input = {
      userId: user.id,
      pastedContent: resumeContent,
      sourceType: 'PASTE',
      description,
      partial,
    };

    await createPastedResume({ variables: { input } });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[var(--primary)] text-[var(--primary-foreground)]">
          Add Resume
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add a Resume</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="upload" className="w-full mt-4">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="paste">Paste</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4">
            <UploadResumeForm onSubmit={handleUpload} />
          </TabsContent>

          <TabsContent value="paste" className="mt-4">
            <PasteResumeForm onSubmit={handlePaste} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
