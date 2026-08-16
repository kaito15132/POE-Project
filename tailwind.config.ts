import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: { colors: { ink: "#090d14", panel: "#111824", gold: "#d6ab5b", cyan: "#56d5d0" } } },
  plugins: [],
} satisfies Config;
