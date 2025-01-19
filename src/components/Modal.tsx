import { IoClose } from "react-icons/io5";
import { useEffect, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { closeEditModal, closeModal } from "../feature/slices/addTask.slice";

interface ModalProps {
  label?: string;
  buttonContent: string;
  children: React.ReactNode;
  taskData: {};
  onAction: () => void;
}

export function Modal({
  label,
  buttonContent,
  children,
  onAction,
  taskData,
}: ModalProps) {
  const dispatch = useDispatch();
  const [missingData, setMissingData] = useState(true); //"",null, empty object
  const onClose = useCallback(() => {
    dispatch(closeModal());
    dispatch(closeEditModal());
  }, [dispatch]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    setMissingData(
      Object.values(taskData).some((value) => value === "" || value === null)
    );
  }, [taskData]);

  return (
    <div
      className="bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[674px] bg-white rounded-xl overflow-hidden shadow-lg"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#00000010]">
          <h2 className="text-xl font-semibold">{label}</h2>
          <button onClick={onClose} aria-label="Close modal">
            <IoClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[550px]">{children}</div>

        {/* Footer */}
        <div className="flex justify-end gap-4 px-6 py-4 border-t bg-[#f1f1f1] border-[#00000013]">
          <div
            onClick={onClose}
            className="px-6 py-[10px] rounded-full border bg-white border-[#00000020] uppercase font-bold cursor-pointer"
          >
            Cancel
          </div>
          <button
            onClick={() => {
              onAction(), onClose();
            }}
            className={`px-6 py-[10px] font-bold uppercase text-white rounded-full focus:outline-none ${
              missingData
                ? "bg-[var(--color-primary-2)] cursor-not-allowed"
                : "bg-[var(--color-primary)]"
            }`}
          >
            {buttonContent}
          </button>
        </div>
      </div>
    </div>
  );
}
