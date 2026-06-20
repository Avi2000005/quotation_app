'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, ArrowLeft, Eye, Save, HelpCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Select } from './ui/Select';
import { Checkbox } from './ui/Checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Badge } from './ui/Badge';
import { PDFPreviewDialog } from './PDFPreviewDialog';
import { quotationApi } from '../lib/api';
import { IQuotation, ICommercial } from '../types/quotation';
import { formatCurrency, numberToWords } from '../lib/utils';

// Static dropdown options
const CLIENT_TYPES = [
  { value: 'College', label: 'College' },
  { value: 'Coaching Class', label: 'Coaching Class' },
  { value: 'Hospital', label: 'Hospital' },
  { value: 'Restaurant', label: 'Restaurant' },
  { value: 'Hotel', label: 'Hotel' },
  { value: 'NGO', label: 'NGO' },
  { value: 'Business', label: 'Business' },
  { value: 'Other', label: 'Other' },
];

const PROJECT_TYPES = [
  { value: 'Static', label: 'Static' },
  { value: 'Dynamic', label: 'Dynamic' },
  { value: 'E-Commerce', label: 'E-Commerce' },
  { value: 'ERP', label: 'ERP Software' },
  { value: 'Mobile App', label: 'Mobile App' },
  { value: 'AI Chatbot', label: 'AI Chatbot' },
  { value: 'Digital Marketing', label: 'Digital Marketing' },
  { value: 'SEO Package', label: 'SEO Package' },
  { value: 'Custom Software', label: 'Custom Software' },
];

// Grouped Scope of Work defaults
const DEFAULT_SCOPE_ITEMS = {
  Website: [
    'Mobile Responsive Design',
    'Home Page',
    'About Us',
    'Services',
    'Courses',
    'Gallery',
    'Contact Page',
    'Inquiry Form',
    'Blog',
    'Testimonials'
  ],
  Integrations: [
    'WhatsApp Integration',
    'Google Maps Integration',
    'Email Integration',
    'Social Media Integration',
    'Payment Gateway',
    'SMS Integration'
  ]
};

// Default payment terms and other definitions

const DEFAULT_PAYMENT_TERMS = [
  '50% Advance Payment',
  '50% Before Final Deployment'
];

const DEFAULT_FREE_SUPPORT = [
  '45 Days Free Technical Support',
  'Minor Content Updates Included'
];

const DEFAULT_CLIENT_RESPONSIBILITIES = [
  'Logo',
  'Content',
  'Images',
  'Course Details',
  'Contact Information',
  'Documents'
];

const DEFAULT_EXCLUSIONS = [
  'Premium Themes',
  'Premium Plugins',
  'Content Writing',
  'Additional Pages',
  'Third Party Licenses',
  'Future Enhancements'
];

const FIXED_TERMS = [
  'The website will be handed over only after full payment is received.',
  'The client must provide all required content, images, logos, and credentials before the project start.',
  'The quotation includes only the features and scope mentioned in the proposal. Any additional work will be charged separately.',
  'A maximum of 2–3 revision rounds are included. Additional revisions may incur extra charges.',
  'Domain, hosting, SSL certificates, third-party plugins, APIs, and other subscription services are not included unless specifically mentioned.',
  'Upon project completion and handover, all website files, source code, and access credentials will be transferred to the client.',
  'Any support, maintenance, bug fixes, or content updates after handover will be billed separately unless covered under a maintenance agreement.',
  'The developer is not responsible for issues caused by third-party hosting providers, plugins, software updates, or unauthorized modifications after handover.',
  'The project timeline may be extended if there are delays in receiving required information, approvals, or feedback from the client.',
  'The client is responsible for maintaining backups and renewing domain, hosting, SSL, and other services after handover.',
  'Intellectual property rights of the website will be transferred to the client upon full payment and project completion.',
  'Any cancellation after project commencement may result in charges for work completed up to that stage.'
];

interface QuotationFormProps {
  initialId?: string; // If editing
}

