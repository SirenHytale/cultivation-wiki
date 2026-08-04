/* Edit this file directly — it is the source. It was originally lifted verbatim
   from the pre-Next site, which no longer exists.

   The home page hero: a hand-drawn inline SVG mountain scene, the seal, the
   title block and the call-to-action buttons. Lifted verbatim rather than
   transcribed into JSX — it is decorative vector art where a mistyped path
   coordinate would be invisible in review and obvious on the page.

   The <canvas class="hero-motes"> stays in this markup; HeroMotes finds it in
   the DOM and drives it, which avoids wrapping the hero's absolutely
   positioned children in an element that would disturb the layout.
*/

export const heroEn = `<svg class="hero-scene" viewBox="0 0 1440 620" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color="#0B0503"/>
        <stop offset="52%"  stop-color="#1D0D07"/>
        <stop offset="82%"  stop-color="#48160F"/>
        <stop offset="100%" stop-color="#7C241B"/>
      </linearGradient>
      <radialGradient id="sunGlow">
        <stop offset="0%"   stop-color="#FFF0C4" stop-opacity="0.95"/>
        <stop offset="26%"  stop-color="#F6D77B" stop-opacity="0.55"/>
        <stop offset="58%"  stop-color="#C9A227" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="#7C241B" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="hazeGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color="#F6D77B" stop-opacity="0"/>
        <stop offset="100%" stop-color="#F6D77B" stop-opacity="0.10"/>
      </linearGradient>
    </defs>

    <rect width="1440" height="620" fill="url(#skyGrad)"/>
    <circle cx="1074" cy="196" r="260" fill="url(#sunGlow)"/>
    <circle cx="1074" cy="196" r="54" fill="#FFF3D2" opacity="0.60"/>
    <circle cx="1074" cy="196" r="54" fill="none" stroke="#F6D77B" stroke-width="1.5" opacity="0.45"/>

    <!-- far ridge -->
    <path class="peak-far" opacity="0.45" d="M0 470 L120 392 L210 438 L330 340 L432 424 L560 356 L660 430 L790 372 L900 446 L1030 368 L1140 440 L1260 386 L1360 448 L1440 402 L1440 620 L0 620 Z"/>
    <!-- drifting cloud bands -->
    <g class="drift-a">
      <ellipse class="cloud" cx="300" cy="404" rx="230" ry="15"/>
      <ellipse class="cloud" cx="470" cy="392" rx="150" ry="10"/>
    </g>
    <g class="drift-b">
      <ellipse class="cloud-b" cx="1000" cy="440" rx="270" ry="17"/>
      <ellipse class="cloud-b" cx="1180" cy="424" rx="160" ry="11"/>
    </g>

    <!-- mid ridge, with a pagoda on the tallest peak -->
    <path class="peak-mid" opacity="0.9" d="M0 528 L96 458 L190 506 L300 420 L410 500 L520 440 L640 512 L742 436 L860 508 L980 448 L1096 520 L1210 462 L1320 522 L1440 470 L1440 620 L0 620 Z"/>
    <g class="peak-near" transform="translate(298,420)">
      <rect x="-1.5" y="-30" width="3" height="30"/>
      <path d="M-22 0 L22 0 L14 -9 L-14 -9 Z"/>
      <rect x="-11" y="0" width="22" height="13"/>
      <path d="M-27 13 L27 13 L17 4 L-17 4 Z" opacity="0"/>
      <path d="M-26 15 L26 15 L16 6 L-16 6 Z"/>
      <rect x="-13" y="15" width="26" height="16"/>
      <path d="M-30 33 L30 33 L19 22 L-19 22 Z"/>
    </g>

    <!-- near ridge + valley haze -->
    <path class="peak-near" d="M0 596 L130 534 L250 590 L370 520 L500 588 L620 528 L760 596 L880 530 L1010 592 L1140 534 L1270 596 L1380 546 L1440 590 L1440 620 L0 620 Z"/>
    <rect y="470" width="1440" height="150" fill="url(#hazeGrad)"/>

    <!-- three cranes -->
    <g stroke="#E4D6B0" stroke-width="1.6" fill="none" opacity="0.4" stroke-linecap="round">
      <path d="M392 262 q9 -7 18 0 q9 -7 18 0"/>
      <path d="M452 236 q7 -5.5 14 0 q7 -5.5 14 0"/>
      <path d="M1012 288 q8 -6 16 0 q8 -6 16 0"/>
    </g>
  </svg>
  <canvas class="hero-motes" aria-hidden="true"></canvas>

  <div class="hero-inner">
    <img class="hero-seal" src="/assets/img/seal.svg" alt="" width="118" height="118">
    <h1>CULTIVATION</h1>
    <p class="hero-han">修仙之路</p>
    <p class="hero-lede">
      Draw the spirit energy out of the world, climb seven realms toward immortality,
      and survive the lightning the heavens send to answer every breakthrough.
      A full Xianxia progression system for Hytale.
    </p>
    <div class="hero-actions">
      <a class="btn" href="/getting-started/">Begin the Path</a>
      <a class="btn ghost" href="/realms/">Browse the Realms</a>
    </div>
    <div class="hero-meta">
      <span><b>7</b> Realms &middot; <b>28</b> Stages</span>
      <span><b>9</b> Skill Branches</span>
      <span><b>156</b> API Events</span>
      <span>Version <b>0.7.2</b></span>
    </div>
  </div>`;

