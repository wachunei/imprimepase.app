import extractData from "./extractData";

const ERRORS = {
  NOT_PDF: "El archivo que seleccionaste no es un PDF",
  NOT_MOBILITY_PASS:
    "El archivo que seleccionaste no parece ser un pase de movilidad",
};

function handleError(err) {
  const errorAlert = document.querySelector(".error-alert");
  errorAlert.textContent = err;
  errorAlert.style.display = "block";
}

async function handleFile(file) {
  try {
    const data = await extractData(file);
    const dataBase64 = Buffer.from(JSON.stringify(data)).toString("base64");
    location.href = `/pass.html?data=${dataBase64}`;
  } catch (error) {
    console.error(error);
    handleError(ERRORS.NOT_MOBILITY_PASS);
  }
}

function main() {
  const fileSelector = document.querySelector("#file-selector");
  const selectButton = document.querySelector("#select-button");
  const selectButtonSpan = selectButton.querySelector("span");

  const handleFileInputChange = (event) => {
    handleFile(event.target.files[0]);
  };
  const handleFileDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        return handleFile(file);
      }
      handleError(ERRORS.NOT_PDF);
    }
  };
  const handleDragEnter = (event) => {
    event.preventDefault();
    selectButton.classList.add("dragover");
  };
  const handleDragLeave = (event) => {
    event.preventDefault();
    selectButton.classList.remove("dragover");
  };
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  fileSelector.addEventListener("change", handleFileInputChange);
  selectButton.addEventListener("dragenter", handleDragEnter);
  selectButton.addEventListener("dragleave", handleDragLeave);
  selectButton.addEventListener("dragover", handleDragOver);
  selectButton.addEventListener("drop", handleFileDrop);
}

window.addEventListener("DOMContentLoaded", () => {
  main();
});
