import Link from 'next/link';
import PencilIcon from './PencilIcon';

interface FloatingEditButtonProps {
  href: string;
  label: string;
}

export default function FloatingEditButton({
  href,
  label,
}: FloatingEditButtonProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-30">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="flex justify-end">
          <Link
            href={href}
            className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--point)] text-white shadow-[0_4px_20px_rgba(52,95,83,0.35)] transition-[transform,opacity] hover:opacity-95 active:scale-95"
            aria-label={label}
          >
            <PencilIcon className="h-7 w-7" />
          </Link>
        </div>
      </div>
    </div>
  );
}
