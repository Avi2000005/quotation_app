import { Schema, model, Document } from 'mongoose';

export interface ICommercial {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export interface IQuotation extends Document {
  quotationNumber: string;
  quotationDate: Date;
  validTillDate: Date;
  createdBy: string;
  clientInfo: {
    clientType: 'College' | 'Coaching Class' | 'Hospital' | 'Restaurant' | 'Hotel' | 'NGO' | 'Business' | 'Other';
    organizationName: string;
    contactPerson: string;
    mobileNumber: string;
    email: string;
    address: string;
  };
  projectInfo: {
    projectType: 'Static Website' | 'Dynamic Website' | 'E-Commerce Website' | 'School Website' | 'College Website' | 'Coaching Website' | 'Hospital Website' | 'ERP Software' | 'Mobile App' | 'AI Chatbot' | 'Digital Marketing' | 'SEO Package' | 'Custom Software';
    projectDescription: string;
  };
  scopeOfWork: string[];
  commercials: ICommercial[];
  subtotal: number;
  gstEnabled: boolean;
  gstAmount: number;
  grandTotal: number;
  grandTotalInWords: string;
  paymentTerms: string[];
  freeSupport: string[];
  clientResponsibilities: string[];
  exclusions: string[];
  termsConditions: string[];
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    branchName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CommercialSchema = new Schema<ICommercial>({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true }
});

const QuotationSchema = new Schema<IQuotation>({
  quotationNumber: { type: String, required: true, unique: true },
  quotationDate: { type: Date, required: true },
  validTillDate: { type: Date, required: true },
  createdBy: { type: String, required: true },
  clientInfo: {
    clientType: {
      type: String,
      enum: ['College', 'Coaching Class', 'Hospital', 'Restaurant', 'Hotel', 'NGO', 'Business', 'Other'],
      required: true
    },
    organizationName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true }
  },
  projectInfo: {
    projectType: {
      type: String,
      enum: [
        'Static',
        'Dynamic',
        'E-Commerce',
        'ERP',
        'Mobile App',
        'AI Chatbot',
        'Digital Marketing',
        'SEO Package',
        'Custom Software'
      ],
      required: true
    },
    projectDescription: { type: String, required: true }
  },
  scopeOfWork: [{ type: String }],
  commercials: [CommercialSchema],
  subtotal: { type: Number, required: true },
  gstEnabled: { type: Boolean, default: true },
  gstAmount: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  grandTotalInWords: { type: String, required: true },
  paymentTerms: [{ type: String }],
  freeSupport: [{ type: String }],
  clientResponsibilities: [{ type: String }],
  exclusions: [{ type: String }],
  termsConditions: [{ type: String }],
  bankDetails: {
    bankName: { type: String },
    accountName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    branchName: { type: String }
  }
}, {
  timestamps: true
});

export const Quotation = model<IQuotation>('Quotation', QuotationSchema);
