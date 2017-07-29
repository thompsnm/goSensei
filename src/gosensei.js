var exec    = require('child_process').exec;
var fs      = require('fs');
var sgf2go  = require('sgf2go');

function generateInitialSgf(move) {
  console.log('generating initial sgf file');
  return [
    [
      [
        {"key":"FF","value":["4"]},
        {"key":"GM","value":["1"]},
        {"key":"SZ","value":["3"]}
      ]
    ]
  ];
}

function computerMove() {
  console.log('executing computer move');
  const gnugo = exec(`${__dirname}/gnugo -l /tmp/game.sgf -o /tmp/game.sgf`);

  gnugo.stdout.on('data', (data) => {
    console.log(data);
  });

  gnugo.stderr.on('data', (data) => {
    console.log(data);
  });

  gnugo.on('close', (code) => {
    console.log('New sgf:');
    logSgfFile();
  });
};

function playerMove(move) {
  console.log('executing player move');
  var json = readSgfFile();
  json[0].push(
    [
      {
        "key":"B", "value":[ convertMoveToSgfCoordinate(move) ]
      }
    ]
  );
  writeSgfFile(json);
}

function convertMoveToSgfCoordinate(move) {
  var letters = ['a', 'b', 'c'];
  var column = move.substr(0, 0);
  var row = parseInt(move.substr(1));
  return (column + letters[letters.length - row]).toLowerCase();
}

function readSgfFile() {
  console.log('reading sgf file');
  if(fs.existsSync('/tmp/game.sgf')) {
    var sgf = fs.readFileSync('/tmp/game.sgf').toString();
    return sgf2go.sgf2json(sgf);
  } else {
    return generateInitialSgf();
  }
}

function writeSgfFile(json) {
  console.log('writing sgf file');
  var sgf = sgf2go.json2sgf(json);
  fs.writeFileSync('/tmp/game.sgf', sgf);
}

function logSgfFile() {
  console.log(sgf2go.json2sgf(readSgfFile()));
}

module.exports = {
  computerMove: computerMove,
  generateInitialSgf: generateInitialSgf,
  logSgfFile: logSgfFile,
  playerMove: playerMove,
  readSgfFile: readSgfFile
}
