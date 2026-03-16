import Image from 'next/image';
interface Props {
  className?: string;
}

export function RaccoonEating({ className }: Props) {
  return (
    <Image
      src="/icons/raccoon/racc_eat.png"
      alt="Raccoon Eating"
      className={className}
      width={160}
      height={120}
    />
  );
}
