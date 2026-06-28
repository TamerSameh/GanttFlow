export function fuzzyMatch(text: string, query: string): boolean {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  let qi = 0;
  for (let i = 0; i < lower.length && qi < q.length; i++) {
    if (lower[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

const _isMac = navigator.platform.includes('Mac');
export function isMac(): boolean {
  return _isMac;
}

export function modKeyLabel(): string {
  return _isMac ? '⌘' : 'Ctrl';
}
