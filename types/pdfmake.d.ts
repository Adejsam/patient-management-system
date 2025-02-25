declare module "pdfmake/build/pdfmake" {
    import { TDocumentDefinitions } from "pdfmake/interfaces";
    
    interface PdfMake {
        vfs: Record<string, string>;
        createPdf(documentDefinition: TDocumentDefinitions): {
            download: (fileName?: string) => void;
            open: () => void;
            print: () => void;
        };
    }

    const pdfMake: PdfMake;
    export default pdfMake;
}

declare module "pdfmake/build/vfs_fonts" {
    const pdfFonts: { pdfMake: { vfs: Record<string, string> } };
    export default pdfFonts;
}
