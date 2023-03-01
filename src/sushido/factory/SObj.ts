import { v4 as uuidv4 } from "uuid";
import { SUnit } from "./SUnit";
import { SUser } from "./SUser";
import { SObjCode, SId, ProcessCode, Pos } from "./type";

export class SObj {
  id: SId;
  code: SObjCode;
  _parentUnit: SUnit | undefined;
  _pos: Pos | undefined;
  _moveStartTime: number = 0;
  _speed: Pos | undefined;
  _maxMoveTime: number = 0;
  _grabUser: SUser | undefined;

  constructor(code: SObjCode) {
    this.id = uuidv4();
    this.code = code;
  }
}
