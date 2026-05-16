/**
 * csvDownload.ts
 * Utility to programmatically trigger a CSV file download in the browser.
 * Uses the Blob + <a> anchor approach — no third-party library required.
 */

/**
 * Triggers a browser download of the provided CSV Blob.
 * Creates a temporary object URL, clicks a hidden anchor tag, then cleans up.
 *
 * @param blob     CSV data as a Blob (from axios responseType: 'blob')
 * @param filename Desired filename (e.g., "leads.csv")
 */
export const downloadCSV = (blob: Blob, filename: string = 'leads.csv'): void => {
  // Create an object URL pointing to the blob data
  const url = URL.createObjectURL(blob);

  // Create a hidden anchor element to trigger the download
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';

  // Append to DOM (required for Firefox compatibility)
  document.body.appendChild(anchor);

  // Programmatically click to trigger the download dialog
  anchor.click();

  // Clean up — remove the anchor and revoke the object URL to free memory
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};
