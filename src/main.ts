import "./style.css";
import * as monaco from "monaco-editor";

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import { IStandaloneEditorConstructionOptions } from "./vite-env";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<div id="editor-wrapper"></div>
<div id="statusbar-wrapper"></div>
`;

self.MonacoEnvironment = {
  getWorker(_, label) {
    switch (label) {
      case "json": {
        return new jsonWorker();
      }
      case "css":
      case "scss":
      case "less": {
        return new cssWorker();
      }
      case "html":
      case "handlebars":
      case "razor": {
        return new htmlWorker();
      }
      case "typescript":
      case "javascript": {
        return new tsWorker();
      }
      default: {
        return new editorWorker();
      }
    }
  }
};

const options: IStandaloneEditorConstructionOptions = {
  automaticLayout: true,
  renderWhitespace: "all",
  mouseWheelZoom: true,
  wordWrap: "on",
  wordWrapColumn: 80,
  minimap: {
    enabled: false
  }
};

const language = {
  value: "function hello() {\n\talert('Hello world!');\n}",
  language: "javascript"
};

const editorReference = document.querySelector<HTMLDivElement>("#editor-wrapper")!;

const CreateEditor = (editorReference: HTMLElement, options?: IStandaloneEditorConstructionOptions) =>
  monaco.editor.create(editorReference, options);

export const editor = CreateEditor(editorReference, {
  ...language,
  ...options
});
editor.focus();

window.editor = editor;
