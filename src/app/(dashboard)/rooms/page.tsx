'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import {
  Badge,
  EmptyState,
  ErrorAlert,
  Input,
  PageHeader,
  Pagination,
  Select,
  Table,
  Td,
  Th,
} from '@/components/ui';
import { api } from '@/lib/api';
import type {
  AdminRoomSummary,
  PaginatedList,
  RoomStatus,
} from '@/types';

const STATUS_TONE: Record<RoomStatus, 'green' | 'amber' | 'red'> = {
  active: 'green',
  closed: 'amber',
  removed: 'red',
};

/// Owner display name resolver — the list endpoint may populate
/// `ownerId` either as a string id (if hydration failed) or as a
/// partial user object. Centralised so list + table cells stay
/// consistent if the populate shape ever changes.
function ownerLabel(ownerId: AdminRoomSummary['ownerId']): {
  label: string;
  numericId: string | null;
  avatarUrl: string;
} {
  if (typeof ownerId !== 'object' || ownerId === null) {
    return {
      label: typeof ownerId === 'string' ? ownerId : '—',
      numericId: null,
      avatarUrl: '',
    };
  }
  return {
    label: ownerId.displayName || ownerId.username || '—',
    numericId: ownerId.numericId != null ? String(ownerId.numericId) : null,
    avatarUrl: ownerId.avatarUrl ?? '',
  };
}

export default function RoomsPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<RoomStatus | ''>('');
  const [country, setCountry] = useState('');

  const [data, setData] = useState<PaginatedList<AdminRoomSummary> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      if (country) params.set('country', country);
      const res = await api<PaginatedList<AdminRoomSummary>>(
        `/admin/rooms?${params.toString()}`,
      );
      setData(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, status, country]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <PageHeader
        title="Rooms"
        subtitle="Voice rooms across the platform. Search by name or numeric ID; filter by status and owner country. Click a row to inspect or moderate."
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            setSearch(searchInput);
          }}
          className="sm:col-span-2"
        >
          <Input
            placeholder="Search by name or ID…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as RoomStatus | '');
            setPage(1);
          }}
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
          <option value="removed">Removed</option>
        </Select>
        <Input
          placeholder="Country (e.g. BD)"
          value={country}
          maxLength={2}
          onChange={(e) => {
            setCountry(e.target.value.toUpperCase());
            setPage(1);
          }}
        />
      </div>

      {error && (
        <div className="mb-4">
          <ErrorAlert message={error} />
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading…
        </div>
      ) : !data || data.items.length === 0 ? (
        <EmptyState message="No rooms match the current filters." />
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Owner</Th>
                <Th>Country</Th>
                <Th>Viewers</Th>
                <Th>Status</Th>
                <Th>Created</Th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((r) => {
                const owner = ownerLabel(r.ownerId);
                return (
                  <tr key={r.id} className="cursor-pointer hover:bg-slate-50">
                    <Td>
                      <Link href={`/rooms/${r.id}`} className="block">
                        <code className="text-xs font-semibold text-brand">
                          {r.numericId ?? '—'}
                        </code>
                      </Link>
                    </Td>
                    <Td>
                      <Link href={`/rooms/${r.id}`} className="block">
                        <div className="flex items-center gap-2">
                          {r.coverUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={r.coverUrl}
                              alt=""
                              className="h-8 w-8 rounded object-cover ring-1 ring-slate-200"
                            />
                          )}
                          <div className="font-medium text-slate-900">
                            {r.name || 'Room'}
                          </div>
                        </div>
                      </Link>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        {owner.avatarUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={owner.avatarUrl}
                            alt=""
                            className="h-6 w-6 rounded-full object-cover ring-1 ring-slate-200"
                          />
                        )}
                        <div>
                          <div className="text-xs font-medium text-slate-900">
                            {owner.label}
                          </div>
                          {owner.numericId && (
                            <div className="text-[10px] text-slate-500">
                              #{owner.numericId}
                            </div>
                          )}
                        </div>
                      </div>
                    </Td>
                    <Td className="text-xs">
                      {r.ownerCountry ? (
                        <code className="text-slate-700">{r.ownerCountry}</code>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </Td>
                    <Td className="text-xs">{r.viewerCount}</Td>
                    <Td>
                      <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>
                    </Td>
                    <Td className="text-xs text-slate-500">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <Pagination
            page={data.page}
            limit={data.limit}
            total={data.total}
            onPage={setPage}
          />
        </>
      )}
    </div>
  );
}
