import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { SUser } from "../sushido/factory/SUser";
import { ObjVisual } from "./SObjView";
import { directPosCss } from "./util";

export function SUserView({ user }: { user: SUser }) {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);

  useEffect(() => {
    document.onmousemove = (ev) => {
      setMouseX(ev.x);
      setMouseY(ev.y);
    };
  }, []);

  return (
    <div>
      {user.grabObjects.map((obj) => (
        <div
          css={[
            directPosCss({ x: mouseX - 25, y: mouseY - 25 }),
            css({ pointerEvents: "none" }),
          ]}
        >
          <ObjVisual key={obj.id} sObj={obj} />
        </div>
      ))}
    </div>
  );
}
