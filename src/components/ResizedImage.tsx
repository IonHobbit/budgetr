import Image from "next/image";

type ImageProps = {
  src: string;
  alt: string;
  className?: string;
};

const ResizedImage = ({ src, alt, className }: ImageProps) => {
  return (
    <div className={`w-20 h-20 relative overflow-hidden ${className}`}>
      <Image
        sizes="100%"
        fill={true}
        src={src}
        className="object-contain"
        alt={alt}
      />
    </div>
  );
};

export default ResizedImage;
