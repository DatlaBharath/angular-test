/**
 * CSV Export Service
 *
 * Provides utility methods to format a list of data objects as CSV with headers:
 * 'Category', 'Amount', 'Timestamp'.
 * Handles CSV escaping, formatting, and basic error reporting.
 *
 * Usage:
 *   Inject CsvExportService into your component or service and call exportToCsv(data).
 *
 * Error Handling:
 *   Returns either the formatted CSV string or throws an Error if input is invalid.
 */
import { Injectable } from '@angular/core';

export interface CsvExportRecord {
  category: string;
  amount: number;
  timestamp: Date | string;
}

@Injectable({ providedIn: 'root' })
export class CsvExportService {
  /**
   * Converts an array of records to CSV string with headers.
   * @param records The records to export
   * @returns CSV string or throws Error if invalid
   */
  exportToCsv(records: CsvExportRecord[]): string {
    if (!Array.isArray(records)) {
      throw new Error('Input data must be an array.');
    }
    // Header row
    const headers = ['Category', 'Amount', 'Timestamp'];

    try {
      const rows = records.map((rec, i) => {
        if (!rec || typeof rec !== 'object') {
          throw new Error(`Record at index ${i} is not a valid object.`);
        }
        return [
          this.escapeCsv(rec.category),
          this.formatAmount(rec.amount),
          this.formatTimestamp(rec.timestamp)
        ].join(',');
      });
      return [headers.join(','), ...rows].join('\r\n');
    } catch (error:any) {
      throw new Error(`CSV Export failed: ${error.message || error}`);
    }
  }

  /**
   * Escapes a value for CSV output (wraps with quotes if contains a comma or quote)
   */
  private escapeCsv(value: string | number | null | undefined): string {
    if (value === null || value === undefined) return '';
    let str = String(value);
    if (/[",\n]/.test(str)) {
      str = '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  /**
   * Formats the Amount field as a string with 2 decimals (if number), or returns as-is if valid string.
   */
  private formatAmount(amount: number | string): string {
    if (typeof amount === 'number') {
      return amount.toFixed(2);
    }
    if (typeof amount === 'string' && !isNaN(Number(amount))) {
      return Number(amount).toFixed(2);
    }
    throw new Error(`Invalid amount: ${amount}`);
  }

  /**
   * Formats the Timestamp for CSV output in ISO string.
   */
  private formatTimestamp(ts: Date | string): string {
    if (ts instanceof Date) {
      return ts.toISOString();
    }
    if (typeof ts === 'string') {
      // Acceptable date string?
      const date = new Date(ts);
      if (!isNaN(date.getTime())) return date.toISOString();
      throw new Error(`Invalid date string: ${ts}`);
    }
    throw new Error(`Invalid timestamp: ${ts}`);
  }
}
