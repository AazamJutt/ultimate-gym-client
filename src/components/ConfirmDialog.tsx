import { ConfirmDialog } from 'primereact/confirmdialog';

const ConfirmDialogModal = () => (
  <ConfirmDialog
    className="bg-white dark:bg-strokedark p-8 rounded-lg shadow-xl text-black dark:text-white max-w-md w-full"
    acceptClassName="text-white bg-danger rounded p-1 w-20 mt-4"
    rejectClassName="text-white bg-primary rounded p-1 w-20 me-3"
  />
);

export default ConfirmDialogModal;
