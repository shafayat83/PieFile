import React from 'react';

export default function HeroIllustration({ isDragging = false, isUploading = false, size = 310 }) {
  return (
    <div className={`hero-pie-container ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="hero-pie-svg"
      >
        <defs>
          {/* Crust Outer Rim Gradient */}
          <radialGradient id="crustGlow" cx="50%" cy="50%" r="50%">
            <stop offset="65%" stopColor="#E27D30" />
            <stop offset="78%" stopColor="#D97706" />
            <stop offset="90%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </radialGradient>

          {/* Cheese Surface Gradient with rich melted core */}
          <radialGradient id="cheeseGlow" cx="44%" cy="36%" r="60%">
            <stop offset="0%" stopColor="#FEF9C3" />
            <stop offset="25%" stopColor="#FEF08A" />
            <stop offset="55%" stopColor="#FBBF24" />
            <stop offset="82%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </radialGradient>

          {/* Wood-Oven Radial Aura */}
          <filter id="pieAura" x="-35%" y="-35%" width="170%" height="170%">
            <feGaussianBlur stdDeviation="22" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Topping Shadows for 3D Layering */}
          <filter id="toppingShadow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.38" />
          </filter>

          {/* Pepperoni Gradients */}
          <radialGradient id="pepGrad1" cx="36%" cy="30%" r="64%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="40%" stopColor="#EF4444" />
            <stop offset="80%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#881337" />
          </radialGradient>
          <radialGradient id="pepGrad2" cx="34%" cy="28%" r="66%">
            <stop offset="0%" stopColor="#FCA5A5" />
            <stop offset="42%" stopColor="#F87171" />
            <stop offset="78%" stopColor="#B91C1C" />
            <stop offset="100%" stopColor="#6F0E0E" />
          </radialGradient>

          {/* Basil Gradient */}
          <linearGradient id="basilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="55%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>

          {/* Mushroom Gradient */}
          <linearGradient id="shroomGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          {/* Crown Center Glow & Shadow */}
          <filter id="crownShadow" x="-35%" y="-35%" width="170%" height="170%">
            <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#000000" floodOpacity="0.55" />
            <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#F59E0B" floodOpacity="0.75" />
          </filter>
        </defs>

        {/* Ambient Wood-Oven Radial Aura */}
        <circle cx="160" cy="160" r="148" fill="rgba(226, 109, 45, 0.22)" filter="url(#pieAura)" className="pie-ambient-aura" />

        {/* Slow, Serene Orbiting Ring */}
        <circle
          cx="160"
          cy="160"
          r="142"
          stroke="rgba(245, 158, 11, 0.3)"
          strokeWidth="1.5"
          strokeDasharray="6 10"
          fill="none"
          className="pie-orbit-ring"
        />

        {/* Main Pie Body */}
        <g className="pie-body-group">
          {/* Thick Golden Crust Rim */}
          <circle cx="160" cy="160" r="136" fill="url(#crustGlow)" stroke="#92400E" strokeWidth="3.5" className="pie-crust-base" />

          {/* Inner Baked Crust Ridge */}
          <circle cx="160" cy="160" r="126" fill="#B45309" opacity="0.6" />

          {/* Melted Cheese Surface */}
          <circle cx="160" cy="160" r="118" fill="url(#cheeseGlow)" className="pie-cheese-core" />

          {/* Baked Blister Speckles (Leopard spotting) */}
          <g opacity="0.55" className="pie-blisters">
            <ellipse cx="120" cy="95" rx="5" ry="3" fill="#92400E" />
            <ellipse cx="205" cy="120" rx="4.5" ry="2.5" fill="#78350F" />
            <ellipse cx="140" cy="225" rx="6" ry="3.5" fill="#92400E" />
            <ellipse cx="98" cy="180" rx="4" ry="2" fill="#78350F" />
            <ellipse cx="218" cy="205" rx="5" ry="3" fill="#92400E" />
            <circle cx="178" cy="98" r="2.5" fill="#B45309" />
            <circle cx="132" cy="150" r="2" fill="#B45309" />
          </g>

          {/* Subtle Slice Separation Lines */}
          <g stroke="#D97706" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.4" className="pie-slice-lines">
            <line x1="160" y1="42" x2="160" y2="102" />
            <line x1="160" y1="218" x2="160" y2="278" />
            <line x1="42" y1="160" x2="102" y2="160" />
            <line x1="218" y1="160" x2="278" y2="160" />
            <line x1="76" y1="76" x2="118" y2="118" />
            <line x1="202" y1="202" x2="244" y2="244" />
            <line x1="244" y1="76" x2="202" y2="118" />
            <line x1="118" y1="202" x2="76" y2="244" />
          </g>

          {/* Toppings: Sizzling Pepperoni */}
          <g className="topping-pepperoni" filter="url(#toppingShadow)">
            {/* Top-Right Pepperoni */}
            <g className="pep-slice pep-1">
              <circle cx="215" cy="114" r="22.5" fill="url(#pepGrad1)" stroke="#7F1D1D" strokeWidth="1.5" />
              <circle cx="208" cy="109" r="1.5" fill="#FEF2F2" opacity="0.75" />
              <circle cx="223" cy="117" r="1.5" fill="#450A0A" />
              <circle cx="214" cy="122" r="1.2" fill="#FEF2F2" opacity="0.8" />
            </g>

            {/* Bottom-Left Pepperoni */}
            <g className="pep-slice pep-2">
              <circle cx="104" cy="208" r="24.5" fill="url(#pepGrad2)" stroke="#7F1D1D" strokeWidth="1.5" />
              <circle cx="97" cy="202" r="1.8" fill="#FEF2F2" opacity="0.75" />
              <circle cx="111" cy="214" r="1.5" fill="#450A0A" />
              <circle cx="105" cy="218" r="1.4" fill="#FEF2F2" opacity="0.85" />
            </g>

            {/* Top-Left Pepperoni */}
            <g className="pep-slice pep-3">
              <circle cx="118" cy="104" r="20.5" fill="url(#pepGrad1)" stroke="#7F1D1D" strokeWidth="1.5" />
              <circle cx="112" cy="99" r="1.5" fill="#FEF2F2" opacity="0.75" />
              <circle cx="122" cy="111" r="1.3" fill="#450A0A" />
            </g>

            {/* Bottom-Right Pepperoni */}
            <g className="pep-slice pep-4">
              <circle cx="208" cy="212" r="21.5" fill="url(#pepGrad2)" stroke="#7F1D1D" strokeWidth="1.5" />
              <circle cx="202" cy="207" r="1.5" fill="#FEF2F2" opacity="0.8" />
              <circle cx="214" cy="219" r="1.4" fill="#450A0A" />
            </g>
          </g>

          {/* Toppings: Earthy Mushrooms */}
          <g className="topping-mushrooms" filter="url(#toppingShadow)">
            <g transform="translate(145, 66) rotate(12)" className="mush-slice mush-1">
              <path d="M4 15 C4 6 12 0 21 0 C30 0 38 6 38 15 C38 17 34 18 21 18 C8 18 4 17 4 15 Z" fill="url(#shroomGrad)" />
              <path d="M17 18 L18 26 C18 27.5 24 27.5 24 26 L25 18 Z" fill="#CBD5E1" />
            </g>

            <g transform="translate(66, 142) rotate(-25)" className="mush-slice mush-2">
              <path d="M4 15 C4 6 12 0 21 0 C30 0 38 6 38 15 C38 17 34 18 21 18 C8 18 4 17 4 15 Z" fill="url(#shroomGrad)" />
              <path d="M17 18 L18 26 C18 27.5 24 27.5 24 26 L25 18 Z" fill="#CBD5E1" />
            </g>

            <g transform="translate(145, 230) rotate(-10)" className="mush-slice mush-3">
              <path d="M4 15 C4 6 12 0 21 0 C30 0 38 6 38 15 C38 17 34 18 21 18 C8 18 4 17 4 15 Z" fill="url(#shroomGrad)" />
              <path d="M17 18 L18 26 C18 27.5 24 27.5 24 26 L25 18 Z" fill="#CBD5E1" />
            </g>
          </g>

          {/* Toppings: Glossy Black Olives */}
          <g className="topping-olives" filter="url(#toppingShadow)">
            <g className="olive-slice olive-1">
              <circle cx="165" cy="115" r="8.5" fill="#18181B" stroke="#27272A" strokeWidth="1.5" />
              <circle cx="165" cy="115" r="3.6" fill="#D97706" />
            </g>

            <g className="olive-slice olive-2">
              <circle cx="236" cy="165" r="8" fill="#18181B" stroke="#27272A" strokeWidth="1.5" />
              <circle cx="236" cy="165" r="3.4" fill="#F59E0B" />
            </g>

            <g className="olive-slice olive-3">
              <circle cx="84" cy="110" r="7.5" fill="#18181B" stroke="#27272A" strokeWidth="1.5" />
              <circle cx="84" cy="110" r="3.2" fill="#D97706" />
            </g>

            <g className="olive-slice olive-4">
              <circle cx="170" cy="205" r="8" fill="#18181B" stroke="#27272A" strokeWidth="1.5" />
              <circle cx="170" cy="205" r="3.4" fill="#F59E0B" />
            </g>
          </g>

          {/* Toppings: Fresh Aromatic Basil Leaves */}
          <g className="topping-basil" filter="url(#toppingShadow)">
            {/* Basil 1 - Top Center */}
            <g className="basil-leaf basil-1">
              <path
                d="M172 80 C186 73 200 83 197 98 C189 109 174 100 172 80 Z"
                fill="url(#basilGrad)"
                stroke="#14532D"
                strokeWidth="1.2"
              />
              <path d="M176 85 Q185 91 191 97" stroke="#86EFAC" strokeWidth="1" fill="none" opacity="0.8" />
            </g>

            {/* Basil 2 - Right */}
            <g className="basil-leaf basil-2">
              <path
                d="M228 134 C243 135 246 153 235 162 C221 164 219 145 228 134 Z"
                fill="url(#basilGrad)"
                stroke="#14532D"
                strokeWidth="1.2"
              />
            </g>

            {/* Basil 3 - Bottom-Left */}
            <g className="basil-leaf basil-3">
              <path
                d="M82 170 C79 154 95 147 105 156 C112 170 97 180 82 170 Z"
                fill="url(#basilGrad)"
                stroke="#14532D"
                strokeWidth="1.2"
              />
            </g>
          </g>
        </g>

        {/* Rising Warm Steam Wisps */}
        <g className="pie-steam" stroke="#FED7AA" strokeWidth="2.8" strokeLinecap="round" opacity="0.7" fill="none">
          <path d="M125 55 Q115 35 130 18 Q145 0 130 -14" className="steam-line steam-1" />
          <path d="M155 48 Q170 30 155 12 Q140 -5 158 -20" className="steam-line steam-2" />
          <path d="M185 52 Q172 32 188 16 Q202 0 186 -14" className="steam-line steam-3" />
          <path d="M210 58 Q225 40 215 22 Q205 5 218 -10" className="steam-line steam-4" />
        </g>

        {/* Floating Aroma Sparkles */}
        <g className="pie-sparkles">
          <circle cx="115" cy="40" r="2.2" fill="#FDE047" className="sparkle-dot sparkle-1" />
          <circle cx="205" cy="45" r="1.8" fill="#F59E0B" className="sparkle-dot sparkle-2" />
          <circle cx="160" cy="20" r="2.5" fill="#FFFFFF" className="sparkle-dot sparkle-3" />
        </g>

        {/* Center Crown Emblem: Big, Prominent, Friendly White Upward Arrow */}
        <g className="hero-center-crown" filter="url(#crownShadow)">
          {/* Outer Pulsing Wave Ring */}
          <circle cx="160" cy="160" r="48" fill="none" stroke="rgba(245, 158, 11, 0.45)" strokeWidth="1.5" className="crown-pulse-ring" />

          {/* Deep Charcoal Outer Disc */}
          <circle cx="160" cy="160" r="42" fill="rgba(14, 14, 18, 0.94)" stroke="#E26D2D" strokeWidth="3.5" className="crown-inner-badge" />

          {/* Vibrant Baked Amber Core Disc */}
          <circle cx="160" cy="160" r="35" fill="url(#crustGlow)" className="crown-amber-disc" />

          {/* Friendly White Upward Arrow - Crisper, Thicker, Clearer */}
          <g className="hero-arrow-symbol">
            <path
              d="M160 181 L160 139"
              stroke="#FFFFFF"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
            <path
              d="M145 152 L160 137 L175 152"
              stroke="#FFFFFF"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
