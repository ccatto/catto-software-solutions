// .prettierrc.mjs - ESM format
export default {
  // Core Prettier options
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  arrowParens: 'always',

  plugins: [
    'prettier-plugin-packagejson',
    '@ianvs/prettier-plugin-sort-imports',
  ],

  // Import sorting configuration
  importOrder: [
    '^react',
    '^next(/.*)?$',
    '<THIRD_PARTY_MODULES>',
    '^(@atomic-design|@lib)(/.*|$)',
    '^[./]',
  ],
  importOrderSortSpecifiers: true,
};
