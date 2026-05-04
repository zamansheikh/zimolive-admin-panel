'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import RoomEmojiForm from '@/components/room-emoji-form';
import { Button, ErrorAlert, PageHeader } from '@/components/ui';
import { api } from '@/lib/api';
import type { RoomEmoji } from '@/types';

/**
 * Edit a single room-emoji. There's no GET-by-id endpoint on the
 * admin API — the catalog is small enough that fetching the full
 * list and filtering is cheaper than adding another route.
 */
export default function EditRoomEmojiPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [emoji, setEmoji] = useState<RoomEmoji | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api<{ items: RoomEmoji[] }>('/admin/room-emojis');
      setEmoji(res.items.find((e) => e.id === id) ?? null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function onDelete() {
    if (!confirm('Hide this emoji from the picker? Existing reactions stay in place.')) {
      return;
    }
    try {
      await api(`/admin/room-emojis/${id}`, { method: 'DELETE' });
      router.push('/room-emojis');
    } catch (e: any) {
      setError(e.message);
    }
  }

  if (loading) return <div className="text-sm text-slate-500">Loading…</div>;
  if (!emoji) return <ErrorAlert message={error || 'Emoji not found'} />;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={emoji.name}
        subtitle={`${emoji.type} · ${emoji.category}`}
        actions={
          <>
            <Button variant="secondary" onClick={() => router.back()}>
              ← Back
            </Button>
            <Button variant="danger" onClick={onDelete}>
              Deactivate
            </Button>
          </>
        }
      />
      {error && (
        <div className="mb-4">
          <ErrorAlert message={error} />
        </div>
      )}
      <RoomEmojiForm initial={emoji} onSaved={(e) => setEmoji(e)} />
    </div>
  );
}
