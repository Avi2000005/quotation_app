import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Indian Rupees format: e.g. ₹15,998
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

// Date formatter: e.g. 19 Jun 2026
export function formatDate(dateStr: string | Date): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

// Convert numbers to Indian English Words format (Lakhs, Crores)
export function numberToWords(num: number): string {
  // Round to nearest integer to avoid decimal issues in translation
  num = Math.round(num);
  if (num === 0) return 'Rupees Zero Only';

  const singleDigits = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teenDigits = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const doubleDigits = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertLessThanOneThousand = (n: number): string => {
    let str = '';
    if (n >= 100) {
      str += singleDigits[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 10 && n < 20) {
      str += teenDigits[n - 10] + ' ';
    } else if (n >= 20) {
      str += doubleDigits[Math.floor(n / 10)] + ' ';
      n %= 10;
      if (n > 0) {
        str += singleDigits[n] + ' ';
      }
    } else if (n > 0) {
      str += singleDigits[n] + ' ';
    }
    return str.trim();
  };

  let wordStr = '';

  // Crores (1,00,00,000)
  const crores = Math.floor(num / 10000000);
  if (crores > 0) {
    wordStr += convertLessThanOneThousand(crores) + ' Crore ';
    num %= 10000000;
  }

  // Lakhs (1,00,000)
  const lakhs = Math.floor(num / 100000);
  if (lakhs > 0) {
    wordStr += convertLessThanOneThousand(lakhs) + ' Lakh ';
    num %= 100000;
  }

  // Thousands (1,000)
  const thousands = Math.floor(num / 1000);
  if (thousands > 0) {
    wordStr += convertLessThanOneThousand(thousands) + ' Thousand ';
    num %= 1000;
  }

  // Hundreds, Tens & Ones
  if (num > 0) {
    wordStr += convertLessThanOneThousand(num);
  }

  // Capitalize properly and ensure correct format
  return `Rupees ${wordStr.replace(/\s+/g, ' ').trim()} Only`;
}
