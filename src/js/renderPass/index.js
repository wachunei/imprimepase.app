import { html, syntax } from "../utils";
import renderQR from "./renderQR";

const pagebreak = syntax(html`<div class="pagebreak"></div>`);

function renderInstructionsPage() {
  return syntax(html`
    <div class="page">
      <div>
        <h1>Instrucciones (no imprimir esta página)</h1>
        <p>
          • Este PDF incluye dos versiones, una a color y otra en escala de
          grises.
        </p>
        <p>
          • <strong>Activa los colores de fondo</strong> para imprimir a color.
        </p>
        <p>• Imprime solo la versión que necesites.</p>
        <p>
          • Al imprimir debes poner <strong>Escala: 100%</strong>. El carnet
          debe medir 8x5 cm.
        </p>
      </div>
    </div>
  `);
}

function renderCardHeader({} = {}) {
  return syntax(html`
    <div class="card--header">
      <div class="card-header__logo">
        <div class="card-header__logo__left"></div>
        <div class="card-header__logo__right"></div>
      </div>
      <div class="card-header__text">
        <span class="line"><strong>Pase de Movilidad</strong></span>
        <span class="line">Campaña SARS-CoV-2</span>
      </div>
    </div>
  `);
}

function renderDataItem(label, content) {
  return syntax(html`
    <span class="line card-data__data-item">
      <span class="line card-data__label">${label}</span>
      <span class="line">${content}</span>
    </span>
  `);
}

function renderVaccine(vaccine) {
  return syntax(html`
    <span class="line card-back__item">
      <span class="line">
        <span class="card-back__title"
          ><strong>${vaccine.date} - ${vaccine.laboratory}</strong></span
        >
        <span class="card-back__small">${vaccine.vaccine}</span>
      </span>
      <span class="line card-back__small"
        >${vaccine.center} - Lote: ${vaccine.lot}</span
      >
      <span class="line card-back__small"></span>
    </span>
  `);
}

function renderVaccinations(vaccinations) {
  const flatVaccines = vaccinations
    .map((schema) => schema.vaccines)
    .reduce((prev, cur) => {
      return [...prev, ...cur];
    }, []);
  return flatVaccines.map(renderVaccine).join("");
}

function renderCardStage(data, { grayscale = false } = {}) {
  return syntax(html`<div class="card-stage ${grayscale ? "bw" : ""}">
    <div class="card">
      ${renderCardHeader()}
      <div class="card-front-content">
        <div class="card-data">
          ${renderDataItem("Nombre:", `${data.names} ${data.lastNames}`)}
          ${renderDataItem("Identificación:", data.id)}
          ${renderDataItem("Fecha de nacimiento:", data.birthdate)}
        </div>
        <div class="card-qr">
          <img src="${data.image}" class="card-qr-image" />
        </div>
      </div>
    </div>
    <div class="card revert">
      <div class="card-back-content">${renderVaccinations(data.vaccines)}</div>
    </div>
  </div>`);
}

async function renderPass(data) {
  const image = await renderQR(data.url);

  const completeData = { ...data, image };

  const printDocument = document.querySelector("#print");

  printDocument.innerHTML = syntax(html`
    ${renderInstructionsPage()}
    <div class="page">
      <h2>Versión a color</h2>
      ${renderCardStage(completeData)}
    </div>
    <div class="page">
      <h2>Versión en escala de grises</h2>
      ${renderCardStage(completeData, { grayscale: true })}
    </div>
  `);
}

export default renderPass;
