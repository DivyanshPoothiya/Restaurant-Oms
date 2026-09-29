/**
 * Design Tokens — Delizoso Luxury Theme
 * Dark matte black + metallic gold
 */

export const C = {
  // Backgrounds
  bg:       '#0A0A0A',   // primary background
  surface:  '#141414',   // card / surface
  surface2: '#1C1C1C',   // elevated surface
  border:   '#2A2A2A',   // subtle borders

  // Gold accents
  gold:     '#D4AF37',
  goldSoft: '#F4A460',
  goldDim:  '#D4AF3720', // 12% opacity gold for glows

  // Text
  white:    '#FFFFFF',
  white80:  'rgba(255,255,255,0.8)',
  white60:  'rgba(255,255,255,0.6)',
  white40:  'rgba(255,255,255,0.4)',
  white20:  'rgba(255,255,255,0.2)',
  white10:  'rgba(255,255,255,0.1)',

  // Nav glassmorphism
  navBg:    'rgba(10,10,10,0.95)',
};

export const FONT = {
  serif:  undefined,   // system fallback (Georgia / serif)
  sans:   undefined,   // system default
};

export const RADIUS = {
  sm:  8,
  md:  12,
  lg:  20,
  xl:  24,
  full: 999,
};

export const SHADOW = {
  gold: {
    shadowColor:   '#D4AF37',
    shadowOffset:  { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius:  24,
    elevation:     12,
  },
  dark: {
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius:  24,
    elevation:     16,
  },
  soft: {
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius:  8,
    elevation:     6,
  },
};
