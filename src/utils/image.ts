const IMAGE_HOST = "images.unsplash.com";

export function getLocalStockImageUrl(photoId: string): string {
  return `${import.meta.env.BASE_URL}images/stock/${photoId}.jpg`;
}

export function getOptimizedImageUrl(
  source: string,
  width: number,
  quality = 65,
): string {
  if (!source.startsWith(`https://${IMAGE_HOST}/`)) return source;

  const url = new URL(source);

  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality));
  return url.toString();
}
