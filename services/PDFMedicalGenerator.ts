import jsPDF from "jspdf";
import { MedicalRecordData } from "../types/medical";

const PDF_CONFIG = {
  MARGIN_LEFT: 15,
  MARGIN_RIGHT: 15,
  PAGE_WIDTH: 180,
  LINE_HEIGHT: 5, // Reduced from 7
  SECTION_PADDING: 6, // Reduced from 10
  SECTION_GAP: 8, // Reduced from 15
  PAGE_HEIGHT: 280,
  FOOTER_HEIGHT: 20,
  LOGO_DIMENSIONS: { width: 50, height: 15 },
  FONTS: {
    TITLE: 20, // Main title
    SECTION: 12, // Section headers
    CONTENT: 10, // Regular content
    FOOTER: 8, // Footer text
  },
};

export const generateMedicalRecordPDF = async (record: MedicalRecordData, logoSrc: string) => {
  const doc = new jsPDF();
  const { MARGIN_LEFT, PAGE_WIDTH, LINE_HEIGHT, SECTION_PADDING, SECTION_GAP, PAGE_HEIGHT, FONTS } =
    PDF_CONFIG;

  const drawHorizontalLine = (y: number) => {
    doc.setDrawColor(200, 200, 200);
    doc.line(10, y, 200, y);
  };

  const checkAndAddNewPage = (currentY: number, neededSpace: number = LINE_HEIGHT): number => {
    if (currentY + neededSpace >= PAGE_HEIGHT) {
      doc.addPage();
      currentY = 40;
      // Reset font and margins for new page
      doc.setFont("helvetica", "normal");
      doc.setFontSize(FONTS.CONTENT);
      doc.setTextColor(0, 0, 0);
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(0, 0, 0);
      
      // Add page header
      doc.setFontSize(FONTS.TITLE);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(44, 62, 80);
      doc.text("Medical Record", 105, 30, { align: "center" });
      drawHorizontalLine(35);
      doc.setFontSize(FONTS.CONTENT);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
    }
    return currentY;
  };

  const drawSection = (title: string, y: number) => {
    y = checkAndAddNewPage(y, 15);
    const sectionHeight = 6;
    doc.setFillColor(240, 240, 240);
    doc.rect(10, y - 4, 190, sectionHeight, "F");
    doc.setFontSize(FONTS.SECTION);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 60);
    doc.text(title, MARGIN_LEFT, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    return y + sectionHeight + SECTION_PADDING;
  };

  const addField = (label: string, value: string, x: number, y: number): number => {
    y = checkAndAddNewPage(y);
    doc.setFontSize(FONTS.CONTENT);
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, x, y);
    doc.setFont("helvetica", "normal");
    const labelWidth = doc.getTextWidth(`${label}: `);
    const valueLines = doc.splitTextToSize(value, PAGE_WIDTH - labelWidth - (x - MARGIN_LEFT));
    doc.text(valueLines, x + labelWidth, y);
    return y + valueLines.length * LINE_HEIGHT;
  };

  const addMultiLineField = (label: string, value: string, x: number, y: number): number => {
    y = checkAndAddNewPage(y, 20);
    doc.setFontSize(FONTS.CONTENT);
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, x, y);
    doc.setFont("helvetica", "normal");
    const valueLines = doc.splitTextToSize(value, 180);

    // Check if we need to add a new page for the value lines
    if (y + (valueLines.length + 1) * LINE_HEIGHT >= PAGE_HEIGHT) {
      y = checkAndAddNewPage(y);
    }

    doc.text(valueLines, x, y + LINE_HEIGHT);
    return y + (valueLines.length + 1) * LINE_HEIGHT + 3;
  };

  const addFooter = (pageNumber: number, totalPages: number) => {
    const today = new Date().toLocaleDateString();
    doc.setFontSize(FONTS.FOOTER);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated on: ${today}`, MARGIN_LEFT, 290);
    doc.text(`Page ${pageNumber} of ${totalPages}`, 180, 290);
  };

  try {
    // Load and add logo
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = document.createElement("img");
      img.src = logoSrc;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(
        imgData,
        "PNG",
        10,
        10,
        PDF_CONFIG.LOGO_DIMENSIONS.width,
        PDF_CONFIG.LOGO_DIMENSIONS.height
      );
    }

    // Initialize first page
    doc.setFont("helvetica", "normal");
    doc.setFontSize(FONTS.CONTENT);
    doc.setTextColor(0, 0, 0);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(0, 0, 0);

    // Title
    doc.setFontSize(FONTS.TITLE);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(44, 62, 80);
    doc.text("Medical Record", 105, 30, { align: "center" });
    drawHorizontalLine(35);

    let currentY = 40;
    currentY = drawSection("Patient Information", currentY);

    // Two-column layout for patient info
    const columnWidth = PAGE_WIDTH / 2;
    currentY = addField("Name", record.patientInfo.name, MARGIN_LEFT, currentY);
    addField(
      "Date of Birth",
      record.patientInfo.dateOfBirth,
      MARGIN_LEFT + columnWidth,
      currentY - LINE_HEIGHT
    );
    currentY = addField("Gender", record.patientInfo.gender, MARGIN_LEFT, currentY + 3);
    addField(
      "Contact",
      record.patientInfo.phoneNumber,
      MARGIN_LEFT + columnWidth,
      currentY - LINE_HEIGHT
    );
    currentY += SECTION_GAP;
    drawHorizontalLine(currentY - 3);

    // Visit Information Section
    currentY = drawSection("Visit Information", currentY + 3);
    currentY = addField("Date", record.medicalRecord.visit_date, MARGIN_LEFT, currentY);
    currentY = addField(
      "Doctor",
      record.medicalRecord.doctor,
      MARGIN_LEFT + columnWidth,
      currentY - LINE_HEIGHT
    );
    currentY = addField("Field", record.medicalRecord.field, MARGIN_LEFT, currentY + 3);
    currentY += SECTION_GAP;
    drawHorizontalLine(currentY - 3);

    // Vital Signs Section
    currentY = drawSection("Vital Signs", currentY + 3);
    currentY = addField("Temperature", record.medicalRecord.temperature, MARGIN_LEFT, currentY);
    currentY = addField(
      "Weight",
      record.medicalRecord.weight,
      MARGIN_LEFT + columnWidth,
      currentY - LINE_HEIGHT
    );
    currentY = addField(
      "Heart Rate",
      record.medicalRecord.heart_rate.toString(),
      MARGIN_LEFT,
      currentY + 3
    );
    currentY = addField(
      "Blood Pressure",
      record.medicalRecord.blood_pressure,
      MARGIN_LEFT + columnWidth,
      currentY - LINE_HEIGHT
    );
    currentY += SECTION_GAP;
    drawHorizontalLine(currentY - 3);

    // Clinical Information Section
    currentY = drawSection("Clinical Information", currentY + 3);
    currentY = addMultiLineField("Symptoms", record.medicalRecord.symptoms, MARGIN_LEFT, currentY);
    currentY = addMultiLineField(
      "Allergies",
      record.medicalRecord.allergies,
      MARGIN_LEFT,
      currentY
    );
    currentY = addMultiLineField(
      "Diagnosis",
      record.medicalRecord.diagnosis,
      MARGIN_LEFT,
      currentY
    );
    currentY += SECTION_GAP;
    drawHorizontalLine(currentY - 3);

    // Lab Results Section
    currentY = drawSection("Laboratory Results", currentY + 3);
    currentY = addMultiLineField(
      "Tests Performed",
      record.medicalRecord.lab_tests,
      MARGIN_LEFT,
      currentY
    );
    currentY = addMultiLineField(
      "Results",
      record.medicalRecord.lab_test_results,
      MARGIN_LEFT,
      currentY
    );
    currentY += SECTION_GAP;
    drawHorizontalLine(currentY - 3);

    // Medications Section
    currentY = drawSection("Medications", currentY + 3);
    doc.setFontSize(FONTS.CONTENT);
    record.medications.forEach((med) => {
      currentY = checkAndAddNewPage(currentY);
      const medText = `${med.name} - ${med.dosage} (${med.frequency})`;
      doc.text(`• ${medText}`, MARGIN_LEFT, currentY);
      currentY += LINE_HEIGHT;
    });
    currentY += SECTION_GAP;
    drawHorizontalLine(currentY - 3);

    // Notes Section
    currentY = drawSection("Medical Notes", currentY + 3);
    currentY = addMultiLineField(
      "Doctor's Notes",
      record.medicalRecord.doctor_notes,
      MARGIN_LEFT,
      currentY
    );

    // Add footer to all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      addFooter(i, pageCount);
    }

    doc.save(`Medical_Record_${record.patientInfo.name}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};