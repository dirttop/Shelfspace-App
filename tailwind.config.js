/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DMSans_400Regular', 'sans-serif'],
        'sans-medium': ['DMSans_500Medium', 'sans-serif'],
        'sans-semibold': ['DMSans_600SemiBold', 'sans-serif'],
        'sans-bold': ['DMSans_700Bold', 'sans-serif'],
        'fraunces-semibold': ['Fraunces_600SemiBold', 'serif'],
        'fraunces-bold': ['Fraunces_700Bold', 'serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        destructive: "var(--destructive)",
        "destructive-foreground": "var(--destructive-foreground)",
        success: "var(--success)",
        "success-foreground": "var(--success-foreground)",
        warning: "var(--warning)",
        "warning-foreground": "var(--warning-foreground)",
        border: "var(--border)",
      },
    },
  },
  plugins: [],
}