import Image from 'next/image';
interface Props {
  className?: string;
  fill?: boolean;
}

export function RaccoonFruits({ className, fill }: Props) {
  if (fill) {
    return (
      <Image
        src="/icons/raccoon/racc_inci.png"
        alt="Raccoon Fruits"
        fill
        className={`object-contain ${className ?? ''}`}
      />
    );
  }
  return (
    <Image
      src="/icons/raccoon/racc_inci.png"
      alt="Raccoon Fruits"
      className={className}
      width={160}
      height={120}
    />
  );
}
