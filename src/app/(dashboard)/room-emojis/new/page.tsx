'use client';

import { useRouter } from 'next/navigation';

import RoomEmojiForm from '@/components/room-emoji-form';
import { Button, PageHeader } from '@/components/ui';

export default function NewRoomEmojiPage() {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="New room emoji"
        subtitle="Pick a render type, set a name + category, and (for image / SVGA) upload the asset."
        actions={
          <Button variant="secondary" onClick={() => router.back()}>
            ← Back
          </Button>
        }
      />
      <RoomEmojiForm onSaved={() => router.push('/room-emojis')} />
    </div>
  );
}
