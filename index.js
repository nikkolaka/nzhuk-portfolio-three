import * as THREE from 'three';
import { randFloat, randInt } from 'three/src/math/MathUtils';
import { Color } from 'three/src/math/Color';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth -20, window.innerHeight -20);
document.body.appendChild( renderer.domElement );
const cubeSize = 30;
const gridWidth = (window.innerWidth / cubeSize);
const gridHeight = (window.innerHeight / cubeSize);
console.log(gridWidth + " " + gridHeight);

// const size = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );

let grid = [];
const gridOffsetX = -(cubeSize * gridWidth / 2 );
const gridOffsetY = -(cubeSize * gridHeight / 2 );
const currentSpinningCubes = [];

const light = new THREE.PointLight( 0xffffff, 10000, 0, 2 );
light.position.set( -1000, -200, 200 );
scene.add( light );

const lightHelper = new THREE.PointLightHelper( light, 20, 0xff0000 );
scene.add( lightHelper );


function buildGrid() {
    for (let i = 0; i < gridWidth; i++) {
        grid[i] = [];
        for (let j = 0; j < gridHeight; j++) {
            let square  = new THREE.BoxGeometry( cubeSize, cubeSize, 1 );
            let material = new THREE.MeshBasicMaterial( { color:  new Color(randFloat(0.7,1), randFloat(0.7,1), randFloat(0.7,1))} );

            grid[i][j] = new THREE.Mesh( square, material );
            grid[i][j].position.x = i * cubeSize + gridOffsetX;
            grid[i][j].position.y = j * cubeSize + gridOffsetY;
            grid[i][j].position.z = 0 ;
            scene.add( grid[i][j] );
        }
    }

}

buildGrid();

function spinCubes(currentSpinningCubesArray) {
    console.log(currentSpinningCubesArray.length);
    if(currentSpinningCubesArray.length > 0) {
        
        currentSpinningCubesArray.forEach(chosenCube => {
            if(grid[chosenCube.x][chosenCube.y].rotation.x < Math.PI  && grid[chosenCube.x][chosenCube.y].rotation.x > 0) {
                grid[chosenCube.x][chosenCube.y].rotation.x += 0.02;
            } else if (grid[chosenCube.x][chosenCube.y].rotation.y < Math.PI && grid[chosenCube.x][chosenCube.y].rotation.y > 0) {
                grid[chosenCube.x][chosenCube.y].rotation.y += 0.02;
            } else {
                grid[chosenCube.x][chosenCube.y].rotation.x = 0;
                grid[chosenCube.x][chosenCube.y].rotation.y = 0;
                currentSpinningCubesArray.splice(currentSpinningCubesArray.indexOf(chosenCube), 1);
            }
        });
    } else{
        for (let i = 0; i < randInt(0, 500); i++) {
            let chosenCube = {x : randInt(0, gridWidth), 
                y : randInt(0, gridHeight)};
            if(grid[chosenCube.x][chosenCube.y] == undefined || currentSpinningCubesArray.includes(chosenCube)) {
                continue;
            }
            grid[chosenCube.x][chosenCube.y].rotation.x = 0;
            grid[chosenCube.x][chosenCube.y].rotation.y = 0;
            if(randInt(0, 1) == 0) {
                grid[chosenCube.x][chosenCube.y].rotation.x += 0.05;
            } else{
                grid[chosenCube.x][chosenCube.y].rotation.y += 0.05;
            }
            currentSpinningCubesArray.push(chosenCube);
        }
    }

}

function simulateCubes(){
    let newGrid = grid;
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            newGrid[x][y] = mutateCubes(x, y);
        }
    }
}

function mutateCubes(centerX, centerY) {
    let r = grid[centerX][centerY].material.color.r;
    let g = grid[centerX][centerY].material.color.g;
    let b = grid[centerX][centerY].material.color.b;

    let newR = 0;
    let newG = 0;
    let newB = 0;

    let count = 0;
    let weight = 0.01;
    let newCube = grid[centerX][centerY]; 
    for (let y = -1; y <= 1; y++) {
        for (let x = -1; x <= 1; x++) {
            if(centerX + x < 0 || centerX + x >= gridWidth || centerY + y < 0 || centerY + y >= gridHeight) {
                continue;
            }
            newR += r + (r - grid[centerX + x][centerY + y].material.color.r) * weight;
            newG += g + (g - grid[centerX + x][centerY + y].material.color.g) * weight;
            newB += b + (b - grid[centerX + x][centerY + y].material.color.b) * weight;
            count++;
        }
    }
    r = newR / count;
    g = newG / count;
    b = newB / count;
    newCube.material.color.r = r;
    newCube.material.color.g = g;
    newCube.material.color.b = b;

    return newCube;

}



camera.position.z = 500;



function animate() {
	requestAnimationFrame( animate );
    simulateCubes();
    spinCubes(currentSpinningCubes);

	renderer.render( scene, camera );
}

animate();

