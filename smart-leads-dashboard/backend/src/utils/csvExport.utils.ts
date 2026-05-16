import { ILeadDocument } from '../models/lead.model';
const escapeCsvCell = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};


const formatDate = (date: Date): string => {
  return new Date(date).toISOString().split('T')[0];
};

export const generateLeadsCsv = (leads: ILeadDocument[]): string => {
  const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];

  const rows = leads.map((lead) => [
    escapeCsvCell(lead.name),
    escapeCsvCell(lead.email),
    escapeCsvCell(lead.status),
    escapeCsvCell(lead.source),
    escapeCsvCell(formatDate(lead.createdAt)),
  ]);

  const csvLines = [headers.join(','), ...rows.map((r) => r.join(','))];
  return csvLines.join('\r\n');
};
