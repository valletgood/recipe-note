import Image from 'next/image';

const LOGO_SIZE = {
  xs: { width: 58, height: 40 },
  sm: { width: 116, height: 81 },
  md: { width: 174, height: 122 },
  lg: { width: 232, height: 162 },
} as const;

type RaccoonLogoSize = keyof typeof LOGO_SIZE;

interface RaccoonLogoProps {
  /** xs: 폼 섹션 아이콘, sm: 인라인, md: 중간, lg: 히어로/정중앙용(기본) */
  size?: RaccoonLogoSize;
  className?: string;
}

export function RaccoonLogo({ size = 'lg', className = '' }: RaccoonLogoProps) {
  const { width, height } = LOGO_SIZE[size];
  return (
    <div
      className={`flex shrink-0 items-center justify-center ${className}`.trim()}
      style={{ width, height }}
    >
      <Image
        src="/icons/raccoon/logo.svg"
        alt="Recipe Note 로고"
        width={width}
        height={height}
        className="object-contain"
        priority={size === 'lg'}
      />
    </div>
  );
}
