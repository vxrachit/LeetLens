'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, LogOut, ShieldCheck, UserCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type GithubSession =
  | {
      authenticated: true;
      hasRequiredStar: true;
      profile: {
        login: string;
        name: string | null;
        avatar_url: string;
        html_url: string;
      };
    }
  | {
      authenticated: false;
      hasRequiredStar?: boolean;
    };

export function UserMenu() {
  const [session, setSession] = useState<GithubSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const response = await fetch('/api/auth/github/session', { cache: 'no-store' });
        const json = (await response.json()) as GithubSession;
        if (active) {
          setSession(json);
        }
      } catch {
        if (active) {
          setSession(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadSession();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <div className="h-11 w-11 rounded-full border border-white/10 bg-white/5 animate-pulse" />;
  }

  if (!session || !session.authenticated) {
    return (
      <Link
        href="/auth/signin"
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
      >
        <UserCircle2 className="w-4 h-4" />
        Sign in
      </Link>
    );
  }

  const { profile } = session;
  const displayName = profile.name || profile.login;

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1.5 text-left transition-colors hover:bg-cyan-500/15">
          <Avatar className="h-8 w-8 border border-white/10">
            <AvatarImage src={profile.avatar_url} alt={displayName} />
            <AvatarFallback>{profile.login[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="hidden sm:flex flex-col leading-tight pr-1">
            <span className="text-xs font-semibold text-white">{displayName}</span>
            <span className="text-[10px] text-slate-400">@{profile.login}</span>
          </span>
          <ChevronDown className="hidden sm:block w-4 h-4 text-slate-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 border-white/10 bg-[#07101f] text-white">
        <DropdownMenuLabel className="px-3 py-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-white/10">
              <AvatarImage src={profile.avatar_url} alt={displayName} />
              <AvatarFallback>{profile.login[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{displayName}</p>
              <p className="truncate text-xs text-slate-400">@{profile.login}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            setProfileOpen(true);
          }}
          className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-slate-200 outline-none hover:bg-white/5"
        >
          <UserCircle2 className="w-4 h-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href="/api/auth/logout"
            className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-red-300 outline-none hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
      <DialogContent className="border-white/10 bg-[#07101f] text-white sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Dashboard Profile</DialogTitle>
          <DialogDescription className="text-slate-400">
            Your authenticated GitHub account and LeetLens access state.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
          <Avatar className="h-20 w-20 border border-cyan-500/20">
            <AvatarImage src={profile.avatar_url} alt={displayName} />
            <AvatarFallback>{profile.login[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <div>
              <p className="text-xl font-semibold">{displayName}</p>
              <p className="text-sm text-slate-400">@{profile.login}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Repo star verified
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
                Dashboard access enabled
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 mt-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Account</p>
            <p className="mt-1 text-sm text-slate-200">GitHub authenticated</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Access</p>
            <p className="mt-1 text-sm text-slate-200">LeetLens dashboard unlocked</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button asChild variant="outline" className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10">
            <a href="/api/auth/logout">
              <LogOut className="h-4 w-4" />
              Sign out
            </a>
          </Button>
          <Button onClick={() => setProfileOpen(false)} className="rounded-xl bg-cyan-500 text-[#060a18] hover:bg-cyan-400">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}