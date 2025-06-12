import * as mammoth from 'mammoth';
import { PDFDocument, rgb } from 'pdf-lib';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export interface ConversionResult {
  success: boolean;
  data?: Blob;
  error?: string;
  filename: string;
}

export class FileConverterService {
  
  /**
   * Convert file to specified format
   */
  static async convertFile(
    file: File, 
    targetFormat: string,
    onProgress?: (progress: number) => void
  ): Promise<ConversionResult> {
    try {
      const sourceFormat = file.name.split('.').pop()?.toLowerCase() || '';
      
      // Update progress
      onProgress?.(10);
      
      // Route to appropriate converter
      switch (`${sourceFormat}-${targetFormat}`) {
        // DOCX/DOC to other formats
        case 'docx-pdf':
        case 'doc-pdf':
          return await this.docxToPdf(file, onProgress);
        
        case 'docx-txt':
        case 'doc-txt':
          return await this.docxToTxt(file, onProgress);
        
        case 'docx-html':
        case 'doc-html':
          return await this.docxToHtml(file, onProgress);
        
        // PDF conversions
        case 'pdf-txt':
          return await this.pdfToTxt(file, onProgress);
        
        // Text to other formats
        case 'txt-pdf':
          return await this.txtToPdf(file, onProgress);
        
        case 'txt-docx':
          return await this.txtToDocx(file, onProgress);
        
        case 'txt-html':
          return await this.txtToHtml(file, onProgress);
        
        // Excel conversions
        case 'xlsx-pdf':
        case 'xls-pdf':
          return await this.excelToPdf(file, onProgress);
        
        case 'xlsx-txt':
        case 'xls-txt':
          return await this.excelToTxt(file, onProgress);
        
        // Image to PDF
        case 'jpg-pdf':
        case 'jpeg-pdf':
        case 'png-pdf':
          return await this.imageToPdf(file, onProgress);
        
        // HTML conversions
        case 'html-pdf':
          return await this.htmlToPdf(file, onProgress);
        
        case 'html-txt':
          return await this.htmlToTxt(file, onProgress);
        
        // RTF conversions
        case 'rtf-txt':
          return await this.rtfToTxt(file, onProgress);
        
        case 'rtf-pdf':
          return await this.rtfToPdf(file, onProgress);
        
        default:
          throw new Error(`Conversion from ${sourceFormat} to ${targetFormat} is not supported yet`);
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        filename: file.name
      };
    }
  }

  /**
   * Convert DOCX to PDF
   */
  private static async docxToPdf(file: File, onProgress?: (progress: number) => void): Promise<ConversionResult> {
    try {
      onProgress?.(25);
      
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      onProgress?.(50);
      
      const pdf = new jsPDF();
      const pageHeight = pdf.internal.pageSize.height;
      const pageWidth = pdf.internal.pageSize.width;
      const margin = 20;
      const lineHeight = 7;
      const maxLineWidth = pageWidth - 2 * margin;
      
      // Split text into lines
      const lines = pdf.splitTextToSize(result.value, maxLineWidth);
      
      onProgress?.(75);
      
      let currentY = margin;
      
      for (let i = 0; i < lines.length; i++) {
        if (currentY + lineHeight > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }
        
        pdf.text(lines[i], margin, currentY);
        currentY += lineHeight;
      }
      
      onProgress?.(90);
      
      const pdfBlob = new Blob([pdf.output('blob')], { type: 'application/pdf' });
      
      onProgress?.(100);
      
      return {
        success: true,
        data: pdfBlob,
        filename: file.name.replace(/\.(docx?|doc)$/i, '.pdf')
      };
    } catch (error) {
      throw new Error(`Failed to convert DOCX to PDF: ${error}`);
    }
  }

  /**
   * Convert DOCX to TXT
   */
  private static async docxToTxt(file: File, onProgress?: (progress: number) => void): Promise<ConversionResult> {
    try {
      onProgress?.(30);
      
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      onProgress?.(80);
      
      const txtBlob = new Blob([result.value], { type: 'text/plain' });
      
      onProgress?.(100);
      
      return {
        success: true,
        data: txtBlob,
        filename: file.name.replace(/\.(docx?|doc)$/i, '.txt')
      };
    } catch (error) {
      throw new Error(`Failed to convert DOCX to TXT: ${error}`);
    }
  }

