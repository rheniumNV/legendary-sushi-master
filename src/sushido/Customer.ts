import { random } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { SUnit } from "./factory/SUnit";
import { Pos } from "./factory/type";
import { normalizedPos, processPos } from "./util";

export type CustomerState =
  | "WAITING_TABLE"
  | "GOING_TABLE"
  | "THINKING_ORDER"
  | "WAITING_ORDER"
  | "WAITING_FOOD"
  | "EATING_FOOD"
  | "GOING_HOME";

export class Customer {
  entryPos: Pos = [0, -1];
  menuCodes: string[];
  moveSpeed: number = 1;
  maxOrderCount: number = 3;

  id: string;
  visualCode: string;
  pos: Pos = this.entryPos;
  targetPos: Pos = this.entryPos;
  table: SUnit | undefined;
  state: CustomerState = "WAITING_TABLE";
  patience: number = 100;
  progress: number = 0;
  orderCount: number = 0;
  isDeleted: boolean = false;

  constructor(visualCode: string, menuCodes: string[]) {
    this.visualCode = visualCode;
    this.menuCodes = menuCodes;
    this.id = uuidv4();
    this.changeState("WAITING_TABLE");
  }

  protected changeState(newState: CustomerState) {
    this.patience = 100;
    this.progress = 0;
    this.state = newState;
    switch (this.state) {
      case "WAITING_TABLE":
        this.orderCount = 0;
        break;
      case "GOING_TABLE":
        if (this.table) {
          this.targetPos = processPos(this.table.pos, [0, 1], (a, b) => a + b);
        }
        break;
      case "WAITING_FOOD":
        if (this.table) {
          this.table.eatMenuCode =
            this.menuCodes[Math.floor(Math.random() * this.menuCodes.length)];
        }
        break;
      case "GOING_HOME":
        this.targetPos = this.entryPos;
        this.table = undefined;
        break;
    }
  }

  protected moveProcess(deltaTime: number, arrivedCallback: () => void) {
    const diff = processPos(this.targetPos, this.pos, (a, b) => a - b);
    const abs = diff[0] * diff[0] + diff[1] * diff[1];
    if (abs < this.moveSpeed * this.moveSpeed * deltaTime * deltaTime) {
      this.pos = this.targetPos;
      arrivedCallback();
      return;
    }
    const moveVec = normalizedPos(diff);
    this.pos = processPos(
      this.pos,
      moveVec,
      (a, b) => a + b * this.moveSpeed * deltaTime
    );
  }

  protected patienceProcess(deltaTime: number, value: number = 1) {
    this.patience -= value * deltaTime;
    if (this.patience < 0) {
      this.changeState("GOING_HOME");
    }
  }

  protected progressProcess(
    nextState: CustomerState,
    deltaTime: number,
    value: number = 10
  ) {
    this.progress += value * deltaTime;
    if (this.progress > 100) {
      this.changeState(nextState);
    }
  }

  update(deltaTime: number, emptyTables: SUnit[]) {
    switch (this.state) {
      case "WAITING_TABLE":
        if (emptyTables.length > 0) {
          this.table = emptyTables[0];
          this.targetPos = this.table.pos;
          this.changeState("GOING_TABLE");
          break;
        }
        this.patienceProcess(deltaTime);
        break;
      case "GOING_TABLE":
        this.moveProcess(deltaTime, () => {
          this.changeState("THINKING_ORDER");
        });
        break;
      case "THINKING_ORDER":
        this.progressProcess("WAITING_ORDER", deltaTime, 100);
        break;
      case "WAITING_ORDER":
        this.patienceProcess(deltaTime);
        this.changeState("WAITING_FOOD");
        break;
      case "WAITING_FOOD":
        this.patienceProcess(deltaTime);
        if (this.table?.eatMenuCode === this.table?.stacks[0]?.code) {
          this.changeState("EATING_FOOD");
        }
        break;
      case "EATING_FOOD":
        if (!this.table?.eatMenuCode) {
          this.orderCount += 1;
          if (this.orderCount < this.maxOrderCount) {
            if (Math.random() < 0.4) {
              this.changeState("THINKING_ORDER");
            } else {
              this.changeState("GOING_HOME");
            }
          } else {
            this.changeState("GOING_HOME");
          }
        }
        break;
      case "GOING_HOME":
        this.moveProcess(deltaTime, () => {
          this.isDeleted = true;
        });
        break;
    }
  }
}
