import { v4 as uuidv4 } from "uuid";
import { SUnit } from "./factory/SUnit";
import { Pos } from "./factory/type";
import { distancePos, normalizedPos, processPos } from "./util";

export type CustomerModel = {
  visualCode: string;
  maxOrderCount: number;
  nextOrderRatio: number;
  paymentScale: number;
  patienceScale: number;
  eatScale: number;
  thinkingOrderScale: number;
  pickWeight: number;
  moveSpeed: number;
};

export type CustomerState =
  | "WAITING_TABLE"
  | "GOING_TABLE"
  | "THINKING_ORDER"
  | "WAITING_ORDER"
  | "WAITING_FOOD"
  | "EATING_FOOD"
  | "GOING_HOME";

export class Customer {
  entryPos: Pos = [0, -4];
  xMax: number;
  menuCodes: string[];

  id: string;
  pos: Pos = this.entryPos;
  targetPos: Pos = this.entryPos;
  table: SUnit | undefined;
  state: CustomerState = "WAITING_TABLE";
  patience: number = 100;
  progress: number = 0;
  orderCount: number = 0;
  currentOrder: string | undefined;
  isDeleted: boolean = false;

  customerModel: CustomerModel;

  _moveVec: Pos = [0, 0];
  _maxMoveTime: number = 0;

  constructor(
    customerModel: CustomerModel,
    menuCodes: string[],
    waitingTableIndex: number,
    xMax: number
  ) {
    this.customerModel = customerModel;
    this.menuCodes = menuCodes;
    this.id = uuidv4();
    this.changeState("WAITING_TABLE");
    this.pos = this.entryPos;
    this.targetPos = this.resolveWaitingTablePos(waitingTableIndex);
    this.xMax = xMax;
  }

  protected resolveWaitingTablePos(waitingTableIndex: number): Pos {
    return [this.xMax - waitingTableIndex * 1 - 1, -4];
  }

  protected changeState(newState: CustomerState) {
    this.progress = 0;
    const prevState = this.state;
    this.state = newState;
    switch (this.state) {
      case "WAITING_TABLE":
        this.orderCount = 0;
        break;
      case "GOING_TABLE":
        if (this.table) {
          this.targetPos = processPos(this.table.pos, [0, -1], (a, b) => a + b);
        }
        break;
      case "THINKING_ORDER":
        this.patience = 100;
        break;
      case "WAITING_FOOD":
        if (this.table) {
          this.table.eatMenuCode = this.currentOrder;
        }
        break;
      case "GOING_HOME":
        this.patience = 100;
        this.targetPos = this.entryPos;
        if (this.table) {
          this.table.eatMenuCode = undefined;
          this.table = undefined;
        }
        break;
    }
  }

  protected moveProcess(deltaTime: number, arrivedCallback: () => void) {
    const diff = processPos(this.targetPos, this.pos, (a, b) => a - b);
    const abs = distancePos(diff);

    const realSpeed = this.customerModel.moveSpeed * deltaTime;

    if (abs < realSpeed * realSpeed) {
      this.pos = this.targetPos;
      arrivedCallback();
      return;
    }
    const moveVec = normalizedPos(diff);
    this.pos = processPos(this.pos, moveVec, (a, b) => a + b * realSpeed);
    this._moveVec = processPos(moveVec, [0, 0], (a, b) => a / 2);
    this._maxMoveTime = realSpeed > 0 ? abs / realSpeed / 2 : 0;
  }

  protected patienceProcess(deltaTime: number, value: number = 1) {
    this.patience -= value * deltaTime * this.customerModel.patienceScale;
    if (this.patience < 0) {
      this.changeState("GOING_HOME");
    }
  }

  protected progressProcess(
    deltaTime: number,
    callback: () => void,
    value: number = 10
  ) {
    this.progress += value * deltaTime;
    if (this.progress > 100) {
      callback();
    }
  }

  update(deltaTime: number, emptyTables: SUnit[], waitingTableIndex: number) {
    this._moveVec = [0, 0];
    this._maxMoveTime = 0;
    switch (this.state) {
      case "WAITING_TABLE":
        if (emptyTables.length > 0) {
          this.table = emptyTables[0];
          this.targetPos = this.table.pos;
          this.changeState("GOING_TABLE");
          break;
        }
        this.targetPos = this.resolveWaitingTablePos(waitingTableIndex);
        this.moveProcess(deltaTime, () => {});
        this.patienceProcess(deltaTime);
        break;
      case "GOING_TABLE":
        this.moveProcess(deltaTime, () => {
          this.changeState("THINKING_ORDER");
        });
        break;
      case "THINKING_ORDER":
        this.progressProcess(
          deltaTime,
          () => {
            this.changeState("WAITING_ORDER");
          },
          100 * this.customerModel.thinkingOrderScale
        );
        break;
      case "WAITING_ORDER": //いったんなしで
        this.currentOrder =
          this.menuCodes[Math.floor(Math.random() * this.menuCodes.length)];
        this.changeState("WAITING_FOOD");
        break;
      case "WAITING_FOOD":
        this.patienceProcess(deltaTime);
        if (this.table?.eatMenuCode === this.table?.stacks[0]?.code) {
          this.changeState("EATING_FOOD");
        }
        break;
      case "EATING_FOOD":
        if (
          this.table?.eatMenuCode &&
          this.table.eatMenuCode !== this.table.stacks[0]?.code
        ) {
          this.changeState("WAITING_FOOD");
        }
        if (!this.table?.eatMenuCode) {
          this.orderCount += 1;
          if (this.orderCount < this.customerModel.maxOrderCount) {
            if (Math.random() < this.customerModel.nextOrderRatio) {
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
