import type { ImgHTMLAttributes, SyntheticEvent } from "react";

type SafeImageProps = ImgHTMLAttributes<HTMLImageElement>;

export function SafeImage({ onError, ...props }: SafeImageProps) {
  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    onError?.(event);
    const image = event.currentTarget;
    const placeholderUrl = new URL(
      `${import.meta.env.BASE_URL}furniture-placeholder.svg`,
      window.location.origin,
    ).href;
    if (image.src !== placeholderUrl) {
      image.src = placeholderUrl;
    }
  };

  return <img {...props} onError={handleError} />;
}
