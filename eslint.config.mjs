import angularPlugin from '@angular-eslint/eslint-plugin';
import angularTemplatePlugin from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';

import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import sortClassMembersPlugin from 'eslint-plugin-sort-class-members';

import rxjsPlugin from '@smarttools/eslint-plugin-rxjs';
import stylisticPlugin from '@stylistic/eslint-plugin-js';

import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

const forbiddenUppercaseAbbreviations = 'ID|HTTP|URL|UTM|JSON|XML';

/** @type {import('eslint').linter.FlatConfig[]} */
export default [
  {
    ignores: ['dist', 'index.html', 'node_modules'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['tsconfig.json'],
        createDefaultProgram: true,
        ecmaVersion: 'latest',
        sourceType: 'module',
        emitDecoratorMetadata: true,
      },
    },
    plugins: {
      '@angular-eslint': angularPlugin,
      '@typescript-eslint': tsPlugin,
      '@smarttools/rxjs': rxjsPlugin,
      'sort-class-members': sortClassMembersPlugin,
      '@stylistic/js': stylisticPlugin,
      import: importPlugin,
    },
    settings: { 'import/external-module-folders': ['node_modules'] },
    linterOptions: { reportUnusedDisableDirectives: 'error' },
    rules: {
      ...importPlugin.configs.recommended.rules,
      ...importPlugin.configs.typescript.rules,
      ...angularPlugin.configs.recommended.rules,
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: ['app'], style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: ['app'], style: 'kebab-case' },
      ],
      '@angular-eslint/component-max-inline-declarations': [
        'error',
        { template: 3, styles: 3, animations: 10 },
      ],
      eqeqeq: 'error',
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: [
            ['external', 'builtin'],
            ['internal'],
            ['parent', 'sibling', 'index'],
          ],
          alphabetize: { order: 'asc' },
        },
      ],
      'import/no-duplicates': 'error',
      'import/no-mutable-exports': 'error',
      'import/no-unresolved': 'off',
      'no-unused-vars': 'off',
      'no-unused-expressions': 'off',
      'no-nested-ternary': 'error',
      'no-console': 'error',
      'no-implicit-coercion': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector:
            ':matches(ImportNamespaceSpecifier, ExportAllDeclaration, ExportNamespaceSpecifier)',
          message: 'Import/export only modules you need',
        },
      ],
      'object-shorthand': 'error',
      '@smarttools/rxjs/no-subscribe-handlers': 'error',
      '@smarttools/rxjs/finnish': [
        'error',
        {
          functions: false,
          methods: false,
          parameters: false,
          strict: true,
          names: {
            '^(canActivate|canActivateChild|canDeactivate|canLoad|intercept|resolve|validate)$': false,
            '^(value|useValue)$': false,
          },
        },
      ],
      '@smarttools/rxjs/suffix-subjects': [
        'error',
        { suffix: '$$', methods: false, functions: false, properties: false },
      ],
      '@smarttools/rxjs/no-unsafe-takeuntil': [
        'error',
        {
          allow: [
            'count',
            'defaultIfEmpty',
            'endWith',
            'every',
            'finalize',
            'finally',
            'isEmpty',
            'last',
            'max',
            'min',
            'publish',
            'publishBehavior',
            'publishLast',
            'publishReplay',
            'reduce',
            'share',
            'shareReplay',
            'skipLast',
            'takeLast',
            'throwIfEmpty',
            'toArray',
          ],
        },
      ],
      'sort-class-members/sort-class-members': [
        'error',
        {
          order: [
            '[ng-inputs]',

            '[private-readonly-properties]',
            '[private-properties]',
            '[protected-readonly-properties]',
            '[protected-properties]',
            '[public-readonly-properties]',
            '[public-properties]',
            '[private-static-readonly-properties]',
            '[private-static-properties]',
            '[protected-static-readonly-properties]',
            '[protected-static-properties]',
            '[public-static-readonly-properties]',
            '[public-static-properties]',

            '[private-accessor-pairs]',
            '[private-getters]',
            '[private-setters]',
            '[protected-accessor-pairs]',
            '[protected-getters]',
            '[protected-setters]',
            '[public-accessor-pairs]',
            '[public-getters]',
            '[public-setters]',
            '[private-static-accessor-pairs]',
            '[private-static-getters]',
            '[private-static-setters]',
            '[protected-static-accessor-pairs]',
            '[protected-static-getters]',
            '[protected-static-setters]',
            '[public-static-accessor-pairs]',
            '[public-static-getters]',
            '[public-static-setters]',

            '[ng-outputs]',
            '[ng-view-child]',

            'constructor',

            '[ng-on-changes]',
            '[ng-on-init]',
            '[ng-do-check]',
            '[ng-after-content-init]',
            '[ng-after-content-checked]',
            '[ng-after-view-init]',
            '[ng-after-view-checked]',
            '[ng-on-destroy]',

            '[event-handlers]',

            '[private-methods]',
            '[protected-methods]',
            '[public-methods]',
            '[static-methods]',
          ],
          groups: {
            'ng-inputs': [{ type: 'property', groupByDecorator: 'Input' }],
            'ng-outputs': [{ type: 'property', groupByDecorator: 'Output' }],
            'ng-view-child': [
              { type: 'property', groupByDecorator: 'ViewChild' },
            ],
            'ng-lifecycle-methods': [{ name: '/ng[A-Z].*', type: 'method' }],
            'ng-on-changes': [{ name: 'ngOnChanges', type: 'method' }],
            'ng-on-init': [{ name: 'ngOnInit', type: 'method' }],
            'ng-do-check': [{ name: 'ngDoCheck', type: 'method' }],
            'ng-after-content-init': [
              { name: 'ngAfterContentInit', type: 'method' },
            ],
            'ng-after-content-checked': [
              { name: 'ngAfterContentChecked', type: 'method' },
            ],
            'ng-after-view-init': [{ name: 'ngAfterViewInit', type: 'method' }],
            'ng-after-view-checked': [
              { name: 'ngAfterViewChecked', type: 'method' },
            ],
            'ng-on-destroy': [{ name: 'ngOnDestroy', type: 'method' }],

            'private-readonly-properties': [
              {
                type: 'property',
                accessibility: 'private',
                groupByDecorator: false,
                readonly: true,
                static: false,
              },
            ],
            'private-properties': [
              {
                type: 'property',
                accessibility: 'private',
                groupByDecorator: false,
                readonly: false,
                static: false,
              },
            ],
            'protected-readonly-properties': [
              {
                type: 'property',
                accessibility: 'protected',
                groupByDecorator: false,
                readonly: true,
                static: false,
              },
            ],
            'protected-properties': [
              {
                type: 'property',
                accessibility: 'protected',
                groupByDecorator: false,
                readonly: false,
                static: false,
              },
            ],
            'public-readonly-properties': [
              {
                type: 'property',
                accessibility: 'public',
                groupByDecorator: false,
                readonly: true,
                static: false,
              },
            ],
            'public-properties': [
              {
                type: 'property',
                accessibility: 'public',
                groupByDecorator: false,
                readonly: false,
                static: false,
              },
            ],
            'private-static-readonly-properties': [
              {
                type: 'property',
                accessibility: 'private',
                groupByDecorator: false,
                readonly: true,
                static: true,
              },
            ],
            'private-static-properties': [
              {
                type: 'property',
                accessibility: 'private',
                groupByDecorator: false,
                readonly: false,
                static: true,
              },
            ],
            'protected-static-readonly-properties': [
              {
                type: 'property',
                accessibility: 'protected',
                groupByDecorator: false,
                readonly: true,
                static: true,
              },
            ],
            'protected-static-properties': [
              {
                type: 'property',
                accessibility: 'protected',
                groupByDecorator: false,
                readonly: false,
                static: true,
              },
            ],
            'public-static-readonly-properties': [
              {
                type: 'property',
                accessibility: 'public',
                groupByDecorator: false,
                readonly: true,
                static: true,
              },
            ],
            'public-static-properties': [
              {
                type: 'property',
                accessibility: 'public',
                groupByDecorator: false,
                readonly: false,
                static: true,
              },
            ],
            'private-accessor-pairs': [
              {
                kind: 'accessor',
                accessibility: 'private',
                accessorPair: true,
                static: false,
              },
            ],
            'protected-accessor-pairs': [
              {
                kind: 'accessor',
                accessibility: 'protected',
                accessorPair: true,
                static: false,
              },
            ],
            'public-accessor-pairs': [
              {
                kind: 'accessor',
                accessibility: 'public',
                accessorPair: true,
                static: false,
              },
            ],
            'private-static-accessor-pairs': [
              {
                kind: 'accessor',
                accessibility: 'private',
                accessorPair: true,
                static: true,
              },
            ],
            'protected-static-accessor-pairs': [
              {
                kind: 'accessor',
                accessibility: 'protected',
                accessorPair: true,
                static: true,
              },
            ],
            'public-static-accessor-pairs': [
              {
                kind: 'accessor',
                accessibility: 'public',
                accessorPair: true,
                static: true,
              },
            ],
            'private-getters': [
              {
                kind: 'get',
                accessibility: 'private',
                static: false,
                accessorPair: false,
              },
            ],
            'protected-getters': [
              {
                kind: 'get',
                accessibility: 'protected',
                static: false,
                accessorPair: false,
              },
            ],
            'public-getters': [
              {
                kind: 'get',
                accessibility: 'public',
                static: false,
                accessorPair: false,
              },
            ],
            'private-setters': [
              {
                kind: 'set',
                accessibility: 'private',
                static: false,
                accessorPair: false,
              },
            ],
            'protected-setters': [
              {
                kind: 'set',
                accessibility: 'protected',
                static: false,
                accessorPair: false,
              },
            ],
            'public-setters': [
              {
                kind: 'set',
                accessibility: 'public',
                static: false,
                accessorPair: false,
              },
            ],
            'private-static-getters': [
              {
                kind: 'get',
                accessibility: 'private',
                static: true,
                accessorPair: false,
              },
            ],
            'protected-static-getters': [
              {
                kind: 'get',
                accessibility: 'protected',
                static: true,
                accessorPair: false,
              },
            ],
            'public-static-getters': [
              {
                kind: 'get',
                accessibility: 'public',
                static: true,
                accessorPair: false,
              },
            ],
            'private-static-setters': [
              {
                kind: 'set',
                accessibility: 'private',
                static: true,
                accessorPair: false,
              },
            ],
            'protected-static-setters': [
              {
                kind: 'set',
                accessibility: 'protected',
                static: true,
                accessorPair: false,
              },
            ],
            'public-static-setters': [
              {
                kind: 'set',
                accessibility: 'public',
                static: true,
                accessorPair: false,
              },
            ],
            'event-handlers': [
              { name: '/on[A-Z].*/', type: 'method', static: false },
            ],
            'private-methods': [
              { type: 'method', accessibility: 'private', static: false },
            ],
            'protected-methods': [
              { type: 'method', accessibility: 'protected', static: false },
            ],
            'public-methods': [
              { type: 'method', accessibility: 'public', static: false },
            ],
            'static-methods': [
              { type: 'method', accessibility: 'public', static: true },
            ],
          },
          accessorPairPositioning: 'getThenSet',
        },
      ],
      '@stylistic/js/lines-between-class-members': [
        'error',
        {
          enforce: [
            { blankLine: 'always', prev: '*', next: 'method' },
            { blankLine: 'always', prev: 'method', next: '*' },
          ],
        },
      ],
      '@stylistic/js/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: '*', next: 'block-like' },
        { blankLine: 'always', prev: 'block-like', next: '*' },
        { blankLine: 'never', prev: 'case', next: '*' },
        { blankLine: 'never', prev: '*', next: 'case' },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: ['variableLike', 'method'],
          format: ['camelCase'],
          leadingUnderscore: 'forbid',
          custom: { regex: forbiddenUppercaseAbbreviations, match: false },
        },
        {
          selector: 'variable',
          modifiers: ['const'],
          format: ['camelCase', 'UPPER_CASE'],
        },
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['PascalCase'],
          custom: { regex: forbiddenUppercaseAbbreviations, match: false },
          prefix: [
            'is',
            'should',
            'has',
            'can',
            'did',
            'will',
            'was',
            'were',
            'must',
            'had',
            'allow',
            'force',
            'enforce',
            'requires',
            'require',
            'disable',
            'enable',
            'matches',
            'expected',
          ],
          filter: {
            regex: '^(actual|value|result|expected)$',
            match: false,
          },
        },
        {
          selector: ['interface', 'typeAlias'],
          format: ['PascalCase'],
          custom: {
            regex: `^I[A-Z]|(Interface|Type)$|${forbiddenUppercaseAbbreviations}`,
            match: false,
          },
        },
        {
          selector: 'class',
          format: ['PascalCase'],
          custom: { regex: forbiddenUppercaseAbbreviations, match: false },
        },
        {
          selector: ['enum'],
          format: ['PascalCase'],
          custom: { regex: forbiddenUppercaseAbbreviations, match: false },
        },
        {
          selector: ['enumMember'],
          format: ['UPPER_CASE'],
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^_$' },
      ],
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-duplicate-enum-values': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
    },
  },
  {
    files: ['**/*.component.html'],
    plugins: {
      '@angular-eslint/template': angularTemplatePlugin,
      prettier: prettierPlugin,
    },
    languageOptions: { parser: angularTemplateParser },
    rules: {
      ...angularTemplatePlugin.configs.recommended.rules,
      ...angularTemplatePlugin.configs.accessibility.rules,
      ...angularTemplatePlugin.configs['process-inline-templates'].rules,
      ...prettierPlugin.configs.recommended.rules,
      '@angular-eslint/template/prefer-self-closing-tags': 'error',
      '@angular-eslint/template/i18n': [
        'error',
        { checkId: false, checkText: false, checkAttributes: false },
      ],
      '@angular-eslint/template/attributes-order': [
        'error',
        {
          alphabetical: false,
          order: [
            'ATTRIBUTE_BINDING',
            'TEMPLATE_REFERENCE',
            'STRUCTURAL_DIRECTIVE',
            'INPUT_BINDING',
            'TWO_WAY_BINDING',
            'OUTPUT_BINDING',
          ],
        },
      ],
      'prettier/prettier': ['error'],
    },
  },
];
