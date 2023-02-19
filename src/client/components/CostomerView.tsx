import { css } from "@emotion/react";
import { Customer } from "../../sushido/Customer";
import { posCss } from "./util";

const customerCss = css({
  width: 50,
  height: 50,
  borderRadius: 50,
  background: "black",
  color: "red",
  textAlign: "center",
  fontSize: 15,
  cursor: "pointer",
  userSelect: "none",
});

export function CustomerVisual({ customer }: { customer: Customer }) {
  return (
    <div css={customerCss}>
      <div>
        <span>{customer.state}</span>
        <span>{Math.floor(customer.progress)}</span>
        <span>{Math.floor(customer.patience)}</span>
      </div>
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
