import * as THREE from 'three';
import { randFloat, randInt } from 'three/src/math/MathUtils';
import { Color } from 'three/src/math/Color';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const cubeSize = 50;
const gridWidth = window.innerWidth / cubeSize;
const gridHeight = window.innerHeight / cubeSize;
console.log(gridWidth + " " + gridHeight);

// const size = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );

let grid = [];
const gridOffsetX = -(cubeSize * gridWidth / 2 );
const gridOffsetY = -(cubeSize * gridHeight / 2 );
const currentSpinningCubes = [];


function buildGrid() {
    for (let i = 0; i < gridWidth; i++) {
        grid[i] = [];
        for (let j = 0; j < gridHeight; j++) {
            let square  = new THREE.BoxGeometry( cubeSize, cubeSize, cubeSize );
            let material = new THREE.MeshBasicMaterial( { color:  new Color(randFloat(0,1), randFloat(0,1), randFloat(0,1))} );

            grid[i][j] = new THREE.Mesh( square, material );
            grid[i][j].position.x = i * cubeSize + gridOffsetX;
            grid[i][j].position.y = j * cubeSize + gridOffsetY;
            grid[i][j].position.z = 0;
            scene.add( grid[i][j] );
        }
    }

}

buildGrid();

function spinCubes(currentSpinningCubesArray) {
    console.log(currentSpinningCubesArray.length);
    if(currentSpinningCubesArray.length > 0) {
        
        currentSpinningCubesArray.forEach(chosenCube => {
            if(grid[chosenCube.x][chosenCube.y].rotation.x < Math.PI / 2) {
                grid[chosenCube.x][chosenCube.y].rotation.x += 0.01;
            }
            if(grid[chosenCube.x][chosenCube.y].rotation.y < Math.PI / 2) {
                grid[chosenCube.x][chosenCube.y].rotation.y += 0.01;
            }
            
            if(grid[chosenCube.x][chosenCube.y].rotation.y >= Math.PI / 2 || grid[chosenCube.x][chosenCube.y].rotation.y >= Math.PI / 2) {
                grid[chosenCube.x][chosenCube.y].rotation.x = 0;
                grid[chosenCube.x][chosenCube.y].rotation.y = 0;
                currentSpinningCubesArray.splice(currentSpinningCubesArray.indexOf(chosenCube), 1);
            }
        });
    } else{
        for (let i = 0; i < randInt(0, 100); i++) {
            let chosenCube = {x : randInt(0, gridWidth), 
                y : randInt(0, gridHeight)};
            if(currentSpinningCubesArray.includes(chosenCube) || grid[chosenCube.x][chosenCube.y] == undefined) {
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


camera.position.z = 1000;



function animate() {
	requestAnimationFrame( animate );
    spinCubes(currentSpinningCubes);

	renderer.render( scene, camera );
}

animate();

