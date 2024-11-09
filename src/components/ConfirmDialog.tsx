interface ConfirmDialogProps {
  visible: boolean;
  action: string;
  onOK: any;
  onCancel: () => void;
}

const ConfirmDialog = ({
  visible,
  action,
  onOK,
  onCancel,
}: ConfirmDialogProps) => {
  return (
    <div
      className={`${
        !visible ? 'hidden' : ''
      } fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50`}
    >
      <div className="bg-white dark:bg-strokedark p-5 rounded-lg shadow-xl text-black dark:text-white max-w-md w-full">
        <div className="p-3"> Are You sure you want to {action}</div>
        <div className="flex justify-end gap-5">
          <button
            className="rounded bg-primary w-20"
            type="button"
            onClick={onOK}
          >
            Yes
          </button>
          <button
            className="rounded bg-danger w-20"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
