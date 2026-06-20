export interface ICommercial {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export interface IQuotation {
  _id?: string;
  quotationNumber: string;
  quotationDate: string; // ISO string from backend
  validTillDate: string; // ISO string from backend
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
  createdAt?: string;
  updatedAt?: string;
}
