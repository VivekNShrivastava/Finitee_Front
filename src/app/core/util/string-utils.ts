export function getEmptyForNull(obj: string) {
  if (obj && obj.length > 0) {
    return obj;
  }
  return "";
}
