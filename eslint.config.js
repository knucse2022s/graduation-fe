import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
<<<<<<< HEAD
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
=======
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
>>>>>>> f2ce451a19c9dd3e020a8e8ed733fc50a6ec5795
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
<<<<<<< HEAD
      reactHooks.configs.flat.recommended,
=======
      reactHooks.configs['recommended-latest'],
>>>>>>> f2ce451a19c9dd3e020a8e8ed733fc50a6ec5795
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
