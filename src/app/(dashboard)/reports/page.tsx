'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  Badge,
  EmptyState,
  ErrorAlert,
  PageHeader,
  Pagination,
  Select,
  Table,
  Td,
  Th,
} from '@/components/ui';
import { api } from '@/lib/api';
import type {
  PaginatedList,
  ReportReason,
  ReportStatus,
  ReportTargetType,
  ReportUserRef,
  UserReport,
} from '@/types';

/**
 * User reports moderation queue.
 *
 * - Lists pending reports first (default `status=pending`); admins can
 *   filter by status / reason / target type to pivot the queue.
 * - Each row shows the reporter, the target, the reason, and a dropdown
 *   to resolve. Resolving requires `moderation.action`; viewing only
 *   requires `moderation.view`. The backend enforces both.
 *
 * Mirrors the shape of the existing /users page (api → state → table)
 * so the codebase has one consistent pattern.
 */
export default function ReportsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ReportStatus | ''>('pending');
  const [reason, setReason] = useState<ReportReason | ''>('');
  const [targetType, setTargetType] = useState<ReportTargetType | ''>('');

  const [data, setData] = useState<PaginatedList<UserReport> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (status) params.set('status', status);
      if (reason) params.set('reason', reason);
      if (targetType) params.set('targetType', targetType);
      const res = await api<PaginatedList<UserReport>>(
        `/admin/reports?${params.toString()}`,
      );
      setData(res);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, status, reason, targetType]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: string, next: ReportStatus) => {
    try {
      await api(`/admin/reports/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: next }),
      });
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <PageHeader
        title="User Reports"
        subtitle="In-app reports filed by users. Required by Google Play User Safety policy — keep the pending queue at zero."
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as ReportStatus | '');
            setPage(1);
          }}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="actioned">Actioned</option>
          <option value="dismissed">Dismissed</option>
        </Select>
        <Select
          value={reason}
          onChange={(e) => {
            setReason(e.target.value as ReportReason | '');
            setPage(1);
          }}
        >
          <option value="">All reasons</option>
          <option value="child_safety">Child safety</option>
          <option value="harassment">Harassment</option>
          <option value="hate_speech">Hate speech</option>
          <option value="sexual_content">Sexual content</option>
          <option value="violence">Violence</option>
          <option value="impersonation">Impersonation</option>
          <option value="scam_or_fraud">Scam or fraud</option>
          <option value="self_harm">Self-harm</option>
          <option value="spam">Spam</option>
          <option value="other">Other</option>
        </Select>
        <Select
          value={targetType}
          onChange={(e) => {
            setTargetType(e.target.value as ReportTargetType | '');
            setPage(1);
          }}
        >
          <option value="">All target types</option>
          <option value="user">User</option>
          <option value="room">Room</option>
          <option value="moment">Moment</option>
          <option value="message">Message</option>
        </Select>
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
        <EmptyState message="No reports match the current filters." />
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <Th>Reporter</Th>
                <Th>Target</Th>
                <Th>Reason</Th>
                <Th>Description</Th>
                <Th>Status</Th>
                <Th>Filed</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <Td>
                    <UserCell user={r.reporterId} />
                  </Td>
                  <Td>
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      {r.targetType}
                    </div>
                    {r.targetUserId ? (
                      <UserCell user={r.targetUserId} />
                    ) : (
                      <code className="text-xs text-slate-500">
                        {r.targetId}
                      </code>
                    )}
                  </Td>
                  <Td>
                    <ReasonBadge reason={r.reason} />
                  </Td>
                  <Td className="max-w-sm">
                    <div className="line-clamp-3 text-xs text-slate-600">
                      {r.description || (
                        <span className="text-slate-400">—</span>
                      )}
                    </div>
                  </Td>
                  <Td>
                    <StatusBadge status={r.status} />
                  </Td>
                  <Td className="text-xs text-slate-500">
                    {new Date(r.createdAt).toLocaleString()}
                  </Td>
                  <Td>
                    <Select
                      value={r.status}
                      onChange={(e) =>
                        updateStatus(r.id, e.target.value as ReportStatus)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="actioned">Actioned</option>
                      <option value="dismissed">Dismissed</option>
                    </Select>
                  </Td>
                </tr>
              ))}
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

function UserCell({
  user,
}: {
  user: ReportUserRef | string | null | undefined;
}) {
  if (!user) {
    return <span className="text-xs text-slate-400">—</span>;
  }
  if (typeof user === 'string') {
    return <code className="text-xs text-slate-500">{user}</code>;
  }
  return (
    <div>
      <div className="font-medium text-slate-900">
        {user.displayName || user.username || 'User'}
      </div>
      {user.numericId != null && (
        <code className="text-xs text-brand">{user.numericId}</code>
      )}
    </div>
  );
}

function ReasonBadge({ reason }: { reason: ReportReason }) {
  // Child-safety priority pathway uses the high-attention red tone so
  // it stands out in a long mixed queue.
  const tone =
    reason === 'child_safety'
      ? 'red'
      : reason === 'spam'
        ? 'slate'
        : 'amber';
  return (
    <Badge tone={tone as 'red' | 'slate' | 'amber'}>
      {reason.replace(/_/g, ' ')}
    </Badge>
  );
}

function StatusBadge({ status }: { status: ReportStatus }) {
  switch (status) {
    case 'pending':
      return <Badge tone="amber">pending</Badge>;
    case 'reviewed':
      return <Badge tone="blue">reviewed</Badge>;
    case 'actioned':
      return <Badge tone="green">actioned</Badge>;
    case 'dismissed':
      return <Badge tone="slate">dismissed</Badge>;
  }
}
