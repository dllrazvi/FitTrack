/**
 * RN Firebase DocumentSnapshot may expose `exists` as boolean or as a method.
 */
export function firestoreDocExists(snap: {
  exists?: boolean | (() => boolean);
}): boolean {
  const ex = snap?.exists as unknown;
  if (typeof ex === 'function') {
    return (ex as () => boolean)();
  }
  return Boolean(ex);
}
