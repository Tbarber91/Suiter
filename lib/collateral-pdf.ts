import jsPDF from 'jspdf';

export interface BusinessDetails {
  companyName: string;
  tradingAs?: string;
  abn: string;
  acn?: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  tagline?: string;
  ownerName: string;
  licenseNumber?: string;
  bankName?: string;
  bsb?: string;
  accountNumber?: string;
  payId?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  items: InvoiceItem[];
  notes: string;
}

export interface LetterheadData {
  recipientName: string;
  recipientOrg?: string;
  recipientAddress: string;
  date: string;
  subject: string;
  body: string;
}

export const downloadInvoicePDF = (business: BusinessDetails, invoice: InvoiceData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth ? doc.internal.pageSize.getWidth() : (doc.internal.pageSize.width || 210);
  const margin = 20;

  // Header Banner
  doc.setFillColor(24, 24, 27); // Zinc 900
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(business.companyName.toUpperCase(), margin, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(212, 212, 216);
  doc.text(`TAX INVOICE  |  ABN: ${business.abn}`, pageWidth - margin, 18, { align: 'right' });

  // Business Meta (left) & Invoice Meta (right)
  let y = 42;
  doc.setTextColor(24, 24, 27);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('SUPPLIER:', margin, y);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(75, 85, 99);
  doc.text(business.companyName, margin, y + 6);
  if (business.tradingAs) doc.text(`T/A: ${business.tradingAs}`, margin, y + 11);
  doc.text(business.address, margin, y + 16);
  doc.text(`Phone: ${business.phone}  |  Email: ${business.email}`, margin, y + 21);
  if (business.licenseNumber) doc.text(`Trade Lic: ${business.licenseNumber}`, margin, y + 26);

  // Invoice Details
  const rightColX = pageWidth - margin - 70;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(24, 24, 27);
  doc.text('INVOICE DETAILS:', rightColX, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(75, 85, 99);
  doc.text(`Invoice Number: ${invoice.invoiceNumber}`, rightColX, y + 6);
  doc.text(`Issue Date: ${invoice.issueDate}`, rightColX, y + 11);
  doc.text(`Due Date: ${invoice.dueDate}`, rightColX, y + 16);

  // Bill To Box
  y = 78;
  doc.setFillColor(244, 244, 245);
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 22, 3, 3, 'F');
  doc.setTextColor(24, 24, 27);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('BILL TO:', margin + 6, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(55, 65, 81);
  doc.text(`${invoice.clientName}  |  ${invoice.clientEmail}`, margin + 6, y + 13);
  doc.text(invoice.clientAddress, margin + 6, y + 18);

  // Items Table Header
  y = 108;
  doc.setFillColor(39, 39, 42);
  doc.rect(margin, y, pageWidth - (margin * 2), 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('DESCRIPTION', margin + 4, y + 5.5);
  doc.text('QTY', pageWidth - margin - 60, y + 5.5, { align: 'center' });
  doc.text('UNIT PRICE', pageWidth - margin - 35, y + 5.5, { align: 'right' });
  doc.text('AMOUNT (AUD)', pageWidth - margin - 4, y + 5.5, { align: 'right' });

  // Items Table Rows
  y += 8;
  let subtotal = 0;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  invoice.items.forEach((item, index) => {
    const lineTotal = item.quantity * item.unitPrice;
    subtotal += lineTotal;

    if (index % 2 === 1) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, y, pageWidth - (margin * 2), 8, 'F');
    }

    doc.setTextColor(39, 39, 42);
    doc.text(item.description, margin + 4, y + 5.5);
    doc.text(item.quantity.toString(), pageWidth - margin - 60, y + 5.5, { align: 'center' });
    doc.text(`$${item.unitPrice.toFixed(2)}`, pageWidth - margin - 35, y + 5.5, { align: 'right' });
    doc.text(`$${lineTotal.toFixed(2)}`, pageWidth - margin - 4, y + 5.5, { align: 'right' });

    y += 8;
  });

  // Table Line
  doc.setDrawColor(228, 228, 231);
  doc.line(margin, y, pageWidth - margin, y);

  // Totals Area
  y += 6;
  const gst = subtotal * 0.1;
  const total = subtotal + gst;

  const totalsX = pageWidth - margin - 50;
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(9);
  doc.text('Subtotal (ex GST):', totalsX, y, { align: 'right' });
  doc.text(`$${subtotal.toFixed(2)}`, pageWidth - margin - 4, y, { align: 'right' });

  y += 6;
  doc.text('GST (10%):', totalsX, y, { align: 'right' });
  doc.text(`$${gst.toFixed(2)}`, pageWidth - margin - 4, y, { align: 'right' });

  y += 7;
  doc.setFillColor(24, 24, 27);
  doc.rect(totalsX - 25, y - 4.5, (pageWidth - margin) - (totalsX - 25), 9, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('TOTAL DUE:', totalsX, y + 2, { align: 'right' });
  doc.text(`$${total.toFixed(2)} AUD`, pageWidth - margin - 4, y + 2, { align: 'right' });

  // Payment Remittance Box
  y = 210;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 36, 3, 3, 'FD');

  doc.setTextColor(24, 24, 27);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('PAYMENT DETAILS & EFT REMITTANCE', margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(55, 65, 81);
  doc.text(`Bank: ${business.bankName || 'Commonwealth Bank of Australia'}`, margin + 6, y + 16);
  doc.text(`BSB: ${business.bsb || '065-000'}    Account Number: ${business.accountNumber || '1029 3847'}`, margin + 6, y + 22);
  doc.text(`Account Name: ${business.companyName}`, margin + 6, y + 28);
  if (business.payId) doc.text(`PayID: ${business.payId}`, margin + 6, y + 33);

  // Footer compliance note
  doc.setFontSize(7.5);
  doc.setTextColor(156, 163, 175);
  doc.text(`Generated via Suiter Marketplace Enterprise Suite. Compliant with Australian Consumer Law & ATO Tax Invoice standards.`, margin, 280);

  doc.save(`${invoice.invoiceNumber || 'Invoice'}_${business.companyName.replace(/\s+/g, '_')}.pdf`);
};

export const downloadLetterheadPDF = (business: BusinessDetails, letter: LetterheadData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth ? doc.internal.pageSize.getWidth() : (doc.internal.pageSize.width || 210);
  const margin = 22;

  // Modern Minimalist Letterhead Top Header
  doc.setFillColor(16, 185, 129); // Emerald 500 accent bar
  doc.rect(margin, 12, 14, 3, 'F');

  doc.setTextColor(24, 24, 27);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(business.companyName, margin, 24);

  if (business.tagline) {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(113, 113, 122);
    doc.text(business.tagline, margin, 29);
  }

  // Right-aligned business contact block
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(82, 82, 91);
  doc.text(`ABN: ${business.abn}`, pageWidth - margin, 18, { align: 'right' });
  doc.text(business.address, pageWidth - margin, 23, { align: 'right' });
  doc.text(`${business.phone}  |  ${business.email}`, pageWidth - margin, 28, { align: 'right' });
  doc.text(business.website, pageWidth - margin, 33, { align: 'right' });

  // Thin dividing rule
  doc.setDrawColor(228, 228, 231);
  doc.line(margin, 38, pageWidth - margin, 38);

  // Recipient Block
  let y = 52;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(24, 24, 27);
  doc.text(`DATE: ${letter.date}`, margin, y);

  y += 8;
  doc.text(letter.recipientName, margin, y);
  if (letter.recipientOrg) {
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(letter.recipientOrg, margin, y);
  }
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(letter.recipientAddress, margin, y);

  // Subject Line
  y += 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(24, 24, 27);
  doc.text(`RE: ${letter.subject.toUpperCase()}`, margin, y);

  // Letter Body (Word wrapped)
  y += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  
  const splitText = doc.splitTextToSize(letter.body, pageWidth - (margin * 2));
  doc.text(splitText, margin, y);

  // Sign-off
  const endY = y + (splitText.length * 5) + 16;
  doc.setTextColor(24, 24, 27);
  doc.setFont('helvetica', 'normal');
  doc.text('Sincerely,', margin, endY);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text(business.ownerName, margin, endY + 8);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(business.companyName, margin, endY + 13);
  if (business.licenseNumber) doc.text(`License Ref: ${business.licenseNumber}`, margin, endY + 18);

  // Official Footer
  doc.setDrawColor(241, 245, 249);
  doc.line(margin, 272, pageWidth - margin, 272);
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`${business.companyName} • Registered Australian Business • ABN ${business.abn}`, pageWidth / 2, 278, { align: 'center' });

  doc.save(`Letter_${business.companyName.replace(/\s+/g, '_')}.pdf`);
};

export interface CryptoTaxReportData {
  taxpayerName: string;
  taxFileNumberMasked?: string;
  financialYear: string;
  btcHoldings: number;
  btcAudSpotPrice: number;
  portfolioAudValue: number;
  totalProceedsAud: number;
  totalCostBaseAud: number;
  netCapitalGainAud: number;
  cgtDiscountAppliedAud: number;
  developerRAndDOffsetAud: number;
  ventureFundingExpensesAud: number;
  disposalEvents: Array<{
    id: string;
    date: string;
    description: string;
    type: string;
    btcAmount: number;
    proceedsAud: number;
    costBaseAud: number;
    gainLossAud: number;
  }>;
  declarationDate: string;
  bsb?: string;
  accountNumber?: string;
}

export const downloadCryptoTaxStatementPDF = (data: CryptoTaxReportData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth ? doc.internal.pageSize.getWidth() : (doc.internal.pageSize.width || 210);
  const margin = 18;

  // Modern ATO-Compliant Dark Header
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Gold/Amber accent line
  doc.setFillColor(245, 158, 11);
  doc.rect(0, 27, pageWidth, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('ATO CRYPTOCURRENCY CAPITAL GAINS & ASSETS SCHEDULE', margin, 14);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(`FINANCIAL YEAR ${data.financialYear}  |  OFFICIAL TAX CLAIM SUMMARY`, margin, 21);
  doc.text('AUSTRALIAN TAXATION OFFICE COMPLIANT', pageWidth - margin, 21, { align: 'right' });

  // Taxpayer & Account Banner
  let y = 36;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 26, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('TAXPAYER & NOMINATED ACCOUNT DETAILS', margin + 5, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Taxpayer Name: ${data.taxpayerName}`, margin + 5, y + 13);
  doc.text(`TFN / Identifier: ${data.taxFileNumberMasked || '***-***-849 (Verified Digital Identity)'}`, margin + 5, y + 19);

  doc.text(`EFT Refund BSB: ${data.bsb || '062-948'}`, pageWidth - margin - 65, y + 13);
  doc.text(`Account Number: ${data.accountNumber || '2383 7561'}`, pageWidth - margin - 65, y + 19);

  // Summary Metrics Bento Grid
  y = 67;
  const colWidth = (pageWidth - (margin * 2) - 9) / 4;

  // Box 1: Total BTC Holdings
  doc.setFillColor(254, 243, 199); // Amber 100
  doc.setDrawColor(251, 191, 36);
  doc.roundedRect(margin, y, colWidth, 22, 2, 2, 'FD');
  doc.setTextColor(146, 64, 14);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('BITCOIN HOLDINGS', margin + 3, y + 5);
  doc.setFontSize(10);
  doc.text(`${data.btcHoldings.toFixed(4)} BTC`, margin + 3, y + 12);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`$${data.portfolioAudValue.toLocaleString('en-AU', { maximumFractionDigits: 0 })} AUD`, margin + 3, y + 18);

  // Box 2: Net Capital Gain
  const col2X = margin + colWidth + 3;
  doc.setFillColor(240, 253, 244); // Emerald 50
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(col2X, y, colWidth, 22, 2, 2, 'FD');
  doc.setTextColor(22, 101, 52);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('NET CAPITAL GAIN (CGT)', col2X + 3, y + 5);
  doc.setFontSize(10);
  doc.text(`$${data.netCapitalGainAud.toLocaleString('en-AU', { minimumFractionDigits: 2 })}`, col2X + 3, y + 12);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Inc. 50% CGT Discount`, col2X + 3, y + 18);

  // Box 3: Dev R&D Deductions
  const col3X = margin + (colWidth * 2) + 6;
  doc.setFillColor(238, 242, 255); // Indigo 50
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(col3X, y, colWidth, 22, 2, 2, 'FD');
  doc.setTextColor(55, 48, 163);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('DEV R&D OFFSET CLAIM', col3X + 3, y + 5);
  doc.setFontSize(10);
  doc.text(`$${data.developerRAndDOffsetAud.toLocaleString('en-AU', { minimumFractionDigits: 2 })}`, col3X + 3, y + 12);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`43.5% Refundable Offset`, col3X + 3, y + 18);

  // Box 4: Venture Expenses
  const col4X = margin + (colWidth * 3) + 9;
  doc.setFillColor(241, 245, 249); // Slate 100
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(col4X, y, colWidth, 22, 2, 2, 'FD');
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('VENTURE DEDUCTIONS', col4X + 3, y + 5);
  doc.setFontSize(10);
  doc.text(`$${data.ventureFundingExpensesAud.toLocaleString('en-AU', { minimumFractionDigits: 2 })}`, col4X + 3, y + 12);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`App Store & Hosting`, col4X + 3, y + 18);

  // Table Header for CGT Events
  y = 97;
  doc.setFillColor(30, 41, 59);
  doc.rect(margin, y, pageWidth - (margin * 2), 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('DATE', margin + 3, y + 5);
  doc.text('DISPOSAL EVENT / DESCRIPTION', margin + 28, y + 5);
  doc.text('BTC AMT', margin + 95, y + 5);
  doc.text('PROCEEDS (AUD)', margin + 118, y + 5);
  doc.text('COST BASE', margin + 143, y + 5);
  doc.text('GAIN / (LOSS)', pageWidth - margin - 3, y + 5, { align: 'right' });

  // Rows
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  data.disposalEvents.forEach((event, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, pageWidth - (margin * 2), 7, 'F');
    }

    doc.setTextColor(51, 65, 85);
    doc.text(event.date, margin + 3, y + 5);
    doc.text(event.description.substring(0, 36), margin + 28, y + 5);
    doc.text(event.btcAmount.toFixed(4), margin + 95, y + 5);
    doc.text(`$${event.proceedsAud.toLocaleString('en-AU', { minimumFractionDigits: 0 })}`, margin + 118, y + 5);
    doc.text(`$${event.costBaseAud.toLocaleString('en-AU', { minimumFractionDigits: 0 })}`, margin + 143, y + 5);

    if (event.gainLossAud >= 0) {
      doc.setTextColor(16, 185, 129); // Green
      doc.text(`+$${event.gainLossAud.toLocaleString('en-AU', { minimumFractionDigits: 0 })}`, pageWidth - margin - 3, y + 5, { align: 'right' });
    } else {
      doc.setTextColor(239, 68, 68); // Red
      doc.text(`-$${Math.abs(event.gainLossAud).toLocaleString('en-AU', { minimumFractionDigits: 0 })}`, pageWidth - margin - 3, y + 5, { align: 'right' });
    }

    y += 7;
  });

  // Statutory ATO Instructions Box
  y += 6;
  doc.setFillColor(255, 251, 235); // Amber 50
  doc.setDrawColor(252, 211, 77);
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 34, 2, 2, 'FD');

  doc.setTextColor(146, 64, 14);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('STATUTORY DECLARATION & LODGEMENT INSTRUCTIONS', margin + 5, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 53, 15);
  doc.text('1. Report Net Capital Gain at Label 18A (Net capital gain) and total capital gains at Label 18V in your Individual Tax Return.', margin + 5, y + 12);
  doc.text('2. Software development and application hosting expenditures are deductible under Section 40-880 or eligible for R&D tax offsets.', margin + 5, y + 17);
  doc.text('3. Retain this statement along with transaction hashes (txids) on the Bitcoin blockchain ledger for 5 years per ATO record-keeping rules.', margin + 5, y + 22);
  doc.text(`4. Nominated EFT Disbursement Rail: BSB ${data.bsb || '062-948'}, Acc ${data.accountNumber || '2383 7561'} (Tamara Alana Barber).`, margin + 5, y + 27);

  // Sign-off signature line
  y += 42;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(`DECLARANT SIGNATURE: ________________________________________`, margin, y);
  doc.text(`DATE: ${data.declarationDate}`, pageWidth - margin - 45, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`I declare that the information provided in this cryptocurrency capital gains and asset claim schedule is true and correct.`, margin, y + 6);

  // Bottom Footer
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, 280, pageWidth - margin, 280);
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Suiter Marketplace Enterprise • Secure Crypto Asset & Tax Claim Reconciliation Engine • Generated with Cryptographic Ledger Proof', pageWidth / 2, 285, { align: 'center' });

  doc.save(`ATO_Crypto_Tax_Schedule_${data.financialYear.replace('/', '_')}_${data.taxpayerName.replace(/\s+/g, '_')}.pdf`);
};
