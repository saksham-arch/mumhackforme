import type { AuthChangeEvent, Session, SupabaseClient } from '@supabase/supabase-js';
import { DEMO_USER_EMAIL, DEMO_USER_ID } from './demoData';
import { simulateLatency } from './demoStore';

type DemoSession = Session;

type AuthListener = (event: AuthChangeEvent, session: DemoSession | null) => void;

const hasWindow = typeof window !== 'undefined';

const getLocalStorage = (): Storage | null => {
  if (!hasWindow) return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

class DemoAuthApi {
  private readonly storageKey = 'flowguide-demo-auth';
  private readonly listeners = new Set<AuthListener>();

  private get storage() {
    return getLocalStorage();
  }

  private readSession(): DemoSession | null {
    const storage = this.storage;
    if (!storage) return null;

    try {
      const raw = storage.getItem(this.storageKey);
      return raw ? (JSON.parse(raw) as DemoSession) : null;
    } catch {
      return null;
    }
  }

  private writeSession(session: DemoSession | null) {
    const storage = this.storage;
    if (!storage) return;

    try {
      if (!session) {
        storage.removeItem(this.storageKey);
      } else {
        storage.setItem(this.storageKey, JSON.stringify(session));
      }
    } catch {
      // Ignore quota errors in demo mode
    }
  }

  private emit(event: AuthChangeEvent, session: DemoSession | null) {
    for (const listener of this.listeners) {
      listener(event, session);
    }
  }

  private buildSession(email?: string): DemoSession {
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = now + 60 * 60; // 1 hour demo session

    const user = {
      id: DEMO_USER_ID,
      email: email ?? DEMO_USER_EMAIL,
      role: 'authenticated',
      aud: 'authenticated',
      app_metadata: { provider: 'demo' },
      user_metadata: { name: 'Jordan Rivers' },
      created_at: '2023-11-10T08:30:00Z',
      updated_at: new Date().toISOString(),
    } as DemoSession['user'];

    return {
      access_token: `demo-access-${Math.random().toString(36).slice(2)}`,
      refresh_token: `demo-refresh-${Math.random().toString(36).slice(2)}`,
      expires_in: 60 * 60,
      expires_at: expiresAt,
      token_type: 'bearer',
      user,
      provider_token: null,
      provider_refresh_token: null,
    } as DemoSession;
  }

  async getSession() {
    return { data: { session: this.readSession() }, error: null };
  }

  async getUser() {
    const session = this.readSession();
    return { data: { user: session?.user ?? null }, error: null };
  }

  async signInWithPassword({ email }: { email: string; password: string }) {
    await simulateLatency(120, 280);
    const session = this.buildSession(email);
    this.writeSession(session);
    this.emit('SIGNED_IN', session);
    return { data: { user: session.user, session }, error: null };
  }

  async signUp({ email }: { email: string; password: string }) {
    return this.signInWithPassword({ email, password: '' });
  }

  async signInWithOAuth() {
    await simulateLatency(120, 280);
    return {
      data: { user: null, session: null },
      error: new Error('OAuth sign-in is disabled in the demo environment.'),
    };
  }

  async signOut() {
    await simulateLatency(80, 180);
    this.writeSession(null);
    this.emit('SIGNED_OUT', null);
    return { error: null };
  }

  onAuthStateChange(callback: AuthListener) {
    this.listeners.add(callback);
    const session = this.readSession();
    callback('INITIAL_SESSION', session);

    return {
      data: {
        subscription: {
          unsubscribe: () => this.listeners.delete(callback),
        },
      },
      error: null,
    };
  }
}

class DemoStorageApi {
  from(bucket: string) {
    return {
      upload: async (path: string, _file: File | Blob) => {
        await simulateLatency(100, 200);
        return {
          data: { path: `${bucket}/${path}` },
          error: null,
        };
      },
    };
  }
}

class DemoSupabaseClient {
  auth = new DemoAuthApi();
  storage = new DemoStorageApi();

  from() {
    throw new Error('Supabase queries are disabled in demo mode. Use the local demo API instead.');
  }
}

export const supabase = new DemoSupabaseClient() as unknown as SupabaseClient;
