const c = document.querySelector(".myCanvas");
const restartBtn = document.querySelector(".restartBtn");
const canvasHeight = c.height;
const canvasWidth = c.width;
const ctx = c.getContext("2d");
let circle_x = 160;
let circle_y = 60;
let radius = 20;
let xSpeed = 20;
let ySpeed = 20;
let ground_x = 100;
let ground_y = 500;
let ground_height = 5;
let brickArray = [];
let count = 0;

//取得min與max中間的數字
function getRandomArbitrary(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    brickArray.push(this);
    this.visible = true;
  }
  drawBrick() {
    ctx.fillStyle = "#b08968";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  touchingBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY <= this.y + this.height + radius &&
      ballY >= this.y - radius
    );
  }

  pickAloaction() {
    let overlapping = false;
    let new_x;
    let new_y;
    //確認birck是否重疊
    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < brickArray.length; i++) {
        if (new_x == brickArray[i].x + 50 && new_y == brickArray[i].y + 50) {
          overlapping = true;
          console.log("overlapping");
          return;
        } else {
          overlapping = false;
        }
      }
    }
    do {
      new_x = getRandomArbitrary(0, 950);
      new_y = getRandomArbitrary(0, 550);
      checkOverlap(new_x, new_y);
    } while (overlapping);
    this.x = new_x;
    this.y = new_y;
  }
}

// 製作所有的brick
for (let i = 0; i < 10; i++) {
  new Brick(
    getRandomArbitrary(0, 950),
    getRandomArbitrary(0, 550)
  ).pickAloaction();
}

window.addEventListener("mousemove", (e) => {
  console.log(e);
  ground_x = e.clientX;
});

function drawCircle() {
  //確認球是否打到磚塊
  brickArray.forEach((brick) => {
    if (brick.visible && brick.touchingBall(circle_x, circle_y)) {
      count++;
      brick.visible = false;
      //改變x.y方向速度，並且將brick從陣列中移除
      //從下方或上方撞擊
      if (circle_y >= brick.y + brick.height || circle_y <= brick.y) {
        ySpeed *= -1;
      }
      //從左方或右方撞擊
      else if (circle_x <= brick.x || circle_x >= brick.x + brick.width) {
        xSpeed *= -1;
      }
      //   brickArray.splice(index, 1);
      //   if (brickArray.length == 0) {
      //     alert("遊戲結束");
      //     clearInterval(game);
      //   }
      if (count == 10) {
        alert("遊戲結束");
        clearInterval(game);
      }
    }
  });
  //確認球是否打到棕色地板
  if (
    circle_x >= ground_x - radius &&
    circle_x <= ground_x + 200 + radius &&
    circle_y >= ground_y - radius &&
    circle_y >= ground_y - radius &&
    circle_y <= ground_y + radius
  ) {
    //從上方下來撞到地板時加強彈力
    if (ySpeed > 0) {
      circle_y -= 40;
    } else {
      //從下往上彈
      circle_y += 40;
    }
    ySpeed *= -1;
  }
  //確認球是否打到邊界
  //碰到右邊邊界
  if (circle_x >= canvasWidth - radius) {
    xSpeed *= -1;
  }
  //碰到左邊邊界
  if (circle_x <= radius) {
    xSpeed *= -1;
  }
  //碰到上邊邊界
  if (circle_y <= radius) {
    ySpeed *= -1;
  }
  //碰到下邊邊界
  if (circle_y >= canvasHeight - radius) {
    ySpeed *= -1;
  }
  //更動圓的座標
  circle_x += xSpeed;
  circle_y += ySpeed;
  //背景重新塗色
  ctx.fillStyle = "#f5ebe0";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  //畫出所有的brick
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  //畫出可移動地板
  ctx.fillStyle = "#7f5539";
  ctx.fillRect(ground_x, ground_y, 200, ground_height);

  //畫出圓球
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "#d5bdaf";
  ctx.fill();
}

let game = setInterval(drawCircle, 25);

restartBtn.addEventListener("click", () => {
  location.reload();
});
