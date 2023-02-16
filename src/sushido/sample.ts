import _ from "lodash";
import { GameManager } from "./GameManager";

const gm = new GameManager();

_.range(40).forEach(() => {
  gm.update();
});
