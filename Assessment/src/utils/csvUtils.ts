/**
 * CSV Import/Export Utilities
 * Handles CSV file import and export for all modules
 */

/**
 * Export data to CSV file
 */
export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Escape values containing commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Import CSV file
 */
export function importFromCSV(
  onComplete: (data: any[]) => void,
  onError?: (error: string) => void
) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.csv';

  input.onchange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) {
      onError?.('No file selected');
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const rows = text.split('\n').filter(row => row.trim());

        if (rows.length < 2) {
          onError?.('CSV file must contain headers and at least one row');
          return;
        }

        // Parse headers
        const headers = rows[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

        // Parse data rows
        const data = rows.slice(1).map(row => {
          const values = parseCSVRow(row);
          const obj: any = {};

          headers.forEach((header, index) => {
            obj[header] = values[index]?.trim().replace(/^"|"$/g, '') || '';
          });

          return obj;
        });

        onComplete(data);
      } catch (error) {
        onError?.(`Error parsing CSV: ${error}`);
      }
    };

    reader.onerror = () => {
      onError?.('Error reading file');
    };

    reader.readAsText(file);
  };

  input.click();
}

/**
 * Parse CSV row handling quoted values
 */
function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    const nextChar = row[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

/**
 * Export table data with selected columns
 */
export function exportTableToCSV(
  data: any[],
  columns: { key: string; label: string }[],
  filename: string
) {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Extract only selected columns
  const exportData = data.map(row => {
    const obj: any = {};
    columns.forEach(col => {
      obj[col.label] = row[col.key];
    });
    return obj;
  });

  exportToCSV(exportData, filename);
}
