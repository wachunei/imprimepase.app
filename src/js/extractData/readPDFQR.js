import jsQR from "jsqr";

async function readPDFQR(pdfDocument) {
  const page = await pdfDocument.getPage(1);
  const viewport = await page.getViewport({ scale: 1.0 });
  const { width, height } = viewport;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const canvasContext = canvas.getContext("2d");

  await page.render({
    canvasContext,
    viewport,
  }).promise;
  const { data } = canvasContext.getImageData(0, 0, width, height);
  const code = jsQR(data, width, height);
  return new URL(code.data).toString();
}

export default readPDFQR;
