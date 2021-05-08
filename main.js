//*** S E L E C T O R S ***//

const canvas1 = document.querySelector("#canvas1");
const ctx1 = canvas1.getContext("2d");
//console.log(ctx1)
canvas1.width = 600;
canvas1.height = 600;
const canvas2 = document.querySelector("#canvas2");
const ctx2 = canvas2.getContext("2d");
canvas2.width = 600;
canvas2.height = 600;
const canvas3 = document.querySelector("#canvas3");
const ctx3 = canvas3.getContext("2d");
canvas3.width = 600;
canvas3.height = 600;
const scoreboard = document.getElementById("scoreboard")


//*** G L O B A L  V A R I A B L E S ***//


const grid = 50;
let keyboard = [];
let score = 0;
let gameSpeed = 1;
let vehicleArr = [];

//*** I M A G E S ***//

const road_bg = new Image()
road_bg.src = 'libraries/images/crossyRoad_bg.jpg'
const vehicle_img = new Image()
vehicle_img.src = 'libraries/images/veh_Sprites.png'
let numberOfVehicles = 4
const chicken_img = new Image()
chicken_img.src = 'libraries/images/ChickenSprite.png'


//*** S O U N D S ***//


const youDied = new Audio
youDied.src = 'libraries/sounds/fatality.mp3'
const youScored = new Audio
youScored.src = 'libraries/sounds/mario_coin_sound.mp3'
const bgMusic = new Audio
bgMusic.src = 'libraries/sounds/MC_Hammer.mp3'
const halfway = new Audio
halfway.src = 'libraries/sounds/anime-wow.mp3'
const winner = new Audio
winner.src = 'libraries/sounds/epic-sax-guy.mp3'


//*** C L A S S E S ***//


