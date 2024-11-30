// InvoicePrint.js
import { useEffect, useRef } from 'react';
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
  const reactToPrintFn = useReactToPrint({
    documentTitle: `Invoice_${Date.now()}`,
    fonts: [{ family: 'Sans-Serif' }],
    contentRef,
    pageStyle: `@page { size: A5; margin: 10mm; } body { font-size: 14px; }`, // Set page size to A5, adjust text size, and decrease margins
  });

  useEffect(() => {
    const handleEsc = (event: any) => {
      if (event.key === 'Escape') {
        setInvoiceData(null);
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

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
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img src={Logo} width={80} style={{ filter: 'grayscale(100%)' }} />
            <div>
              <p style={{ fontWeight: 'bold' }}>Ultimate Gym & Health Club</p>
              <p style={{ fontSize: '12px' }}>
                Isa Tower 84-A-B1 45 Ghalib Road, link MM Alam Rd, Block B 1
                Gulberg III, Lahore
              </p>
            </div>
          </div>
        </div>
        <div style={{ paddingBottom: '10px', borderBottom: '1px solid black' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
              RECEIPT
            </span>
            <span>{moment(invoiceData.invoice_date).format('MMM D YYYY')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>
              Invoice Number:
            </span>{' '}
            {invoiceData?.id}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>
              Membership ID:
            </span>{' '}
            {invoiceData?.membership_id}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>Name</span>{' '}
            {invoiceData?.client_name}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>Phone</span>{' '}
            {invoiceData?.client_phone}
          </div>
        </div>
        <div
          style={{
            margin: '10px 0px',
            borderBottom: '1px solid black',
          }}
        >
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>DETAILS</span>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>
              Package:
            </span>
            {invoiceData?.package_name}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>
              Training Fee:
            </span>{' '}
            Rs. {invoiceData?.training_fee}/-
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>
              Personal Fee:
            </span>{' '}
            Rs. {invoiceData?.personal_fee}/-
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>
              Registration Fee:
            </span>{' '}
            Rs. {invoiceData?.registration_fee}/-
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>
              Locker Fee:
            </span>{' '}
            Rs. {invoiceData?.locker_fee}/-
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>
              Payment Type:
            </span>{' '}
            {capitalize(invoiceData?.payment_type)}
          </div>

          <div
            style={{
              marginTop: '10px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
              Total Fee:
            </span>
            <span>
              Rs.{' '}
              {invoiceData?.personal_fee +
                (invoiceData?.training_fee || 0) +
                (invoiceData?.registration_fee || 0) +
                (invoiceData?.locker_fee || 0)}
            </span>
          </div>
        </div>
        <div
          style={{
            padding: '8px 0',
            display: 'flex',
            gap: '14px',
            justifyContent: 'space-between',
          }}
        >
          <p style={{ fontWeight: '500', fontSize: '16px' }}>
            Thanks for joining our gym and becoming part of our family
          </p>
          <p style={{ fontWeight: 'bold', fontSize: '16px' }}>Signature</p>
        </div>
        <div style={{ marginTop: '10px', fontSize: '11px' }}>
          <p style={{ fontWeight: '300' }}>Software Developed by: Codefumes</p>
          <p style={{ fontWeight: '300' }}>0349-4902816, info@codefumes.tech</p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePrint;
