export const capitalize = (string) =>
  string
    .split(" ")
    .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

export const readFile = async (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = () => resolve(fileReader.result);
    fileReader.onerror = reject;

    fileReader.readAsArrayBuffer(file);
  });
};

const defaultTemplateLiteralTag = (strings, ...vars) => {
  let result = "";
  strings.forEach((str, i) => {
    result += `${str}${i === strings.length - 1 ? "" : vars[i]}`;
  });
  return result;
};

export const html = defaultTemplateLiteralTag;
export const syntax = (a) => a;
