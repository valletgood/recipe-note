import Image from 'next/image';
interface Props {
  className?: string;
  fill?: boolean;
}

export function RaccoonCooking({ className, fill }: Props) {
  if (fill) {
    return (
      <Image
        src="/icons/raccoon/racc_cooking.png"
        alt="Raccoon Cooking"
        fill
        className={`object-contain ${className ?? ''}`}
      />
    );
  }
  return (
    <Image
      src="/icons/raccoon/racc_cooking.png"
      alt="Raccoon Cooking"
      className={className}
      width={160}
      height={120}
    />
  );
}