export default function QuotationForm({ initialId }: QuotationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Core Form Fields
  const [createdBy, setCreatedBy] = useState('Renvora Admin');
  const [quotationDate, setQuotationDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [validTillDate, setValidTillDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15); // Default validity 15 days
    return d.toISOString().split('T')[0];
  });

  const [clientType, setClientType] = useState<any>('College');
  const [organizationName, setOrganizationName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const [projectType, setProjectType] = useState<any>('Static');
  const [projectDescription, setProjectDescription] = useState('');

  // Lists & Checkboxes
  const [scopeOfWork, setScopeOfWork] = useState<string[]>([]);
  const [customScope, setCustomScope] = useState('');

  const [bankName, setBankName] = useState('ICICI Bank');
  const [accountName, setAccountName] = useState('Renvora Technologies Private Limited');
  const [accountNumber, setAccountNumber] = useState('123456789012');
  const [ifscCode, setIfscCode] = useState('ICIC0001234');
  const [branchName, setBranchName] = useState('Mumbai');

  const [commercials, setCommercials] = useState<ICommercial[]>([
    { description: 'Initial Website Development & Design Setup', quantity: 1, price: 15000, total: 15000 }
  ]);

  const [gstEnabled, setGstEnabled] = useState(true);
  
  const [paymentOption, setPaymentOption] = useState<'50-50' | '100' | 'custom'>('50-50');
  const [paymentTerms, setPaymentTerms] = useState<string[]>(['50% Advance Payment', '50% Remaining Payment']);
  const [customPayment, setCustomPayment] = useState('');

  const [supportOption, setSupportOption] = useState<'45' | '90' | 'custom'>('45');
  const [freeSupport, setFreeSupport] = useState<string[]>(['45 Days Free Technical Support', 'Minor Content Updates Included']);
  const [customSupport, setCustomSupport] = useState('');

  const [clientResponsibilities, setClientResponsibilities] = useState<string[]>(DEFAULT_CLIENT_RESPONSIBILITIES);
  const [customResponsibility, setCustomResponsibility] = useState('');

  const [exclusions, setExclusions] = useState<string[]>(DEFAULT_EXCLUSIONS);
  const [customExclusion, setCustomExclusion] = useState('');

  // Quotation number state (fetched/saved)
  const [quotationNumber, setQuotationNumber] = useState('SCT-YYYY-XXX');

  // Load quotation data if in edit mode
  useEffect(() => {
    if (initialId) {
      setLoading(true);
      quotationApi.getQuotationById(initialId)
        .then((data) => {
          setQuotationNumber(data.quotationNumber);
          setCreatedBy(data.createdBy);
          setQuotationDate(new Date(data.quotationDate).toISOString().split('T')[0]);
          setValidTillDate(new Date(data.validTillDate).toISOString().split('T')[0]);
          
          setClientType(data.clientInfo.clientType);
          setOrganizationName(data.clientInfo.organizationName);
          setContactPerson(data.clientInfo.contactPerson);
          setMobileNumber(data.clientInfo.mobileNumber);
          setEmail(data.clientInfo.email);
          setAddress(data.clientInfo.address);

          setProjectType(data.projectInfo.projectType);
          setProjectDescription(data.projectInfo.projectDescription);

          setScopeOfWork(data.scopeOfWork || []);
          if (data.bankDetails) {
            setBankName(data.bankDetails.bankName || '');
            setAccountName(data.bankDetails.accountName || '');
            setAccountNumber(data.bankDetails.accountNumber || '');
            setIfscCode(data.bankDetails.ifscCode || '');
            setBranchName(data.bankDetails.branchName || '');
          }
          setCommercials(data.commercials || []);
          setGstEnabled(data.gstEnabled);
          const loadedTerms = data.paymentTerms || [];
          setPaymentTerms(loadedTerms);
          if (loadedTerms.length === 2 && loadedTerms[0] === '50% Advance Payment' && (loadedTerms[1] === '50% Remaining Payment' || loadedTerms[1] === '50% Before Final Deployment')) {
            setPaymentOption('50-50');
          } else if (loadedTerms.length === 1 && loadedTerms[0] === '100% Advance Payment') {
            setPaymentOption('100');
          } else {
            setPaymentOption('custom');
          }

          const loadedSupport = data.freeSupport || [];
          setFreeSupport(loadedSupport);
          if (loadedSupport.length === 2 && loadedSupport[0] === '45 Days Free Technical Support' && loadedSupport[1] === 'Minor Content Updates Included') {
            setSupportOption('45');
          } else if (loadedSupport.length === 2 && loadedSupport[0] === '90 Days Free Technical Support' && loadedSupport[1] === 'Minor Content Updates Included') {
            setSupportOption('90');
          } else {
            setSupportOption('custom');
          }
          setClientResponsibilities(data.clientResponsibilities || []);
          setExclusions(data.exclusions || []);
        })
        .catch((err) => {
          console.error(err);
          alert('Failed to load quotation.');
        })
        .finally(() => setLoading(false));
    }
  }, [initialId]);

  // Financial Calculations
  const subtotal = commercials.reduce((acc, row) => acc + (row.quantity * row.price), 0);
  const gstAmount = gstEnabled ? Math.round(subtotal * 0.18) : 0;
  const grandTotal = subtotal + gstAmount;
  const grandTotalInWords = numberToWords(grandTotal);

  // Commercial Table helpers
  const handleAddCommercialRow = () => {
    setCommercials([...commercials, { description: '', quantity: 1, price: 0, total: 0 }]);
  };

  const handleRemoveCommercialRow = (index: number) => {
    if (commercials.length === 1) return;
    setCommercials(commercials.filter((_, i) => i !== index));
  };

  const handleCommercialChange = (index: number, field: keyof ICommercial, value: any) => {
    const updated = [...commercials];
    if (field === 'quantity' || field === 'price') {
      const numVal = parseFloat(value) || 0;
      (updated[index] as any)[field] = numVal;
      updated[index].total = updated[index].quantity * updated[index].price;
    } else {
      (updated[index] as any)[field] = value;
    }
    setCommercials(updated);
  };

  // Checkbox Lists handlers
  const handleToggleScope = (item: string) => {
    if (scopeOfWork.includes(item)) {
      setScopeOfWork(scopeOfWork.filter(s => s !== item));
    } else {
      setScopeOfWork([...scopeOfWork, item]);
    }
  };

  const handleAddCustomScope = () => {
    if (!customScope.trim()) return;
    setScopeOfWork([...scopeOfWork, customScope.trim()]);
    setCustomScope('');
  };

  // Checkbox Lists handlers

  const handleToggleResponsibility = (item: string) => {
    if (clientResponsibilities.includes(item)) {
      setClientResponsibilities(clientResponsibilities.filter(r => r !== item));
    } else {
      setClientResponsibilities([...clientResponsibilities, item]);
    }
  };

  const handleAddCustomResponsibility = () => {
    if (!customResponsibility.trim()) return;
    setClientResponsibilities([...clientResponsibilities, customResponsibility.trim()]);
    setCustomResponsibility('');
  };

  const handleToggleExclusion = (item: string) => {
    if (exclusions.includes(item)) {
      setExclusions(exclusions.filter(e => e !== item));
    } else {
      setExclusions([...exclusions, item]);
    }
  };

  const handleAddCustomExclusion = () => {
    if (!customExclusion.trim()) return;
    setExclusions([...exclusions, customExclusion.trim()]);
    setCustomExclusion('');
  };

  const handleAddCustomPayment = () => {
    if (!customPayment.trim()) return;
    setPaymentTerms([...paymentTerms, customPayment.trim()]);
    setCustomPayment('');
  };

  const handleRemovePaymentTerm = (index: number) => {
    setPaymentTerms(paymentTerms.filter((_, i) => i !== index));
  };

  const handleAddCustomSupport = () => {
    if (!customSupport.trim()) return;
    setFreeSupport([...freeSupport, customSupport.trim()]);
    setCustomSupport('');
  };

  const handleRemoveSupportTerm = (index: number) => {
    setFreeSupport(freeSupport.filter((_, i) => i !== index));
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!createdBy.trim()) newErrors.createdBy = 'Created By is required';
    if (!organizationName.trim()) newErrors.organizationName = 'Organization Name is required';
    if (!contactPerson.trim()) newErrors.contactPerson = 'Contact Person is required';
    
    // Simple mobile regex
    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile Number is required';
    } else if (!/^[0-9+\s-]{10,15}$/.test(mobileNumber.trim())) {
      newErrors.mobileNumber = 'Enter a valid mobile number';
    }

    // Email regex
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!address.trim()) newErrors.address = 'Address is required';
    if (!projectDescription.trim()) newErrors.projectDescription = 'Project Description is required';

    commercials.forEach((row, i) => {
      if (!row.description.trim()) {
        newErrors[`row-${i}-desc`] = 'Description required';
      }
      if (row.quantity <= 0) {
        newErrors[`row-${i}-qty`] = 'Qty > 0';
      }
      if (row.price < 0) {
        newErrors[`row-${i}-price`] = 'Price >= 0';
      }
    });

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      // Scroll to the first error
      const firstErrorKey = Object.keys(newErrors)[0];
      const element = document.getElementById(firstErrorKey);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }

    return true;
  };

  const compileData = (): Partial<IQuotation> => {
    return {
      createdBy,
      quotationDate: new Date(quotationDate).toISOString(),
      validTillDate: new Date(validTillDate).toISOString(),
      clientInfo: {
        clientType,
        organizationName,
        contactPerson,
        mobileNumber,
        email,
        address
      },
      projectInfo: {
        projectType,
        projectDescription
      },
      scopeOfWork,
      bankDetails: {
        bankName,
        accountName,
        accountNumber,
        ifscCode,
        branchName
      },
      commercials,
      subtotal,
      gstEnabled,
      gstAmount,
      grandTotal,
      grandTotalInWords,
      paymentTerms,
      freeSupport,
      clientResponsibilities,
      exclusions,
      termsConditions: FIXED_TERMS
    };
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setSaveLoading(true);
    const data = compileData();

    try {
      if (initialId) {
        await quotationApi.updateQuotation(initialId, data);
      } else {
        await quotationApi.createQuotation(data);
      }
      router.push('/');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving quotation');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleOpenPreview = () => {
    const orgValid = organizationName.trim() !== '';
    const contactValid = contactPerson.trim() !== '';
    const descValid = projectDescription.trim() !== '' && projectDescription.toLowerCase().trim() !== 'nothing';
    
    if (!orgValid || !contactValid || !descValid) {
      alert('Please fill in all required fields (Organization Name, Contact Person, and Project Description) before previewing the PDF.');
      validateForm(); // Highlight the fields with error borders
      return;
    }
    if (!validateForm()) return;
    setPreviewOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
        <p className="text-slate-400 font-medium text-sm">Loading Quotation details...</p>
      </div>
    );
  }

  // Pre-compiled object for previewing
  const previewQuotationObj: IQuotation = {
    quotationNumber: initialId ? quotationNumber : 'SCT-YYYY-XXX (Autogenerated)',
    quotationDate,
    validTillDate,
    createdBy,
    clientInfo: { clientType, organizationName, contactPerson, mobileNumber, email, address },
    projectInfo: { projectType, projectDescription },
    scopeOfWork,
    bankDetails: {
      bankName,
      accountName,
      accountNumber,
      ifscCode,
      branchName
    },
    commercials,
    subtotal,
    gstEnabled,
    gstAmount,
    grandTotal,
    grandTotalInWords,
    paymentTerms,
    freeSupport,
    clientResponsibilities,
    exclusions,
    termsConditions: FIXED_TERMS
  };

  return (
    <div className="space-y-6">
      
      {/* Header action bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <button
            onClick={() => router.push('/')}
            className="flex items-center text-sm text-slate-400 hover:text-white mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Logo" className="h-10 w-auto object-contain rounded-md" />
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {initialId ? `Edit Quotation (${quotationNumber})` : 'Create New Quotation'}
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Fill out the sections below to configure and generate the professional quotation PDF.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleOpenPreview} className="cursor-pointer">
            <Eye size={16} className="mr-2" />
            Preview PDF
          </Button>
          <Button variant="primary" onClick={handleSave} loading={saveLoading} className="cursor-pointer">
            <Save size={16} className="mr-2" />
            {initialId ? 'Update Quotation' : 'Save & Close'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: MAIN FIELDS (2 cols on large screen) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <span className="flex items-center justify-center bg-primary/20 text-primary h-6 w-6 rounded-full text-xs font-bold">1</span>
                General Configuration
              </CardTitle>
              <CardDescription>Setup core documentation variables.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Created By (Author)"
                id="createdBy"
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
                error={errors.createdBy}
                placeholder="Author Name"
              />
              <Input
                label="Quotation Date"
                type="date"
                value={quotationDate}
                onChange={(e) => setQuotationDate(e.target.value)}
              />
              <Input
                label="Valid Till Date"
                type="date"
                value={validTillDate}
                onChange={(e) => setValidTillDate(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Section 2: Client Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <span className="flex items-center justify-center bg-primary/20 text-primary h-6 w-6 rounded-full text-xs font-bold">2</span>
                Client Information
              </CardTitle>
              <CardDescription>Provide details about the target organization.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Client Type"
                  options={CLIENT_TYPES}
                  value={clientType}
                  onChange={(e) => setClientType(e.target.value as any)}
                />
                <Input
                  label="Organization Name"
                  id="organizationName"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  error={errors.organizationName}
                  placeholder="e.g. Renvora College"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Contact Person"
                  id="contactPerson"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  error={errors.contactPerson}
                  placeholder="Contact Person Name"
                />
                <Input
                  label="Mobile Number"
                  id="mobileNumber"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  error={errors.mobileNumber}
                  placeholder="e.g. +91 98765 43210"
                />
                <Input
                  label="Email Address"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  placeholder="client@org.com"
                />
              </div>

              <Textarea
                label="Billing/Correspondence Address"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                error={errors.address}
                placeholder="Full postal address..."
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Section 3: Project Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <span className="flex items-center justify-center bg-primary/20 text-primary h-6 w-6 rounded-full text-xs font-bold">3</span>
                Project Information
              </CardTitle>
              <CardDescription>Describe the engineering project.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="Project Type"
                options={PROJECT_TYPES}
                value={projectType}
                onChange={(e) => setProjectType(e.target.value as any)}
              />
              <Textarea
                label="Detailed Project Description"
                id="projectDescription"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                error={errors.projectDescription}
                placeholder="Write a summary of the client's needs, proposed solution, and overall project architectural framework..."
                rows={5}
              />
            </CardContent>
          </Card>

          {/* Section 4: Commercials Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="flex items-center justify-center bg-primary/20 text-primary h-6 w-6 rounded-full text-xs font-bold">4</span>
                  Commercials Table
                </CardTitle>
                <CardDescription>Configure itemized billing estimates.</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={handleAddCommercialRow} className="cursor-pointer">
                <Plus size={14} className="mr-1" /> Add Item
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                      <th className="py-3 pr-4 text-left">Description</th>
                      <th className="py-3 px-4 text-center w-20">Qty</th>
                      <th className="py-3 px-4 text-right w-36">Price (₹)</th>
                      <th className="py-3 px-4 text-right w-36">Total (₹)</th>
                      <th className="py-3 pl-4 text-center w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {commercials.map((row, i) => (
                      <tr key={i} className="border-b border-slate-800/60 hover:bg-slate-900/10">
                        <td className="py-3 pr-4 vertical-align-top">
                          <input
                            type="text"
                            id={`row-${i}-desc`}
                            value={row.description}
                            onChange={(e) => handleCommercialChange(i, 'description', e.target.value)}
                            placeholder="e.g. Responsive Frontend Design & Integration"
                            className={`w-full bg-slate-900 border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary ${
                              errors[`row-${i}-desc`] ? 'border-destructive' : 'border-slate-700'
                            }`}
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="number"
                            id={`row-${i}-qty`}
                            min="1"
                            value={row.quantity}
                            onChange={(e) => handleCommercialChange(i, 'quantity', e.target.value)}
                            className={`w-full bg-slate-900 border rounded-lg px-2 py-1.5 text-xs text-center text-foreground focus:outline-none focus:ring-1 focus:ring-primary ${
                              errors[`row-${i}-qty`] ? 'border-destructive' : 'border-slate-700'
                            }`}
                          />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <input
                            type="number"
                            id={`row-${i}-price`}
                            min="0"
                            value={row.price}
                            onChange={(e) => handleCommercialChange(i, 'price', e.target.value)}
                            className={`w-full bg-slate-900 border rounded-lg px-3 py-1.5 text-xs text-right text-foreground focus:outline-none focus:ring-1 focus:ring-primary ${
                              errors[`row-${i}-price`] ? 'border-destructive' : 'border-slate-700'
                            }`}
                          />
                        </td>
                        <td className="py-3 px-4 text-right text-xs font-bold text-white pr-6">
                          {formatCurrency(row.quantity * row.price).replace('INR', '').trim()}
                        </td>
                        <td className="py-3 pl-4 text-center">
                          <button
                            onClick={() => handleRemoveCommercialRow(i)}
                            disabled={commercials.length === 1}
                            className="text-slate-500 hover:text-destructive disabled:opacity-30 p-1 cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Summary */}
              <div className="flex flex-col items-end pt-4 space-y-2 border-t border-slate-800">
                <div className="w-80 space-y-1.5 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-white">{formatCurrency(subtotal)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={gstEnabled}
                        onChange={(e) => setGstEnabled(e.target.checked)}
                        className="mr-2 h-3.5 w-3.5 rounded bg-slate-900 border-slate-700 accent-primary"
                      />
                      Add CGST + SGST (18%):
                    </label>
                    <span className={`font-semibold ${gstEnabled ? 'text-white' : 'text-slate-600 line-through'}`}>
                      {formatCurrency(gstAmount)}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-bold border-t border-slate-800 pt-2 text-white">
                    <span>Grand Total:</span>
                    <span className="text-primary">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>

                <div className="w-full text-right bg-slate-900/40 p-3 rounded-lg border border-slate-800/80 mt-2">
                  <span className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Amount in words:</span>
                  <span className="text-xs font-bold text-amber-500">{grandTotalInWords}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Bank Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <span className="flex items-center justify-center bg-primary/20 text-primary h-6 w-6 rounded-full text-xs font-bold">5</span>
                Bank Details
              </CardTitle>
              <CardDescription>Specify bank account information for payments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Bank Name"
                  id="bankName"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. ICICI Bank"
                />
                <Input
                  label="Account Name (Beneficiary)"
                  id="accountName"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g. Renvora Technologies Private Limited"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Account Number"
                  id="accountNumber"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. 123456789012"
                />
                <Input
                  label="IFSC Code"
                  id="ifscCode"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  placeholder="e.g. ICIC0001234"
                />
                <Input
                  label="Branch Name"
                  id="branchName"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="e.g. Mumbai"
                />
              </div>
            </CardContent>
          </Card>

        </div>

        {/* RIGHT COLUMN: CHECKLISTS & FIXED TERMS */}
        <div className="space-y-6">
          
          {/* Section 5: Scope Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                Scope of Work
              </CardTitle>
              <CardDescription>Select included architectural scopes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-[350px] overflow-y-auto space-y-3 pr-2">
                {Object.entries(DEFAULT_SCOPE_ITEMS).map(([category, items]) => (
                  <div key={category} className="space-y-1.5">
                    <span className="block text-[10px] font-bold text-primary uppercase tracking-wider">{category}</span>
                    <div className="grid grid-cols-1 gap-1.5 pl-1">
                      {items.map((item) => (
                        <div key={item} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`scope-${item}`}
                            checked={scopeOfWork.includes(item)}
                            onChange={() => handleToggleScope(item)}
                            className="h-3.5 w-3.5 bg-slate-900 border-slate-700 rounded accent-primary cursor-pointer"
                          />
                          <label htmlFor={`scope-${item}`} className="text-xs text-slate-300 hover:text-white cursor-pointer select-none">
                            {item}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {/* Render any added custom scope items that are not in defaults */}
                {scopeOfWork.filter(s => !Object.values(DEFAULT_SCOPE_ITEMS).flat().includes(s)).map((customS, idx) => (
                  <div key={idx} className="flex items-center space-x-2 bg-slate-800/30 p-1.5 rounded border border-slate-850">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => handleToggleScope(customS)}
                      className="h-3.5 w-3.5 bg-slate-900 border-slate-700 rounded accent-primary cursor-pointer"
                    />
                    <span className="text-xs text-amber-500 font-medium flex-1 truncate">{customS}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleScope(customS)}
                      className="text-slate-500 hover:text-white text-xs px-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Custom Scope Input */}
              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  placeholder="Custom Scope Item..."
                  value={customScope}
                  onChange={(e) => setCustomScope(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomScope(); } }}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none"
                />
                <Button size="sm" variant="secondary" onClick={handleAddCustomScope} className="cursor-pointer">Add</Button>
              </div>
            </CardContent>
          </Card>

          {/* Deliverables section removed */}

          {/* Section 7a: Payment Schedule */}
          <Card>
            <CardHeader>
              <div className="mb-1">
                <span className="inline-block text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded uppercase tracking-wider">Payment</span>
              </div>
              <CardTitle className="text-base">Payment Schedule</CardTitle>
              <CardDescription>Configure project payment milestones.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="Payment Terms Option"
                options={[
                  { value: '50-50', label: '50% Advance Payment / 50% Remaining' },
                  { value: '100', label: '100% Advance Payment' },
                  { value: 'custom', label: 'Custom / Other Milestones' }
                ]}
                value={paymentOption}
                onChange={(e) => {
                  const opt = e.target.value as any;
                  setPaymentOption(opt);
                  if (opt === '50-50') {
                    setPaymentTerms(['50% Advance Payment', '50% Remaining Payment']);
                  } else if (opt === '100') {
                    setPaymentTerms(['100% Advance Payment']);
                  }
                }}
              />

              {paymentOption === 'custom' ? (
                <>
                  <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
                    {paymentTerms.map((term, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-900/60 p-2 rounded border border-slate-800 text-xs text-slate-300">
                        <span className="truncate flex-1">{term}</span>
                        <button onClick={() => handleRemovePaymentTerm(i)} className="text-slate-500 hover:text-destructive ml-2 cursor-pointer">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add milestone (e.g. 50% on start)"
                      value={customPayment}
                      onChange={(e) => setCustomPayment(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomPayment(); } }}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                    />
                    <Button size="sm" variant="secondary" onClick={handleAddCustomPayment} className="cursor-pointer">Add</Button>
                  </div>
                </>
              ) : (
                <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/80">
                  <span className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Active Milestones:</span>
                  <div className="space-y-1">
                    {paymentTerms.map((term, i) => (
                      <div key={i} className="text-xs text-slate-300">• {term}</div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 7b: Support Framework */}
          <Card>
            <CardHeader>
              <div className="mb-1">
                <span className="inline-block text-[9px] font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded uppercase tracking-wider">Support</span>
              </div>
              <CardTitle className="text-base">Support Framework</CardTitle>
              <CardDescription>Define terms for post-launch support.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="Support Period Option"
                options={[
                  { value: '45', label: '45 Days Free Technical Support' },
                  { value: '90', label: '90 Days Free Technical Support' },
                  { value: 'custom', label: 'Custom / Other Support Plan' }
                ]}
                value={supportOption}
                onChange={(e) => {
                  const opt = e.target.value as any;
                  setSupportOption(opt);
                  if (opt === '45') {
                    setFreeSupport(['45 Days Free Technical Support', 'Minor Content Updates Included']);
                  } else if (opt === '90') {
                    setFreeSupport(['90 Days Free Technical Support', 'Minor Content Updates Included']);
                  }
                }}
              />

              {supportOption === 'custom' ? (
                <>
                  <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
                    {freeSupport.map((term, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-900/60 p-2 rounded border border-slate-800 text-xs text-slate-300">
                        <span className="truncate flex-1">{term}</span>
                        <button onClick={() => handleRemoveSupportTerm(i)} className="text-slate-500 hover:text-destructive ml-2 cursor-pointer">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add support item (e.g. 90 Days SLA)"
                      value={customSupport}
                      onChange={(e) => setCustomSupport(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomSupport(); } }}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                    />
                    <Button size="sm" variant="secondary" onClick={handleAddCustomSupport} className="cursor-pointer">Add</Button>
                  </div>
                </>
              ) : (
                <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/80">
                  <span className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Active Support Plan:</span>
                  <div className="space-y-1">
                    {freeSupport.map((term, i) => (
                      <div key={i} className="text-xs text-slate-300">• {term}</div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 8a: Client Responsibilities */}
          <Card>
            <CardHeader>
              <div className="mb-1">
                <span className="inline-block text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-wider">Responsibilities</span>
              </div>
              <CardTitle className="text-base">Client Responsibilities</CardTitle>
              <CardDescription>List items client must provide.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-[200px] overflow-y-auto space-y-1.5 pr-2">
                {DEFAULT_CLIENT_RESPONSIBILITIES.map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`resp-${item}`}
                      checked={clientResponsibilities.includes(item)}
                      onChange={() => handleToggleResponsibility(item)}
                      className="h-3.5 w-3.5 bg-slate-900 border-slate-700 rounded accent-emerald-500 cursor-pointer"
                    />
                    <label htmlFor={`resp-${item}`} className="text-xs text-slate-300 hover:text-white cursor-pointer select-none">
                      {item}
                    </label>
                  </div>
                ))}

                {clientResponsibilities.filter(r => !DEFAULT_CLIENT_RESPONSIBILITIES.includes(r)).map((customR, idx) => (
                  <div key={idx} className="flex items-center space-x-2 bg-slate-800/30 p-1.5 rounded border border-slate-850">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => handleToggleResponsibility(customR)}
                      className="h-3.5 w-3.5 bg-slate-900 border-slate-700 rounded accent-emerald-500 cursor-pointer"
                    />
                    <span className="text-xs text-amber-500 font-medium flex-1 truncate">{customR}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleResponsibility(customR)}
                      className="text-slate-500 hover:text-white text-xs px-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  placeholder="Custom Responsibility..."
                  value={customResponsibility}
                  onChange={(e) => setCustomResponsibility(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomResponsibility(); } }}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                />
                <Button size="sm" variant="secondary" onClick={handleAddCustomResponsibility} className="cursor-pointer">Add</Button>
              </div>
            </CardContent>
          </Card>

          {/* Section 8b: Project Exclusions */}
          <Card>
            <CardHeader>
              <div className="mb-1">
                <span className="inline-block text-[9px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded uppercase tracking-wider">Exclusions</span>
              </div>
              <CardTitle className="text-base">Project Exclusions</CardTitle>
              <CardDescription>Specify items not covered.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-[200px] overflow-y-auto space-y-1.5 pr-2">
                {DEFAULT_EXCLUSIONS.map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`excl-${item}`}
                      checked={exclusions.includes(item)}
                      onChange={() => handleToggleExclusion(item)}
                      className="h-3.5 w-3.5 bg-slate-900 border-slate-700 rounded accent-red-500 cursor-pointer"
                    />
                    <label htmlFor={`excl-${item}`} className="text-xs text-slate-300 hover:text-white cursor-pointer select-none">
                      {item}
                    </label>
                  </div>
                ))}

                {exclusions.filter(e => !DEFAULT_EXCLUSIONS.includes(e)).map((customE, idx) => (
                  <div key={idx} className="flex items-center space-x-2 bg-slate-800/30 p-1.5 rounded border border-slate-850">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => handleToggleExclusion(customE)}
                      className="h-3.5 w-3.5 bg-slate-900 border-slate-700 rounded accent-red-500 cursor-pointer"
                    />
                    <span className="text-xs text-amber-500 font-medium flex-1 truncate">{customE}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleExclusion(customE)}
                      className="text-slate-500 hover:text-white text-xs px-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  placeholder="Custom Exclusion..."
                  value={customExclusion}
                  onChange={(e) => setCustomExclusion(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomExclusion(); } }}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                />
                <Button size="sm" variant="secondary" onClick={handleAddCustomExclusion} className="cursor-pointer">Add</Button>
              </div>
            </CardContent>
          </Card>

          {/* Section 9: Website Handover Terms and Conditions */}
          <Card className="border-slate-800 bg-slate-900/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-1.5 text-slate-400">
                <HelpCircle size={16} /> Website Handover Terms & Conditions
              </CardTitle>
              <CardDescription>Required contract terms (non-editable).</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Increase max height and ensure scrolling works cleanly (fixes Bug 8) */}
              <ol className="list-decimal list-inside space-y-2 text-[10px] text-slate-400 pr-1 max-h-[350px] overflow-y-auto">
                {FIXED_TERMS.map((term, i) => (
                  <li key={i} className="pl-1 text-justify">{term}</li>
                ))}
              </ol>
            </CardContent>
          </Card>

        </div>

      </div>

      {/* Real-time PDF preview dialog */}
      {previewOpen && (
        <PDFPreviewDialog
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          quotation={previewQuotationObj}
        />
      )}

    </div>
  );
}
