const PREFIX = "nuri_offline_";

export const offlineStorage = {
  save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(data));
    } catch {
      // localStorage lleno o no disponible - fallo silencioso
    }
  },

  load<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch {
      // fallo silencioso
    }
  },

  clear(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch {
      // fallo silencioso
    }
  },
};
