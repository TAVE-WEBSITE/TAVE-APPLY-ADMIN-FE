import { type ReactNode, useEffect, type DialogHTMLAttributes } from "react";
import { Icon } from "@/components/Icon/Icon";
import Button from "@/components/Button/Button";

/** children으로 본문에 해당하는 내용 받아오기 */
interface ModalProps extends DialogHTMLAttributes<HTMLDialogElement> {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  buttonCount: 1 | 2;
  title?: string;
  children: ReactNode;
  confirmText?: string;
  onConfirm?: () => void;
  cancelText?: string;
  width?: string;
  defaultOpen?: boolean;
  isPending?: boolean;
}

const Modal = ({
  dialogRef,
  buttonCount,
  title,
  children,
  confirmText = "확인",
  onConfirm,
  cancelText = "취소",
  width = "w-[480px]",
  defaultOpen = false,
  isPending = false,
}: ModalProps) => {
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // ESC 키 이벤트 처리
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dialog.close();
      }
    };

    // dialog가 닫힐 때 onClose 호출
    const handleClose = () => {
      if (!dialog.open) {
        document.body.style.overflow = "unset";
        dialog.close();
      }
    };

    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("keydown", handleKeyDown);

    // 초기 상태 설정
    if (defaultOpen) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    }

    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, []);

  // 배경 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    const dialogDimensions = dialogRef.current?.getBoundingClientRect();
    if (!dialogDimensions) return;

    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      dialogRef.current?.close();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={`
        ${width}
        fixed
        top-1/2
        left-1/2
        -translate-x-1/2
        -translate-y-1/2
        rounded-xl
        backdrop:bg-black!
        backdrop:opacity-50!
        backdrop-blur-xl
        focus:outline-none
      `}
      onClick={handleBackdropClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <button
          onClick={() => dialogRef.current?.close()}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Icon type="X" size={24} />
        </button>
      </div>

      {/* Body */}
      <div className="p-6">{children}</div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-200">
        {buttonCount === 1 && (
          <Button
            onClick={() => dialogRef.current?.close()}
            className="w-full bg-blue-600 text-white"
          >
            {confirmText}
          </Button>
        )}
        {buttonCount === 2 && (
          <>
            <Button
              onKeyDown={(e) => e.key === "Enter" && dialogRef.current?.close()}
              onClick={() => dialogRef.current?.close()}
              className="bg-gray-200 !text-gray-900 hover:bg-gray-300"
            >
              {cancelText}
            </Button>
            {onConfirm && (
              <Button
                isPending={isPending}
                onClick={() => {
                  onConfirm();
                }}
                className="hover:bg-blue-700 bg-blue-500"
              >
                {confirmText}
              </Button>
            )}
          </>
        )}
      </div>
    </dialog>
  );
};

export default Modal;
