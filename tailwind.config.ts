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
			padding: '2rem',
			screens: {
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
					DEFAULT: '#C75D4B', // Rich terracotta
					foreground: '#FFFFFF',
					light: '#E8A398', // Lighter terracotta for hover states
					dark: '#9A4539', // Darker terracotta for active states
				},
				secondary: {
					DEFAULT: '#2D5F5D', // Deep forest green
					foreground: '#FFFFFF',
					light: '#4D7E7C', // Lighter forest green
					dark: '#1F4240', // Darker forest green
				},
				accent: {
					DEFAULT: '#E9B44C', // Mustard yellow
					foreground: '#343434',
					light: '#F0C878', // Lighter mustard
					dark: '#C79227', // Darker mustard
				},
				neutral: {
					DEFAULT: '#E9DCC9', // Warm beige
					dark: '#343434',    // Deep charcoal
					light: '#F6F4EB',   // Soft cream
					sand: '#D9CEB9',    // Sand color
				},
				vermilion: {
					DEFAULT: '#E94F35', // Vermilion accent
					light: '#F07863',
					dark: '#BF3C26',
				},
				indigo: {
					DEFAULT: '#4E5198', // Indigo
					light: '#7275B5',
					dark: '#363870',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: '#CEC0AB', // Muted earthy tone
					foreground: '#5E5649', // Darker for text on muted background
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
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
				'poppins': ['Poppins', 'sans-serif'],
				'nunito': ['Nunito', 'sans-serif'],
				'bitter': ['Bitter', 'serif'],
			},
			backgroundImage: {
				'tribal-pattern-light': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c75d4b' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
				'tribal-pattern-dark': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e9b44c' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
				'warli-pattern': "url(\"data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c75d4b' fill-opacity='0.1'%3E%3Ccircle cx='16' cy='16' r='6'/%3E%3Ccircle cx='48' cy='48' r='6'/%3E%3Cpath d='M16 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z'/%3E%3C/g%3E%3C/svg%3E\")",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
