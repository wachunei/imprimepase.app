import { frameIdentifier } from "../renderPass";

async function printPass() {
  //   document.getElementById(frameIdentifier).contentWindow.print();
  window.print();
}

export default printPass;
