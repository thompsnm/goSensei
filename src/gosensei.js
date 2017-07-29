var exec    = require('child_process').exec;
var fs      = require('fs');
var sgf2go  = require('sgf2go');

var json = [
    [
      [
        {"key":"FF","value":["4"]},
        {"key":"GM","value":["1"]},
        {"key":"SZ","value":["9"]}
      ],
      [
        {"key":"B","value":["aa"]}
      ],
      [
        {"key":"W","value":["bb"]}
      ],
      [
        {"key":"B","value":["cc"]}
      ],
      [
        {"key":"W","value":["dd"]}
      ],
      [
        {"key":"B","value":["ad"]}
      ],
      [
        {"key":"W","value":["bd"]}
      ]
    ]
];

generateInitialSgf();
executeMove();

// Generate initial sgf file
function generateInitialSgf() {
  const generated = sgf2go.json2sgf(json);
  //const generated = fs.readFileSync(`${__dirname}/game.sgf`).toString();
  fs.writeFileSync(__dirname + '/game.sgf', generated);
  console.log('Current sgf:');
  logSgfFile();
}

//Execute move
function executeMove() {
  const gnugo = exec(`${__dirname}/gnugo -l ${__dirname}/game.sgf -o ${__dirname}/game.sgf`);

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

function logSgfFile() {
  console.log(fs.readFileSync(`${__dirname}/game.sgf`).toString());
}

module.exports = {
  executeMove: executeMove,
  logSgfFile: logSgfFile
}
