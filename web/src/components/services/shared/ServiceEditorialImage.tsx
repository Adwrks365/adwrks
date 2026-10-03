import Image from "next/image";

type ServiceEditorialImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
};

export function ServiceEditorialImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = "",
}: ServiceEditorialImageProps) {
  return (
    <figure className={`sp-editorial-media ${className}`.trim()}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="sp-editorial-media-image"
        sizes="(min-width: 768px) 42vw, 100vw"
        loading={priority ? undefined : "lazy"}
        priority={priority}
      />
    </figure>
  );
}