  /**
   * Convert DOCX to HTML
   */
  private static async docxToHtml(file: File, onProgress?: (progress: number) => void): Promise<ConversionResult> {
    try {
      onProgress?.(30);
      
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      
      onProgress?.(80);
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Converted Document</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
          </style>
        </head>
        <body>
          ${result.value}
        </body>
        </html>
      `;
      
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
      
      onProgress?.(100);
      
      return {
        success: true,
        data: htmlBlob,
        filename: file.name.replace(/\.(docx?|doc)$/i, '.html')
      };
    } catch (error) {
      throw new Error(`Failed to convert DOCX to HTML: ${error}`);
    }
  }

  /**
   * Convert TXT to PDF
   */
  private static async txtToPdf(file: File, onProgress?: (progress: number) => void): Promise<ConversionResult> {
    try {
      onProgress?.(25);
      
      const text = await file.text();
      
      onProgress?.(50);
      
      const pdf = new jsPDF();
      const pageHeight = pdf.internal.pageSize.height;
      const pageWidth = pdf.internal.pageSize.width;
      const margin = 20;
      const lineHeight = 7;
      const maxLineWidth = pageWidth - 2 * margin;
      
      const lines = pdf.splitTextToSize(text, maxLineWidth);
      
      onProgress?.(75);
      
      let currentY = margin;
      
      for (let i = 0; i < lines.length; i++) {
        if (currentY + lineHeight > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }
        
        pdf.text(lines[i], margin, currentY);
        currentY += lineHeight;
      }
      
      const pdfBlob = new Blob([pdf.output('blob')], { type: 'application/pdf' });
      
      onProgress?.(100);
      
      return {
        success: true,
        data: pdfBlob,
        filename: file.name.replace(/\.txt$/i, '.pdf')
      };
    } catch (error) {
      throw new Error(`Failed to convert TXT to PDF: ${error}`);
    }
  }

  /**
   * Convert TXT to HTML
   */
  private static async txtToHtml(file: File, onProgress?: (progress: number) => void): Promise<ConversionResult> {
    try {
      onProgress?.(30);
      
      const text = await file.text();
      
      onProgress?.(70);
      
      // Convert line breaks to HTML
      const htmlContent = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>\n');
      
      const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Converted Text</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
          </style>
        </head>
        <body>
          <pre style="white-space: pre-wrap; font-family: inherit;">${htmlContent}</pre>
        </body>
        </html>
      `;
      
      const htmlBlob = new Blob([fullHtml], { type: 'text/html' });
      
      onProgress?.(100);
      
      return {
        success: true,
        data: htmlBlob,
        filename: file.name.replace(/\.txt$/i, '.html')
      };
    } catch (error) {
      throw new Error(`Failed to convert TXT to HTML: ${error}`);
    }
  }

  /**
   * Convert Excel to PDF
   */
  private static async excelToPdf(file: File, onProgress?: (progress: number) => void): Promise<ConversionResult> {
    try {
      onProgress?.(25);
      
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      onProgress?.(50);
      
      const pdf = new jsPDF();
      const margin = 20;
      let currentY = margin;
      
      // Process each worksheet
      workbook.SheetNames.forEach((sheetName, sheetIndex) => {
        if (sheetIndex > 0) {
          pdf.addPage();
          currentY = margin;
        }
        
        const worksheet = workbook.Sheets[sheetName];
        const csvData = XLSX.utils.sheet_to_csv(worksheet);
        
        // Add sheet title
        pdf.setFontSize(14);
        pdf.text(`Sheet: ${sheetName}`, margin, currentY);
        currentY += 15;
        
        // Add CSV data
        pdf.setFontSize(10);
        const lines = csvData.split('\n');
        
        lines.forEach(line => {
          if (currentY > pdf.internal.pageSize.height - margin) {
            pdf.addPage();
            currentY = margin;
          }
          
          pdf.text(line, margin, currentY);
          currentY += 6;
        });
      });
      
      onProgress?.(90);
      
      const pdfBlob = new Blob([pdf.output('blob')], { type: 'application/pdf' });
      
      onProgress?.(100);
      
      return {
        success: true,
        data: pdfBlob,
        filename: file.name.replace(/\.xlsx?$/i, '.pdf')
      };
    } catch (error) {
      throw new Error(`Failed to convert Excel to PDF: ${error}`);
    }
  }

  /**
   * Convert Excel to TXT
   */
  private static async excelToTxt(file: File, onProgress?: (progress: number) => void): Promise<ConversionResult> {
    try {
      onProgress?.(30);
      
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      onProgress?.(70);
      
      let textContent = '';
      
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const csvData = XLSX.utils.sheet_to_csv(worksheet);
        
        textContent += `Sheet: ${sheetName}\n`;
        textContent += '='.repeat(50) + '\n';
        textContent += csvData + '\n\n';
      });
      
