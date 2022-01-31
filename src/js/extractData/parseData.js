import { capitalize } from "../utils";

const CAMPAIGN = "Campaña SARS-CoV-2";
const PERSONAL_DATA_TOKENS = [
  "Apellidos / Last Name:",
  "Nombres / First and Middle Name:",
  "N° de Documento / Document ID:",
  "Fecha de Nacimiento / Date of Birth:",
  "Escaneando este QR se verifica el estado del Pase de Movilidad",
];

const VACCINATIONS_TOKENS = ["Esquema:", "Refuerzo:"];
const VACCINES_TOKENS = [
  "1° dosis Laboratorio fabricante / Manufacturer:",
  "2° dosis Laboratorio fabricante / Manufacturer:",
  "Refuerzo Laboratorio fabricante / Manufacturer:",
  "Refuerzo Laboratorio fabricante / Manufacturer:",
];

const VACCINE_TOKENS = [
  "Fecha de vacunación / Vaccination date:",
  "Vacuna administrada / Vaccine product:",
  "Vacunatorio / Vaccination center:",
  "Lote o serie / Lot or series:",
];

const finder = (data, substring, { fromIndex = 0, mandatory = false } = {}) => {
  const index = data.indexOf(substring, fromIndex);
  if (mandatory && index === -1)
    throw new Error(`Substring ${substring} not found`);
  return index;
};

const readBetweenTokens = (
  data,
  tokens,
  { reachStart = false, reachEnd = false } = {}
) => {
  let currentIndex = 0;
  let indexes = [];
  const presentTokens = [];
  const content = [];

  for (let i = 0; i < tokens.length; i++) {
    const index = finder(data, tokens[i], { fromIndex: currentIndex });
    if (index !== -1) {
      presentTokens.push(tokens[i]);
      indexes.push(index);
      currentIndex = index + tokens[i].length;
    }
  }
  if (reachStart && indexes[0] !== 0) {
    indexes.unshift(0);
    presentTokens.unshift("");
  }
  for (let i = 0; i < indexes.length - Number(!Boolean(reachEnd)); i++) {
    content.push(
      data
        .substring(
          indexes[i] + presentTokens[i].length,
          indexes[i + 1] || data.length
        )
        .trim()
    );
  }
  return content;
};

const parsePersonalInformation = (data) => {
  const personalData = readBetweenTokens(data, PERSONAL_DATA_TOKENS);
  const personalInformation = {
    names: capitalize(personalData[1]),
    lastNames: capitalize(personalData[0]),
    birthdate: personalData[3],
    id: personalData[2],
  };
  return personalInformation;
};

const parseVaccine = (vaccine) => {
  const vaccineRawData = readBetweenTokens(vaccine, VACCINE_TOKENS, {
    reachStart: true,
    reachEnd: true,
  });
  if (vaccineRawData.length === 1) return vaccineRawData[0];
  const vaccineData = {
    laboratory: vaccineRawData[0],
    date: vaccineRawData[1],
    vaccine: vaccineRawData[2],
    center: vaccineRawData[3],
    lot: vaccineRawData[4],
  };
  return vaccineData;
};

const parseVaccines = (schema) => {
  const vaccines = readBetweenTokens(schema, VACCINES_TOKENS, {
    reachStart: true,
    reachEnd: true,
  });
  return vaccines.map(parseVaccine);
};

const parseVaccinations = (data) => {
  const vaccinationSchemes = readBetweenTokens(data, VACCINATIONS_TOKENS, {
    reachEnd: true,
  });
  const vaccinationsData = [];

  vaccinationSchemes.forEach((scheme, index) => {
    const data = parseVaccines(scheme);
    if (index === 0) {
      vaccinationsData.push({
        schema: data[0],
        vaccines: data.slice(1),
      });
    } else {
      vaccinationsData.push({
        schema: "Refuerzo",
        vaccines: data,
      });
    }
  });

  return vaccinationsData;
};

function parseData(rawData) {
  const data = rawData
    .replace(/\s+/g, " ")
    .replace("\u0001\u0002\u0001", "")
    .trim();

  finder(data, CAMPAIGN, { mandatory: true });

  const personalInformation = parsePersonalInformation(data);
  const vaccinesInformation = parseVaccinations(data);

  const parsedData = {
    ...personalInformation,
    vaccines: vaccinesInformation,
  };
  return parsedData;
}

export default parseData;
