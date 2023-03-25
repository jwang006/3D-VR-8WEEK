//node code learning from becky - term2-week7
//sketch code learning from Joe - term1-week6
//collabration with Yifan Hang- networked experence with OSC
//sketch code from jing term1 - week6 assignment

// Create connection to Node.JS Server
const socket = io();

let radius = 1100;
let positions = [],
    sizes = [],
    numBoxes = 80,
    positionsLine = [];

let canvas;
let roll = 0;
let pitch = 0;
let yaw = 0;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  background(255);
  createEasyCam();
  
   for(let i = 0 ; i < numBoxes ; i++){
    //s = size ==raduis of sphere
    let s = createVector(random(5,10));
    //p = position;
    let p = createVector(random(-radius/2,radius/2),random(-radius/2,radius/2), random(-radius/2,radius/2) );
    positions.push(p);
    sizes.push(s);
  }

}

function draw() {
  //set lights, make sure the rotate can be seen
  randomSeed(400);
  drawGrid(20, 20, 100);
  lights();
  pointLight(241, 203, 99, pitch*400, roll*400, yaw*400);

  //draw random spheres and lines;
  push();
    for(let i = 1 ; i < numBoxes ; i++){
    push();
    let _sz = sizes[i].copy();
    //p is random x,y,z;
    //ps is previous x,y,z;
    let ps = positions[i-1].copy();
    
    //make whole structure rotate by users phone
    rotateZ(pitch);
    rotateX(roll);
    rotateY(yaw); 

    MyLine(ps,positions[i]); 
    Sphere(_sz, positions[i]);
    pop();
    }
    pop();
}
//class of lines
function MyLine(ps,s){
  push();
  strokeWeight(3);
  stroke(255,240,0);
  beginShape();
  translate(0,0, radius/2);
  vertex(ps.x,ps.y,ps.z);
  vertex(s.x,s.y,s.z);
  endShape();
  pop();
}
//class of spheres
function Sphere(sr, pos){
  push();
  translate(pos.x, pos.y, pos.z + radius/2);
  push();

  //make each sphere spin by itself
  rotateZ(pitch);
  rotateX(roll);
  rotateY(yaw); 
  stroke(183,253,185);
  fill(183,253,185);
  sphere(sr.r,20,20);
  pop();
  pop();
}

/* draw a grid with variable width height and size */
function drawGrid(rows, cols, sz){
  push();
  stroke(0,100);
  // move to negative edge of the grid
  translate(-rows*0.5*sz,-cols*0.5*sz );

  // draw the rows
  for(let i = 0; i < rows+1; i++){
    line(i *sz, 0 ,i*sz, cols*sz);
  }
  // draw the columns
  for(let j = 0; j < cols+1; j++){
    line(0,j *sz, rows*sz ,j*sz);
  }

  pop();
}

//process the incoming OSC message and use them for our sketch
function unpackOSC(message){
  /*-------------
  This sketch is set up to work with the gryosc app on the apple store.
  Use either the gyro OR the rrate to see the two different behaviors
  TASK: 
  Change the gyro address to whatever OSC app you are using to send data via OSC
  ---------------*/

  //maps phone rotation directly 
  //uses the rotation rate to keep rotating in a certain direction
  if(message.address == "/gyrosc/rrate"){
    roll += map(message.args[0],-3,3,-0.1,0.1);
    pitch += map(message.args[1],-3,3,-0.1,0.1);
    yaw += map(message.args[2],-3,3,-0.1,0.1);
  }
}

//Events we are listening for
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

}

// Connect to Node.JS Server
socket.on("connect", () => {
  console.log(socket.id);
});

// Callback function on the event we disconnect
socket.on("disconnect", () => {
  console.log(socket.id);
});

// Callback function to recieve message from Node.JS
socket.on("message", (_message) => {

  console.log(_message);

  unpackOSC(_message);

});