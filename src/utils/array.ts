export function upsert<T>(array: T[], newItem: T, key: keyof T): T[] {
  const index = array.findIndex((item) => item[key] === newItem[key]);
  return index !== -1
    ? [...array.slice(0, index), newItem, ...array.slice(index + 1)]
    : [...array, newItem];
}
