async function readPDF(pdfDocument) {
  let fullContent = "";
  for (let i = 0; i < pdfDocument.numPages; i++) {
    const page = await pdfDocument.getPage(i + 1);
    const content = await page.getTextContent();
    fullContent += content.items
      .map((line) => line.str)
      .join(" ")
      .replace(`${i + 1}/${pdfDocument.numPages}`, "")
      .trim();
  }
  return fullContent;
}

export default readPDF;
