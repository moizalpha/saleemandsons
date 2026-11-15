"use client";

import { useId } from "react";

export default function ProductArt({ art, className = "" }: { art: "carryall" | "journal" | "tray" | "weekender"; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const gid = (name: string) => `${uid}-${name}`;

  return (
    <svg className={`product-art ${className}`} viewBox="0 0 420 330" role="img" aria-label={`${art} product illustration`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gid("leather")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a5744e" />
          <stop offset="0.52" stopColor="#69432f" />
          <stop offset="1" stopColor="#38251c" />
        </linearGradient>
        <linearGradient id={gid("canvas")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d0bea0" />
          <stop offset="1" stopColor="#8e8068" />
        </linearGradient>
        <linearGradient id={gid("brass")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#dec28b" />
          <stop offset="0.52" stopColor="#9b763b" />
          <stop offset="1" stopColor="#624a28" />
        </linearGradient>
        <filter id={gid("shadow")} x="-35%" y="-35%" width="170%" height="190%">
          <feGaussianBlur stdDeviation="11" />
        </filter>
        <pattern id={gid("grain")} width="11" height="11" patternUnits="userSpaceOnUse">
          <path d="M2 1l1 2M8 6l1 2M4 10l1-1" stroke="#fff" strokeOpacity=".12" strokeWidth=".6" />
        </pattern>
      </defs>
      <ellipse cx="215" cy="273" rx="118" ry="15" fill="#211812" opacity=".22" filter={`url(#${gid("shadow")})`} />
      {art === "carryall" && (
        <g transform="translate(58 36) rotate(-5 152 130)">
          <path d="M104 98V68c0-31 22-51 51-51s51 20 51 51v30" fill="none" stroke="#36251b" strokeWidth="17" strokeLinecap="round" />
          <path d="M104 98V68c0-31 22-51 51-51s51 20 51 51v30" fill="none" stroke={`url(#${gid("brass")})`} strokeWidth="3" strokeLinecap="round" />
          <rect x="26" y="83" width="258" height="160" rx="22" fill={`url(#${gid("leather")})`} />
          <rect x="26" y="83" width="258" height="160" rx="22" fill={`url(#${gid("grain")})`} />
          <path d="M36 111h238" stroke="#d2ac7a" strokeOpacity=".27" strokeWidth="1.4" />
          <rect x="43" y="165" width="224" height="52" rx="9" fill="#3a281f" opacity=".88" />
          <rect x="143" y="154" width="23" height="31" rx="3" fill={`url(#${gid("brass")})`} />
          <rect x="149" y="160" width="11" height="19" rx="1.5" fill="#2d2118" />
          <path d="M40 100v126M270 100v126" stroke="#e0bd8b" strokeOpacity=".22" strokeWidth="1.3" />
          <circle cx="155" cy="205" r="2.4" fill="#c8a06a" />
        </g>
      )}
      {art === "journal" && (
        <g transform="translate(70 38) rotate(-9 140 130)">
          <path d="M73 58l160-17c11-1 20 7 21 18l15 180c1 11-7 20-18 21L91 276c-11 1-20-7-21-18L55 78c-1-10 7-19 18-20z" fill="#2d211a" opacity=".2" transform="translate(8 9)" />
          <path d="M73 58l160-17c11-1 20 7 21 18l15 180c1 11-7 20-18 21L91 276c-11 1-20-7-21-18L55 78c-1-10 7-19 18-20z" fill={`url(#${gid("leather")})`} />
          <path d="M91 62l13 207" stroke="#d3b28d" strokeOpacity=".35" strokeWidth="2" />
          <path d="M213 49l16 207" stroke="#211710" strokeOpacity=".38" strokeWidth="2" />
          <path d="M135 143l52-5" stroke="#dec69d" strokeOpacity=".65" strokeWidth="2" />
          <path d="M137 159l65-7" stroke="#dec69d" strokeOpacity=".35" strokeWidth="1.5" />
          <path d="M139 176l42-5" stroke="#dec69d" strokeOpacity=".35" strokeWidth="1.5" />
          <path d="M238 70l18 205" stroke="#e6d6bd" strokeOpacity=".4" strokeWidth="7" />
        </g>
      )}
      {art === "tray" && (
        <g transform="translate(46 68) rotate(-5 165 100)">
          <path d="M34 115l62-66c7-8 17-13 28-13h137c12 0 22 5 29 14l50 67c8 10 1 25-12 26l-265 19c-14 1-20-15-29-47z" fill="#1f1b17" opacity=".25" transform="translate(6 16)" />
          <path d="M34 108l62-66c7-8 17-13 28-13h137c12 0 22 5 29 14l50 67c8 10 1 25-12 26l-265 19c-14 1-20-15-29-47z" fill={`url(#${gid("brass")})`} />
          <path d="M52 106l53-55c6-6 13-9 21-9h127c8 0 15 3 21 9l42 55-264 22z" fill="#342a1d" />
          <path d="M69 111l44-44c5-5 11-7 18-7h112c7 0 13 2 18 7l35 43-227 18z" fill="#5b482e" opacity=".8" />
          <path d="M55 131l263-21" stroke="#e3c488" strokeOpacity=".75" strokeWidth="2" />
        </g>
      )}
      {art === "weekender" && (
        <g transform="translate(38 34) rotate(3 174 130)">
          <path d="M107 83V55c0-23 17-40 40-40s40 17 40 40v28" fill="none" stroke="#3b2b20" strokeWidth="13" strokeLinecap="round" />
          <path d="M107 83V55c0-23 17-40 40-40s40 17 40 40v28" fill="none" stroke="#b18d56" strokeWidth="2" strokeLinecap="round" />
          <path d="M35 112c0-14 11-25 25-25h230c14 0 25 11 25 25v116c0 19-14 33-33 33H68c-19 0-33-14-33-33z" fill={`url(#${gid("canvas")})`} />
          <path d="M35 112c0-14 11-25 25-25h230c14 0 25 11 25 25v116c0 19-14 33-33 33H68c-19 0-33-14-33-33z" fill={`url(#${gid("grain")})`} />
          <path d="M36 134h278M36 222h278" stroke="#5a4938" strokeOpacity=".5" strokeWidth="4" />
          <path d="M54 91v145M296 91v145" stroke="#62432c" strokeWidth="11" />
          <path d="M54 94v140M296 94v140" stroke="#c49b63" strokeOpacity=".55" strokeWidth="1.5" />
          <rect x="148" y="151" width="38" height="21" rx="3" fill={`url(#${gid("brass")})`} />
          <path d="M166 155v13" stroke="#302216" strokeWidth="3" />
        </g>
      )}
    </svg>
  );
}
