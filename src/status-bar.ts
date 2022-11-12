import {
  CreateStatusBar,
  CreateStatusBarItem,
  CreateStatusBarCursorNavText,
  GetEndOfLineSequence,
  CreateStatusBarColorThemeText
} from "./status-bar-utils";
import * as monaco from "monaco-editor";
import { editor } from "./main";

const statusBarRight = CreateStatusBar("statusbar-right", document.querySelector("#statusbar-wrapper")!);
const statusBarLeft = CreateStatusBar("statusbar-left", document.querySelector("#statusbar-wrapper")!);

const {
  item: statusBarCursorNav,
  itemText: statusBarCursorNavText,
  itemToolTip: statusBarCursorNavToolTip
} = CreateStatusBarItem("statusbar-cur-nav", statusBarRight);
statusBarCursorNavText.textContent = CreateStatusBarCursorNavText(editor.getPosition());
statusBarCursorNavToolTip.textContent = "Go to Line/Column";

const statusBarEndOfLineSequence = CreateStatusBarItem("statusbar-eof-seq", statusBarRight);
statusBarEndOfLineSequence.itemText.textContent = GetEndOfLineSequence();
statusBarEndOfLineSequence.itemToolTip.textContent = "Select End of Line Sequence";

const statusBarLanguageMode = CreateStatusBarItem("statusbar-lang-mode", statusBarRight);
statusBarLanguageMode.itemText.textContent = editor.getModel()?.getLanguageId() ?? "";
statusBarLanguageMode.itemToolTip.textContent = "Select Language Mode";

const statusColorTheme = CreateStatusBarItem("statusbar-color-theme", statusBarLeft);
statusColorTheme.itemText.textContent = CreateStatusBarColorThemeText();
statusColorTheme.itemToolTip.textContent = "Select Color Theme";

editor.onDidChangeCursorPosition((event) => {
  // console.debug(e.position);
  const { position } = event;
  const text = CreateStatusBarCursorNavText(position);
  statusBarCursorNavText.textContent = text;
});

editor.onDidChangeCursorSelection((event) => {
  const { selection } = event;
  const selectedRange = monaco.Range.fromPositions(selection.getStartPosition(), selection.getEndPosition());
  const characterCount = editor.getModel()?.getCharacterCountInRange(selectedRange);
  if (!selection.isEmpty()) {
    // console.debug(characterCount);
    statusBarCursorNavText.textContent = statusBarCursorNavText.textContent
      ? statusBarCursorNavText.textContent?.concat(` (${characterCount ?? 0} character selected)`)
      : // eslint-disable-next-line unicorn/no-null
        null;
  }
});

statusBarCursorNav.addEventListener("click", () => {
  const value = JSON.stringify(
    editor.getSupportedActions().map(({ alias, id, label }) => ({ alias, id, label })),
    undefined,
    "\t"
  ).toString();
  const model = monaco.editor.createModel(value, "json");
  editor.setModel(model);

  editor.focus();
  editor.trigger("", "editor.action.gotoLine", "");
});

statusColorTheme.item.addEventListener("click", () => {
  editor.focus();
  editor.trigger("", "edtior.action.changeColorTheme", "");
});

editor.onDidChangeModel(() => {
  statusBarEndOfLineSequence.itemText.textContent = GetEndOfLineSequence();
  statusBarLanguageMode.itemText.textContent = editor.getModel()?.getLanguageId() ?? "";
});
// @ts-expect-error internal API
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
editor._themeService.onDidColorThemeChange(() => {
  statusColorTheme.itemText.textContent = CreateStatusBarColorThemeText();
});
editor.addAction({
  // An unique identifier of the contributed action.
  id: "edtior.action.changeColorTheme",

  // A label of the action that will be presented to the user.
  label: "Change Color Theme",

  // An optional array of keybindings for the action.
  keybindings: [
    // chord
    monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyT)
  ],
  run: () => {
    // @ts-expect-error internal API
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (editor._themeService._theme.id == "vs") {
      editor.updateOptions({ theme: "vs-dark" });
    } else {
      editor.updateOptions({ theme: "vs" });
    }
  }
});
