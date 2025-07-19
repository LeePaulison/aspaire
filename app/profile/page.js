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
  const resumes = useResumesStore((s) => s.resumes, shallow);
  console.log('[ProfilePage] User:', user);
  console.log('[ProfilePage] Preferences:', preferences);
  console.log('[ProfilePage] Resumes:', resumes);
  return (
    <>
      <section className='mt-8'>
        <h1 className='text-2xl font-bold mt-4'>Profile Information</h1>
        <div className='flex flex-row mt-4'>
          <div className='w-24 h-24 relative'>
            <Image
              src={user?.avatar || '/default-avatar.png'}
              alt='User Avatar'
              fill
              className='rounded-full object-cover'
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
        <p>
          {resumes.length > 0
            ? resumes.map((resume) => (
                <div key={resume.id}>
                  <h3 className='font-semibold'>{resume.title}</h3>
                  <p>{resume.experience} years of experience</p>
                </div>
              ))
            : 'No resumes available'}
        </p>
      </section>
    </>
  );
}
