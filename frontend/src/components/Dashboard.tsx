'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  FileText,
  Search,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Eye,
  Download,
  AlertTriangle,
  Layers,
  Users,
  DollarSign
} from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { Dialog } from './ui/Dialog';
import { PDFPreviewDialog } from './PDFPreviewDialog';
import { QuotationPDF } from './QuotationPDF';
import { quotationApi } from '../lib/api';
import { IQuotation } from '../types/quotation';
import { formatCurrency, formatDate } from '../lib/utils';

// Dynamically import PDF download link to avoid SSR mismatch issues
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

export default function Dashboard() {
  const router = useRouter();
  const [quotations, setQuotations] = useState<IQuotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Dialog States
  const [selectedQuotation, setSelectedQuotation] = useState<IQuotation | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchQuotations = async (query = '') => {
    try {
      setLoading(true);
      const data = await quotationApi.getQuotations(query);
      setQuotations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations(search);
  }, [search]);

  // Actions
  const handleDuplicate = async (id: string) => {
    try {
      setActionLoading(true);
      await quotationApi.duplicateQuotation(id);
      fetchQuotations(search); // Refresh list
    } catch (err) {
      console.error(err);
      alert('Failed to duplicate quotation.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setActionLoading(true);
      await quotationApi.deleteQuotation(deleteId);
      setDeleteOpen(false);
      setDeleteId(null);
      fetchQuotations(search);
    } catch (err) {
      console.error(err);
      alert('Failed to delete quotation.');
    } finally {
      setActionLoading(false);
    }
  };

  const triggerDelete = (id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const triggerPreview = (quotation: IQuotation) => {
    setSelectedQuotation(quotation);
    setPreviewOpen(true);
  };

  // Metrics calculations
  const totalQuotations = quotations.length;
  const totalValue = quotations.reduce((acc, q) => acc + q.grandTotal, 0);
  const uniqueClients = new Set(quotations.map((q) => q.clientInfo.organizationName.toLowerCase())).size;

  return (
    <div className="space-y-6">
      
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <img src="/logo.jpg" alt="Logo" className="h-10 w-auto object-contain rounded-md" />
            Shiv Core Tech Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Enterprise Quotation Portal (A Division of Renvora Technologies Private Limited).
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => router.push('/quotation/new')}
          className="shadow-lg shadow-blue-500/20 cursor-pointer"
        >
          <Plus size={18} className="mr-2" />
          Create New Quotation
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Card className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-slate-100 group-hover:scale-110 transition-transform">
            <FileText size={80} />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500/10 text-primary rounded-xl">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Quotations</p>
                <h3 className="text-3xl font-extrabold text-white mt-1">{totalQuotations}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-slate-100 group-hover:scale-110 transition-transform">
            <DollarSign size={80} />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Booked Volume</p>
                <h3 className="text-3xl font-extrabold text-amber-500 mt-1">{formatCurrency(totalValue)}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-slate-100 group-hover:scale-110 transition-transform">
            <Users size={80} />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                <Users size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Unique Clients</p>
                <h3 className="text-3xl font-extrabold text-white mt-1">{uniqueClients}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Control / Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 h-4.5 w-4.5" />
            <input
              type="text"
              placeholder="Search by quote number, organization, or contact person..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          {search && (
            <Button size="sm" variant="ghost" onClick={() => setSearch('')} className="cursor-pointer">
              Clear Filter
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Main Data Table */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
              <p className="text-slate-500 text-sm">Retrieving quotations from server...</p>
            </div>
          ) : quotations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="text-slate-600 h-12 w-12 mb-3" />
              <h3 className="text-lg font-bold text-white">No Quotations Found</h3>
              <p className="text-slate-400 text-sm mt-1 max-w-md px-4">
                {search ? "No records matched your search query. Try typing something else or clearing filters." : "Create your first quotation by clicking the button above."}
              </p>
              {!search && (
                <Button variant="outline" size="sm" onClick={() => router.push('/quotation/new')} className="mt-4 cursor-pointer">
                  <Plus size={14} className="mr-1" /> Get Started
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-850 bg-slate-900/50 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="py-4 px-6">Quotation No</th>
                    <th className="py-4 px-6">Client / Organization</th>
                    <th className="py-4 px-6">Project Type</th>
                    <th className="py-4 px-6">Quotation Date</th>
                    <th className="py-4 px-6 text-right">Grand Total</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {quotations.map((q) => (
                    <tr key={q._id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="py-4 px-6 font-bold text-white">
                        {q.quotationNumber}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-200">{q.clientInfo.organizationName}</span>
                          <span className="text-xs text-slate-400">{q.clientInfo.contactPerson}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant="primary">
                          {q.projectInfo.projectType}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-slate-300">
                        {formatDate(q.quotationDate)}
                      </td>
                      <td className="py-4 px-6 text-right font-extrabold text-amber-500">
                        {formatCurrency(q.grandTotal)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* PDF Preview Button */}
                          <button
                            onClick={() => triggerPreview(q)}
                            title="View PDF Preview"
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                          >
                            <Eye size={16} />
                          </button>

                          {/* PDF Direct Download Link */}
                          <PDFDownloadLink
                            document={<QuotationPDF quotation={q} />}
                            fileName={`Quotation-${q.quotationNumber}.pdf`}
                          >
                            {/* @ts-ignore */}
                            {({ loading }) => (
                              <button
                                disabled={loading}
                                title={loading ? 'Preparing PDF...' : 'Download PDF'}
                                className="p-2 text-slate-400 hover:text-amber-500 hover:bg-slate-800 rounded-lg disabled:opacity-40 transition-all cursor-pointer"
                              >
                                <Download size={16} />
                              </button>
                            )}
                          </PDFDownloadLink>

                          {/* Edit Button */}
                          <button
                            onClick={() => router.push(`/quotation/edit/${q._id}`)}
                            title="Edit Quotation"
                            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                          >
                            <Edit2 size={16} />
                          </button>

                          {/* Duplicate Button */}
                          <button
                            disabled={actionLoading}
                            onClick={() => handleDuplicate(q._id!)}
                            title="Duplicate Quotation"
                            className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-slate-800 rounded-lg disabled:opacity-40 transition-all cursor-pointer"
                          >
                            <Copy size={16} />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => triggerDelete(q._id!)}
                            title="Delete Quotation"
                            className="p-2 text-slate-400 hover:text-destructive hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog
        isOpen={deleteOpen}
        onClose={() => { if (!actionLoading) setDeleteOpen(false); }}
        title="Delete Quotation"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-red-500">
            <AlertTriangle className="h-6 w-6" />
            <span className="font-bold text-base">Warning: Destructive Action</span>
          </div>
          <p className="text-xs text-slate-300">
            Are you sure you want to permanently delete this quotation? This action is irreversible and will remove all record logs from the system database.
          </p>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <Button
              variant="ghost"
              disabled={actionLoading}
              onClick={() => setDeleteOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              loading={actionLoading}
              onClick={handleDeleteConfirm}
              className="cursor-pointer"
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Preview PDF Modal */}
      {previewOpen && selectedQuotation && (
        <PDFPreviewDialog
          isOpen={previewOpen}
          onClose={() => {
            setPreviewOpen(false);
            setSelectedQuotation(null);
          }}
          quotation={selectedQuotation}
        />
      )}

    </div>
  );
}
