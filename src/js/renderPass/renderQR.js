import QRCode from "easyqrcodejs";

async function renderQR(URL) {
  return new Promise((resolve) => {
    new QRCode(document.createElement("div"), {
      text: URL,
      width: 256,
      height: 256,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
      onRenderingEnd: (_a, b) => {
        resolve(b);
      },
    });
  });
}

export default renderQR;
