const eatfoodmusic = new Audio("music/eatfood.mp3");
const movesnakemusic = new Audio("music/movesnake.mp3");
const overlaycontainer = document.querySelector(".overlaycontainer");
const hideoverlaynotificationbtn = document.getElementById(
  "hideoverlaynotificationbtn"
);
let inputsnakedirection = { topbottomoffset: 0, rightleftoffset: 0 };
let snakearr = [{ topbottomoffset: 13, rightleftoffset: 15 }];
let foodparticle = { topbottomoffset: 15, rightleftoffset: 13 };
let lastpainttime = 0;
let snakemovespeed = 10;
let score = 0;
let scoreboard = document.getElementById("scoreboard");
let gameboard = document.getElementById("gameboard");

// ============================ game loop ============================
function gameloop(framepersecond) {
  window.requestAnimationFrame(gameloop);
  // console.log("fps " + framepersecond);
  if ((framepersecond - lastpainttime) / 1000 < 1 / snakemovespeed) {
    // animation will occur if the fps - lastpainttime is decimal value that's why divided with 1000 then the value is less then 1/snakemovespeed variable which means too fast animation then return the animation that's why we've returned the animation because it's too much fast otherwise lastpainttime = fps which means we're ready to play the game
    return;
  }
  lastpainttime = framepersecond;
  gamelogic();
  //   console.log("lastpainttime " + lastpainttime);
}

// ============================ snake colliding conditions ============================
function iscollide(snake) {
  // ============= if the snake bump into itself or the snake's head bumped with snake's body ===============
  for (let bodysegment = 1; bodysegment < snakearr.length; bodysegment++) {
    if (
      snake[bodysegment].topbottomoffset === snake[0].topbottomoffset &&
      snake[bodysegment].rightleftoffset === snake[0].rightleftoffset
    ) {
      //   console.log("snake bumped into itself");
      return true;
    }
  }
  // ============================ if the snake bump into barrier ============================
  if (
    snake[0].topbottomoffset >= 18 ||
    snake[0].topbottomoffset <= 0 ||
    snake[0].rightleftoffset >= 18 ||
    snake[0].rightleftoffset <= 0
  ) {
    // console.log("snake bumped into the barrier");
    return true;
  }
}

// ============================ game functions ============================
function gamelogic() {
  // ============================ update the snake array and the food particle ============================
  //   if the snake is collide then reset the snake direction to default value and reset the snake body and show only snake head & reset the score for new game
  if (iscollide(snakearr)) {
    inputsnakedirection = { topbottomoffset: 0, rightleftoffset: 0 };
    // alert("game over");
    document.body.classList.add("active");
    overlaycontainer.style.display = "block";
    snakearr = [{ topbottomoffset: 13, rightleftoffset: 15 }];
    score = 0;
  }
  // ============================ hide the game over notification ============================
  hideoverlaynotificationbtn.addEventListener("click", (e) => {
    document.body.classList.remove("active");
    overlaycontainer.style.display = "none";
  });
  // ===== if you have eaten the food increment the user's game score and regenerate the food particle ======
  if (
    snakearr[0].topbottomoffset === foodparticle.topbottomoffset &&
    snakearr[0].rightleftoffset === foodparticle.rightleftoffset
  ) {
    // console.log("snake ate the food particle");
    score += 1;
    scoreboard.innerHTML = "Score : " + score;
    eatfoodmusic.play();
    // ==================== update the merge snake body with new snake body's segments ====================
    snakearr.unshift({
      topbottomoffset:
        snakearr[0].topbottomoffset + inputsnakedirection.topbottomoffset,
      rightleftoffset:
        snakearr[0].rightleftoffset + inputsnakedirection.rightleftoffset,
    });
    // ============ change the food particle location with random location inside the game box ============
    let startrowcolumn = 2;
    let endlastrowcolumn = 16;
    foodparticle = {
      topbottomoffset: Math.round(
        startrowcolumn + (endlastrowcolumn - startrowcolumn) * Math.random()
      ),
      rightleftoffset: Math.round(
        startrowcolumn + (endlastrowcolumn - startrowcolumn) * Math.random()
      ),
    };
  }
  // ===================== moving the snake element =====================
  // ======== iterated each snake body segments using decremented for loop with the snakearry ========
  for (
    // it's the second last segment of snake array let snakebodysegments = snakearr.length - 2;
    let snakebodysegments = snakearr.length - 2;
    snakebodysegments >= 0;
    snakebodysegments--
  ) {
    snakearr[snakebodysegments + 1] = { ...snakearr[snakebodysegments] };
  }
  snakearr[0].topbottomoffset += inputsnakedirection.topbottomoffset;
  snakearr[0].rightleftoffset += inputsnakedirection.rightleftoffset;

  // ===================== cleared the gameboard then displaying the snake =====================
  gameboard.innerHTML = "";
  snakearr.forEach((element, index) => {
    let snakeelement = document.createElement("div");
    snakeelement.style.gridRowStart = element.topbottomoffset;
    snakeelement.style.gridColumnStart = element.rightleftoffset;
    if (index === 0) {
      snakeelement.classList.add("snakehead");
    } else {
      snakeelement.classList.add("snakebody");
    }
    gameboard.appendChild(snakeelement);
  });
  // ============================  displaying the food particle ============================
  let foodelement = document.createElement("div");
  foodelement.style.gridRowStart = foodparticle.topbottomoffset;
  foodelement.style.gridColumnStart = foodparticle.rightleftoffset;
  foodelement.classList.add("foodparticle");
  gameboard.appendChild(foodelement);
}

window.requestAnimationFrame(gameloop);
// ======================= move the snake direction according to the user's input =======================
window.addEventListener("keydown", (e) => {
  inputsnakedirection = { topbottomoffset: 1, rightleftoffset: 0 };
  switch (e.key) {
    case "ArrowUp":
      inputsnakedirection = { topbottomoffset: -1, rightleftoffset: 0 };
      movesnakemusic.play();
      //   console.log(`the key code for ${e.key} is ${e.keyCode}`);
      break;
    case "ArrowDown":
      inputsnakedirection = { topbottomoffset: 1, rightleftoffset: 0 };
      movesnakemusic.play();
      //   console.log(`the key code for ${e.key} is ${e.keyCode}`);
      break;
    case "ArrowRight":
      inputsnakedirection = { topbottomoffset: 0, rightleftoffset: 1 };
      movesnakemusic.play();
      //   console.log(`the key code for ${e.key} is ${e.keyCode}`);
      break;
    case "ArrowLeft":
      inputsnakedirection = { topbottomoffset: 0, rightleftoffset: -1 };
      movesnakemusic.play();
      //   console.log(`the key code for ${e.key} is ${e.keyCode}`);
      break;
    default:
      break;
  }
});
