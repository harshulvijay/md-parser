/**
 * Rollup build script 🧰🐱‍👤
 */

// imports

import commonjs from "@rollup/plugin-commonjs";
import del from "rollup-plugin-delete";
import multiInput from "rollup-plugin-multi-input";
import nodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

// for deep merging the options
import { merge } from "lodash";
// to know the package deps
import { dependencies } from "./package.json";

// stub type objects

/**
 * Stub object for reusing `rollup-plugin-terser.Options' type without having
 * to reimport it. ✨
 *
 * @type {import("rollup-plugin-terser").Options}
 */
const RollupPluginTerserOptionsStub = {};

/**
 * Stub object for reusing `Rollup.MergedRollupOptions' type without having to
 * reimport it. ✨
 *
 * @type {import("rollup").MergedRollupOptions}
 */
const MergedRollupOptionsStub = {};

/**
 * Stub object for reusing `Rollup.OutputOptions' type without having to
 * reimport it. ✨
 *
 * @type {import("rollup").OutputOptions}
 */
const RollupOutputOptionsStub = {};

// objects

/**
 * Are we building for production?
 *
 * see: https://github.com/rollup/rollup-watch/issues/48
 */
const isProduction = !process.env.ROLLUP_WATCH;

/**
 * Terser options
 *
 * @type {typeof RollupPluginTerserOptionsStub}
 */
const terserOptions = {
  compress: true,
  ecma: 2020,
  mangle: true,
  module: true,
  format: {
    braces: true,
    comments: false,
  },
  toplevel: true,
};

/**
 * Output options
 *
 * @type {typeof RollupOutputOptionsStub}
 */
const outputOptions = {
  exports: "named",
  compact: true,
  strict: true,
  esModule: true,
};

// functions

/**
 * Generates build options for `buildTarget'. 📝
 *
 * @param {"amd" | "cjs" | "umd"} buildTargetFormat UMD, CJS or AMD
 * @param {{} | typeof MergedRollupOptionsStub} toMerge Merge options ➕📝
 * @param {{} | typeof MergedRollupOptionsStub} override Override options ❌📝
 */
function optionsGenerator(buildTargetFormat, toMerge = {}, override = {}) {
  // additional plugins used depending on `buildTarget'
  const additionalPlugins = [];
  // plugins used depending on build mode (`process.env.NODE_ENV')
  const devPlugins = [];

  switch (buildTargetFormat) {
    case "amd":
    case "umd":
      // use `commonjs' and `node-resolve' plugins
      additionalPlugins.push(commonjs(), nodeResolve());
      break;

    default:
      break;
  }

  /**
   * Output paths of the generated files
   *
   * @type {{ normal: string, min: string }}
   */
  const outputPaths = {
    normal: `dist/${buildTargetFormat}`,
    min: `dist/${buildTargetFormat}/min`,
  };

  switch (isProduction) {
    case "production":
      // no production-specific plugins yet
      break;

    case "development":
    default:
      devPlugins.push(
        del({
          targets: [outputPaths.normal, outputPaths.min],
        })
      );
      break;
  }

  /**
   * Common output options between the minified and non-minifed builds
   *
   * @type {typeof RollupOutputOptionsStub}
   */
  const commonOutputOptions = {
    ...outputOptions,
    format: buildTargetFormat,
  };

  /**
   * Options
   *
   * @type {typeof MergedRollupOptionsStub}
   */
  const options = {
    output: [
      {
        ...commonOutputOptions,
        dir: outputPaths.normal,
      },
      {
        ...commonOutputOptions,
        dir: outputPaths.min,
        plugins: [terser(terserOptions)],
      },
    ],
    input: ["src/**/*.ts"],
    treeshake: true,
    plugins: [
      // development environment-dependent plugins
      ...devPlugins,
      replace({
        // dev or prod mode?
        "process.env.NODE_ENV": JSON.stringify(
          isProduction ? "production" : "development"
        ),
        preventAssignment: true,
      }),
      multiInput(),
      typescript({
        tsconfig: "tsconfig.json",
        // set module type to `ESNext'
        tsconfigOverride: {
          compilerOptions: {
            module: "ESNext"
          }
        }
      }),
      // additional plugins
      ...additionalPlugins,
    ],
    // override the generated options with the user-provided options at the end
    ...override,
  };

  // merge the generated options with the user-provided options at the end
  merge(options, toMerge);

  return options;
}

// export

export default [
  optionsGenerator("amd", {
    output: [{ name: "Parser" }, { name: "Parser" }],
  }),
  optionsGenerator("cjs", {
    // mark the package deps as `external'
    external: Object.keys(dependencies),
  }),
  optionsGenerator(
    "umd",
    {
      output: [{ name: "Parser" }, { name: "Parser" }],
    },
    {
      // single input source
      // see https://github.com/lukeed/navaid/issues/5#issuecomment-488540276
      // and https://github.com/rollup/rollup/issues/3490#issue-597179882
      input: "src/index.ts",
    }
  ),
];
