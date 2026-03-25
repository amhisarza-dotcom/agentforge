import type { Config } from "tailwindcss";

const config: Config = {
    content: [
          "./pages/**/*.{js,ts,jsx,tsx,mdx}",
          "./components/**/*.{js,ts,jsx,tsx,mdx}",
          "./app/**/*.{js,ts,jsx,tsx,mdx}",
        ],
    theme: {
          extend: {
                  colors: {
                            primary: {
                                        50: "#f0f7ff",
                                        100: "#e0effe",
                                        200: "#bae0fd",
                                        300: "#7cc8fb",
                                        400: "#36adf6",
                                        500: "#0c93e7",
                                        600: "#0074c5",
                                        700: "#015da0",
                                        800: "#064f84",
                                        900: "#0b426e",
                                        950: "#072a49",
                            },
                            dark: {
                                        50: "#f6f6f7",
                                        100: "#e2e3e5",
                                        200: "#c4c6cb",
                                        300: "#9fa2a9",
                                        400: "#7b7e87",
                                        500: "#60636c",
                                        600: "#4c4e56",
                                        700: "#3e4047",
                                        800: "#2d2e33",
                                        900: "#1a1b1f",
                                        950: "#0d0e10",
                            },
                  },
          },
    },
    plugins: [],
};
export default config;
