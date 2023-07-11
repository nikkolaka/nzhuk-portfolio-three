import { randFloat, randInt } from "three/src/math/MathUtils";
import { Clock } from "three/src/core/Clock";

class Snake {
  constructor(gridWidth, gridHeight) {
    this.gridHeight = gridHeight;
    this.gridWidth = gridWidth;
    this.prevDirection;
    this.location = [randInt(0, gridWidth), randInt(0, gridHeight)];
    this.newDirection = "right";
    this.clock = new Clock();
    this.alive = true;
    this.color = {r : randFloat(0.1,0.2), g : randFloat(0.1,0.2), b : randFloat(0.1,0.2)};
  }
  move() {
    let newLocation = this.location;

    let x_axis = 0;
    let y_axis = 1;

    switch (this.newDirection) {
      case "up":
        newLocation[y_axis] += 1;
        break;
      case "down":
        newLocation[y_axis] -= 1;
        break;
      case "left":
        newLocation[x_axis] -= 1;
        break;
      case "right":
        newLocation[x_axis] += 1;
        break;
      case "up-right":
        newLocation[y_axis] += 1;
        newLocation[x_axis] += 1;
        break;
      case "up-left":
        newLocation[y_axis] += 1;
        newLocation[x_axis] -= 1;
        break;
      case "down-right":
        newLocation[y_axis] -= 1;
        newLocation[x_axis] += 1;

        break;
      case "down-left":
        newLocation[y_axis] -= 1;
        newLocation[x_axis] -= 1;

        break;
    }
    if (newLocation[x_axis] < 0) newLocation[x_axis] = this.gridWidth - 1;
    if (newLocation[x_axis] >= this.gridWidth) newLocation[x_axis] = 0;
    if (newLocation[y_axis] < 0) newLocation[y_axis] = this.gridHeight - 1;
    if (newLocation[y_axis] >= this.gridHeight) newLocation[y_axis] = 0;

    this.location = newLocation;
    this.changeDirection();
    this.checkIfAlive();
  }

  checkIfAlive() {
    if(randInt(0, 100) < 2) {
      this.alive = false;
    }
  }

  changeDirection() {
    let chanceToChange = randInt(0, 100);
    this.prevDirection = this.newDirection;
    if (chanceToChange > 20) {
      this.newDirection = this.prevDirection;
    } else if (chanceToChange > 10) {
      switch (this.prevDirection) {
        case "up":
          this.newDirection = "up-right";
          break;
        case "up-right":
          this.newDirection = "right";
          break;
        case "right":
          this.newDirection = "down-right";
          break;
        case "down-right":
          this.newDirection = "down";
          break;
        case "down":
          this.newDirection = "down-left";
          break;
        case "down-left":
          this.newDirection = "left";
          break;
        case "left":
          this.newDirection = "up-left";
          break;
        case "up-left":
          this.newDirection = "up";
          break;
      }
    } else {
      switch (this.prevDirection) {
        case "up":
          this.newDirection = "up-left";
          break;
        case "up-right":
          this.newDirection = "up";
          break;
        case "right":
          this.newDirection = "up-right";
          break;
        case "down-right":
          this.newDirection = "right";
          break;
        case "down":
          this.newDirection = "down-right";
          break;
        case "down-left":
          this.newDirection = "down";
          break;
        case "left":
          this.newDirection = "down-left";
          break;
        case "up-left":
          this.newDirection = "left";
          break;
      }
    }
  }
}
export { Snake };
