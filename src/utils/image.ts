const IMAGE_HOST = "images.unsplash.com";

export function getOptimizedImageUrl(
  source: string,
  width: number,
  quality = 65,
): string {
  const url = new URL(source);
  if (url.hostname !== IMAGE_HOST) return source;

  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality));
  return url.toString();
}