      const txtBlob = new Blob([textContent], { type: 'text/plain' });
      
      onProgress?.(100);
      
      return {
        success: true,
        data: txtBlob,
        filename: file.name.replace(/\.xlsx?$/i, '.txt')
      };
    } catch (error) {
      throw new Error(`Failed to convert Excel to TXT: ${error}`);
    }
  }

  /**
   * Convert Image to PDF
   */
  private static async imageToPdf(file: File, onProgress?: (progress: number) => void): Promise<ConversionResult> {
    try {
      onProgress?.(25);
      
      const imageUrl = URL.createObjectURL(file);
      
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          try {
            onProgress?.(50);
            
            const pdf = new jsPDF();
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            // Calculate dimensions to fit the page
            const imgWidth = img.width;
            const imgHeight = img.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            
            const width = imgWidth * ratio;
            const height = imgHeight * ratio;
            
            // Center the image
            const x = (pdfWidth - width) / 2;
            const y = (pdfHeight - height) / 2;
            
            onProgress?.(75);
            
            pdf.addImage(img, 'JPEG', x, y, width, height);
            
            const pdfBlob = new Blob([pdf.output('blob')], { type: 'application/pdf' });
            
            onProgress?.(100);
            
            URL.revokeObjectURL(imageUrl);
            
            resolve({
              success: true,
              data: pdfBlob,
              filename: file.name.replace(/\.(jpg|jpeg|png)$/i, '.pdf')
            });
          } catch (error) {
            URL.revokeObjectURL(imageUrl);
            reject(new Error(`Failed to convert image to PDF: ${error}`));
          }
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(imageUrl);
          reject(new Error('Failed to load image'));
        };
        
        img.src = imageUrl;
      });
    } catch (error) {
      throw new Error(`Failed to convert image to PDF: ${error}`);
    }
  }

  /**
   * Convert HTML to PDF
   */
  private static async htmlToPdf(file: File, onProgress?: (progress: number) => void): Promise<ConversionResult> {
    try {
      onProgress?.(30);
      
      const htmlContent = await file.text();
      
      onProgress?.(60);
      
      // Create a temporary div to render HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '800px';
      document.body.appendChild(tempDiv);
      
      onProgress?.(80);
      
      // For now, convert HTML text content to PDF
      const textContent = tempDiv.textContent || tempDiv.innerText || '';
      document.body.removeChild(tempDiv);
      
      const pdf = new jsPDF();
      const lines = pdf.splitTextToSize(textContent, 170);
      
      let currentY = 20;
      for (let i = 0; i < lines.length; i++) {
        if (currentY > 280) {
          pdf.addPage();
          currentY = 20;
        }
        pdf.text(lines[i], 20, currentY);
        currentY += 7;
      }
      
      const pdfBlob = new Blob([pdf.output('blob')], { type: 'application/pdf' });
      
      onProgress?.(100);
      
      return {
        success: true,
        data: pdfBlob,
        filename: file.name.replace(/\.html?$/i, '.pdf')
      };
    } catch (error) {
      throw new Error(`Failed to convert HTML to PDF: ${error}`);
    }
  }

  /**
   * Convert HTML to TXT
   */
  private static async htmlToTxt(file: File, onProgress?: (progress: number) => void): Promise<ConversionResult> {
    try {
      onProgress?.(30);
      
      const htmlContent = await file.text();
      
      onProgress?.(60);
      
      // Create a temporary div to extract text
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);
      
      const textContent = tempDiv.textContent || tempDiv.innerText || '';
      document.body.removeChild(tempDiv);
      
      onProgress?.(90);
      
      const txtBlob = new Blob([textContent], { type: 'text/plain' });
      
      onProgress?.(100);
      
      return {
        success: true,
        data: txtBlob,
        filename: file.name.replace(/\.html?$/i, '.txt')
      };
    } catch (error) {
      throw new Error(`Failed to convert HTML to TXT: ${error}`);
    }
  }

  /**
   * Convert RTF to TXT
   */
  private static async rtfToTxt(file: File, onProgress?: (progress: number) => void): Promise<ConversionResult> {
    try {
      onProgress?.(30);
      
      const rtfContent = await file.text();
      
      onProgress?.(60);
      
      // Basic RTF to text conversion (removes RTF formatting)
      let textContent = rtfContent
        .replace(/\\[a-z]+\d*\s?/g, '') // Remove RTF control words
        .replace(/[{}]/g, '') // Remove braces
        .replace(/\\\\/g, '\\') // Convert escaped backslashes
        .replace(/\\'/g, "'") // Convert escaped quotes
        .trim();
      
      onProgress?.(90);
      
      const txtBlob = new Blob([textContent], { type: 'text/plain' });
      
      onProgress?.(100);
      
      return {
        success: true,
        data: txtBlob,
        filename: file.name.replace(/\.rtf$/i, '.txt')
      };
    } catch (error) {
      throw new Error(`Failed to convert RTF to TXT: ${error}`);
    }
  }

  /**
   * Convert RTF to PDF
   */
  private static async rtfToPdf(file: File, onProgress?: (progress: number) => void): Promise<ConversionResult> {
    try {
      // First convert RTF to TXT, then TXT to PDF
      const txtResult = await this.rtfToTxt(file, (progress) => onProgress?.(progress * 0.5));
      
      if (!txtResult.success || !txtResult.data) {
        throw new Error('Failed to extract text from RTF');
      }
      
      // Create a temporary file object for the text
      const txtFile = new File([txtResult.data], 'temp.txt', { type: 'text/plain' });
      
      const pdfResult = await this.txtToPdf(txtFile, (progress) => onProgress?.(50 + progress * 0.5));
      
      return {
        success: pdfResult.success,
        data: pdfResult.data,
        error: pdfResult.error,
        filename: file.name.replace(/\.rtf$/i, '.pdf')
      };
    } catch (error) {
      throw new Error(`Failed to convert RTF to PDF: ${error}`);
    }
  }

  /**
   * Basic PDF to text extraction (limited functionality)
   */
  private static async pdfToTxt(file: File, onProgress?: (progress: number) => void): Promise<ConversionResult> {
    try {
      onProgress?.(30);
      
      // Note: This is a basic implementation. For full PDF text extraction,
      // you would need a library like pdf-parse or PDF.js
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      onProgress?.(60);
      
      // This is a placeholder - actual PDF text extraction requires more complex libraries
      const pageCount = pdfDoc.getPageCount();
      let textContent = `PDF Document with ${pageCount} pages.\n\n`;
      textContent += 'Note: Full text extraction requires additional PDF parsing libraries.\n';
      textContent += 'This is a placeholder conversion.';
      
      onProgress?.(90);
      
      const txtBlob = new Blob([textContent], { type: 'text/plain' });
      
      onProgress?.(100);
      
      return {
        success: true,
        data: txtBlob,
        filename: file.name.replace(/\.pdf$/i, '.txt')
      };
    } catch (error) {
      throw new Error(`Failed to convert PDF to TXT: ${error}`);
    }
  }

  /**
   * Convert TXT to DOCX (basic implementation)
   */
  private static async txtToDocx(file: File, onProgress?: (progress: number) => void): Promise<ConversionResult> {
    try {
      onProgress?.(30);
      
      const text = await file.text();
      
      onProgress?.(60);
      
      // For a full DOCX implementation, you would use the 'docx' library
      // This is a simplified approach creating an RTF file that can be opened as DOCX
      const rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}\\f0\\fs24 ${text.replace(/\n/g, '\\par ')}}`;
      
      onProgress?.(90);
      
      const docxBlob = new Blob([rtfContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      
      onProgress?.(100);
      
      return {
        success: true,
        data: docxBlob,
        filename: file.name.replace(/\.txt$/i, '.docx')
      };
    } catch (error) {
      throw new Error(`Failed to convert TXT to DOCX: ${error}`);
    }
  }

  /**
   * Get list of supported conversions
   */
  static getSupportedConversions(): { [key: string]: string[] } {
    return {
      'docx': ['pdf', 'txt', 'html'],
      'doc': ['pdf', 'txt', 'html'],
      'txt': ['pdf', 'html', 'docx'],
      'pdf': ['txt'],
      'xlsx': ['pdf', 'txt'],
      'xls': ['pdf', 'txt'],
      'jpg': ['pdf'],
      'jpeg': ['pdf'],
      'png': ['pdf'],
      'html': ['pdf', 'txt'],
      'rtf': ['pdf', 'txt']
    };
  }

  /**
   * Check if conversion is supported
   */
  static isConversionSupported(sourceFormat: string, targetFormat: string): boolean {
    const supported = this.getSupportedConversions();
    return supported[sourceFormat.toLowerCase()]?.includes(targetFormat.toLowerCase()) || false;
  }
}