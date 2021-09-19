# top-deps-stats

Get an overview of your most used dependencies in your projects. It reads all the project directories in the specified path, looks for the `package.json` and outputs a table.

## Installation

Install globally

`npm i top-deps-stats -g` or `yarn global add top-deps-stats`.

Or run it using `npx top-deps-stats [YOUR ARGUMENTS]`.

## Usage

```
Usage: index [options]

Options:
  -d, --dir <path>   Directory to inspect
  -t,--top [number]  Show only N most popular dependencies (optional)
  -d,--include-dev   Count devDependencies too (false by default)
  -h, --help         display help for command
```