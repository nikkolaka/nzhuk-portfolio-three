import * as THREE from "three";
import { randFloat, randInt } from "three/src/math/MathUtils";
import { Color } from "three/src/math/Color";
import { PickHelper } from "./mousecontrols.js";
import { Snake } from "./snake.js";

let scene, camera, renderer;
let cubeGrid = [],
  colorGrid = [],
  currentSpinningCubes = [];
let cubeSize, gridWidth, gridHeight;
let gridOffsetX, gridOffsetY;
let fov = 75, aspect = window.innerWidth / window.innerHeight, near = 0.1, far = 1000;
const pickPosition = {x: 0, y: 0};
const pickHelper = new PickHelper();
const mouseClock = new THREE.Clock();
let canvas;
let snakes = [];


init();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    fov,
    aspect,
    near,
    far
  );
  camera.position.z = 500;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
  document.body.appendChild(renderer.domElement);
  canvas = renderer.domElement;   
  cubeSize = 30;
  gridWidth = window.innerWidth / cubeSize;
  gridHeight = window.innerHeight / cubeSize;
  snakes = [new Snake(gridWidth, gridHeight)];
  gridOffsetX = -((cubeSize * gridWidth) / 2);
  gridOffsetY = -((cubeSize * gridHeight) / 2);
  window.addEventListener('mousemove', setPickPosition);
  window.addEventListener('mouseout', clearPickPosition);
  window.addEventListener('mouseleave', clearPickPosition);
  clearPickPosition();
  buildGrid();
}

animate();

function animate() {
  requestAnimationFrame(animate);

  changeRandomCubeColor(0.05);

  mouseColorChanging();
  simulateSnakes();
  simulateCubes();
  spinCubes(currentSpinningCubes);
  
  


  renderer.render(scene, camera);
}

function simulateSnakes() {
  if(snakes.length < 10 && randInt(0, 100) < 1) {
    snakes.push(new Snake(gridWidth, gridHeight));
  }
  

  

  snakes.forEach(snake => {
    if (!snake.alive) {
      snakes.splice(snakes.indexOf(snake), 1);

    }
    if (snake.clock.getElapsedTime() > 0.05) {
      snake.move();
      setCubeColor(snake.location[0], snake.location[1], snake.color.r, snake.color.g, snake.color.b);
      spinCube(snake.location[0], snake.location[1], randInt(0,1));
      snake.clock.start();
    }
  });
    

}



function mouseColorChanging() {
    let selectedCube = pickHelper.pick(pickPosition, scene, camera, colorGrid);
    if (selectedCube && mouseClock.getElapsedTime() > 0.05) {


        spinCube(selectedCube[0], selectedCube[1], randInt(0,1));
        setCubeColor(selectedCube[0], selectedCube[1], randFloat(0.8, 1), randFloat(0.9, 1), randFloat(0.8, 1));

        selectedCube = null;
        mouseClock.start();
    }
}

function spinCube(x, y, direction) {
  x = Math.floor(x);
  y = Math.floor(y);
  if (direction === 0) {
    cubeGrid[x][y].rotation.y += 0.01;
  } else{
    cubeGrid[x][y].rotation.x += 0.01;
  }
  currentSpinningCubes.push({x: x, y: y});


}


function changeRandomCubeColor(chance) {
    if (randFloat(0, 1) < chance) {
        setCubeColor(
            randInt(0, gridWidth - 1), 
            randInt(0, gridHeight - 1),
            randFloat(0, 0.2),
            randFloat(0.8, 1),
            randFloat(0, 0.2));
    }
}

function buildGrid() {
  for (let i = 0; i < gridWidth; i++) {
    cubeGrid[i] = [];
    colorGrid[i] = [];
    for (let j = 0; j < gridHeight; j++) {
      let square = new THREE.BoxGeometry(cubeSize, cubeSize, 1);
      let colors = {
        r: randFloat(0, 0.0001),
        g: randFloat(0, 0.0001),
        b: randFloat(0, 0.0001),
      };
      colorGrid[i][j] = colors;
      let material = new THREE.MeshBasicMaterial({
        color: new Color(colors.r, colors.g, colors.b),
      });

      cubeGrid[i][j] = new THREE.Mesh(square, material);
      cubeGrid[i][j].position.x = i * cubeSize + gridOffsetX;
      cubeGrid[i][j].position.y = j * cubeSize + gridOffsetY;
      cubeGrid[i][j].position.z = 0;
      cubeGrid[i][j].userData.i = i;
      cubeGrid[i][j].userData.j = j;
      scene.add(cubeGrid[i][j]);
    }
  }
}

