'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorAlert,
  PageHeader,
  Select,
  Table,
  Td,
  Textarea,
  Th,
} from '@/components/ui';
import { api } from '@/lib/api';
import { authStorage, hasPermission } from '@/lib/auth';
import type { AppUser, PaginatedList } from '@/types';

type AgencyCreateRequestStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled';

interface AgencyCreateRequest {
  id: string;
  userId: AppUser | string | null;
  status: AgencyCreateRequestStatus;
  name: string;
  code: string;
  description: string;
  country: string;
  contactEmail: string;
  contactPhone: string;
  logoUrl: string;
  pitch: string;
  // Applicant KYC info — surfaced to the admin during review only.
  applicantPhone: string;
  applicantAddress: string;
  idCardFrontUrl: string;
  idCardBackUrl: string;
  decisionNote: string;
  createdAt: string;
  decidedAt?: string | null;
  createdAgencyId?: string | null;
}

/**
 * Review queue for app-submitted agency creation requests. Admins
 * with `agency.manage` approve (which actually creates the agency
 * and makes the requester its owner) or reject.
 */
export default function AgencyCreateRequestsPage() {
  const permissions = useMemo(
    () => authStorage.getRole()?.permissions ?? [],
    [],
  );
  const canManage = hasPermission(permissions, 'agency.manage');

  const [status, setStatus] = useState<AgencyCreateRequestStatus | ''>(
    'pending',
  );
  const [data, setData] = useState<PaginatedList<AgencyCreateRequest> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  // Free-form note attached to whichever request the admin is acting
  // on. Keyed by request id so multiple rows can hold drafts side-by-
  // side without bleeding into each other.
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (status) params.set('status', status);
      const res = await api<PaginatedList<AgencyCreateRequest>>(
        `/admin/agencies/create-requests/all?${params.toString()}`,
      );
      setData(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  async function decide(reqId: string, action: 'approve' | 'reject') {
    setBusy(`${action}-${reqId}`);
    setError(null);
    try {
      await api(
        `/admin/agencies/create-requests/${reqId}/${action}`,
        {
          method: 'POST',
          body: JSON.stringify({ note: notes[reqId] ?? '' }),
        },
      );
      setNotes((prev) => {
        const next = { ...prev };
        delete next[reqId];
        return next;
      });
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="Agency creation requests"
        subtitle="Approve to create the agency with the requester as owner, or reject to send them back to iterate on the proposal."
      />

      {error && (
        <div className="mb-4">
          <ErrorAlert message={error} />
        </div>
      )}

      <Card>
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Status
          </span>
          <Select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as AgencyCreateRequestStatus | '')
            }
            className="w-40"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
            <option value="">All</option>
          </Select>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-slate-500">
            Loading…
          </div>
        ) : !data || data.items.length === 0 ? (
          <EmptyState
            message={
              status === 'pending'
                ? 'No pending creation requests.'
                : 'No requests with that status.'
            }
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Requester</Th>
                <Th>Proposed agency</Th>
                <Th>Pitch</Th>
                <Th>Submitted</Th>
                {canManage && status === 'pending' && <Th>Actions</Th>}
                {(status !== 'pending' || !canManage) && <Th>Status</Th>}
              </tr>
            </thead>
            <tbody>
              {data.items.map((r) => {
                const user =
                  typeof r.userId === 'object' && r.userId
                    ? (r.userId as AppUser)
                    : null;
                return (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <Td>
                      {user ? (
                        <Link
                          href={`/users/${user.id}`}
                          className="block"
                        >
                          <div className="font-medium text-slate-900">
                            {user.displayName || user.username || '—'}
                          </div>
                          <code className="text-xs text-slate-500">
                            ID {user.numericId ?? '—'} · @
                            {user.username || '—'}
                          </code>
                        </Link>
                      ) : (
                        <code className="text-xs text-slate-500">
                          {typeof r.userId === 'string' ? r.userId : '—'}
                        </code>
                      )}
                    </Td>
                    <Td>
                      <div className="flex items-start gap-3">
                        {r.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={r.logoUrl}
                            alt={r.name}
                            className="h-12 w-12 flex-none rounded-full border border-slate-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-slate-100 text-xs text-slate-400">
                            no logo
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-slate-900">
                            {r.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            <code className="text-brand">{r.code}</code> ·{' '}
                            {r.country}
                          </div>
                          {r.description && (
                            <div className="mt-1 max-w-md text-xs text-slate-600">
                              {r.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </Td>
                    <Td>
                      {r.pitch && (
                        <div className="max-w-sm whitespace-pre-wrap text-xs text-slate-600">
                          {r.pitch}
                        </div>
                      )}
                      {(r.applicantPhone ||
                        r.applicantAddress ||
                        r.idCardFrontUrl ||
                        r.idCardBackUrl) && (
                        <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-2 py-1.5 text-[11px]">
                          <div className="font-semibold uppercase tracking-wide text-amber-700">
                            Applicant info
                          </div>
                          {r.applicantPhone && (
                            <div className="text-slate-700">
                              📞 {r.applicantPhone}
                            </div>
                          )}
                          {r.applicantAddress && (
                            <div className="text-slate-700">
                              🏠 {r.applicantAddress}
                            </div>
                          )}
                          {(r.idCardFrontUrl || r.idCardBackUrl) && (
                            <div className="mt-1 flex gap-2">
                              {r.idCardFrontUrl && (
                                <a
                                  href={r.idCardFrontUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-brand hover:underline"
                                >
                                  ID front ↗
                                </a>
                              )}
                              {r.idCardBackUrl && (
                                <a
                                  href={r.idCardBackUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-brand hover:underline"
                                >
                                  ID back ↗
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      {!r.pitch &&
                        !r.applicantPhone &&
                        !r.applicantAddress &&
                        !r.idCardFrontUrl &&
                        !r.idCardBackUrl && (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                    </Td>
                    <Td className="text-xs text-slate-500">
                      {new Date(r.createdAt).toLocaleString()}
                    </Td>
                    {canManage && r.status === 'pending' ? (
                      <Td>
                        <div className="flex flex-col gap-2">
                          <Textarea
                            rows={2}
                            placeholder="Note for the requester (optional)"
                            className="w-64 text-xs"
                            value={notes[r.id] ?? ''}
                            onChange={(e) =>
                              setNotes((prev) => ({
                                ...prev,
                                [r.id]: e.target.value,
                              }))
                            }
                          />
                          <div className="flex gap-2">
                            <Button
                              disabled={busy === `approve-${r.id}`}
                              onClick={() => decide(r.id, 'approve')}
                            >
                              {busy === `approve-${r.id}`
                                ? 'Approving…'
                                : 'Approve'}
                            </Button>
                            <Button
                              variant="danger"
                              disabled={busy === `reject-${r.id}`}
                              onClick={() => decide(r.id, 'reject')}
                            >
                              {busy === `reject-${r.id}`
                                ? 'Rejecting…'
                                : 'Reject'}
                            </Button>
                          </div>
                        </div>
                      </Td>
                    ) : (
                      <Td>
                        {r.status === 'approved' && (
                          <Badge tone="green">Approved</Badge>
                        )}
                        {r.status === 'rejected' && (
                          <Badge tone="red">Rejected</Badge>
                        )}
                        {r.status === 'cancelled' && (
                          <Badge tone="amber">Cancelled</Badge>
                        )}
                        {r.status === 'pending' && (
                          <Badge tone="amber">Pending</Badge>
                        )}
                        {r.decisionNote && (
                          <div className="mt-1 max-w-xs text-xs text-slate-500">
                            “{r.decisionNote}”
                          </div>
                        )}
                        {r.createdAgencyId && (
                          <Link
                            href={`/agencies/${r.createdAgencyId}`}
                            className="mt-1 block text-xs text-brand hover:underline"
                          >
                            View agency →
                          </Link>
                        )}
                      </Td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
