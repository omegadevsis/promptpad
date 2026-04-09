import { saveAs } from 'file-saver';

export class ExportService {
  /**
   * Export content as a text file.
   */
  static exportToTxt(content: string, filename: string = 'prompt.txt') {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, filename);
  }

  /**
   * Export prompt and variables as JSON.
   */
  static exportToJson(data: any, filename: string = 'prompt.json') {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    saveAs(blob, filename);
  }

  /**
   * Remove HTML tags for prompt-clean export.
   */
  static stripHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }
}
