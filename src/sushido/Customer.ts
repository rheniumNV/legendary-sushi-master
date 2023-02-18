import { v4 as uuidv4 } from "uuid";
import { SUnit } from "./factory/SUnit";
import { Pos } from "./factory/type";


export type CustomerStatus = "moving";

export class Customer {
  id: string;
  visualCode: string;
  pos: Pos = [0, 0];
  target: SUnit | undefined;
  currentMenuCode: string | undefined;
  state: CustomerStatus = "moving";

  constructor(visualCode: string) {
    this.visualCode = visualCode;
    this.id = uuidv4();
  }

  update(deltaTime: number) {}
}
