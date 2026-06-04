import { useState, useEffect } from 'react';

const STORAGE_KEY = 'ctf_progress_v1';

export function useCTFProgress() {
  const [progress, setProgress] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const markSolved = (challengeId, timeMs) => {
    setProgress(prev => ({
      ...prev,
      [challengeId]: { solved: true, timeMs },
    }));
  };

  const isSolved    = (id) => !!progress[id]?.solved;
  const getTime     = (id) => progress[id]?.timeMs ?? null;
  const hasAnySolved = Object.values(progress).some(p => p.solved);
  const totalSolved  = Object.values(progress).filter(p => p.solved).length;

  return { progress, markSolved, isSolved, getTime, hasAnySolved, totalSolved };
}
