declare module "jspdf-autotable" {
    import { jsPDF } from "jspdf";
  
    export interface AutoTableOptions {
      head?: string[][];
      body: string[][];
      startY?: number;
      theme?: "striped" | "grid" | "plain";
      styles?: Record<string, unknown>;
      headStyles?: Record<string, unknown>;
      margin?: { left: number; right: number };
    }
  
    export default function autoTable(doc: jsPDF, options: AutoTableOptions): number;
  }