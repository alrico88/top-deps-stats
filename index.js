#!/usr/bin/env node

const { readdirSync, lstatSync } = require('fs');
const path = require('path');
const { readFileAsJSONSync } = require('node-read-file-helper');
const orderBy = require('lodash/orderBy');
const { Command } = require('commander');
const { calcPercent } = require('math-helper-functions');
const get = require('./helpers/get');
const countToTable = require('./helpers/format');

const program = new Command();

program
  .option('-d, --dir <path>', 'Directory to inspect')
  .option('-t,--top [number]', 'Show only N most popular dependencies (optional)')
  .option('-d,--include-dev', 'Count devDependencies too (false by default)')
  .parse(process.argv);

const options = program.opts();

/**
 * Gets the package.json dependencies
 *
 * @param {string} pathToPackageDotJson
 * @return {string[]}
 */
function getPackageDeps(pathToPackageDotJson) {
  const packagePath = path.join(pathToPackageDotJson, 'package.json');
  const parsed = readFileAsJSONSync(packagePath);

  const deps = [];

  if (parsed.dependencies) {
    deps.push(...Object.keys(parsed.dependencies));
  }

  if (options.includeDev === true) {
    if (parsed.devDependencies) {
      deps.push(...Object.keys(parsed.devDependencies));
    }
  }

  return deps;
}

/**
 * Gets a project's dependencies
 *
 * @param {string} projectPath
 * @return {string[]}
 */
function getProjectDeps(projectPath) {
  const filesInDir = readdirSync(projectPath);

  if (filesInDir.includes('package.json')) {
    return getPackageDeps(projectPath);
  }

  return [];
}

/**
 * Filters non-project directories and files
 *
 * @param {string[]} dirs
 * @return {string[]}
 */
function getOnlyProjectDirs(dirs) {
  return dirs.reduce((agg, dir) => {
    const projectPath = path.join(options.dir, dir);

    if (lstatSync(projectPath).isDirectory()) {
      const filesInside = readdirSync(projectPath);

      if (filesInside.includes('package.json')) {
        agg.push(dir);
      }
    }

    return agg;
  }, []);
}

function init() {
  const dirs = readdirSync(path.resolve(options.dir));

  const projectDirs = getOnlyProjectDirs(dirs);

  const stats = projectDirs.reduce((agg, project) => {
    const projectPath = path.join(options.dir, project);

    const deps = getProjectDeps(projectPath);

    deps.forEach((dep) => {
      // eslint-disable-next-line no-param-reassign
      agg[dep] = get(agg, dep, 0) + 1;
    });

    return agg;
  }, {});

  const asArray = orderBy(
    Object.entries(stats).map(([dep, count]) => ({
      dependency: dep,
      count,
      percent: calcPercent(count, projectDirs.length),
    })),
    'count',
    'desc',
  );

  const table = countToTable(asArray, options.top);

  console.log(`Top dependencies for ${options.dir}`);
  console.log(table);
}

init();
