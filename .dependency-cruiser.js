module.exports = {
  'extends': 'dependency-cruiser/configs/recommended-warn-only',
  options: {
    /* conditions specifying which files not to follow further when encountered:
       - path: a regular expression to match
       - dependencyTypes: see https://github.com/sverweij/dependency-cruiser/blob/master/doc/rules-reference.md#dependencytypes
       for a complete list
    */
    doNotFollow: {
      dependencyTypes: [
        'npm',
        'npm-dev',
        'npm-optional',
        'npm-peer',
        'npm-bundled',
        'npm-no-pkg'
      ]
    },

    /* pattern specifying which files to include (regular expression) 
       dependency-cruiser will skip everything not matching this pattern
    */
    includeOnly: 'src',

    exclude: "node_modules|(\\.spec|\\.e2e)\\.ts$|\\.mock\\.ts|\\.d\\.ts$",
    /* prefix for links in html and svg output (e.g. https://github.com/you/yourrepo/blob/develop/) */
    prefix: '#',

    /* if true combines the package.jsons found from the module up to the base
       folder the cruise is initiated from. Useful for how (some) mono-repos
       manage dependencies & dependency definitions.
     */
    combinedDependencies: true,

    /* false (the default): ignore dependencies that only exist before typescript-to-javascript compilation
       true: also detect dependencies that only exist before typescript-to-javascript compilation
       "specify": for each dependency identify whether it only exists before compilation or also after
     */
    tsPreCompilationDeps: true,

    /* if true leave symlinks untouched, otherwise use the realpath */
    // preserveSymlinks: false,

    /* Typescript project file ('tsconfig.json') to use for
       (1) compilation and
       (2) resolution (e.g. with the paths property)

       The (optional) fileName attribute specifies which file to take (relative to
       dependency-cruiser's current working directory). When not provided
       defaults to './tsconfig.json'.
     */
    tsConfig: {
      fileName: './tsconfig.json'
    },

    reporterOptions: {
      dot: {
        theme: {
          graph: {
            splines: "ortho",
            rankdir: 'LR',
          },
          node: {
            //fillcolor: "orange",
          },
          edge: {
            arrowhead: "vee",
            arrowsize: "0.5",
            penwidth: "1.0",
          },
          modules: [
            {
              criteria: { "rules[0].severity": "error" },
              attributes: { fontcolor: "red", color: "red" }
            },
            {
              criteria: { "rules[0].severity": "info" },
              attributes: { fontcolor: "blue", color: "blue" }
            },
            {
              criteria: { source: "^src/services" },
              attributes: { fillcolor: "#d2ffd2" }
            },
            {
              criteria: { source: "^src/utils" },
              attributes: { fillcolor: "#d9c2ff" }
            },
            {
              criteria: { source: "\\.tsx$" },
              attributes: { fillcolor: "#67d4ff", shape: "component" }
            },
            {
              criteria: { collapsed: true },
              attributes: { shape: "tab" }
            }
          ],
          dependencies: [
            {
              criteria: { resolved: "singleton" },
              attributes: { color: "#00770077", style: 'dashed' }
            }
          ]
        }
      },
    }
  }
};