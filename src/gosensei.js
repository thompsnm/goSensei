var exec     = require('child_process').exec;
var execSync = require('child_process').execSync;
var fs       = require('fs');
var sgf2go   = require('sgf2go');

//playerMove('b2');
//console.log(isGameOver());
//computerMove();
//console.log(isGameOver());
//playerMove('pass');
//console.log(isGameOver());
//console.log(reportScore().toString());

//computerMove().then(function(move) { console.log(move); } );
//console.log(convertMoveToSgfCoordinate('a1'));

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

  //return new Promise((resolve, reject) => {
    var gnugo = execSync(`${__dirname}/gnugo -l /tmp/game.sgf -o /tmp/game.sgf`);

    //gnugo.stdout.on('data', (data) => {
    //  console.log(data);
    //});

    //gnugo.stderr.on('data', (data) => {
    //  console.log(data);
    //});

    //gnugo.on('close', (code) => {
    //  console.log('New sgf:');
      logSgfFile();

      var moveList = readSgfFile()[0];
      var lastMove = moveList[moveList.length - 1][0].value;
      //resolve(lastMove);
  return lastMove;
  //  });
  //});
};

function playerMove(move) {
  console.log('executing player move at ' + move);
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
  console.log('converting move ' + move);
  if(move === 'pass') {
    return '';
  }

  var letters = ['a', 'b', 'c'];
  var column = move.substr(0, 1);
  var row = parseInt(move.substr(1));
  var convertedMove = column.concat(letters[letters.length - row]).toLowerCase();

  console.log('converted move: ' + convertedMove);
  return convertedMove;
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

function isGameOver() {
  console.log('checking if game is over');
  var moveList = readSgfFile()[0];
  if(moveList.length < 3) {
    return false;
  }

  var lastMove = moveList[moveList.length - 1][0].value;
  var secondToLastMove = moveList[moveList.length - 2][0].value;
  if(lastMove == '' && secondToLastMove == '') {
    return true;
  } else {
    return false;
  }
}

function reportScore() {
  console.log('checking score');

  var gnugo = execSync(`${__dirname}/gnugo -l /tmp/game.sgf --score estimate`);
  return gnugo.toString().trim();
}

function logSgfFile() {
  console.log(sgf2go.json2sgf(readSgfFile()));
}

module.exports = {
  computerMove: computerMove,
  generateInitialSgf: generateInitialSgf,
  isGameOver: isGameOver,
  logSgfFile: logSgfFile,
  playerMove: playerMove,
  readSgfFile: readSgfFile,
  reportScore: reportScore
}
