/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte}'
  ],

  theme: {
    extend: {
      colors: {
        // Obsidian black stack
        bg0: '#0b0b0d',
        bg1: '#101013',
        bg2: '#141417',
        bg3: '#1a1a1e',
        bg4: '#222228',

        // Text tiers
        t1: '#eceae4',
        t2: '#9896a0',
        t3: '#4e4e58',

        // Severity
        alert:      '#d04e4e',
        advisory:   '#c07a10',
        monitor:    '#3a9660',
        teal:       '#29b89a',

        // Legacy aliases (so existing code doesn't break)
        bg:    '#0b0b0d',
        panel: '#101013',
        text:  '#eceae4',
        muted: '#9896a0',
      },

      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Fira Mono', 'monospace'],
      },

      borderRadius: {
        card: '11px',
        pill: '20px',
      },

      fontSize: {
        '2xs': '10px',
        xs:    '11px',
        sm:    '12px',
        base:  '13px',
        md:    '14px',
      },

      borderColor: {
        b0: 'rgba(255,255,255,0.05)',
        b1: 'rgba(255,255,255,0.09)',
        b2: 'rgba(255,255,255,0.14)',
      },
    }
  },

  plugins: []
}