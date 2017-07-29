var Alexa    = require('alexa-sdk');
var goSensei = require('./gosensei');

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context, callback);
  alexa.registerHandlers(newSessionHandlers, gameModeHandlers, startGameHandlers);
  alexa.execute();
};

var states = {
  GAMEMODE: '_GAMEMODE',   // User is playing against the computer.
  STARTMODE: '_STARTMODE'  // Prompt the user to start or restart the game.
};

var newSessionHandlers = {

  // This will short-cut any incoming intent or launch requests and route them to this handler.
  'NewSession': function() {
    this.handler.state = states.STARTMODE;
    this.emit(
      ':ask',
      'Welcome to Go Sensei. Would you like to play a game of Go?',
      'Say yes to start the game or no to quit.'
    );
  }
};

var gameModeHandlers = Alexa.CreateStateHandler(states.GAMEMODE, {

  'NewSession': function () {
    this.handler.state = '';
    this.emitWithState('NewSession'); // Equivalent to the Start Mode NewSession handler
  },

  'MoveIntent': function() {
    var move = this.event.request.intent.slots.move.value;

    console.log('user move: ' + move);
    var json = goSensei.readSgfFile();
    goSensei.playerMove(json, move);
    goSensei.computerMove();
    this.emit(':ask', 'Move has been recorded. Where would you like to play? Say a coordinate like F5.', 'Where would you like to play? Say a coordinate like F5.');
  },

  'AMAZON.HelpIntent': function() {
    console.log('user asked for help');
    //this.emit(':ask', 'I am thinking of a number between zero and one hundred, try to guess and I will tell you' +
    //' if it is higher or lower.', 'Try saying a number.');
  },

  'SessionEndedRequest': function () {
    console.log('session ended!');
  },

  'Unhandled': function() {
    this.emit(':ask', 'Sorry, I didn\'t get that. Try saying the coordinate again.', 'Try saying the coordinate again.');
  }

});

var startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, {

  'NewSession': function () {
      this.emit('NewSession'); // Uses the handler in newSessionHandlers
  },

  'AMAZON.HelpIntent': function() {
    console.log('user asked for help');
    //var message = 'I will think of a number between zero and one hundred, try to guess and I will tell you if it' +
    //              ' is higher or lower. Do you want to start the game?';
    //this.emit(':ask', message, message);
  },

  'AMAZON.YesIntent': function() {
    this.handler.state = states.GAMEMODE;
    this.emit(':ask', 'Great! Where would you like to play? Say a coordinate like F5.', 'Where would you like to play? Say a coordinate like F5.');
  },

  'AMAZON.NoIntent': function() {
    this.emit(':tell', 'Ok, see you next time!');
  },

  'SessionEndedRequest': function () {
    console.log('session ended!');
  },

  'Unhandled': function() {
    var message = 'Say yes to continue, or no to end the game.';
    this.emit(':ask', message, message);
  }
});
