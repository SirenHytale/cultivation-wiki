/* Pre-paint theme resolution.

   This has to run before the first paint, or a light-theme reader gets a flash
   of the dark palette on every navigation. It is deliberately a blocking inline
   script in <head> — the one place a synchronous script is the right call. */

export const THEME_STORAGE_KEY = "cultivation-wiki-theme";

const SNIPPET = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}")||(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SNIPPET }} />;
}
