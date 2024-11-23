import common from 'eslint-config-neon/common';
import node from 'eslint-config-neon/node';
import prettier from 'eslint-config-neon/prettier';
import typescript from 'eslint-config-neon/typescript';

/**
 * @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigArray}
 */
const config = [
	...common,
	...node,
	...typescript,
	{
		languageOptions: {
			parserOptions: {
				project: './tsconfig.eslint.json'
			}
		},
		ignores: ['./dist/*'],
		rules: {
			'curly': 1,
			'tsdoc/syntax': 0,
			'jsdoc/newline-after-description': 0,
			'@typescript-eslint/sort-type-union-intersection-members': 0,
			'@typescript-eslint/consistent-type-definitions': 0,
			'unicorn/number-literal-case': 0,
			'unicorn/numeric-separators-style': 0,
			'unicorn/new-for-builtins': 0,
			'import-x/extensions': 0,
			'import-x/order': [
				2,
				{
					'alphabetize': {
						caseInsensitive: false,
						order: 'asc'
					},
					'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
					'newlines-between': 'always'
				}
			]
		}
	},
	...prettier
];

export default config;
