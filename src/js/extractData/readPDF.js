async function readPDF(pdfDocument) {
  let fullContent = "";
  for (let i = 0; i < pdfDocument.numPages; i++) {
    const page = await pdfDocument.getPage(i + 1);
    const content = await page.getTextContent();
    const pageMarker = ` ${i + 1}/${pdfDocument.numPages}`;
    fullContent += content.items
      .map((line) => line.str)
      .join(" ")
      .replace(pageMarker, "")
      .trim();
  }
  return fullContent;
}

export default readPDF;
