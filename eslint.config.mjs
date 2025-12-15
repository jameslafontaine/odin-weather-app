import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

export default [
  // Base recommended config for all files
  js.configs.recommended,
  prettierConfig,
  
  // Browser environment (for src/ files)
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
  
  // Node.js environment (for webpack configs and other root-level JS files)
  {
    files: ["*.js", "*.cjs"],  // Removed *.mjs from here
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
  
  // ES Modules environment (for .mjs files like eslint.config.mjs)
  {
    files: ["*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
  
  // Files to ignore
  {
    ignores: [
      "dist/",
      "build/",
      "public/",
      "node_modules/",
      "src/assets/img/**",
      "src/assets/font/**",
      "src/assets/video/**",
      "*.min.js",
      "*.min.css",
      "*.bundle.js",
      "*.bundle.js.map",
      "*.js.map",
      "eslint.config.mjs",  // Don't lint the config file itself
    ],
  },
];
