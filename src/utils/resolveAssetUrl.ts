export function resolveAssetUrl(path: string): string {
  return new URL(path, import.meta.url).href;
}