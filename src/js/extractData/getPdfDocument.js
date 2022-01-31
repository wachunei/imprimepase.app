const pdfjs = require("pdfjs-dist");
pdfjs.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry.js");

async function getPdfDocument(buffer) {
  const pdfDocument = await pdfjs.getDocument(buffer).promise;
  return pdfDocument;
}

export default getPdfDocument;
