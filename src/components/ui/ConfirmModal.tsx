'use client';

import Modal from './Modal';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  hideCancel?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  destructive = false,
  hideCancel = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onCancel}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="font-display text-base font-semibold text-[var(--foreground)]">
            {title}
          </p>
          {description && (
            <p className="text-sm text-[var(--point-muted)]">{description}</p>
          )}
        </div>

        <div className="flex gap-2">
          {!hideCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl border border-[var(--glass-border)] bg-white/60 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-white/90 active:scale-95"
            >
              {cancelLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-colors active:scale-95 ${
              destructive
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-[var(--point)] hover:opacity-90'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
