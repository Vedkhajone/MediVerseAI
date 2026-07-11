// ⚠️ DATABASE DISABLED — this is a UI-only stub.
// The original Supabase client was replaced with a no-op shim so the app runs
// without any backend. Every query resolves to empty data / no-op success.
//
// 👉 To connect your OWN backend, see BACKEND_INTEGRATION.md at the repo root.
//    You have two clean paths:
//    1. Replace this file with a real Supabase client (paste the original back
//       and set VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY in .env), OR
//    2. Delete usages of `supabase` in the routes and call your REST/GraphQL
//       API through a thin client in `src/lib/api.ts` (recommended for a
//       custom FastAPI / Node backend).

type AnyObj = Record<string, unknown>;

type Row = Record<string, any>;
type QueryResult = { data: Row[]; count: number; error: null };
type SingleResult = { data: Row | null; error: null };

const emptyResult: QueryResult = { data: [], count: 0, error: null };
const nullResult: SingleResult = { data: null, error: null };

type Chain = (...args: any[]) => Query;
interface Query extends PromiseLike<QueryResult> {
  select: Chain; insert: Chain; update: Chain; upsert: Chain; delete: Chain;
  eq: Chain; neq: Chain; gt: Chain; gte: Chain; lt: Chain; lte: Chain;
  like: Chain; ilike: Chain; in: Chain; is: Chain; or: Chain; and: Chain;
  not: Chain; match: Chain; contains: Chain; order: Chain; limit: Chain;
  range: Chain; filter: Chain; returns: Chain; throwOnError: Chain;
  single(): Promise<SingleResult>;
  maybeSingle(): Promise<SingleResult>;
  csv(): Promise<{ data: string; error: null }>;
}

function makeQuery(): Query {
  const q: any = {};
  const chainable = [
    "select", "insert", "update", "upsert", "delete",
    "eq", "neq", "gt", "gte", "lt", "lte", "like", "ilike",
    "in", "is", "or", "and", "not", "match", "contains",
    "order", "limit", "range", "filter", "returns", "throwOnError",
  ];
  for (const m of chainable) q[m] = () => q;
  q.single = async () => nullResult;
  q.maybeSingle = async () => nullResult;
  q.csv = async () => ({ data: "", error: null });
  // Thenable: `await supabase.from(...).select()...` resolves to empty list.
  q.then = (resolve: (v: QueryResult) => unknown, reject?: unknown) =>
    Promise.resolve(emptyResult).then(resolve, reject as never);
  q.catch = (rej: unknown) => Promise.resolve(emptyResult).catch(rej as never);
  q.finally = (fn: () => void) => Promise.resolve(emptyResult).finally(fn);
  return q as Query;
}

const storageBucket = {
  upload: async (_p: string, _f: unknown, _opts?: unknown) => nullResult,
  download: async (_p: string) => nullResult,
  createSignedUrl: async (_p: string, _e: number) => ({
    data: { signedUrl: "" },
    error: null as Error | null,
  }),
  getPublicUrl: (_p: string) => ({ data: { publicUrl: "" } }),
  remove: async (_p: string[]) => nullResult,
  list: async () => ({ data: [], error: null }),
};

const authSubscription = { unsubscribe: () => {} };

type SupabaseShim = {
  from: (t: string) => Query;
  rpc: (fn: string, args?: AnyObj) => Promise<QueryResult>;
  storage: { from: (b: string) => typeof storageBucket };
  auth: {
    getSession: () => Promise<{ data: { session: { access_token: string; user: any } | null }; error: null }>;
    setSession: (s: any) => Promise<{ data: { session: null }; error: null }>;
    getUser: () => Promise<{ data: { user: null }; error: null }>;
    onAuthStateChange: (cb: (event: string, session: any) => void) => { data: { subscription: { unsubscribe: () => void } } };
    signOut: () => Promise<{ error: null }>;
    signInWithPassword: (creds?: any) => Promise<{ data: null; error: Error }>;
    signUp: (creds?: any) => Promise<{ data: null; error: Error }>;
    signInWithOAuth: (opts?: any) => Promise<{ data: null; error: Error }>;
  };
};

export const supabase: SupabaseShim = {
  from: (_t: string) => makeQuery(),
  rpc: async (_fn: string, _args?: AnyObj) => emptyResult,
  storage: { from: (_b: string) => storageBucket },
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    setSession: async (_s: any) => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: (_cb: (event: string, session: any) => void) => ({
      data: { subscription: authSubscription },
    }),
    signOut: async () => ({ error: null }),
    signInWithPassword: async () => ({
      data: null,
      error: new Error("Auth is disabled in this UI-only build."),
    }),
    signUp: async () => ({
      data: null,
      error: new Error("Auth is disabled in this UI-only build."),
    }),
    signInWithOAuth: async () => ({
      data: null,
      error: new Error("Auth is disabled in this UI-only build."),
    }),
  },
};
