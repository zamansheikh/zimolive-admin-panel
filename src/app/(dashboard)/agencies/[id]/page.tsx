'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import AppUserPicker from '@/components/app-user-picker';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorAlert,
  Field,
  Input,
  PageHeader,
  Pagination,
  Select,
  Table,
  Td,
  Textarea,
  Th,
} from '@/components/ui';
import { api } from '@/lib/api';
import { authStorage, hasPermission } from '@/lib/auth';
import type { Agency, AppUser, PaginatedList } from '@/types';

type AgencyStatus = Agency['status'];

type AgencyMemberRole = 'owner' | 'admin' | 'member';

interface AgencyMember {
  id: string;
  agencyId: string;
  role: AgencyMemberRole;
  joinedAt: string;
  diamondsContributed: number;
  liveMinutes: number;
  // Populated from `populate('userId', …)` — surfaces as the
  // user object on the row.
  userId?: AppUser | string | null;
}

export default function AgencyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const permissions = useMemo(
    () => authStorage.getRole()?.permissions ?? [],
    [],
  );
  const canManage = hasPermission(permissions, 'agency.manage');
  const canAssignHost = hasPermission(permissions, 'hosts.assign_agency');

  const [agency, setAgency] = useState<Agency | null>(null);
  const [hosts, setHosts] = useState<PaginatedList<AppUser> | null>(null);
  const [members, setMembers] = useState<PaginatedList<AgencyMember> | null>(
    null,
  );
  const [hostsPage, setHostsPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  // Pending picks for the two assignment widgets — separate state so the
  // operator can stage a host pick without clearing a stale admin pick.
  const [pendingHost, setPendingHost] = useState<AppUser | null>(null);
  const [pendingMember, setPendingMember] = useState<AppUser | null>(null);
  const [pendingMemberRole, setPendingMemberRole] =
    useState<AgencyMemberRole>('admin');

  // Inline edit mode for the Details card. Local draft mirrors the
  // agency document and is committed via PATCH on Save.
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<EditDraft>(_emptyDraft());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [a, h, m] = await Promise.all([
        api<{ agency: Agency }>(`/admin/agencies/${id}`),
        api<PaginatedList<AppUser>>(
          `/admin/agencies/${id}/hosts?page=${hostsPage}&limit=10`,
        ),
        api<PaginatedList<AgencyMember>>(
          `/admin/agencies/${id}/members?page=1&limit=50`,
        ),
      ]);
      setAgency(a.agency);
      setHosts(h);
      setMembers(m);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [id, hostsPage]);

  useEffect(() => {
    load();
  }, [load]);

  async function changeStatus(status: AgencyStatus) {
    setBusy('status');
    setError(null);
    try {
      const r = await api<{ agency: Agency }>(
        `/admin/agencies/${id}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        },
      );
      setAgency(r.agency);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(null);
    }
  }

  function beginEdit() {
    if (!agency) return;
    setDraft({
      name: agency.name,
      description: agency.description ?? '',
      country: agency.country,
      logoUrl: agency.logoUrl ?? '',
      contactEmail: agency.contactEmail ?? '',
      contactPhone: agency.contactPhone ?? '',
      commissionRate: String(agency.commissionRate),
    });
    setEditing(true);
  }

  async function saveEdit() {
    if (!agency) return;
    setBusy('save-edit');
    setError(null);
    try {
      const body = {
        name: draft.name.trim(),
        description: draft.description.trim(),
        country: draft.country.trim().toUpperCase(),
        logoUrl: draft.logoUrl.trim(),
        contactEmail: draft.contactEmail.trim(),
        contactPhone: draft.contactPhone.trim(),
        commissionRate: parseInt(draft.commissionRate, 10) || 0,
      };
      const r = await api<{ agency: Agency }>(`/admin/agencies/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
      setAgency(r.agency);
      setEditing(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(null);
    }
  }

  async function assignHost() {
    if (!pendingHost) return;
    setBusy('assign-host');
    setError(null);
    try {
      await api(`/admin/agencies/${id}/hosts/${pendingHost.id}`, {
        method: 'POST',
      });
      setPendingHost(null);
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(null);
    }
  }

  async function removeHost(userId: string) {
    if (!confirm('Remove this host from the agency?')) return;
    setBusy('remove-host-' + userId);
    setError(null);
    try {
      await api(`/admin/agencies/${id}/hosts/${userId}/remove`, {
        method: 'PATCH',
      });
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(null);
    }
  }

  async function addMember() {
    if (!pendingMember) return;
    setBusy('add-member');
    setError(null);
    try {
      await api(`/admin/agencies/${id}/members`, {
        method: 'POST',
        body: JSON.stringify({
          userId: pendingMember.id,
          role: pendingMemberRole,
        }),
      });
      setPendingMember(null);
      setPendingMemberRole('admin');
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(null);
    }
  }

  async function removeMember(userId: string) {
    if (!confirm('Remove this user from the agency?')) return;
    setBusy('remove-member-' + userId);
    setError(null);
    try {
      await api(`/admin/agencies/${id}/members/${userId}`, {
        method: 'DELETE',
      });
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(null);
    }
  }

  if (loading) return <div className="text-sm text-slate-500">Loading…</div>;
  if (!agency) return <ErrorAlert message={error || 'Agency not found'} />;

  // Ids of existing agency members — used to exclude them from the host
  // / member pickers below so the operator can't pick the same person
  // twice.
  const existingMemberIds = new Set(
    (members?.items ?? [])
      .map((m) => (typeof m.userId === 'string' ? m.userId : m.userId?.id))
      .filter((s): s is string => !!s),
  );
  const existingHostIds = new Set((hosts?.items ?? []).map((u) => u.id));

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title={agency.name}
        subtitle={
          <>
            <code className="text-brand">{agency.code}</code> · {agency.country} ·{' '}
            <span>{agency.hostCount} hosts</span>
          </>
        }
        actions={
          <Button variant="secondary" onClick={() => router.back()}>
            ← Back
          </Button>
        }
      />

      {error && (
        <div className="mb-4">
          <ErrorAlert message={error} />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Details
            </h3>
            {canManage && !editing && (
              <button
                type="button"
                onClick={beginEdit}
                className="text-xs font-semibold text-brand hover:underline"
              >
                Edit
              </button>
            )}
          </div>
          {editing ? (
            <div className="space-y-3">
              <Field label="Agency name">
                <Input
                  value={draft.name}
                  onChange={(e) =>
                    setDraft({ ...draft, name: e.target.value })
                  }
                />
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Country (ISO 2)">
                  <Input
                    maxLength={2}
                    value={draft.country}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        country: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </Field>
                <Field label="Commission %">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={draft.commissionRate}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        commissionRate: e.target.value,
                      })
                    }
                  />
                </Field>
              </div>
              <Field label="Logo URL">
                <Input
                  value={draft.logoUrl}
                  onChange={(e) =>
                    setDraft({ ...draft, logoUrl: e.target.value })
                  }
                  placeholder="https://…"
                />
              </Field>
              <Field label="Description">
                <Textarea
                  rows={3}
                  value={draft.description}
                  onChange={(e) =>
                    setDraft({ ...draft, description: e.target.value })
                  }
                />
              </Field>
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  variant="secondary"
                  onClick={() => setEditing(false)}
                  disabled={busy === 'save-edit'}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveEdit}
                  disabled={busy === 'save-edit' || !draft.name.trim()}
                >
                  {busy === 'save-edit' ? 'Saving…' : 'Save'}
                </Button>
              </div>
            </div>
          ) : (
            <dl className="space-y-1.5 text-sm">
              <Row
                label="Public ID"
                value={
                  <code className="font-semibold text-brand">
                    {agency.numericId ?? '—'}
                  </code>
                }
              />
              <Row label="Code" value={<code>{agency.code}</code>} />
              <Row label="Country" value={agency.country} />
              <Row
                label="Commission"
                value={`${agency.commissionRate}%`}
              />
              <Row label="Hosts" value={String(agency.hostCount)} />
              <Row
                label="Total diamonds"
                value={String(agency.totalDiamondsEarned)}
              />
              <Row
                label="Created"
                value={new Date(agency.createdAt).toLocaleDateString()}
              />
            </dl>
          )}
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Contact
            </h3>
            {canManage && !editing && (
              <button
                type="button"
                onClick={beginEdit}
                className="text-xs font-semibold text-brand hover:underline"
              >
                Edit
              </button>
            )}
          </div>
          {editing ? (
            <div className="space-y-3">
              <Field label="Contact email">
                <Input
                  type="email"
                  value={draft.contactEmail}
                  onChange={(e) =>
                    setDraft({ ...draft, contactEmail: e.target.value })
                  }
                />
              </Field>
              <Field label="Contact phone">
                <Input
                  value={draft.contactPhone}
                  onChange={(e) =>
                    setDraft({ ...draft, contactPhone: e.target.value })
                  }
                />
              </Field>
            </div>
          ) : (
            <>
              <dl className="space-y-1.5 text-sm">
                <Row label="Email" value={agency.contactEmail || '—'} />
                <Row label="Phone" value={agency.contactPhone || '—'} />
              </dl>
              {agency.description && (
                <p className="mt-3 rounded bg-slate-50 p-2 text-xs text-slate-600">
                  {agency.description}
                </p>
              )}
            </>
          )}
        </Card>

        <Card>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Status
          </h3>
          <div className="mb-3">
            {agency.status === 'active' && <Badge tone="green">Active</Badge>}
            {agency.status === 'suspended' && (
              <Badge tone="amber">Suspended</Badge>
            )}
            {agency.status === 'terminated' && (
              <Badge tone="red">Terminated</Badge>
            )}
          </div>
          {canManage && (
            <div className="flex flex-wrap gap-2">
              {agency.status !== 'active' && (
                <Button
                  variant="secondary"
                  disabled={busy === 'status'}
                  onClick={() => changeStatus('active')}
                >
                  Activate
                </Button>
              )}
              {agency.status !== 'suspended' && (
                <Button
                  variant="secondary"
                  disabled={busy === 'status'}
                  onClick={() => changeStatus('suspended')}
                >
                  Suspend
                </Button>
              )}
              {agency.status !== 'terminated' && (
                <Button
                  variant="danger"
                  disabled={busy === 'status'}
                  onClick={() => changeStatus('terminated')}
                >
                  Terminate
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* ─── Agency members (owners / admins / members) ─── */}
      {canManage && (
        <div className="mt-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Agency members
              </h2>
              <p className="text-xs text-slate-500">
                Owner / admin / member roles inside the mobile app. Owners
                and admins moderate join requests, kick members, and see
                the ranking from the app's Manage Agency view.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <AppUserPicker
                placeholder="Search user by name or ID"
                className="w-72"
                clearOnPick={false}
                filter={(u) => !existingMemberIds.has(u.id)}
                onPick={(u) => setPendingMember(u)}
              />
              <Select
                value={pendingMemberRole}
                onChange={(e) =>
                  setPendingMemberRole(
                    e.target.value as AgencyMemberRole,
                  )
                }
                className="w-32"
              >
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
                <option value="member">Member</option>
              </Select>
              <Button
                disabled={!pendingMember || busy === 'add-member'}
                onClick={addMember}
              >
                {busy === 'add-member' ? 'Adding…' : 'Add'}
              </Button>
            </div>
          </div>

          {pendingMember && (
            <div className="mb-3 flex items-center gap-2 rounded-lg border border-brand/30 bg-brand/5 px-3 py-2 text-xs">
              <span className="text-slate-700">
                Will add{' '}
                <b>{pendingMember.displayName || pendingMember.username}</b>{' '}
                (ID {pendingMember.numericId ?? '—'}) as{' '}
                <b>{pendingMemberRole}</b>.
              </span>
              <button
                type="button"
                onClick={() => setPendingMember(null)}
                className="ml-auto text-xs text-slate-500 hover:underline"
              >
                Clear
              </button>
            </div>
          )}

          {!members || members.items.length === 0 ? (
            <EmptyState message="No agency members yet. Add a user as owner / admin / member to populate the roster." />
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>User</Th>
                  <Th>Role</Th>
                  <Th>Joined</Th>
                  <Th>Diamonds</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {members.items.map((m) => {
                  const u =
                    typeof m.userId === 'object' && m.userId
                      ? (m.userId as AppUser)
                      : null;
                  return (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <Td>
                        {u ? (
                          <Link href={`/users/${u.id}`} className="block">
                            <div className="font-medium text-slate-900">
                              {u.displayName || u.username || '—'}
                            </div>
                            <code className="text-xs text-slate-500">
                              ID {u.numericId ?? '—'} · @
                              {u.username || '—'}
                            </code>
                          </Link>
                        ) : (
                          <code className="text-xs text-slate-500">
                            {typeof m.userId === 'string' ? m.userId : '—'}
                          </code>
                        )}
                      </Td>
                      <Td>
                        {m.role === 'owner' && (
                          <Badge tone="amber">Owner</Badge>
                        )}
                        {m.role === 'admin' && (
                          <Badge tone="brand">Admin</Badge>
                        )}
                        {m.role === 'member' && (
                          <Badge tone="green">Member</Badge>
                        )}
                      </Td>
                      <Td className="text-xs text-slate-500">
                        {new Date(m.joinedAt).toLocaleDateString()}
                      </Td>
                      <Td className="text-xs">
                        {m.diamondsContributed.toLocaleString()}
                      </Td>
                      <Td>
                        {u && (
                          <button
                            onClick={() => removeMember(u.id)}
                            disabled={busy === 'remove-member-' + u.id}
                            className="text-xs text-red-600 hover:underline disabled:opacity-50"
                          >
                            {busy === 'remove-member-' + u.id
                              ? 'Removing…'
                              : 'Remove'}
                          </button>
                        )}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </div>
      )}

      {/* ─── Hosts assigned to this agency ─── */}
      <div className="mt-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Hosts under this agency
            </h2>
            <p className="text-xs text-slate-500">
              Broadcasters whose host earnings flow through this agency's
              commission split. The user must already be a host —
              promote them on the user detail page first.
            </p>
          </div>
          {canAssignHost && (
            <div className="flex items-center gap-2">
              <AppUserPicker
                placeholder="Search host user"
                className="w-72"
                clearOnPick={false}
                // Server-side: restrict the result page to hosts so a
                // page full of non-host matches doesn't drown out the
                // host the operator is looking for.
                requireHost
                // Client-side: drop hosts already in this agency.
                filter={(u) => !existingHostIds.has(u.id)}
                emptyHint="No matching hosts. If the user isn't a host yet, promote them on their user page first."
                onPick={(u) => setPendingHost(u)}
              />
              <Button
                disabled={!pendingHost || busy === 'assign-host'}
                onClick={assignHost}
              >
                {busy === 'assign-host' ? 'Assigning…' : 'Assign host'}
              </Button>
            </div>
          )}
        </div>

        {pendingHost && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-brand/30 bg-brand/5 px-3 py-2 text-xs">
            <span className="text-slate-700">
              Will assign <b>{pendingHost.displayName || pendingHost.username}</b>{' '}
              (ID {pendingHost.numericId ?? '—'}) as a host of this agency.
            </span>
            <button
              type="button"
              onClick={() => setPendingHost(null)}
              className="ml-auto text-xs text-slate-500 hover:underline"
            >
              Clear
            </button>
          </div>
        )}

        {!hosts || hosts.items.length === 0 ? (
          <EmptyState message="No hosts assigned yet. Search above to add — only users already promoted to host are eligible." />
        ) : (
          <>
            <Table>
              <thead>
                <tr>
                  <Th>User</Th>
                  <Th>Tier</Th>
                  <Th>Stream hours</Th>
                  <Th>Diamonds earned</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {hosts.items.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <Td>
                      <Link href={`/users/${u.id}`} className="block">
                        <div className="font-medium text-slate-900">
                          {u.displayName || u.username || '—'}
                        </div>
                        <code className="text-xs text-slate-500">
                          ID {u.numericId ?? '—'} · @{u.username || '—'}
                        </code>
                      </Link>
                    </Td>
                    <Td>
                      <Badge tone="brand">
                        {u.hostProfile?.tier || 'trainee'}
                      </Badge>
                    </Td>
                    <Td className="text-xs">
                      {u.hostProfile?.streamHours ?? 0}
                    </Td>
                    <Td className="text-xs">
                      {u.hostProfile?.totalDiamondsEarned ?? 0}
                    </Td>
                    <Td>
                      {u.status === 'active' && (
                        <Badge tone="green">active</Badge>
                      )}
                      {u.status === 'banned' && (
                        <Badge tone="red">banned</Badge>
                      )}
                    </Td>
                    <Td>
                      {canAssignHost && (
                        <button
                          onClick={() => removeHost(u.id)}
                          disabled={busy === 'remove-host-' + u.id}
                          className="text-xs text-red-600 hover:underline disabled:opacity-50"
                        >
                          {busy === 'remove-host-' + u.id
                            ? 'Removing…'
                            : 'Remove'}
                        </button>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination
              page={hosts.page}
              limit={hosts.limit}
              total={hosts.total}
              onPage={setHostsPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="max-w-[60%] truncate font-medium text-slate-900">
        {value}
      </dd>
    </div>
  );
}

interface EditDraft {
  name: string;
  description: string;
  country: string;
  logoUrl: string;
  contactEmail: string;
  contactPhone: string;
  /** String so the input retains user-typed characters like "30". */
  commissionRate: string;
}

function _emptyDraft(): EditDraft {
  return {
    name: '',
    description: '',
    country: 'BD',
    logoUrl: '',
    contactEmail: '',
    contactPhone: '',
    commissionRate: '30',
  };
}
