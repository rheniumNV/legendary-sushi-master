import { css } from "@emotion/react";
import { useEffect } from "react";
import { SUnit } from "../../sushido/factory/SUnit";
import { Direction } from "../../sushido/factory/type";

const unitCss = ({
  pos,
  direction,
}: {
  pos: [number, number];
  direction: Direction;
}) =>
  css({
    position: "absolute",
    width: 99,
    height: 99,
    background: "blue",
    color: "white",
    textAlign: "center",
    left: pos[0] * 100,
    top: pos[1] * 100,
    fontSize: 20,
    display: "flex",
    alignContent: "center",
    ">div": {
      transform: `rotate(${[0, 90, 180, 270][direction]}deg)`,
    },
    cursor: "pointer",
    userSelect: "none",
  });

const progressBarCss = (value: number) =>
  css({
    width: 100,
    height: 10,
    background: "gray",
    position: "absolute",
    zIndex: 100,
    ">div": {
      background: "green",
      width: value,
      height: 10,
    },
  });

export function SUnitView({
  sUnit,
  releaseFunc,
  startInteract,
  endInteract,
}: {
  sUnit: SUnit;
  releaseFunc: (id: string) => void;
  startInteract: () => void;
  endInteract: () => void;
}) {
  const progress = sUnit.stackProgress;

  useEffect(() => {}, []);

  return (
    <div
      css={unitCss({
        pos: sUnit.pos,
        direction: sUnit.direction,
      })}
      onClick={() => {
        releaseFunc(sUnit.id);
      }}
      onMouseOver={() => {
        startInteract();
      }}
      onMouseOut={() => {
        endInteract();
      }}
    >
      <div>
        <span>{sUnit.options.code}</span>
        <span>{sUnit.eatMenuCode}</span>
      </div>
      {(progress ?? 0) > 0 && (
        <div css={progressBarCss(progress ?? 0)}>
          <div />
        </div>
      )}
    </div>
  );
}
