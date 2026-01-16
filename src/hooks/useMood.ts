import { useState, useCallback, useEffect } from 'react';

export interface MoodEntry {
  id: string;
  mood: number; // 1-5 scale
  notes: string;
  timestamp: Date;
}

const STORAGE_KEY = 'mindease_mood_logs';

export function useMood(isGuest: boolean) {
  const [entries, setEntries] = useState<MoodEntry[]>(() => {
    if (isGuest) return [];
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      }));
    }
    return [];
  });

  // Persist to localStorage for non-guest users
  useEffect(() => {
    if (!isGuest && entries.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries, isGuest]);

  const addEntry = useCallback((mood: number, notes: string) => {
    const newEntry: MoodEntry = {
      id: 'mood_' + Date.now(),
      mood,
      notes,
      timestamp: new Date(),
    };

    setEntries(prev => [newEntry, ...prev]);
    return newEntry;
  }, []);

  const getRecentEntries = useCallback((days: number = 7) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    return entries.filter(entry => entry.timestamp >= cutoff);
  }, [entries]);

  const getAverageMood = useCallback((days: number = 7) => {
    const recent = getRecentEntries(days);
    if (recent.length === 0) return null;
    
    const sum = recent.reduce((acc, entry) => acc + entry.mood, 0);
    return sum / recent.length;
  }, [getRecentEntries]);

  const getStreak = useCallback(() => {
    if (entries.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      
      const hasEntry = entries.some(entry => {
        const entryDate = new Date(entry.timestamp);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === checkDate.getTime();
      });
      
      if (hasEntry) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  }, [entries]);

  const clearEntries = useCallback(() => {
    setEntries([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    entries,
    addEntry,
    getRecentEntries,
    getAverageMood,
    getStreak,
    clearEntries,
  };
}
