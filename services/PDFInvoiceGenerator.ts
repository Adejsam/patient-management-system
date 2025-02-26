import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export interface Service {
  description: string;
  amount: string;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  address: string;
  email: string;
}

export interface InvoiceOrReceipt {
  receiptNumber: string;
  date: string;
  amount: string;
  status?: string;
  method?: string;
  services?: Service[];
  customerInfo: CustomerInfo;
}

interface CellHookData {
  cell: {
    text: string[];
    styles: {
      lineWidth?: number;
    };
    y: number;
    height: number;
  };
  row: {
    index: number;
  };
}

interface TableOptions {
  head: string[][];
  body: string[][];
  startY: number;
  theme: "grid" | "striped" | "plain";
  styles: {
    fontSize: number;
    cellPadding: number;
  };
  headStyles: {
    fillColor: number[];
    textColor: number;
    fontStyle: 'bold' | 'normal' | 'italic';
  };
  margin: {
    left: number;
    right: number;
  };
  willDrawCell?: (data: CellHookData) => void;
}

export class PDFInvoiceGenerator {
  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  }

  private async addLogo(doc: jsPDF, imgSrc: string): Promise<void> {
    try {
      const img = await this.loadImage(imgSrc);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imgData = canvas.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 10, 5, 65, 20);
      }
    } catch (error) {
      console.error("Error adding logo:", error);
    }
  }

  private addCustomerInfo(doc: jsPDF, data: InvoiceOrReceipt, startY: number): number {
    let yPosition = startY;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    doc.text("Bill To:", 10, yPosition);
    yPosition += 7;
    doc.text(data.customerInfo.name, 10, yPosition);
    yPosition += 7;
    doc.text(data.customerInfo.address, 10, yPosition);
    yPosition += 7;
    doc.text(data.customerInfo.email, 10, yPosition);
    
    return yPosition + 15;
  }

  private addDocumentDetails(doc: jsPDF, data: InvoiceOrReceipt, type: string, startY: number): number {
    let yPosition = startY;
    
    doc.text(`${type} Number: ${data.receiptNumber}`, 10, yPosition);
    yPosition += 7;
    doc.text(`Date: ${data.date}`, 10, yPosition);
    yPosition += 7;
    
    if (data.status) {
      doc.text(`Status: ${data.status}`, 10, yPosition);
      yPosition += 7;
    }
    if (data.method) {
      doc.text(`Payment Method: ${data.method}`, 10, yPosition);
      yPosition += 7;
    }
    
    return yPosition;
  }

  private addServicesTable(doc: jsPDF, data: InvoiceOrReceipt, startY: number): void {
    if (!data.services?.length) return;

    const tableHeader = ["Description", "Quantity", "Unit Price", "Amount"];
    const tableBody = data.services.map((service) => {
      const unitPrice = parseFloat(service.amount.replace(/[^0-9.-]+/g, "")) / service.quantity;
      return [
        service.description,
        service.quantity.toString(),
        `$${unitPrice.toFixed(2)}`,
        service.amount
      ];
    });

    // Calculate total
    const total = data.services.reduce((sum, service) => 
      sum + parseFloat(service.amount.replace(/[^0-9.-]+/g, "")), 0
    );

    // Add empty row for spacing
    tableBody.push(["", "", "", ""]);

    // Add total row
    tableBody.push(["", "", "Total:", `$${total.toFixed(2)}`]);

    const tableOptions: TableOptions = {
      head: [tableHeader],
      body: tableBody,
      startY: startY + 10,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 5
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      margin: {
        left: 10,
        right: 10
      },
      willDrawCell: function(data: CellHookData) {
        // Style the total row
        if (data.row.index === tableBody.length - 1) {
          doc.setFont("helvetica", "bold");
          // Remove borders for empty cells in total row
          if (data.cell.text.length === 0) {
            data.cell.styles.lineWidth = 0;
          }
        }
      }
    };

    autoTable(doc, tableOptions);
  }

  public async generatePDF(data: InvoiceOrReceipt, type: string, logoSrc: string): Promise<jsPDF> {
    const doc = new jsPDF();

    try {
      await this.addLogo(doc, logoSrc);

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(`${type} Details`, 105, 40, { align: "center" });

      let yPosition = this.addCustomerInfo(doc, data, 60);
      yPosition = this.addDocumentDetails(doc, data, type, yPosition);
      this.addServicesTable(doc, data, yPosition);

      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  }
}