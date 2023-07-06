import * as THREE from "three";
import { randFloat, randInt } from "three/src/math/MathUtils";
import { Color } from "three/src/math/Color";

let scene, camera, renderer;
let cubeGrid = [],
  colorGrid = [],
  currentSpinningCubes = [];
let cubeSize, gridWidth, gridHeight;
let gridOffsetX, gridOffsetY;

init();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 500;
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
  document.body.appendChild(renderer.domElement);
  cubeSize = 30;
  gridWidth = window.innerWidth / cubeSize;
  gridHeight = window.innerHeight / cubeSize;
  gridOffsetX = -((cubeSize * gridWidth) / 2);
  gridOffsetY = -((cubeSize * gridHeight) / 2);
  buildGrid();
}

animate();

function animate() {
  requestAnimationFrame(animate);
  simulateCubes();
  spinCubes(currentSpinningCubes);

  renderer.render(scene, camera);
}

function buildGrid() {
  for (let i = 0; i < gridWidth; i++) {
    cubeGrid[i] = [];
    colorGrid[i] = [];
    for (let j = 0; j < gridHeight; j++) {
      let square = new THREE.BoxGeometry(cubeSize, cubeSize, 1);
      let colors = {
        r: randFloat(0, 1),
        g: randFloat(0.3, 1),
        b: randFloat(0, 1),
      };
      colorGrid[i][j] = colors;
      let material = new THREE.MeshBasicMaterial({
        color: new Color(colors.r, colors.g, colors.b),
      });

      cubeGrid[i][j] = new THREE.Mesh(square, material);
      cubeGrid[i][j].position.x = i * cubeSize + gridOffsetX;
      cubeGrid[i][j].position.y = j * cubeSize + gridOffsetY;
      cubeGrid[i][j].position.z = 0;
      scene.add(cubeGrid[i][j]);
    }
  }
}

function spinCubes(currentSpinningCubesArray) {
  console.log(currentSpinningCubesArray.length);
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

  let newR = 0;
  let newG = 0;
  let newB = 0;

  let count = 0;
  let weight = 0.01;
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
      if (r > 0 && r < 1)
        newR += r + (colorGrid[centerX + x][centerY + y].r - r) * weight;
      if (g > 0 && g < 1)
        newG += g + (colorGrid[centerX + x][centerY + y].g - g) * weight;
      if (b > 0 && b < 1)
        newB += b + (colorGrid[centerX + x][centerY + y].b - b) * weight;
      count++;
    }
  }
  newR /= count;
  newG /= count;
  newB /= count;
  return { r: newR, g: newG, b: newB };
}
