// InvoicePrint.js
import { useRef } from 'react';
import { Invoice } from '../types/Invoice';
import { useReactToPrint } from 'react-to-print';
import Logo from '../images/logo/logo-dark.png';
import moment from 'moment';
import { capitalize } from '../utils/helpers';
import { MdPrint } from 'react-icons/md';

const InvoicePrint = ({
  invoiceData,
  setInvoiceData,
}: {
  invoiceData: Partial<Invoice>;
  setInvoiceData: () => void;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  return (
    <div>
      <div className="flex justify-between mb-5">
        <button
          className="flex gap-2 items-center text-blue-500 rounded hover:text-blue-600"
          type="button"
          font-medium
          onClick={() => {
            reactToPrintFn();
            setInvoiceData(null);
          }}
        >
          <MdPrint />
          Print
        </button>
        <button
          className="text-red-500 rounded hover:text-red-600"
          type="button"
          font-medium
          onClick={() => {
            setInvoiceData(null);
          }}
        >
          Cancel
        </button>
      </div>
      <div ref={contentRef}>
        <div className="mb-5">
          <div className="flex items-center gap-5">
            <img src={Logo} className="w-15 grayscale" />
            <div>
              <p className="text-lg font-bold">Ultimate Gym & Health Club</p>
              <p className="text-xs">
                Isa Tower 84-A-B1 45 Ghalib Road, link MM Alam Rd, Block B 1
                Gulberg III, Lahore
              </p>
            </div>
          </div>
        </div>
        <div className="pb-4 border-b dark:border-white border-black">
          <div className="flex justify-between">
            <span className="text-lg font-bold">RECEIPT</span>
            <span>{moment(invoiceData.invoice_date).format('MMM D YYYY')}</span>
            </div>
          <div className="flex justify-between">
            <span className="font-medium w-50 text-gray-800">
              Invoice Number:
            </span>{' '}
            {invoiceData.id}
          </div>
          <div className="flex justify-between">
            <span className="font-medium w-50 text-gray-800">
              Membership ID:
            </span>{' '}
            {invoiceData.membership_id}
          </div>
          <div className="flex justify-between">
            <span className="font-medium w-50 text-gray-800">Name</span>{' '}
            {invoiceData.client_name}
          </div>
          <div className="flex justify-between">
            <span className="font-medium w-50 text-gray-800">Phone</span>{' '}
            {invoiceData.client_phone}
          </div>
        </div>
        <div className="my-3 pb-4 border-b dark:border-white border-black">
          <span className="text-lg font-bold">DETAILS</span>

          <div className="flex justify-between">
            <span className="font-medium w-50 text-gray-800">Package:</span>
            {invoiceData.package_name}
          </div>
          <div className="flex justify-between">
            <span className="font-medium w-50 text-gray-800">
              Training Fee:
            </span>{' '}
            Rs. {invoiceData.training_fee}/-
          </div>
          <div className="flex justify-between">
            <span className="font-medium w-50 text-gray-800">
              Personal Fee:
            </span>{' '}
            Rs. {invoiceData.personal_fee}/-
          </div>
          <div className="flex justify-between">
            <span className="font-medium w-50 text-gray-800">
              Payment Type:
            </span>{' '}
            {capitalize(invoiceData.payment_type)}
          </div>

          <div className="mt-5 flex justify-between">
            <span className="text-lg font-bold">Total Fee:</span>
            <span>
              Rs. {invoiceData.training_fee + invoiceData.personal_fee}
            </span>
          </div>
        </div>
        <div className="py-2 flex gap-5 justify-between">
          <p className="font-medium text-lg">
            Thanks for joining our gym and becoming part of our family
          </p>
          <p className="font-bold text-lg">Signature</p>
        </div>
        <div className="mt-3 text-xs">
          <p className="text-light">Software Developed by: Muhammad Azam</p>
          <p className="text-light">0349-4902816, m.aazamsultan@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePrint;
