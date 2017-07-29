var program = require('commander');
var exec = require('child_process').exec;

program.version('1.0.0');

console.log(__dirname);
const gnugo = exec(__dirname + '/gnugo -h');
//const gnugo = exec('ls ' + __dirname);

gnugo.stdout.on('data', (data) => {
    console.log(data.toString());
});

gnugo.stderr.on('data', (data) => {
    console.log(data.toString());
});

gnugo.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});
