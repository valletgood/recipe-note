import Image from 'next/image';
interface Props {
  className?: string;
}

export function RaccoonCrying({ className }: Props) {
  return (
    <Image
      src="/icons/raccoon/racc_cry.png"
      alt="Raccoon Crying"
      className={className}
      width={160}
      height={120}
      style={{ background: 'transparent' }}
    />
  );
}
