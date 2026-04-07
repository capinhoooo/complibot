//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  {
    name: 'complibot/ignores',
    ignores: [
      '**/.output/**',
      '**/.nitro/**',
      '**/.vinxi/**',
      '**/routeTree.gen.ts',
      'eslint.config.js',
      'prettier.config.js',
      'vite.config.*',
      'public/**',
    ],
  },
  ...tanstackConfig,
]
