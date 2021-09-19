const Table = require('cli-table3');
const { processNumber } = require('number-helper-functions');

/**
 * Creates a table
 *
 * @param {{dependency: string, count: number, percent: number}[]} array
 * @param {number} [top]
 */
function countToTable(array, top) {
  const header = ['Rank', 'Dependency', 'Count', 'Present in %'];

  const table = new Table({
    head: header,
  });

  const toShow = top ? array.slice(0, top) : array;

  toShow.forEach(({ dependency, count, percent }, index) => {
    table.push([`# ${index + 1}`, dependency, count, `${processNumber(percent, 1)}%`]);
  });

  return table.toString();
}

module.exports = countToTable;
