import * as monaco from "monaco-editor";
import { editor } from "./main";
import { Position } from "./vite-env";

const CreateStatusBarItemText = (reference: HTMLElement) => {
  const itemText = CreateHTMLDivElementWithNode(`${reference.id}-text`, reference);
  itemText.classList.add("statusbar-item-text");
  return itemText;
};

const CreateStatusBarItemToolTip = (reference: HTMLElement) => {
  const itemToolTip = CreateHTMLDivElementWithNode(`${reference.id}-tooltip`, reference);
  itemToolTip.classList.add("statusbar-item-tooltip");
  return itemToolTip;
};

export const CreateHTMLElementById = <T extends keyof HTMLElementTagNameMap>(id: string, type: T) => {
  const element = document.createElement<T>(type);
  element.setAttribute("id", id);
  return element;
};

export const CreateStatusBarCursorNavText = (position: Position) =>
  `Ln ${position?.lineNumber ?? 0}, Col ${position?.column ?? 0}`;
export const CreateStatusBarColorThemeText = () => {
  // @ts-expect-error internal API
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const id: string = editor._themeService._theme.id;

  return `Theme: ${id}`;
};

export const CreateHTMLDivElementWithNode = (id: string, reference: HTMLElement) => {
  const element = CreateHTMLElementById(id, "div");
  document.querySelector(`#${reference.id}`)?.appendChild(element);
  return element;
};

export const CreateStatusBar = (id: string, reference: HTMLElement) => CreateHTMLDivElementWithNode(id, reference);

export const CreateStatusBarItem = (id: string, reference: HTMLElement) => {
  const item = CreateHTMLDivElementWithNode(id, reference);
  const itemText = CreateStatusBarItemText(item);
  const itemToolTip = CreateStatusBarItemToolTip(item);
  item.classList.add("statusbar-item");
  item.addEventListener("mouseover", () => OnToolTipOverflowViewPort(itemToolTip));
  return { item, itemText, itemToolTip };
};

const OnToolTipOverflowViewPort = (itemToolTip: HTMLElement) => {
  const { left, right } = itemToolTip.getBoundingClientRect();
  const border = 2;
  if (left < 0) {
    // reset tooltip style
    itemToolTip.style.transform = "translateX(0%)";
    itemToolTip.style.left = "0px";
    // get new tooltip bounding rect
    const rect = itemToolTip.getBoundingClientRect();
    itemToolTip.style.left = `${-rect.left + border}px`;
  }
  if (right > (window.innerWidth || document.documentElement.clientWidth)) {
    // reset tooltip style
    itemToolTip.style.transform = "translateX(0%)";
    itemToolTip.style.left = "0px";
    // get new tooltip bounding rect
    const rect = itemToolTip.getBoundingClientRect();
    itemToolTip.style.left = `${window.innerWidth - rect.right - border}px`;
  }
};

export const GetEndOfLineSequence = () => {
  switch (editor.getModel()?.getEndOfLineSequence()) {
    case monaco.editor.EndOfLineSequence.CRLF: {
      return "CRLF";
    }
    case monaco.editor.EndOfLineSequence.LF: {
      return "LF";
    }
    default: {
      return "";
    }
  }
};
