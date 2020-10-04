const container = document.getElementById("container");
const text = document.getElementById("text");

// 7500 is equal to 7.5sec
const totalTime = 7500;
const breatheTime = (totalTime / 5) * 2;
const holdTime = totalTime / 5;

breatheAnimation();

function breatheAnimation() {
  text.innerText = "breathe in!";
  container.className = "container grow";

  setTimeout(() => {
    text.innerText = "hold";

    setTimeout(() => {
      text.innerText = "breathe out";
      container.className = "container shrink";
    }, holdTime);
  }, breatheTime);
}

//to run this animation every 7.5sec
setInterval(breatheAnimation, totalTime);
