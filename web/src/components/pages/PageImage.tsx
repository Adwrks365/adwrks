import Image from "next/image";
import { toLocalMediaUrl } from "@/lib/media/urls";

type PageImageProps = {
  src: string;
  alt?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
};

export function PageImage({
  src,
  alt = "",
  className = "",
  priority,
  sizes = "(max-width: 768px) 100vw, 50vw",
  width = 640,
  height = 480,
}: PageImageProps) {
  const localSrc = toLocalMediaUrl(src);
  if (!localSrc.startsWith("/")) return null;

  return (
    <Image
      src={localSrc}
      alt={alt}
      width={width}
      height={height}
      className={`page-image ${className}`.trim()}
      priority={priority}
      sizes={sizes}
    />
  );
}
