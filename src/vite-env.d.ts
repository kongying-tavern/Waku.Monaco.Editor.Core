/// <reference types="vite/client" />
import * as monaco from "monaco-editor";
declare type Position = monaco.Position | null;
declare type IStandaloneEditorConstructionOptions = monaco.editor.IStandaloneEditorConstructionOptions;
declare type IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;
declare global {
  interface Window {
    editor: IStandaloneCodeEditor;
  }
}
