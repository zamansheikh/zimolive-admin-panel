'use client';

import { FormEvent, useState } from 'react';

import { Button, Card, ErrorAlert, Field, Input, Select } from '@/components/ui';
import { api } from '@/lib/api';
import type { RoomEmoji, RoomEmojiType } from '@/types';

interface Props {
  initial?: RoomEmoji;
  onSaved: (e: RoomEmoji) => void;
}

const TYPE_OPTIONS: { value: RoomEmojiType; label: string; hint: string }[] = [
  {
    value: 'char',
    label: 'Character — raw unicode (😀, 😴, 🎉)',
    hint: 'Cheapest. Renders as plain text on the client.',
  },
  {
    value: 'image',
    label: 'Image — PNG / WEBP / GIF',
    hint: 'Static or simple-animated thumbnail. Cached on the client.',
  },
  {
    value: 'svga',
    label: 'SVGA — animated',
    hint: 'Heaviest. Use only when an image / GIF is not enough.',
  },
];

const COMMON_CATEGORIES = [
  'happy',
  'sad',
  'love',
  'tease',
  'thumbs',
  'vip',
  'general',
];

/**
 * Catalog editor for one room-emoji. Keeps per-type fields conditional
 * so a `char` emoji never carries a stale `assetUrl` and vice versa —
 * the backend re-validates on save, this is just so the form doesn't
 * mislead the admin into setting a field that won't be used.
 */
export default function RoomEmojiForm({ initial, onSaved }: Props) {
  const isEdit = !!initial;

  const [name, setName] = useState(initial?.name ?? '');
  const [category, setCategory] = useState(initial?.category ?? 'general');
  const [type, setType] = useState<RoomEmojiType>(initial?.type ?? 'char');
  const [char, setChar] = useState(initial?.char ?? '');
  const [assetUrl, setAssetUrl] = useState(initial?.assetUrl ?? '');
  const [assetPublicId, setAssetPublicId] = useState(initial?.assetPublicId ?? '');
  const [durationMs, setDurationMs] = useState(String(initial?.durationMs ?? 3000));
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));
  const [active, setActive] = useState(initial?.active ?? true);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadAsset(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const url =
        type === 'svga'
          ? '/admin/room-emojis/upload?type=svga'
          : '/admin/room-emojis/upload';
      const res = await api<{ url: string; publicId: string }>(url, {
        method: 'POST',
        body: fd,
      });
      setAssetUrl(res.url);
      setAssetPublicId(res.publicId);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // Quick client-side guards so the API doesn't have to round-trip
    // for the obvious missing-field case.
    if (type === 'char' && !char.trim()) {
      setError('A character is required for char-type emojis.');
      return;
    }
    if ((type === 'image' || type === 'svga') && !assetUrl) {
      setError('Upload an asset before saving.');
      return;
    }

    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        name,
        category: category.trim() || 'general',
        type,
        // Only ship the field that matches the type. Avoids carrying
        // stale data forward when the admin switches types mid-edit.
        char: type === 'char' ? char.trim() : '',
        assetUrl: type === 'char' ? '' : assetUrl,
        assetPublicId: type === 'char' ? '' : assetPublicId,
        durationMs: parseInt(durationMs, 10) || 3000,
        sortOrder: parseInt(sortOrder, 10) || 0,
        active,
      };
      const res = isEdit
        ? await api<{ emoji: RoomEmoji }>(
            `/admin/room-emojis/${initial!.id}`,
            { method: 'PATCH', body: JSON.stringify(body) },
          )
        : await api<{ emoji: RoomEmoji }>('/admin/room-emojis', {
            method: 'POST',
            body: JSON.stringify(body),
          });
      onSaved(res.emoji);
    } catch (e: any) {
      setError(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name" hint="Shown in the picker grid (e.g. 'Laughing')">
            <Input
              required
              maxLength={60}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Laughing"
            />
          </Field>
          <Field
            label="Category"
            hint="Free-form bucket — the picker groups by this string."
          >
            <Input
              list="emoji-categories"
              maxLength={40}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="general"
            />
            <datalist id="emoji-categories">
              {COMMON_CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
        </div>

        <Field label="Type">
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as RoomEmojiType)}
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
          <p className="mt-1 text-xs text-slate-500">
            {TYPE_OPTIONS.find((o) => o.value === type)?.hint}
          </p>
        </Field>

        {type === 'char' ? (
          <Field
            label="Character"
            hint="Paste any unicode emoji or short symbol (max 8 chars)."
          >
            <Input
              required
              maxLength={8}
              value={char}
              onChange={(e) => setChar(e.target.value)}
              placeholder="😀"
              className="text-2xl"
            />
            {char && (
              <div className="mt-2 flex h-16 w-16 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-4xl">
                {char}
              </div>
            )}
          </Field>
        ) : (
          <Field label={type === 'svga' ? 'SVGA file' : 'Image file'}>
            <div className="flex items-start gap-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50">
                {assetUrl ? (
                  type === 'image' ? (
                    <img
                      src={assetUrl}
                      alt=""
                      className="h-full w-full rounded-lg object-contain"
                    />
                  ) : (
                    <span className="text-xs text-slate-500">SVGA</span>
                  )
                ) : (
                  <span className="text-[10px] text-slate-400">No file</span>
                )}
              </div>
              <input
                type="file"
                accept={type === 'svga' ? '.svga' : 'image/png,image/jpeg,image/webp,image/gif'}
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadAsset(f);
                  e.target.value = '';
                }}
                className="block w-full text-sm"
              />
            </div>
            {uploading && <p className="mt-1 text-xs text-slate-500">Uploading…</p>}
            {assetUrl && (
              <p className="mt-1 break-all text-xs text-slate-500">{assetUrl}</p>
            )}
          </Field>
        )}

        <div className="grid grid-cols-3 gap-3">
          <Field
            label="Duration (ms)"
            hint="How long the reaction stays on screen. 500–15000."
          >
            <Input
              type="number"
              min={500}
              max={15000}
              value={durationMs}
              onChange={(e) => setDurationMs(e.target.value)}
            />
          </Field>
          <Field label="Sort order" hint="Lower first inside its category.">
            <Input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </Field>
          <Field label="Status">
            <Select
              value={active ? 'true' : 'false'}
              onChange={(e) => setActive(e.target.value === 'true')}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Select>
          </Field>
        </div>

        {error && <ErrorAlert message={error} />}

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={saving || uploading}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create emoji'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
