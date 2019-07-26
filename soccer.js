const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

readSoccerFile()
  .then(getDataRows)
  .then(sortBySmallestSpread)
  .then(sortedDataRows => {
    const smallestDiff = sortedDataRows[0];

    console.log(smallestDiff.team);
  })
  .catch(error => {
    console.error(error);
  });

function readSoccerFile () {
  const filePath = './soccer.dat';
  const readFileOptions = {
    encoding: 'utf-8'
  }

  return readFile(filePath, readFileOptions);
}

function getDataRows (soccerFile) {
  const splitLines = soccerFile.split("\n");

  const dataRows = [];

  splitLines.forEach(parseLine);

  function parseLine (line) {
    const forAgainstRegExp = /\d+\.\s+(\w+).*?(\d+)\s+-\s+(\d+)/;
    const result = forAgainstRegExp.exec(line);

    if (result !== null) {
      const parsedLine = {
        team: result[1],
        for: parseInt(result[2], 10),
        against: parseInt(result[3], 10)
      };

      parsedLine.forAgainstDiff = Math.abs(parsedLine.for - parsedLine.against);

      dataRows.push(parsedLine);
    }
  }

  return dataRows;
}

function sortBySmallestSpread (dataRows) {
  return dataRows.sort((firstEl, secondEl) => {
    return firstEl.forAgainstDiff - secondEl.forAgainstDiff;
  })
}
