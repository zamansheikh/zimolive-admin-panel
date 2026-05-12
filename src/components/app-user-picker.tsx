'use client';

import { useEffect, useRef, useState } from 'react';

import { Input } from '@/components/ui';
import { api } from '@/lib/api';
import type { AppUser, PaginatedList } from '@/types';

interface Props {
  /** Called when the operator picks a user from the dropdown. */
  onPick: (user: AppUser) => void;
  /** Placeholder for the search box. Defaults to "Search by name or ID". */
  placeholder?: string;
  /** Tailwind classes appended to the wrapper for width / spacing tweaks. */
  className?: string;
  /** Optional client-side filter (e.g. exclude existing members). Applied
   *  AFTER the server returns its page, so use this only for "exclude
   *  already-added" — anything that should narrow the search itself
   *  belongs in [requireHost] / future server-side filters. */
  filter?: (user: AppUser) => boolean;
  /** Restrict search to host users on the server. When set, the picker
   *  passes `isHost=true` to `/admin/app-users` so the result page is
   *  drawn from the host pool, not the whole user table. Without this
   *  flag, looking for "Z" among 10k users might return 8 non-hosts and
   *  drop them all client-side — even if a host named "Zachary" exists
   *  further down. */
  requireHost?: boolean;
  /** Auto-clear the input after pick. Default true. */
  clearOnPick?: boolean;
  /** Custom message when the API + client-side filter both yield nothing.
   *  Defaults to "No users match \"{query}\"". Use this to nudge the
   *  operator about why the picker is empty (e.g. "Promote this user to
   *  host first"). */
  emptyHint?: string;
}

/**
 * Type-ahead app-user picker. Debounces the query, hits `/admin/app-users
 * ?search=…`, and shows the top matches in a dropdown below the input.
 *
 * Used wherever an admin needs to act on a specific app user — agency
 * member assignment, gift recipient selection, etc. — instead of pasting
 * a Mongo `_id` they had to look up by hand.
 */
export default function AppUserPicker({
  onPick,
  placeholder,
  className,
  filter,
  requireHost,
  clearOnPick = true,
  emptyHint,
}: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounce = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when the user clicks outside the search box —
  // otherwise it lingers when they tab to another control.
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  function onChange(value: string) {
    setQuery(value);
    setOpen(true);
    if (debounce.current) clearTimeout(debounce.current);
    if (!value.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounce.current = setTimeout(() => {
      doSearch(value.trim());
    }, 250);
  }

  async function doSearch(q: string) {
    try {
      const params = new URLSearchParams({
        search: q,
        limit: '8',
      });
      // Server-side host filter — keeps the picker honest when the
      // operator is looking for a host among a sea of regular users.
      if (requireHost) params.set('isHost', 'true');
      const res = await api<PaginatedList<AppUser>>(
        `/admin/app-users?${params.toString()}`,
      );
      let items = res.items;
      if (filter) items = items.filter(filter);
      setResults(items);
    } catch {
      // Silent — picker stays empty rather than erroring out the whole form.
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handlePick(user: AppUser) {
    onPick(user);
    setOpen(false);
    if (clearOnPick) {
      setQuery('');
      setResults([]);
    }
  }

  return (
    <div ref={wrapperRef} className={`relative ${className ?? ''}`}>
      <Input
        value={query}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => query && setOpen(true)}
        placeholder={placeholder ?? 'Search by name or ID'}
        className="w-full"
      />
      {open && (loading || results.length > 0 || query.trim()) && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-72 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
          {loading && (
            <div className="px-3 py-2 text-xs text-slate-500">Searching…</div>
          )}
          {!loading && results.length === 0 && query.trim() && (
            <div className="px-3 py-2 text-xs text-slate-500">
              {emptyHint ?? `No users match "${query}"`}
            </div>
          )}
          {!loading &&
            results.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handlePick(u)}
                className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-slate-50"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                  {u.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={u.avatarUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    (u.displayName || u.username || '?').charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-slate-900">
                    {u.displayName || u.username || 'User'}
                    {u.isHost && (
                      <span className="ml-1 inline-block rounded bg-brand/10 px-1 py-0.5 text-[10px] font-semibold text-brand">
                        HOST
                      </span>
                    )}
                  </div>
                  <div className="truncate text-xs text-slate-500">
                    <code className="text-brand">
                      ID {u.numericId ?? '—'}
                    </code>{' '}
                    · @{u.username || '—'}
                  </div>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
