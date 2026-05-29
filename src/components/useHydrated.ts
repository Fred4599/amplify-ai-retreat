import { useEffect, useState } from 'react';

/** True after the React island has mounted in the browser. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
