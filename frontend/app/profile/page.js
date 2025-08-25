'use client';

import { shallow } from 'zustand/shallow';
import { useUserStore } from '@/store/userStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import { useResumesStore } from '@/store/resumesStore';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LuSettings } from 'react-icons/lu';

import ResumeDialog from '@/components/resumeDialog';

let rerenderCount = 0;

export default function ProfilePage() {
  const user = useUserStore((s) => s.user, shallow);
  const preferences = usePreferencesStore((s) => s.preferences, shallow);
  const resumes = useResumesStore.getState().resumes;
  console.log('[ProfilePage] User:', user);
  console.log('[ProfilePage] Preferences:', preferences);
  console.log('[ProfilePage] Resumes:', resumes);
  console.log('✅ Resumes length:', resumes.length);
  console.log('🔍 resumes[0]:', resumes[0]);
  console.log('📎 resumes[0].originalFilename:', resumes[0]?.originalFilename);

  return (
    <>
      <section className='mt-8'>
        <h1 className='text-2xl font-bold mt-4'>Profile Information</h1>
        <div className='flex flex-row mt-4'>
          <div className='relative w-10 h-10 md:w-24 md:h-24'>
            <Image
              src={user?.avatar || '/default-avatar.png'}
              alt='User Avatar'
              fill
              className='rounded-full object-cover'
              sizes='(max-width: 48rem) 2.5rem, 6rem'
              priority
            />
          </div>
          <div className='ml-4'>
            <h2 className='text-xl font-semibold'>{user?.name || 'Guest User'}</h2>
            <p className='text-gray-600'>{user?.email || 'No email provided'}</p>
          </div>
        </div>
      </section>
      <section className='mt-8'>
        <div className='flex flex-row justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold'>Quick Preferences View</h2>
          <Button variant='ghost' size='icon' asChild>
            <LuSettings className='size-4' />
          </Button>
        </div>
        <dl className='grid grid-cols-2 gap-4 text-sm'>
          <div>
            <dt>Remote:</dt>
            <dd>{preferences.remote ? 'Yes' : 'No'}</dd>
          </div>
          <div>
            <dt>Salary Range:</dt>
            <dd>
              {preferences.salaryMin}–{preferences.salaryMax} {preferences.salaryCurrency}
            </dd>
          </div>
          <div>
            <dt>Preferred Locations:</dt>
            <dd>{preferences?.preferredLocations?.join(', ') || 'Any'}</dd>
          </div>
          <div>
            <dt>Industries:</dt>
            <dd>{preferences?.industries?.join(', ') || 'Any'}</dd>
          </div>
        </dl>
      </section>
      <section>
        <div className='flex flex-row items-center justify-between mb-2'>
          <h2 className='text-xl font-semibold'>Resumes</h2>
          <ResumeDialog />
        </div>
        {resumes.length > 0
          ? resumes.map((resume, index) => (
              <div key={index} className='p-4 border rounded-lg mb-4'>
                <h3 className='text-lg font-semibold'>{resume.originalFilename}</h3>
                <p className='text-sm text-gray-600'>{resume.description || 'No description provided'}</p>
                <p className='text-xs text-gray-500'>Source: {resume.sourceType}</p>
                <p className='text-xs text-gray-500'>Created: {new Date(resume.createdAt).toLocaleDateString()}</p>
                <p className='text-xs text-gray-500'>Updated: {new Date(resume.updatedAt).toLocaleDateString()}</p>
                <hr className='my-4' />
              </div>
            ))
          : 'No resumes available'}
      </section>
    </>
  );
}
