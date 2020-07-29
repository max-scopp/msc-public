import { Config as InternalConfig } from '@stencil/core/internal/stencil-public-compiler';
import { sass } from '@stencil/sass';

import visualizer from 'rollup-plugin-visualizer';

const isDev = process.argv.includes('--dev');

const devOutputs = [];

if (isDev) {
  devOutputs.push({
    type: "www",
    copy: [{ src: "_devViews/**/*", dest: '.' }],
  })

  devOutputs.push({
    type: "www",
    copy: [
      { src: "../custom-elements.json", dest: './elements.json' },
      { src: "../docs.json", dest: './docs.json' },
    ],
  })
}
export const config: InternalConfig = {
  tsconfig: './tsconfig.json',

  enableCache: true,
  namespace: "msc",

  profile: true,

  bundles: [
    //#region "Core"
    { components: ['msc-request-notifier', 'msc-progress-indicator', 'msc-loader'] },
    //#endregion
    //#region "Base"
    { components: ['msc-button', 'msc-button-group', 'msc-picto-button'] },
    { components: ['msc-form-field', 'msc-input', 'msc-select', 'msc-option'] },
    { components: ['msc-sidebar'] },
    { components: ['msc-menu', 'msc-list', 'msc-dropdown', 'msc-item'] },
    { components: ['msc-toast', 'msc-toast-container'] },
    { components: ['msc-header-bar', 'msc-actions-bar'] },
    { components: ['msc-display-filter'] },
    { components: ['msc-tooltip', 'msc-title', 'msc-badge', 'msc-icon'] },
    { components: ['msc-content', 'msc-grid'] },
    { components: ['msc-card', 'msc-modal'] },
    { components: ['msc-collapsible', 'msc-define'] },
  ],

  preamble: "(C) Maximilian Scopp https://maxscopp.de/ - MIT",

  globalScript: "src/global.ts",
  globalStyle: "src/global.scss",

  outputTargets: [
    ...devOutputs,
    {
      type: "dist",
      esmLoaderPath: "../loader"
    },
    {
      type: "docs-readme"
    },
    {
      type: 'docs-vscode',
      file: 'custom-elements.json',
      sourceCodeBaseUrl: 'https://github.com/max-scopp/ui-studio/',
    },
    {
      type: 'docs-json',
      file: 'docs.json'
    }
  ],
  plugins: [
    sass({
      // be able to include scss partials
      includePaths: ["./src/scss/", "node_modules"],

      // always include the engine in each component
      injectGlobalPaths: ["./src/scss/engine.scss"]
    }),
    visualizer({
      filename: 'stats.treemap.html',
      title: 'visual treemap',
      template: "treemap"
    }),
    visualizer({
      filename: 'stats.network.html',
      title: 'visual network',
      template: "network"
    }),
  ]
};
