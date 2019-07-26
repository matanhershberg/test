const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

readWeatherFile()
  .then(getDataRows)
  .then(sortBySmallestSpread)
  .then(sortedDataRows => {
    const smallestSpread = sortedDataRows[0];

    console.log(smallestSpread.day);
  });

function readWeatherFile () {
  const filePath = './w_data (5).dat';
  const readFileOptions = {
    encoding: 'utf-8'
  }

  return readFile(filePath, readFileOptions);
}

function getDataRows (weatherFile) {
  const splitLines = weatherFile.split("\n");

  const dataRows = splitLines.map(parseLine);

  function parseLine (line) {
    const dayMxtMntRegExp = /^ +([\d\*]+)\s+([\d\*]+)\s+([\d\*]+)/;
    const result = dayMxtMntRegExp.exec(line);

    if (result !== null) {
      const parsedLine = {
        day: parseInt(result[1], 10),
        maxT: parseInt(result[2], 10),
        minT: parseInt(result[3], 10)
      };

      parsedLine.minMaxDiff = parsedLine.maxT - parsedLine.minT;

      return parsedLine;
    }
  }

  return dataRows;
}

function sortBySmallestSpread (dataRows) {
  return dataRows.sort((firstEl, secondEl) => {
    return firstEl.minMaxDiff - secondEl.minMaxDiff;
  })
}