export const heroZh = `<svg class="hero-scene" viewBox="0 0 1440 620" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color="#0B0503"/>
        <stop offset="52%"  stop-color="#1D0D07"/>
        <stop offset="82%"  stop-color="#48160F"/>
        <stop offset="100%" stop-color="#7C241B"/>
      </linearGradient>
      <radialGradient id="sunGlow">
        <stop offset="0%"   stop-color="#FFF0C4" stop-opacity="0.95"/>
        <stop offset="26%"  stop-color="#F6D77B" stop-opacity="0.55"/>
        <stop offset="58%"  stop-color="#C9A227" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="#7C241B" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="hazeGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color="#F6D77B" stop-opacity="0"/>
        <stop offset="100%" stop-color="#F6D77B" stop-opacity="0.10"/>
      </linearGradient>
    </defs>

    <rect width="1440" height="620" fill="url(#skyGrad)"/>
    <circle cx="1074" cy="196" r="260" fill="url(#sunGlow)"/>
    <circle cx="1074" cy="196" r="54" fill="#FFF3D2" opacity="0.60"/>
    <circle cx="1074" cy="196" r="54" fill="none" stroke="#F6D77B" stroke-width="1.5" opacity="0.45"/>

    <!-- far ridge -->
    <path class="peak-far" opacity="0.45" d="M0 470 L120 392 L210 438 L330 340 L432 424 L560 356 L660 430 L790 372 L900 446 L1030 368 L1140 440 L1260 386 L1360 448 L1440 402 L1440 620 L0 620 Z"/>
    <!-- drifting cloud bands -->
    <g class="drift-a">
      <ellipse class="cloud" cx="300" cy="404" rx="230" ry="15"/>
      <ellipse class="cloud" cx="470" cy="392" rx="150" ry="10"/>
    </g>
    <g class="drift-b">
      <ellipse class="cloud-b" cx="1000" cy="440" rx="270" ry="17"/>
      <ellipse class="cloud-b" cx="1180" cy="424" rx="160" ry="11"/>
    </g>

    <!-- mid ridge, with a pagoda on the tallest peak -->
    <path class="peak-mid" opacity="0.9" d="M0 528 L96 458 L190 506 L300 420 L410 500 L520 440 L640 512 L742 436 L860 508 L980 448 L1096 520 L1210 462 L1320 522 L1440 470 L1440 620 L0 620 Z"/>
    <g class="peak-near" transform="translate(298,420)">
      <rect x="-1.5" y="-30" width="3" height="30"/>
      <path d="M-22 0 L22 0 L14 -9 L-14 -9 Z"/>
      <rect x="-11" y="0" width="22" height="13"/>
      <path d="M-27 13 L27 13 L17 4 L-17 4 Z" opacity="0"/>
      <path d="M-26 15 L26 15 L16 6 L-16 6 Z"/>
      <rect x="-13" y="15" width="26" height="16"/>
      <path d="M-30 33 L30 33 L19 22 L-19 22 Z"/>
    </g>

    <!-- near ridge + valley haze -->
    <path class="peak-near" d="M0 596 L130 534 L250 590 L370 520 L500 588 L620 528 L760 596 L880 530 L1010 592 L1140 534 L1270 596 L1380 546 L1440 590 L1440 620 L0 620 Z"/>
    <rect y="470" width="1440" height="150" fill="url(#hazeGrad)"/>

    <!-- three cranes -->
    <g stroke="#E4D6B0" stroke-width="1.6" fill="none" opacity="0.4" stroke-linecap="round">
      <path d="M392 262 q9 -7 18 0 q9 -7 18 0"/>
      <path d="M452 236 q7 -5.5 14 0 q7 -5.5 14 0"/>
      <path d="M1012 288 q8 -6 16 0 q8 -6 16 0"/>
    </g>
  </svg>
  <canvas class="hero-motes" aria-hidden="true"></canvas>

  <div class="hero-inner">
    <img class="hero-seal" src="/assets/img/seal.svg" alt="" width="118" height="118">
    <h1 style="letter-spacing:0.18em">修 真</h1>
    <p class="hero-han">CULTIVATION</p>
    <p class="hero-lede">
      引天地灵气入体，历七重境界以求长生，
      并在每一次突破时挺过天降之劫。
      为 Hytale 打造的完整修真体系。
    </p>
    <div class="hero-actions">
      <a class="btn" href="/zh/getting-started/">踏上仙途</a>
      <a class="btn ghost" href="/zh/realms/">浏览境界</a>
    </div>
    <div class="hero-meta">
      <span><b>7</b> 重境界 &middot; <b>28</b> 个阶段</span>
      <span><b>9</b> 条天赋分支</span>
      <span><b>156</b> 个接口事件</span>
      <span>版本 <b>0.7.2</b></span>
    </div>
  </div>`;
