import printPass from "./printPass";
import renderPass from "./renderPass";

function getDataFromURL() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const { data } = Object.fromEntries(urlSearchParams.entries());
  const passData = Buffer(data, "base64").toString();
  return JSON.parse(passData);
}

function validateData(data) {
  const KEYS = ["birthdate", "id", "lastNames", "names", "url", "vaccines"];
  if (KEYS.some((key) => !data[key])) {
    throw new Error("Invalid data");
  }
}

function handlePrintButtonClick(data) {
  printPass();
}

function renderUI(data) {
  const dataNameElements = document.querySelectorAll(".data-name");
  dataNameElements.forEach((element) => {
    element.textContent = data.names.split(" ")[0];
  });
  const loadingSection = document.querySelector(".loading-section");
  const unloaded = document.querySelectorAll(".unloaded");
  unloaded.forEach((el) => el.classList.remove("unloaded"));
  loadingSection.classList.add("unloaded");

  const printButton = document.querySelector("#print-button");
  printButton.addEventListener("click", () => handlePrintButtonClick(data));
}

async function main() {
  let data;
  try {
    data = getDataFromURL();
    validateData(data);
  } catch (error) {
    location.href = `/index.html`;
  }
  console.log(data);
  await renderPass(data);
  renderUI(data);
}

window.addEventListener("DOMContentLoaded", () => {
  main();
});
