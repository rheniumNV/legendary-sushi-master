import { css } from "@emotion/react";
import { SObj } from "../sushido/SObj";
import { SUnit } from "../sushido/SUnit";
import { Pos, SId } from "../sushido/type";
import { posCss } from "./util";

const objCss = css({
  width: 50,
  height: 50,
  borderRadius: 50,
  background: "orange",
  color: "white",
  textAlign: "center",
  fontSize: 15,
  cursor: "pointer",
  userSelect: "none",
});

export function ObjVisual({
  sObj,
  grabFunc,
}: {
  sObj: SObj;
  grabFunc?: (objId: string) => void;
}) {
  return (
    <div
      css={objCss}
      onClick={() => {
        if (grabFunc) {
          grabFunc(sObj.id);
        }
      }}
    >
      <span>{sObj.code}</span>
    </div>
  );
}

export function SObjView({
  sUnit,
  getObj,
  grabFunc,
}: {
  sUnit: SUnit;
  getObj: (id: SId) => SObj | undefined;
  grabFunc: (objId: string) => void;
}) {
  return (
    <div>
      {sUnit.stacks.map((stackObj) => (
        <div css={posCss({ pos: stackObj._pos ?? [0, 0] })}>
          <ObjVisual sObj={stackObj} grabFunc={grabFunc} />
        </div>
      ))}
      {sUnit.inputs.map(({ sObj }) => (
        <div css={posCss({ pos: sObj._pos ?? [0, 0] })}>
          <ObjVisual sObj={sObj} grabFunc={grabFunc} />
        </div>
      ))}
    </div>
  );
}
