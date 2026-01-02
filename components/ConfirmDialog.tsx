"use client";

type ConfirmDialogProps = {
    open: boolean;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    onConfirm: () => void;
    onClose: () => void;
};

export default function ConfirmDialog({
    open,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    loading,
    onConfirm,
    onClose,
}: ConfirmDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg rounded-2xl bg-[#25262dc3] py-6 px-10">
                <div className="text-lg font-semibold">{title}</div>

                {description ? (
                    <div className="mt-2 text-sm text-white/70 whitespace-pre-line">
                        {description}
                    </div>
                ) : null}

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm
                       hover:bg-white/10 transition disabled:opacity-50"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="rounded-xl bg-rose-600 text-white px-4 py-2 text-sm font-medium
                       hover:bg-rose-500 transition disabled:opacity-50"
                    >
                        {loading ? "Deleting…" : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
