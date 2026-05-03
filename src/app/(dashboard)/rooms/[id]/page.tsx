'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorAlert,
  PageHeader,
  Table,
  Td,
  Th,
} from '@/components/ui';
import { api } from '@/lib/api';
import { authStorage, hasPermission } from '@/lib/auth';
import {
  resolvePopulatedUser,
  type AdminRoomSnapshot,
  type AdminRoomSummary,
  type RoomStatus,
} from '@/types';

const STATUS_TONE: Record<RoomStatus, 'green' | 'amber' | 'red'> = {
  active: 'green',
  closed: 'amber',
  removed: 'red',
};

const ROLE_TONE: Record<'owner' | 'admin' | 'member', 'brand' | 'blue' | 'slate'> = {
  owner: 'brand',
  admin: 'blue',
  member: 'slate',
};

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const permissions = useMemo(() => authStorage.getRole()?.permissions ?? [], []);
  const canModerate = hasPermission(permissions, 'rooms.close');

  const [snap, setSnap] = useState<AdminRoomSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await api<AdminRoomSnapshot>(`/admin/rooms/${id}`);
      setSnap(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /// Mark REMOVED. Confirms first because the action evicts everyone
  /// currently in the room — destructive in the user-experience sense
  /// even though the row stays in Mongo for audit.
  async function remove() {
    if (!snap) return;
    const reason = prompt(
      `Remove "${snap.room.name}"?\n\nAll members + seats will be cleared and the room will not appear in the live list. Optional reason for the audit log:`,
      '',
    );
    if (reason === null) return;
    setActing(true);
    setError(null);
    try {
      const res = await api<{ room: AdminRoomSummary }>(
        `/admin/rooms/${id}/remove`,
        {
          method: 'POST',
          body: JSON.stringify({ reason }),
        },
      );
      // Patch the in-memory snapshot rather than refetching the whole
      // detail — keeps members/seats lists scrolled where they were.
      setSnap((prev) =>
        prev ? { ...prev, room: { ...prev.room, ...res.room } } : prev,
      );
    } catch (e: any) {
      setError(e.message);
    } finally {
      setActing(false);
    }
  }

  /// Flip REMOVED → ACTIVE. No prompt — restoring is reversible by
  /// just hitting Remove again.
  async function restore() {
    if (!snap) return;
    setActing(true);
    setError(null);
    try {
      const res = await api<{ room: AdminRoomSummary }>(
        `/admin/rooms/${id}/restore`,
        {
          method: 'POST',
        },
      );
      setSnap((prev) =>
        prev ? { ...prev, room: { ...prev.room, ...res.room } } : prev,
      );
    } catch (e: any) {
      setError(e.message);
    } finally {
      setActing(false);
    }
  }

  if (loading) return <div className="text-sm text-slate-500">Loading…</div>;
  if (!snap) return <ErrorAlert message={error || 'Room not found'} />;

  const { room, owner, seats, members } = snap;
  const occupiedSeats = seats.filter((s) => s.userId != null);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title={room.name || 'Room'}
        subtitle={
          <>
            {room.numericId && (
              <code className="text-brand">#{room.numericId}</code>
            )}{' '}
            · {room.kind} · {room.viewerCount} viewer(s) · seats{' '}
            {occupiedSeats.length}/{room.micCount}
          </>
        }
        actions={
          <>
            <Button variant="secondary" onClick={() => router.back()}>
              ← Back
            </Button>
            {canModerate && room.status !== 'removed' && (
              <Button variant="danger" onClick={remove} disabled={acting}>
                Remove room
              </Button>
            )}
            {canModerate && room.status === 'removed' && (
              <Button variant="primary" onClick={restore} disabled={acting}>
                Restore
              </Button>
            )}
          </>
        }
      />

      {error && (
        <div className="mb-4">
          <ErrorAlert message={error} />
        </div>
      )}

      <Card className="mb-6">
        <div className="flex items-start gap-4">
          {room.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={room.coverUrl}
              alt=""
              className="h-24 w-24 rounded-lg object-cover ring-1 ring-slate-200"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-brand-50 text-3xl text-brand-700">
              ✦
            </div>
          )}
          <div className="flex-1 space-y-2 text-sm">
            <div className="flex flex-wrap gap-2">
              <Badge tone={STATUS_TONE[room.status]}>{room.status}</Badge>
              <Badge tone="slate">{room.kind}</Badge>
              {room.ownerCountry && (
                <Badge tone="slate">{room.ownerCountry}</Badge>
              )}
              {room.liveAt && <Badge tone="green">live</Badge>}
            </div>
            {room.announcement && (
              <div className="rounded-lg bg-slate-50 px-3 py-2 text-slate-700">
                <span className="text-xs font-semibold text-slate-500">
                  ANNOUNCEMENT
                </span>
                <div className="mt-1 whitespace-pre-wrap">
                  {room.announcement}
                </div>
              </div>
            )}
            {room.status === 'removed' && room.removedReason && (
              <div className="rounded-lg bg-rose-50 px-3 py-2 text-rose-800">
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Removed
                </span>
                <div className="mt-1">{room.removedReason}</div>
              </div>
            )}
            <div className="text-xs text-slate-500">
              Created {new Date(room.createdAt).toLocaleString()}
              {room.liveAt && (
                <>
                  {' · '}
                  Live since {new Date(room.liveAt).toLocaleString()}
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      {owner && (
        <Card className="mb-6">
          <h2 className="mb-2 text-sm font-semibold text-slate-700">Owner</h2>
          <div className="flex items-center gap-3">
            {owner.avatarUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={owner.avatarUrl}
                alt=""
                className="h-12 w-12 rounded-full object-cover ring-1 ring-slate-200"
              />
            )}
            <div>
              <div className="font-medium text-slate-900">
                {owner.displayName || owner.username || owner.id}
              </div>
              <div className="text-xs text-slate-500">
                {owner.numericId && <>#{owner.numericId}</>}
                {owner.country && <> · {owner.country}</>}
              </div>
            </div>
          </div>
        </Card>
      )}

      <h2 className="mb-3 text-sm font-semibold text-slate-700">
        Seats ({occupiedSeats.length}/{room.micCount})
      </h2>
      {seats.length === 0 ? (
        <EmptyState message="No seats configured." />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Seat</Th>
              <Th>User</Th>
              <Th>State</Th>
              <Th>Joined</Th>
            </tr>
          </thead>
          <tbody>
            {seats.map((s) => {
              const u = resolvePopulatedUser(s.userId);
              return (
                <tr key={s.id}>
                  <Td className="text-xs">#{s.seatIndex}</Td>
                  <Td>
                    {u ? (
                      <div>
                        <div className="font-medium text-slate-900">{u.label}</div>
                        {u.numericId && (
                          <div className="text-xs text-slate-500">#{u.numericId}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">empty</span>
                    )}
                  </Td>
                  <Td className="text-xs">
                    <div className="flex gap-1">
                      {s.locked && <Badge tone="amber">locked</Badge>}
                      {s.muted && <Badge tone="red">muted</Badge>}
                    </div>
                  </Td>
                  <Td className="text-xs text-slate-500">
                    {s.joinedAt ? new Date(s.joinedAt).toLocaleTimeString() : '—'}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      <h2 className="mb-3 mt-6 text-sm font-semibold text-slate-700">
        Members ({members.length})
      </h2>
      {members.length === 0 ? (
        <EmptyState message="No one currently in the room." />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Role</Th>
              <Th>User</Th>
              <Th>Joined</Th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => {
              const u = resolvePopulatedUser(m.userId);
              return (
                <tr key={m.id}>
                  <Td>
                    <Badge tone={ROLE_TONE[m.role]}>{m.role}</Badge>
                  </Td>
                  <Td>
                    <div className="font-medium text-slate-900">
                      {u?.label ?? '—'}
                    </div>
                    {u?.numericId && (
                      <div className="text-xs text-slate-500">#{u.numericId}</div>
                    )}
                  </Td>
                  <Td className="text-xs text-slate-500">
                    {new Date(m.joinedAt).toLocaleString()}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      {room.kickHistory && room.kickHistory.length > 0 && (
        <>
          <h2 className="mb-3 mt-6 text-sm font-semibold text-slate-700">
            Kick history
          </h2>
          <Table>
            <thead>
              <tr>
                <Th>User</Th>
                <Th>Reason</Th>
                <Th>When</Th>
              </tr>
            </thead>
            <tbody>
              {room.kickHistory.map((k, i) => (
                <tr key={`${k.userId}-${k.at}-${i}`}>
                  <Td className="text-xs">
                    <code>{k.userId}</code>
                  </Td>
                  <Td className="text-xs text-slate-600">{k.reason || '—'}</Td>
                  <Td className="text-xs text-slate-500">
                    {new Date(k.at).toLocaleString()}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
}
