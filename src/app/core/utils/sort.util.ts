export type SortDirection = 'asc' | 'desc';

export function sortArray<T>(
  array: T[],
  field: keyof T | string,
  direction: SortDirection = 'asc',
  getValue?: (item: T, field: keyof T | string) => any
): T[] {
  const dir = direction === 'asc' ? 1 : -1;
  return [...array].sort((a, b) => {
    const aVal = getValue ? getValue(a, field) : (a as any)[field as string];
    const bVal = getValue ? getValue(b, field) : (b as any)[field as string];

    if (aVal < bVal) return -1 * dir;
    if (aVal > bVal) return 1 * dir;
    return 0;
  });
}
