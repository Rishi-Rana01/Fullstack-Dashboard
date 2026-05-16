import { ILeadDocument } from '../models/lead.model';

// ── CSV Export Utility ─────────────────────────────────────────────────────
// Converts an array of Mongoose lead documents into a properly escaped
// CSV string. Avoids any third-party CSV library for minimal dependencies.

/**
 * Escapes a cell value for safe CSV embedding.
 * Wraps values containing commas, quotes, or newlines in double quotes,
 * and escapes existing double-quotes by doubling them (RFC 4180).
 */
const escapeCsvCell = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

/**
 * Formats a Date object as a locale-agnostic ISO date string (YYYY-MM-DD).
 */
const formatDate = (date: Date): string => {
  return new Date(date).toISOString().split('T')[0];
};

/**
 * Converts an array of lead documents into a CSV string.
 * Columns: Name, Email, Status, Source, Created At
 *
 * @param leads Array of Mongoose lead documents
 * @returns Full CSV string including header row
 */
export const generateLeadsCsv = (leads: ILeadDocument[]): string => {
  const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];

  const rows = leads.map((lead) => [
    escapeCsvCell(lead.name),
    escapeCsvCell(lead.email),
    escapeCsvCell(lead.status),
    escapeCsvCell(lead.source),
    escapeCsvCell(formatDate(lead.createdAt)),
  ]);

  // Join header and each row with CRLF line endings per RFC 4180
  const csvLines = [headers.join(','), ...rows.map((r) => r.join(','))];
  return csvLines.join('\r\n');
};
