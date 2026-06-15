import js from "@eslint/js";
import securityPlugin from "eslint-plugin-security";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";

export default [
  js.configs.recommended,
  {
    plugins: {
      security: securityPlugin,
      "jsx-a11y": jsxA11yPlugin
    },
    rules: {
      "security/detect-object-injection": "warn",
      "no-control-regex": "warn"
    }
  }
];