class Chicken {
  constructor() {
    this.spriteWidth = 250;     //sprite size 250px x 250px
    this.spriteHeight = 250;
    this.width = this.spriteWidth / 5 ;    //sprite size on canvas 5x smaller minus 1 px 
    this.height = this.spriteHeight / 5 ;
    this.x = canvas2.width / 2 - this.width / 2;    //position x middle of canvas
    this.y = canvas2.height - this.height - 20;     //position y bottom of canvas
    this.movement = false;
    this.frameX = 0;
    this.frameY = 0;
  }
  drawChar() {
    // ctx2.fillRect(this.x, this.y, this.width, this.height);
    // ctx2.fillStyle = "yellow";
    ctx2.drawImage(chicken_img, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
  }
  updateStatus() {
    //console.log('update')
    if (keyboard[38] || keyboard[87]) {
      // UP movement
      if (this.movement === false) {
        this.y = this.y - grid;
        this.movement = true;
        this.frameY = 3
      }
    }
    if (keyboard[40] || keyboard[83]) {
      // DOWN Movement
      if (this.movement === false && this.y < canvas2.height - this.height * 2) {
        this.y = this.y + grid;
        this.movement = true;
        this.frameY = 0
      }
    }
    if (keyboard[37] || keyboard[65]) {
        // LEFT movement
        if (this.movement === false && this.x > this.width) {
          this.x = this.x - grid;
          this.movement = true;
          this.frameY = 1
        }
    }
    if (keyboard[39] || keyboard[68]) {
        // RIGHT movement
        if (this.movement === false && this.x < canvas2.width - this.width * 2) {
          this.x = this.x + grid;
          this.movement = true;
          this.frameY = 2
        }
    }
        // Successfully reach end of screen
    if (this.y < 0) {
        scorePoint()
    }
  }
  move() {
    if (this.movement === false){
      this.frameX = 1
    } else if (this.frameX = 1){
      this.frameX = 0
    }
    console.log("moved");
  }
}
const nugget = new Chicken();
class Vehicles {
  constructor(width, height, x, y, speed) {
    this.width = width
    this.height = height
    this.x = x
    this.y = y
    this.speed = speed
    this.randomVeh = Math.floor(Math.random() * numberOfVehicles)
    this.frameX = 0
  }
  drawVehicle() {
    //ctx3.fillRect(this.x, this.y, this.width, this.height)
    //ctx3.fillStyle = "red"
    ctx3.drawImage(vehicle_img, this.frameX * this.width, this.randomVeh * this.height, grid*2, grid, this.x, this.y, this.width, this.height)
  }
  updateStatus() {
    //this.speed can be negative or positive for direction control therefore multiplication used as speed increment
    this.x += this.speed * gameSpeed 
    //check condition if car moving right
    //resetting vehicles to loop over again
    if(this.speed > 0){
      this.frameX = 1
      if(this.x > canvas3.width + this.width) {
        this.x = 0 - this.width
        this.randomVeh = Math.floor(Math.random() * numberOfVehicles)
      } //check condition if car is moving left
    } else {
      if(this.x < 0 - this.width) {
        this.x = canvas3.width + this.width
        this.randomVeh = Math.floor(Math.random() * numberOfVehicles)
      }
    }
  }
}


//*** F U N C T I O N S ***//


// Animation Frame, clears canvas, draws chicken and car, background
function animation() {
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
  nugget.drawChar();
  nugget.updateStatus();
  ctx1.drawImage(road_bg, 0, 0, canvas1.width, canvas1.height)
  handleVehicle();
  requestAnimationFrame(animation);
}
animation();
//Increment score, increase difficulty speed, reposition chicken to starting point
function scorePoint() {
    score++
    gameSpeed += 0.1
    nugget.x = canvas2.width / 2 - nugget.width / 2
    nugget.y = canvas2.height - nugget.height - 20;
    vehicleArr = []
    createVehicle() //clear and reset vehicles randomiser
    scoreboard.innerHTML = score
    //console.log(`Score: ${score}`)
    console.log(`Game Speed: ${gameSpeed}`)
    //Play sounds
    if(score === 5){
      halfway.play()
    } else if (score === 11){
      bgMusic.pause()
      winner.play()
      swal("WINNER WINNER CHICKEN DINNER", "Proceed to MacDonalds to claim your prize.")
    }
    youScored.play()
}
// Create random Vehicle Distance
function randomVehicleDistance() {
  let randomNum = Math.floor(Math.random() * 200) + 200
  return randomNum
  //200 to 400
}
// Create random vehicle starting speed, recursion function used
function randomStartingSpeed() {
  let x = Math.random() * 4 - 2 // returns -2 to 2
  let y = Math.round(x * 10) / 10 // round to nearest 1 decimal place
  if(y !== 0.1 && y !== -0.1 && y !== 0.2 && y !== -0.2 && y !== 0.3 && y !== -0.3 && y !== 0){
   //console.log(x)
    return x
  } 
  return randomStartingSpeed()
}
//distance between cars, location on canvas and speed of vehicles
function handleCreateVehicle(lane) {
  let xSpeed = randomStartingSpeed()
  for(let i = 0; i < 2; i++){
    let x = i * randomVehicleDistance() 
    vehicleArr.push(new Vehicles(grid * 2, grid, x, canvas3.height - grid * lane - 20, xSpeed * gameSpeed))
  }
}
//create vehicles on each car lane
function createVehicle() {
  //Lane 1
  handleCreateVehicle(2)
  //Lane 2
  handleCreateVehicle(3)
  // //Lane 3 
  handleCreateVehicle(4)
  //  //Lane 4
  handleCreateVehicle(5)
  // //Lane 5 
  handleCreateVehicle(7)
  // //Lane 6
  handleCreateVehicle(8)
  // //Lane 7 
  handleCreateVehicle(9)
  //  //Lane 8
  handleCreateVehicle(10)
}
createVehicle()
//Handles Vehicle attributes
function handleVehicle(){
  for(let i = 0; i < vehicleArr.length; i++){
    vehicleArr[i].drawVehicle()
    vehicleArr[i].updateStatus()
  }
  // Collision with Vehicle
  for (let i = 0; i < vehicleArr.length; i++){
    if(handleCollision(nugget, vehicleArr[i]) === false){
      restartGame()
    }
  }
}
// Collision detection
function handleCollision(a, b) {
  //Collision conditions:
  //if B collides A from the left = bx + width < ax
  //if B collides A from the top = by + height < ay
  //if B collides A from the right = ax + width < bx
  //if B collides A from the btm = ay + height < by
  if(b.x + b.width < a.x || b.y + b.height < a.y + 1 || a.x + a.width < b.x || a.y + a.height - 1 < b.y) {
    return true
  } else {
    return false
  }  
}
// Resets Game
function restartGame(){
  gameSpeed = 1
  score = 0  
  nugget.x = canvas2.width / 2 - nugget.width / 2
  nugget.y = canvas2.height - nugget.height - 20;
  vehicleArr = []
  createVehicle()
  scoreboard.innerHTML = score
  youDied.play()
}


//*** E V E N T  L I S T E N E R S ***//


const btn = document.getElementById("btn")
btn.addEventListener("click", function(){
 console.log("clicked")
 if (bgMusic.paused){
   bgMusic.play()
 } else {
   bgMusic.pause()
 }
})
//Detect WASD or arrows keys
window.addEventListener("keydown", function (event) {
    event.preventDefault()
  keyboard = [];
  keyboard[event.keyCode] = true;
  if (
    keyboard[37] ||
    keyboard[38] ||
    keyboard[39] ||
    keyboard[40] ||
    keyboard[87] ||
    keyboard[83] ||
    keyboard[65] ||
    keyboard[68]
  ) {
    nugget.move();
  }
});
//To updateStatus movement = false to allow player to move when key is pressed again
window.addEventListener("keyup", function(event){
    delete keyboard[event.keyCode]
    nugget.movement = false
    nugget.frameX = 0 //revert to images on first column
})