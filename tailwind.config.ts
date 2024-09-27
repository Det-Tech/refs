import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        green: {
          DEFAULT: "#047373",
          dark: "#006666"
        },
        black: {
          DEFAULT: "#000000",
          light: "#1F1F1F"
        },
        sky: {
          DEFAULT: "#4AE0F6",
          light: "#7BEEFF",
          dark: "#00ABFB",
        },
        orange: {
          DEFAULT: "#FFAC72",
          dark: "#F2703B",
        },
        gray: {
          semiLight: "#D9D9D9",
          light: "#CECECE"
        }
      }
    },
  },
  plugins: [],
};
export default config;
