'use client';

import { jsPDF } from 'jspdf';
import { GovernanceItem } from './governance-data';

/**
 * Helper to split and render text blocks cleanly with automatic page breaks
 */
function renderTextBlock(
  doc: jsPDF,
  text: string,
  startX: number,
  startY: number,
  maxWidth: number,
  lineHeight = 5
): number {
  const lines = doc.splitTextToSize(text, maxWidth);
  let currentY = startY;

  for (const line of lines) {
    if (currentY > 270) {
      doc.addPage();
      currentY = 25;
    }
    doc.text(line, startX, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

/**
 * Generates an executive compliance PDF summary for an individual Governance document.
 */
export function generateGovernancePDF(item: GovernanceItem) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  // --- Top Decorative Header ---
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 24, 'F');

  doc.setFillColor(16, 185, 129); // emerald-500 accent line
  doc.rect(0, 24, pageWidth, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('SUITER ENTERPRISE MARKETPLACE', margin, 12);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('GOVERNANCE, PRIVACY & REGULATORY COMPLIANCE DOSSIER', margin, 18);

  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text('ADELAIDE, SA • KAURNA COUNTRY', pageWidth - margin - 50, 15);

  y = 34;

  // --- Document Identifier & Badge Section ---
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`REFERENCE CODE:`, margin + 4, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(item.code, margin + 35, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.text(`JURISDICTION:`, margin + 4, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.text(item.jurisdiction, margin + 35, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.text(`AUTHORITY:`, margin + 4, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.text(item.authority, margin + 35, y + 18);

  // Right side badges
  doc.setFillColor(236, 253, 245); // emerald-50
  doc.setDrawColor(167, 243, 208); // emerald-200
  doc.roundedRect(pageWidth - margin - 52, y + 4, 48, 6, 1, 1, 'FD');
  doc.setTextColor(4, 120, 87); // emerald-700
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text(`STATUS: ${item.status}`, pageWidth - margin - 50, y + 8);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(`Last Audited: ${item.lastAudited}`, pageWidth - margin - 50, y + 15);
  doc.text(`Compliance Rating: ${item.complianceScore}% Verified`, pageWidth - margin - 50, y + 19);

  y += 28;

  // --- Document Title ---
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(item.title, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 7 + 2;

  // Category & Effective Date
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Category: ${item.categoryLabel}  |  Effective: ${item.effectiveDate}`, margin, y);
  y += 6;

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // --- 1. Executive Summary ---
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('1. LEGISLATIVE & REGULATORY OVERVIEW', margin, y);
  y += 5;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  y = renderTextBlock(doc, item.summary, margin, y, contentWidth, 4.5);
  y += 4;

  // --- 2. Key Statutory Obligations ---
  if (y > 240) { doc.addPage(); y = 25; }
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('2. MANDATED STATUTORY OBLIGATIONS', margin, y);
  y += 5;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  for (const obligation of item.keyObligations) {
    if (y > 265) { doc.addPage(); y = 25; }
    doc.setFillColor(15, 23, 42);
    doc.circle(margin + 2, y - 1, 0.8, 'F');
    y = renderTextBlock(doc, obligation, margin + 6, y, contentWidth - 6, 4.2);
    y += 1.5;
  }
  y += 3;

  // --- 3. Platform Code of Practice & Implementation ---
  if (y > 240) { doc.addPage(); y = 25; }
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('3. SUITER MARKETPLACE CODE OF PRACTICE', margin, y);
  y += 5;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  for (const cop of item.codeOfPractice) {
    if (y > 265) { doc.addPage(); y = 25; }
    doc.setFillColor(16, 185, 129);
    doc.circle(margin + 2, y - 1, 0.8, 'F');
    y = renderTextBlock(doc, cop, margin + 6, y, contentWidth - 6, 4.2);
    y += 1.5;
  }
  y += 3;

  // --- 4. Architectural & Platform Controls ---
  if (y > 240) { doc.addPage(); y = 25; }
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('4. TECHNICAL & ARCHITECTURAL SAFEGUARDS', margin, y);
  y += 5;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  for (const ctrl of item.platformControls) {
    if (y > 265) { doc.addPage(); y = 25; }
    doc.setFillColor(79, 70, 229); // indigo
    doc.circle(margin + 2, y - 1, 0.8, 'F');
    y = renderTextBlock(doc, ctrl, margin + 6, y, contentWidth - 6, 4.2);
    y += 1.5;
  }
  y += 3;

  // --- 5. Penalties & Enforcement ---
  if (y > 240) { doc.addPage(); y = 25; }
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('5. REGULATORY ENFORCEMENT & PENALTY THRESHOLDS', margin, y);
  y += 5;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  y = renderTextBlock(doc, item.penaltiesAndEnforcement, margin, y, contentWidth, 4.2);
  y += 5;

  // --- 6. Attestation Box ---
  if (y > 235) { doc.addPage(); y = 25; }
  doc.setFillColor(241, 245, 249); // slate-100
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('COMPLIANCE ATTESTATION & INTEGRITY VERIFICATION', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text(`Digital Verification Signature: ${item.verificationHash}`, margin + 4, y + 11);
  doc.text('Certified by Suiter Marketplace Governance Office • Tarntanya (Adelaide, SA)', margin + 4, y + 16);
  doc.text(`Issued for user profile compliance inspection on ${new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}.`, margin + 4, y + 20);

  y += 28;

  // --- Page Footers for all pages ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, 285, pageWidth - margin, 285);

    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text('Suiter Enterprise Marketplace • Governance, Privacy & Compliance Summary', margin, 290);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 18, 290);
  }

  // Save PDF file
  const sanitizedFileName = `Suiter_${item.code.replace(/[^a-zA-Z0-9_-]/g, '_')}_Compliance_Summary.pdf`;
  doc.save(sanitizedFileName);
}

/**
 * Compiles and generates a comprehensive multi-document Governance and Compliance Dossier.
 */
export function generateFullDossierPDF(items: GovernanceItem[]) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // --- COVER PAGE ---
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 297, 'F');

  // Emerald highlight accent
  doc.setFillColor(16, 185, 129);
  doc.rect(margin, 50, 4, 45, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('SUITER MARKETPLACE', margin + 10, 62);
  doc.setFontSize(16);
  doc.setTextColor(148, 163, 184);
  doc.text('GOVERNANCE & COMPLIANCE DOSSIER', margin + 10, 72);

  doc.setFontSize(10);
  doc.setTextColor(203, 213, 225);
  doc.text('Comprehensive Library of Privacy Laws, Codes of Practice & Regulations', margin + 10, 84);

  // Metadata Card on Cover
  doc.setFillColor(30, 41, 59); // slate-800
  doc.roundedRect(margin, 120, contentWidth, 75, 4, 4, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text('DOSSIER SPECIFICATION', margin + 8, 132);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(241, 245, 249);
  doc.text(`Total Statutes, Codes & Standards Indexed: ${items.length} instruments`, margin + 8, 142);
  doc.text(`Jurisdictions: Commonwealth of Australia, South Australia (Tarntanya), Global`, margin + 8, 150);
  doc.text(`Target Entities: Suiter Marketplace Operators, Registered Traders & Verified Users`, margin + 8, 158);
  doc.text(`Compliance Baseline: 100% Attestation Rating across Privacy, Consumer & Cyber Security`, margin + 8, 166);
  doc.text(`Issued & Verified: ${new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin + 8, 174);
  doc.text(`Sovereign Hosting Region: Australia East / South Australia (CBD Node)`, margin + 8, 182);

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Confidential enterprise legal compliance pack prepared for audit, investor review, and user verification.', margin, 270);
  doc.text('© 2026 Suiter Marketplace • Adelaide, SA 5000', margin, 276);

  // --- EXECUTIVE SUMMARY & INDEX PAGE ---
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, 297, 'F');

  let y = 25;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('EXECUTIVE COMPLIANCE MATRIX', margin, y);
  y += 6;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Summary schedule of active statutory frameworks, governing bodies, and operational status.', margin, y);
  y += 10;

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('CODE', margin + 3, y + 5.5);
  doc.text('STATUTE / CODE OF PRACTICE', margin + 28, y + 5.5);
  doc.text('AUTHORITY', margin + 110, y + 5.5);
  doc.text('STATUS', margin + 145, y + 5.5);
  y += 8;

  for (const item of items) {
    if (y > 265) {
      doc.addPage();
      y = 25;
    }
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y, pageWidth - margin, y);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(item.code, margin + 3, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const shortTitle = item.title.length > 50 ? item.title.substring(0, 48) + '...' : item.title;
    doc.text(shortTitle, margin + 28, y + 5);

    const shortAuth = item.authority.length > 22 ? item.authority.substring(0, 20) + '...' : item.authority;
    doc.text(shortAuth, margin + 110, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(4, 120, 87);
    doc.text(item.status, margin + 145, y + 5);

    y += 8;
  }

  // --- DETAILED PAGES FOR EACH INSTRUMENT ---
  for (const item of items) {
    doc.addPage();
    let iy = 25;

    // Header bar
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 18, 'F');
    doc.setFillColor(16, 185, 129);
    doc.rect(0, 18, pageWidth, 1, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`SUITER GOVERNANCE DOSSIER • ${item.code}`, margin, 12);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(item.categoryLabel.toUpperCase(), pageWidth - margin - 35, 12);

    iy = 28;

    // Title
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    const tLines = doc.splitTextToSize(item.title, contentWidth);
    doc.text(tLines, margin, iy);
    iy += tLines.length * 6 + 3;

    // Info row
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Authority: ${item.authority}  |  Jurisdiction: ${item.jurisdiction}`, margin, iy);
    iy += 4.5;
    doc.text(`Status: ${item.status}  |  Last Audited: ${item.lastAudited}  |  Compliance Score: ${item.complianceScore}%`, margin, iy);
    iy += 6;

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, iy, pageWidth - margin, iy);
    iy += 6;

    // Summary
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('1. OVERVIEW & SCOPE', margin, iy);
    iy += 4.5;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    iy = renderTextBlock(doc, item.summary, margin, iy, contentWidth, 4.2);
    iy += 4;

    // Key Obligations
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('2. STATUTORY OBLIGATIONS', margin, iy);
    iy += 4.5;

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    for (const ob of item.keyObligations) {
      if (iy > 260) { doc.addPage(); iy = 25; }
      doc.setFillColor(15, 23, 42);
      doc.circle(margin + 2, iy - 1, 0.7, 'F');
      iy = renderTextBlock(doc, ob, margin + 5, iy, contentWidth - 5, 4);
      iy += 1;
    }
    iy += 3;

    // Code of practice
    if (iy > 230) { doc.addPage(); iy = 25; }
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('3. CODE OF PRACTICE IMPLEMENTATION', margin, iy);
    iy += 4.5;

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    for (const cop of item.codeOfPractice) {
      if (iy > 260) { doc.addPage(); iy = 25; }
      doc.setFillColor(16, 185, 129);
      doc.circle(margin + 2, iy - 1, 0.7, 'F');
      iy = renderTextBlock(doc, cop, margin + 5, iy, contentWidth - 5, 4);
      iy += 1;
    }
    iy += 3;

    // Platform controls
    if (iy > 230) { doc.addPage(); iy = 25; }
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('4. TECHNICAL & ARCHITECTURAL CONTROLS', margin, iy);
    iy += 4.5;

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    for (const ctrl of item.platformControls) {
      if (iy > 260) { doc.addPage(); iy = 25; }
      doc.setFillColor(79, 70, 229);
      doc.circle(margin + 2, iy - 1, 0.7, 'F');
      iy = renderTextBlock(doc, ctrl, margin + 5, iy, contentWidth - 5, 4);
      iy += 1;
    }
    iy += 3;

    // Penalties & Hash
    if (iy > 235) { doc.addPage(); iy = 25; }
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, iy, contentWidth, 18, 2, 2, 'FD');

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('ENFORCEMENT & INTEGRITY ATTESTATION:', margin + 3, iy + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    const pLines = doc.splitTextToSize(item.penaltiesAndEnforcement, contentWidth - 6);
    doc.text(pLines.slice(0, 2), margin + 3, iy + 9);
    doc.text(`Digital Seal: ${item.verificationHash.substring(0, 48)}...`, margin + 3, iy + 16);
  }

  // --- Page numbering across all pages except cover ---
  const total = doc.getNumberOfPages();
  for (let i = 2; i <= total; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, 285, pageWidth - margin, 285);
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text('Suiter Enterprise Marketplace • Governance & Compliance Master Dossier', margin, 290);
    doc.text(`Page ${i} of ${total}`, pageWidth - margin - 18, 290);
  }

  doc.save('Suiter_Enterprise_Governance_Full_Compliance_Dossier.pdf');
}
