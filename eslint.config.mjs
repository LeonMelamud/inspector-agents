import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

// `next lint` was removed in Next 16, so ESLint runs directly (`npm run lint` = `eslint .`).
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'distribution/**', 'next-env.d.ts']),
]);

export default eslintConfig;
