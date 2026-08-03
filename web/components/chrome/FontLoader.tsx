/* Non-blocking web font.
 *
 * Noto Serif SC cannot move to next/font — that loader exposes only
 * latin / latin-ext / cyrillic / vietnamese for this family, so self-hosting it
 * would drop every Chinese glyph. It therefore stays a Google Fonts stylesheet,
 * which by default is a render-blocking request to a third-party origin and was
 * the main cost in First Contentful Paint.
 *
 * This restores the pattern the original static site used: preload the sheet,
 * attach it as `media="print"` so it never blocks the first paint, then flip it
 * to `all` once it has arrived. `display=swap` means text renders immediately
 * in the fallback face and re-flows to the real one, and the fallback stack in
 * xianxia.css already lists system CJK serifs.
 */

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;900&display=swap";

/* Flip the sheet from print to all the moment it loads. Handles the race where
   it is already cached and parsed before this script runs. */
const SWAP = `(function(){var l=document.querySelector('link[data-font-swap]');if(!l)return;function go(){l.media='all'}if(l.sheet){go()}else{l.addEventListener('load',go)}})()`;

export function FontLoader() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="preload" as="style" href={FONT_HREF} />
      <link rel="stylesheet" href={FONT_HREF} media="print" data-font-swap="" />
      <noscript>
        <link rel="stylesheet" href={FONT_HREF} />
      </noscript>
      <script dangerouslySetInnerHTML={{ __html: SWAP }} />
    </>
  );
}
