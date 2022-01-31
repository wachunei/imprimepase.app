import readPDF from "./readPDF";
import readPDFQR from "./readPDFQR";
import parseData from "./parseData";
import getPdfDocument from "./getPdfDocument";
import { readFile } from "../utils";

async function extractData(file) {
  const fileBuffer = await readFile(file);
  const pdfDocument = await getPdfDocument(fileBuffer);
  const rawPDFdata = await readPDF(pdfDocument);
  const qrUrl = await readPDFQR(pdfDocument);
  const parsedData = {
    url: qrUrl,
    ...parseData(rawPDFdata),
  };
  return parsedData;
}

export default extractData;
