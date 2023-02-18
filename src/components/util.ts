import { css } from "@emotion/react";
import { Pos } from "../sushido/factory/type";

export const posCss = ({ pos }: { pos: Pos }) =>
  css({
    position: "absolute",
    left: pos[0] * 100 + 25,
    top: pos[1] * 100 + 25,
  });

export const directPosCss = ({ x, y }: { x: number; y: number }) =>
  css({
    position: "fixed",
    left: x,
    top: y,
  });
