import { css } from "@emotion/react";
import { Customer } from "../../sushido/Customer";
import { SObj } from "../../sushido/factory/SObj";
import { SUnit } from "../../sushido/factory/SUnit";
import { Pos, SId } from "../../sushido/factory/type";
import { posCss } from "./util";

const customerCss = css({
  width: 50,
  height: 50,
  borderRadius: 50,
  background: "black",
  color: "white",
  textAlign: "center",
  fontSize: 15,
  cursor: "pointer",
  userSelect: "none",
});

export function CustomerVisual({ customer }: { customer: Customer }) {
  return (
    <div css={customerCss}>
      <span>お客さん</span>
    </div>
  );
}

export function CustomerView({ customer }: { customer: Customer }) {
  return (
    <div>
      <div css={posCss({ pos: customer.pos })}>
        <CustomerVisual customer={customer} />
      </div>
    </div>
  );
}
