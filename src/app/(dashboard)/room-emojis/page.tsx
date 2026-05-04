'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Badge,
  Button,
  EmptyState,
  ErrorAlert,
  PageHeader,
  Table,
  Td,
  Th,
} from '@/components/ui';
import { api } from '@/lib/api';
import { authStorage, hasPermission } from '@/lib/auth';
import type { RoomEmoji } from '@/types';

/**
 * Catalog of seat-emoji reactions. Small enough that we list everything
 * unpaginated — emojis are a global set (tens of rows). Listing is
 * grouped by category so admins see the picker layout the mobile app
 * will produce.
 */
export default function RoomEmojisPage() {
  const permissions = useMemo(
    () => authStorage.getRole()?.permissions ?? [],
    [],
  );
  // Reuses VIP_MANAGE since rooms are part of the platform's core
  // surface and we don't want to fragment the permission list.
  const canManage = hasPermission(permissions, 'vip.manage');

  const [items, setItems] = useState<RoomEmoji[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api<{ items: RoomEmoji[] }>('/admin/room-emojis');
      setItems(res.items);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Group by category preserving insertion order so the admin sees
  // the same layout the mobile picker will render.
  const grouped = useMemo(() => {
    const out = new Map<string, RoomEmoji[]>();
    for (const e of items) {
      const arr = out.get(e.category) ?? [];
      arr.push(e);
      out.set(e.category, arr);
    }
    return Array.from(out.entries());
  }, [items]);

  return (
    <div>
      <PageHeader
        title="Room Emojis"
        subtitle="Reactions seated users can fire over their mic. Three render types: raw character, image, or SVGA animation. Mobile groups them by category in the picker."
        actions={
          canManage && <Button href="/room-emojis/new">+ New Emoji</Button>
        }
      />

      {error && (
        <div className="mb-4">
          <ErrorAlert message={error} />
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading…
        </div>
      ) : items.length === 0 ? (
        <EmptyState message="No emojis configured yet." />
      ) : (
        <div className="space-y-6">
          {grouped.map(([category, list]) => (
            <section key={category}>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {category} ({list.length})
              </h2>
              <Table>
                <thead>
                  <tr>
                    <Th>Preview</Th>
                    <Th>Name</Th>
                    <Th>Type</Th>
                    <Th>Duration</Th>
                    <Th>Sort</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((e) => (
                    <tr key={e.id} className="cursor-pointer hover:bg-slate-50">
                      <Td>
                        <Link href={`/room-emojis/${e.id}`}>
                          <EmojiPreview emoji={e} />
                        </Link>
                      </Td>
                      <Td>
                        <Link href={`/room-emojis/${e.id}`}>
                          <div className="font-medium text-slate-900">
                            {e.name}
                          </div>
                        </Link>
                      </Td>
                      <Td className="text-xs">
                        <Badge tone="brand">{e.type}</Badge>
                      </Td>
                      <Td className="text-xs">{e.durationMs} ms</Td>
                      <Td className="text-xs">{e.sortOrder}</Td>
                      <Td>
                        {e.active ? (
                          <Badge tone="green">active</Badge>
                        ) : (
                          <Badge tone="amber">inactive</Badge>
                        )}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

/// Inline preview that picks the right renderer per type. SVGA only
/// shows a placeholder badge — rendering the player on the admin list
/// would burn cycles and we don't have the SVGA player on the web side
/// anyway.
function EmojiPreview({ emoji }: { emoji: RoomEmoji }) {
  if (emoji.type === 'char') {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded bg-slate-50 text-2xl">
        {emoji.char}
      </div>
    );
  }
  if (emoji.type === 'image' && emoji.assetUrl) {
    return (
      <img
        src={emoji.assetUrl}
        alt=""
        className="h-12 w-12 rounded bg-slate-50 object-contain"
      />
    );
  }
  // SVGA fallback.
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded bg-slate-100 text-[10px] font-semibold text-slate-500">
      SVGA
    </div>
  );
}
