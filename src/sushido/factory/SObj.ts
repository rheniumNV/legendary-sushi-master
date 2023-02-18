import { v4 as uuidv4 } from "uuid";
import { SUnit } from "./SUnit";
import { SUser } from "./SUser";
import { SObjCode, SId, ProcessCode, Pos } from "./type";

export class SObj {
  id: SId;
  code: SObjCode;
  processCode: ProcessCode | undefined;
  _parentUnit: SUnit | undefined;
  _pos: Pos | undefined;
  _speed: Pos | undefined;
  _maxMoveTime: number = 0;
  _grabUser: SUser | undefined;

  protected tasks: any[] = [];

  constructor(code: SObjCode) {
    this.id = uuidv4();
    this.code = code;
  }
}
