const Game = require("./game");

function GameView() {
  this.game = null;
  this.interval = 600
  this.grid = document.getElementsByClassName('grid-square-square')
  this.levelUp = 0
}

GameView.MOVES = {
  left: -1,
  down: 8,
  right: 1,
};

GameView.prototype.bindKeyHandlers = function bindKeyHandlers() {
  key.unbind('space')
  key.unbind('left')
  key.unbind('right')
  key.unbind('down')

  let pill = this.game.currentPill
  Object.keys(GameView.MOVES).forEach(function(k)  {
    const move = GameView.MOVES[k];
    key(k, function () { pill.control(move); });
  });

    key("space", function () { pill.rotate(); });
};

GameView.prototype.start = function start() {
  switchScreen()
  let thisLevel = document.getElementById('level-slider').value - 0
  thisLevel += this.levelUp
  this.game = new Game(this.grid, thisLevel); 
  var gameLoop = setInterval(() => {
    this.game.step(); 
    this.bindKeyHandlers();
    if (this.game.lose) {
      this.clearGrid()
      this.game = null
      clearInterval(gameLoop)
      switchScreen()
      this.splash()
    } else if (this.game.win) {
      key.unbind('space')
      this.clearGrid()
      this.game = null
      clearInterval(gameLoop)
      document.getElementById('next-level-div').classList.toggle('hidden')
      key("space",  this.nextLevel.bind(this));
    }
  }, this.interval);
};

GameView.prototype.nextLevel = function nextLevel(){
  document.getElementById('next-level-div').classList.toggle('hidden')
  this.levelUp += 1
  switchScreen()
  this.start()
}

GameView.prototype.splash = function splash(){ 
  key("space",  this.start.bind(this));
}

GameView.prototype.clearGrid = function clearGrid(){
  Array.from(this.grid).forEach(ele => {
    ele.classList.remove(
      'virus', 'pill', 'cornflowerblue', 'bisque',
      'salmon', 'minHor', 'minVer', 'maxHor', 'maxVer', 'floater'
    )})

}

function switchScreen(){
  Array.from(document.getElementsByClassName('toHide')).forEach(ele => ele.classList.toggle('hidden'))
  key.unbind('space')
  key.unbind('left')
  key.unbind('right')
  key.unbind('down')
}

module.exports = GameView;
