'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Dialog } from './ui/Dialog';
import { QuotationPDF } from './QuotationPDF';
import { IQuotation } from '../types/quotation';
import { Button } from './ui/Button';
import { Download } from 'lucide-react';

// Dynamically import PDF components with SSR disabled to prevent pre-render errors
const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  { ssr: false }
);

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

interface PDFPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  quotation: IQuotation;
}

export const PDFPreviewDialog: React.FC<PDFPreviewDialogProps> = ({
  isOpen,
  onClose,
  quotation,
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`PDF Preview - ${quotation.quotationNumber || 'Draft'}`}
      size="xl"
    >
      <div className="flex flex-col space-y-4 h-full">
        {/* Helper bar */}
        <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700">
          <p className="text-xs text-slate-400">
            Review the generated vector PDF. You can print, zoom, or download it using the viewer tools or the button on the right.
          </p>
          
          <PDFDownloadLink
            document={<QuotationPDF quotation={quotation} />}
            fileName={`Quotation-${quotation.quotationNumber || 'Draft'}.pdf`}
          >
            {/* @ts-ignore */}
            {({ loading }) => (
              <Button size="sm" variant="accent" loading={loading} className="cursor-pointer">
                <Download size={14} className="mr-1.5" />
                {loading ? 'Compiling PDF...' : 'Download PDF'}
              </Button>
            )}
          </PDFDownloadLink>
        </div>

        {/* PDF Viewer Container */}
        <div className="flex-1 w-full h-[65vh] rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
          <PDFViewer width="100%" height="100%" className="border-0 bg-slate-900" showToolbar={true}>
            <QuotationPDF quotation={quotation} />
          </PDFViewer>
        </div>
      </div>
    </Dialog>
  );
};
