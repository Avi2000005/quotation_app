'use client';

import React from 'react';
import QuotationForm from '@/components/QuotationForm';

interface EditQuotationPageProps {
  params: Promise<{ id: string }>;
}

export default function EditQuotationPage({ params }: EditQuotationPageProps) {
  const resolvedParams = React.use(params);
  return <QuotationForm initialId={resolvedParams.id} />;
}
