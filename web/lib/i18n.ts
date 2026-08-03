/* Chrome strings, per language. Ported from SITE.ui in the static data/nav.js.
   These used to be injected by site.js at runtime; now they are read on the
   server and baked into the HTML. */

import type { Lang } from "./nav";

export interface UIStrings {
  search: string;
  searchAria: string;
  searchPlaceholder: string;
  searchEmpty: string;
  noResults: string;
  onThisPage: string;
  prev: string;
  next: string;
  navigate: string;
  openHit: string;
  closeHit: string;
  elsewhere: string;
  rights: string;
  aHytaleMod: string;
  langName: string;
  langSwitch: string;
  untranslated: string;
  untranslatedTitle: string;
  skipToContent: string;
  openNav: string;
  themeToggle: string;
  searching: string;
}

export const UI: Record<Lang, UIStrings> = {
  en: {
    search: "Search the wiki…",
    searchAria: "Search the wiki",
    searchPlaceholder: "Search realms, Qi, commands…",
    searchEmpty: "Search across every page of the wiki.",
    noResults: "No results for",
    onThisPage: "On this page",
    prev: "← Previous",
    next: "Next →",
    navigate: "navigate",
    openHit: "open",
    closeHit: "close",
    elsewhere: "ELSEWHERE",
    rights: "All rights reserved.",
    aHytaleMod: "a Hytale mod",
    langName: "中文",
    langSwitch: "Switch to Chinese",
    untranslated: "EN",
    untranslatedTitle: "Not translated yet — opens the English page",
    skipToContent: "Skip to content",
    openNav: "Open navigation",
    themeToggle: "Toggle day / night theme",
    searching: "Searching…",
  },
  zh: {
    search: "搜索本站…",
    searchAria: "搜索本站",
    searchPlaceholder: "搜索境界、灵气、指令…",
    searchEmpty: "搜索本站所有页面。",
    noResults: "未找到结果：",
    onThisPage: "本页目录",
    prev: "← 上一页",
    next: "下一页 →",
    navigate: "选择",
    openHit: "打开",
    closeHit: "关闭",
    elsewhere: "相关链接",
    rights: "版权所有。",
    aHytaleMod: "Hytale 模组",
    langName: "English",
    langSwitch: "切换到英文",
    untranslated: "EN",
    untranslatedTitle: "尚未翻译 —— 将打开英文页面",
    skipToContent: "跳到正文",
    openNav: "打开导航",
    themeToggle: "切换昼夜主题",
    searching: "搜索中…",
  },
};

export function t(lang: Lang): UIStrings {
  return UI[lang] ?? UI.en;
}

/** Decorative glyph for a page eyebrow, by English sidebar group name. */
export const GROUP_HAN: Record<string, string> = {
  "Start Here": "起",
  "The Path": "道",
  "Arts & Treasures": "術",
  "The World": "界",
  Tools: "器",
  Configuration: "配",
  "For Developers": "匠",
  About: "誌",
};

/** <html lang> value for each language. */
export const HTML_LANG: Record<Lang, string> = { en: "en", zh: "zh-CN" };
