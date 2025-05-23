
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '1.5rem',
			screens: {
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#2D8B61', // Green color from logo
					foreground: '#FFFFFF',
					50: '#EEFAF4',
					100: '#D3F0E3',
					200: '#A8E1C8',
					300: '#7CD0AC',
					400: '#51C091',
					500: '#2D8B61',
					600: '#256F4E',
					700: '#1D543C',
					800: '#143829',
					900: '#0A1C15',
				},
				secondary: {
					DEFAULT: '#2D5F5D', // Deep forest green
					foreground: '#FFFFFF',
					50: '#ECFAF9',
					100: '#D0F0EE',
					200: '#A1E1DE',
					300: '#71D2CE',
					400: '#42C2BD',
					500: '#2D5F5D',
					600: '#24C4A',
					700: '#1B3635',
					800: '#122423',
					900: '#091211',
				},
				accent: {
					DEFAULT: '#EBF7F2', // Light mint for accents
					foreground: '#2D8B61',
				},
				neutral: {
					DEFAULT: '#F7F9FA', // Light background
					dark: '#1A2235',   // Deep navy for dark mode
					light: '#FFFFFF',  // Pure white
					surface: '#F2F5F7', // Subtle light gray
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				sidebar: {
					DEFAULT: '#0F172A',
					foreground: '#F8FAFC',
					muted: '#334155'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'soft': '0 2px 10px rgba(0, 0, 0, 0.04)',
				'card': '0 4px 20px rgba(0, 0, 0, 0.05)',
				'elevated': '0 8px 30px rgba(0, 0, 0, 0.08)',
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"fade-in": {
					"0%": {
						opacity: "0",
						transform: "translateY(10px)"
					},
					"100%": {
						opacity: "1",
						transform: "translateY(0)"
					}
				},
				"pulse-gentle": {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0.7" },
				},
				"wave": {
					"0%": { transform: "scaleY(1)" },
					"50%": { transform: "scaleY(0.5)" },
					"100%": { transform: "scaleY(1)" },
				},
				"wave-audio": {
					"0%, 100%": { height: "60%" },
					"25%": { height: "30%" },
					"50%": { height: "80%" },
					"75%": { height: "40%" }
				}
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in": "fade-in 0.5s ease-out",
				"pulse-gentle": "pulse-gentle 2s infinite ease-in-out",
				"wave-1": "wave 1.2s infinite ease-in-out 0.1s",
				"wave-2": "wave 1.2s infinite ease-in-out 0.2s",
				"wave-3": "wave 1.2s infinite ease-in-out 0.3s",
				"wave-4": "wave 1.2s infinite ease-in-out 0.4s",
				"wave-5": "wave 1.2s infinite ease-in-out 0.5s",
				"wave-audio": "wave-audio 1.8s ease-in-out infinite"
			},
			fontFamily: {
				'inter': ['Inter', 'sans-serif'],
				'poppins': ['Poppins', 'sans-serif'],
				'nunito': ['Nunito', 'sans-serif'],
				'bitter': ['Bitter', 'serif'],
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
