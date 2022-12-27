const canvas = document.querySelector(".myCanvas");
const ctx = canvas.getContext("2d");
//分數計算
let score = 0;
let highestScore;
loadHighestScore();
document.querySelector(".myScore").innerHTML = `遊戲分數: ${score}`;
document.querySelector(".myScore2").innerHTML = `最高分數: ${highestScore}`;

// getContext()會回傳一個canvas的drawing context,可以在canvas內畫圖
const unit = 20;
const row = canvas.height / unit; // 320/20=16
const column = canvas.width / unit; // 320/20=16

//貪食蛇本體
//array中的每個元素都是一個物件來儲存身體的x,y座標
let snake = [];
function createSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };

  snake[1] = {
    x: 60,
    y: 0,
  };

  snake[2] = {
    x: 40,
    y: 0,
  };

  snake[3] = {
    x: 20,
    y: 0,
  };
}

//果實
class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "lightskyblue";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickALocation() {
    let overlapping = false;
    let new_x;
    let new_y;
    //確認位置是否跟貪食蛇本體重疊
    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }
    //當overlapping為true時，執行以下程式碼
    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}

createSnake();
let myFruit = new Fruit();

//改變移動方向
window.addEventListener("keydown", changeDirection);
let direction = "Right";
function changeDirection(e) {
  if (e.key == "ArrowRight" && direction !== "Left") {
    direction = "Right";
  } else if (e.key == "ArrowDown" && direction !== "Up") {
    direction = "Down";
  } else if (e.key == "ArrowLeft" && direction !== "Right") {
    direction = "Left";
  } else if (e.key == "ArrowUp" && direction !== "Down") {
    direction = "Up";
  }
  //每次按下方向鍵之後，在下一幀被畫出來之前
  //不接受任何keydown事件，防止連續按鍵導致自殺
  window.removeEventListener("keydown", changeDirection);
}

function draw() {
  //每次畫圖之前，確認是否咬到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("Game Over");
      return;
    }
  }
  //每次執行背景重置，重新繪製貪食蛇位置
  ctx.fillStyle = "rgb(166, 188, 164)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  myFruit.drawFruit();

  //繪製出貪食蛇位置
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "khaki";
    } else {
      ctx.fillStyle = "beige";
    }
    ctx.strokeStyle = "black";

    //穿牆邏輯判斷
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    //x,y,width,height
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }
  //以目前的direction方向，來決定蛇的下一幀要放在哪個座標
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  if (direction == "Left") {
    snakeX -= unit;
  } else if (direction == "Up") {
    snakeY -= unit;
  } else if (direction == "Right") {
    snakeX += unit;
  } else if (direction == "Down") {
    snakeY += unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };
  //確認是否有吃到果實
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    myFruit.pickALocation();
    //更新分數
    score++;
    setHighestScore(score);
    document.querySelector(".myScore").innerHTML = `遊戲分數: ${score}`;
    document.querySelector(".myScore2").innerHTML = `最高分數: ${highestScore}`;
  } else {
    snake.pop();
  }
  snake.unshift(newHead);
  window.addEventListener("keydown", changeDirection);
}

let myGame = setInterval(draw, 100);

function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
