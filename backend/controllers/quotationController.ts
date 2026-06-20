import { Request, Response } from 'express';
import { Quotation } from '../models/Quotation.js';

// Auto-generate the next quotation number
const generateNextQuotationNumber = async (date: Date): Promise<string> => {
  const year = date.getFullYear();
  const prefix = `SCT-${year}-`;
  
  // Find the last quotation created in this calendar year
  const lastQuotation = await Quotation.findOne({
    quotationNumber: { $regex: `^SCT-${year}-` }
  }).sort({ quotationNumber: -1 });

  let nextSeq = 1;
  if (lastQuotation) {
    const parts = lastQuotation.quotationNumber.split('-');
    if (parts.length === 3) {
      const lastSeqNum = parseInt(parts[2], 10);
      if (!isNaN(lastSeqNum)) {
        nextSeq = lastSeqNum + 1;
      }
    }
  }

  const paddedSeq = nextSeq.toString().padStart(3, '0');
  return `${prefix}${paddedSeq}`;
};

// Get all quotations (with search)
export const getQuotations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;
    let query = {};
    
    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      query = {
        $or: [
          { quotationNumber: searchRegex },
          { 'clientInfo.organizationName': searchRegex },
          { 'clientInfo.contactPerson': searchRegex },
          { 'projectInfo.projectType': searchRegex }
        ]
      };
    }

    const quotations = await Quotation.find(query).sort({ createdAt: -1 });
    res.status(200).json(quotations);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving quotations', error: error.message });
  }
};

// Get quotation by ID
export const getQuotationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) {
      res.status(404).json({ message: 'Quotation not found' });
      return;
    }
    res.status(200).json(quotation);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving quotation', error: error.message });
  }
};

// Create new quotation
export const createQuotation = async (req: Request, res: Response): Promise<void> => {
  try {
    const quotationData = req.body;
    
    // Auto-generate fields
    const quotationDate = quotationData.quotationDate ? new Date(quotationData.quotationDate) : new Date();
    const quotationNumber = await generateNextQuotationNumber(quotationDate);
    
    // Default validTillDate: 15 days from quotationDate if not provided
    const validTillDate = quotationData.validTillDate 
      ? new Date(quotationData.validTillDate) 
      : new Date(quotationDate.getTime() + 15 * 24 * 60 * 60 * 1000);

    const newQuotation = new Quotation({
      ...quotationData,
      quotationNumber,
      quotationDate,
      validTillDate
    });

    const savedQuotation = await newQuotation.save();
    res.status(201).json(savedQuotation);
  } catch (error: any) {
    console.error('Error in createQuotation:', error);
    res.status(400).json({ message: 'Error creating quotation', error: error.message });
  }
};

// Update quotation
export const updateQuotation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Make sure we don't accidentally update the quotation number format if year changed,
    // but if the date is changed we might keep the same number or let it update.
    // Usually, keeping the original quotation number is preferred for existing quotations unless explicitly modified.
    delete updateData.quotationNumber; 

    const updatedQuotation = await Quotation.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedQuotation) {
      res.status(404).json({ message: 'Quotation not found' });
      return;
    }

    res.status(200).json(updatedQuotation);
  } catch (error: any) {
    console.error('Error in updateQuotation:', error);
    res.status(400).json({ message: 'Error updating quotation', error: error.message });
  }
};

// Delete quotation
export const deleteQuotation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedQuotation = await Quotation.findByIdAndDelete(id);
    
    if (!deletedQuotation) {
      res.status(404).json({ message: 'Quotation not found' });
      return;
    }

    res.status(200).json({ message: 'Quotation deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting quotation', error: error.message });
  }
};

// Duplicate quotation
export const duplicateQuotation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const original = await Quotation.findById(id);
    
    if (!original) {
      res.status(404).json({ message: 'Original quotation not found' });
      return;
    }

    const now = new Date();
    // Compute next number
    const newQuotationNumber = await generateNextQuotationNumber(now);
    
    // Calculate validity based on original duration or default 15 days
    const origDuration = original.validTillDate.getTime() - original.quotationDate.getTime();
    const newValidTill = new Date(now.getTime() + (origDuration > 0 ? origDuration : 15 * 24 * 60 * 60 * 1000));

    // Convert document to object, remove Mongoose-specific tracking fields
    const rawData = original.toObject() as any;
    delete rawData._id;
    delete rawData.createdAt;
    delete rawData.updatedAt;
    delete rawData.__v;

    const duplicated = new Quotation({
      ...rawData,
      quotationNumber: newQuotationNumber,
      quotationDate: now,
      validTillDate: newValidTill
    });

    const saved = await duplicated.save();
    res.status(201).json(saved);
  } catch (error: any) {
    res.status(400).json({ message: 'Error duplicating quotation', error: error.message });
  }
};