function spinCubes(currentSpinningCubesArray) {
  if (currentSpinningCubesArray.length > 0) {
    currentSpinningCubesArray.forEach((chosenCube) => {
      if (
        cubeGrid[chosenCube.x][chosenCube.y].rotation.x < Math.PI &&
        cubeGrid[chosenCube.x][chosenCube.y].rotation.x > 0
      ) {
        cubeGrid[chosenCube.x][chosenCube.y].rotation.x += 0.02;
      } else if (
        cubeGrid[chosenCube.x][chosenCube.y].rotation.y < Math.PI &&
        cubeGrid[chosenCube.x][chosenCube.y].rotation.y > 0
      ) {
        cubeGrid[chosenCube.x][chosenCube.y].rotation.y += 0.02;
      } else {
        cubeGrid[chosenCube.x][chosenCube.y].rotation.x = 0;
        cubeGrid[chosenCube.x][chosenCube.y].rotation.y = 0;
        currentSpinningCubesArray.splice(
          currentSpinningCubesArray.indexOf(chosenCube),
          1
        );
      }
    });
  } else {
    for (let i = 0; i < randInt(0, 500); i++) {
      let chosenCube = {
        x: randInt(0, gridWidth - 1),
        y: randInt(0, gridHeight - 1),
      };
      if (currentSpinningCubesArray.includes(chosenCube)) {
        continue;
      }
      cubeGrid[chosenCube.x][chosenCube.y].rotation.x = 0;
      cubeGrid[chosenCube.x][chosenCube.y].rotation.y = 0;
      if (randInt(0, 1) == 0) {
        cubeGrid[chosenCube.x][chosenCube.y].rotation.x += 0.05;
      } else {
        cubeGrid[chosenCube.x][chosenCube.y].rotation.y += 0.05;
      }
      currentSpinningCubesArray.push(chosenCube);
    }
  }
}

function simulateCubes() {
  let newColorGrid = JSON.parse(JSON.stringify(colorGrid));
  for (let i = 0; i < gridWidth; i++) {
    for (let j = 0; j < gridHeight; j++) {
      newColorGrid[i][j] = degradeCubes(j, i);
      cubeGrid[i][j].material.color = new Color(
        newColorGrid[i][j].r,
        newColorGrid[i][j].g,
        newColorGrid[i][j].b
      );
    }
  }
  colorGrid = newColorGrid;
}

function degradeCubes(centerY, centerX) {
  let r = colorGrid[centerX][centerY].r;
  let g = colorGrid[centerX][centerY].g;
  let b = colorGrid[centerX][centerY].b;

  let newR = 0.0000001;
  let newG = 0.0000001;
  let newB = 0.0000001;

  let count = 0;
  let weight = 0.1;
  let diffusion = 0.0005  ;

  for (let y = -1; y <= 1; y++) {
    for (let x = -1; x <= 1; x++) {
      if (
        centerX + x < 0 ||
        centerX + x >= gridWidth ||
        centerY + y < 0 ||
        centerY + y >= gridHeight
      ) {
        continue;
      }
      // if (r > 0 && r < 1)
      //   newR += r + (colorGrid[centerX + x][centerY + y].r - r) * weight;
      // else
      //   newR += r;
      // if (g > 0 && g < 1)
      //   newG += g + (colorGrid[centerX + x][centerY + y].g - g) * weight;
      // else 
      //   newG += g;
      // if (b > 0 && b < 1)
      //   newB += b + (colorGrid[centerX + x][centerY + y].b - b) * weight;
      // else
      //   newB += b;
      newR += r + (colorGrid[centerX + x][centerY + y].r - r) * weight;
      newG += g + (colorGrid[centerX + x][centerY + y].g - g) * weight;
      newB += b + (colorGrid[centerX + x][centerY + y].b - b) * weight;
      count++;
    }
  }
  newR /= count;
  newG /= count;
  newB /= count;
  if(newR > 0) newR -= diffusion;
  if(newG > 0) newG -= diffusion;
  if(newB > 0) newB -= diffusion;

  return { r: newR, g: newG, b: newB};
}

function setCubeColor(x, y, r, g, b) {
    x = Math.floor(x);
    y = Math.floor(y);
    colorGrid[x][y] = { r: r, g: g, b: b};
    cubeGrid[x][y].material.color = new Color(r, g, b);
}

function getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * canvas.width  / rect.width,
      y: (event.clientY - rect.top ) * canvas.height / rect.height,
    };
  }
   
  function setPickPosition(event) {
    const pos = getCanvasRelativePosition(event);
    pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
    pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
  }
   
  function clearPickPosition() {
    // unlike the mouse which always has a position
    // if the user stops touching the screen we want
    // to stop picking. For now we just pick a value
    // unlikely to pick something
    pickPosition.x = -100000;
    pickPosition.y = -100000;
  }

  
