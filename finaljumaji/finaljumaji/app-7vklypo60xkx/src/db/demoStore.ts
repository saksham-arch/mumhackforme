import { demoData, type DemoSeedData } from './demoData';

export type DemoData = DemoSeedData;
export type TableName = keyof DemoData;
export type TableRecord<K extends TableName> = DemoData[K] extends Array<infer U> ? U : never;

const STORAGE_KEY = 'flowguide-demo-store';
const tableNames = Object.keys(demoData) as TableName[];

const hasWindow = typeof window !== 'undefined';

const getLocalStorage = (): Storage | null => {
  if (!hasWindow) return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const storage = getLocalStorage();

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const isDemoData = (value: unknown): value is DemoData => {
  if (!value || typeof value !== 'object') return false;

  return tableNames.every((table) => Array.isArray((value as Record<TableName, unknown[]>)[table]));
};

const readFromStorage = (): DemoData | null => {
  if (!storage) return null;

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return isDemoData(parsed) ? (parsed as DemoData) : null;
  } catch {
    return null;
  }
};

const writeToStorage = (data: DemoData) => {
  if (!storage) return;

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore quota errors — demo data can be regenerated.
  }
};

const initializeStore = (): DemoData => {
  const stored = readFromStorage();
  if (stored) {
    return stored;
  }

  const seeded = clone(demoData);
  writeToStorage(seeded);
  return seeded;
};

let store: DemoData = initializeStore();

const ensureStoreIntegrity = () => {
  if (!isDemoData(store)) {
    store = clone(demoData);
    writeToStorage(store);
  }
};

const persist = () => writeToStorage(store);

export const resetDemoStore = () => {
  store = clone(demoData);
  persist();
};

export const getStoreSnapshot = (): DemoData => {
  ensureStoreIntegrity();
  return clone(store);
};

export const getTable = <K extends TableName>(table: K): DemoData[K] => {
  ensureStoreIntegrity();
  return clone(store[table]);
};

export const setTable = <K extends TableName>(table: K, records: DemoData[K]) => {
  ensureStoreIntegrity();
  store[table] = clone(records);
  persist();
};

export const insertRecord = <K extends TableName>(table: K, record: TableRecord<K>): TableRecord<K> => {
  ensureStoreIntegrity();
  const entry = clone(record);
  (store[table] as TableRecord<K>[]).push(entry);
  persist();
  return clone(entry);
};

export const updateRecord = <K extends TableName>(table: K, id: string, updates: Partial<TableRecord<K>>): TableRecord<K> | null => {
  ensureStoreIntegrity();
  const records = store[table] as TableRecord<K>[];
  const idx = records.findIndex((row) => (row as { id?: string }).id === id);

  if (idx === -1) return null;

  const updated = { ...records[idx], ...updates } as TableRecord<K>;
  records[idx] = updated;
  persist();
  return clone(updated);
};

export const deleteRecord = <K extends TableName>(table: K, id: string): boolean => {
  ensureStoreIntegrity();
  const records = store[table] as TableRecord<K>[];
  const next = records.filter((row) => (row as { id?: string }).id !== id) as TableRecord<K>[];

  if (next.length === records.length) {
    return false;
  }

  store[table] = next as DemoData[K];
  persist();
  return true;
};

export const generateDemoId = (prefix: string) => {
  const cryptoApi = (globalThis as typeof globalThis & { crypto?: Crypto }).crypto;

  if (cryptoApi && 'randomUUID' in cryptoApi) {
    return `${prefix}_${cryptoApi.randomUUID()}`;
  }

  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
};

export const nowIsoString = () => new Date().toISOString();

let failureEmitted = false;

export const maybeFailOnce = () => {
  if (failureEmitted) return;

  if (Math.random() < 0.08) {
    failureEmitted = true;
    throw new Error('Demo network hiccup. Please retry.');
  }
};

export const simulateLatency = (min = 150, max = 450) =>
  new Promise<void>((resolve) => {
    const duration = Math.floor(Math.random() * (max - min + 1)) + min;
    setTimeout(resolve, duration);
  });

export type NetworkOptions = {
  allowFailure?: boolean;
  minLatency?: number;
  maxLatency?: number;
};

export const withDemoNetwork = async <T>(operation: () => T | Promise<T>, options?: NetworkOptions): Promise<T> => {
  const { allowFailure = true, minLatency = 150, maxLatency = 450 } = options ?? {};

  await simulateLatency(minLatency, maxLatency);

  if (allowFailure) {
    maybeFailOnce();
  }

  return await Promise.resolve(operation());
};
