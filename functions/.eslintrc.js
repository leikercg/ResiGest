module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended", "google"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  rules: {
    "quotes": ["error", "double", {allowTemplateLiterals: true}],
    "indent": ["error", 2], // Usa 2 espacios para la indentación
    "max-len": ["error", {code: 120}], // Permite líneas de hasta 120 caracteres
  },
};
