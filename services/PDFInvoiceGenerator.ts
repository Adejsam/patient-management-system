import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export interface Service {
  description: string;
  amount: string;
}

export interface CustomerInfo {
  name: string;
  address: string;
  hospital_number: string;
}

export interface InvoiceOrReceipt {
  invoiceNumber?: string;
  receiptNumber?: string;
  date: string;
  amount: string;
  status?: string;
  method?: string;
  balanceAmount?: string;
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
    lineWidth?: number;
    lineColor?: number[];
  };
  headStyles: {
    fillColor: number[];
    textColor: number;
    fontStyle: "bold" | "normal" | "italic";
    lineWidth?: number;
    lineColor?: number[];
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

  private capitalizeFirstLetter(str: string): string {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  private addCustomerInfo(doc: jsPDF, data: InvoiceOrReceipt, startY: number): number {
    let yPosition = startY;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");

    // Ensure customer info has valid values
    const customer = {
      name: data.customerInfo.name || "N/A",
      address: data.customerInfo.address || "N/A",
      hospital_number: data.customerInfo.hospital_number || "N/A",
    };

    // Add each line with proper spacing
    doc.text("Bill To:", 10, yPosition);
    yPosition += 10;

    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${this.capitalizeFirstLetter(customer.name)}`, 10, yPosition);
    yPosition += 8;

    doc.text(`Address: ${this.capitalizeFirstLetter(customer.address)}`, 10, yPosition);
    yPosition += 8;

    doc.text(`Hospital Number: ${customer.hospital_number}`, 10, yPosition);
    yPosition += 8;

    return yPosition + 15;
  }

  private formatAmount(amount: string): string {
    const num = parseFloat(amount);
    // Always show 2 decimal places for consistency
    return num.toFixed(2);
  }

  private addDocumentDetails(
    doc: jsPDF,
    data: InvoiceOrReceipt,
    type: string,
    startY: number
  ): number {
    let yPosition = startY;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");

    // Add title
    doc.text(`${type} Details`, 10, yPosition);
    yPosition += 10;

    doc.setFont("helvetica", "normal");

    // Add document number
    const docNumber = data.receiptNumber || data.invoiceNumber || "N/A";
    doc.text(`${type} Number: ${docNumber}`, 10, yPosition);
    yPosition += 8;

    // Add date
    doc.text(`Date: ${data.date}`, 10, yPosition);
    yPosition += 8;

    // Add status if available
    if (data.status) {
      doc.text(`Status: ${this.capitalizeFirstLetter(data.status)}`, 10, yPosition);
      yPosition += 8;
    }

    // Add payment method if available
    if (data.method) {
      doc.text(`Payment Method: ${this.capitalizeFirstLetter(data.method)}`, 10, yPosition);
      yPosition += 8;
    }

    // Add balance amount if available
    if (data.balanceAmount !== undefined) {
      doc.text(`Balance Amount: ₦${this.formatAmount(data.balanceAmount)}`, 10, yPosition);
      yPosition += 8;
    }

    return yPosition + 10;
  }

  private addServicesTable(doc: jsPDF, data: InvoiceOrReceipt, startY: number): void {
    if (!data.services?.length) return;

    const tableHeader = [["Description", "Amount"]];
    const tableBody = data.services
      .filter((service) => service.description && service.amount)
      .map((service) => [service.description, `₦${this.formatAmount(service.amount)}`]);

    // Calculate total amount
    const totalAmount = data.services.reduce((sum, service) => sum + parseFloat(service.amount), 0);

    // Add total row
    tableBody.push(["Total", `₦${this.formatAmount(totalAmount.toFixed(2))}`]);

    const tableOptions: TableOptions = {
      head: tableHeader,
      body: tableBody,
      startY: startY + 10,
      theme: "grid",
      styles: {
        fontSize: 12,
        cellPadding: 5,
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
      margin: {
        left: 10,
        right: 10,
      },
    };

    autoTable(doc, tableOptions);
  }

  public async generatePDF(data: InvoiceOrReceipt, type: string, logoSrc: string): Promise<jsPDF> {
    const doc = new jsPDF();

    try {
      await this.addLogo(doc, logoSrc);

      doc.setFontSize(20);
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
