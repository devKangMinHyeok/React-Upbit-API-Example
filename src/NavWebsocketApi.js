import { memo } from "react";
import { NavLink, Outlet } from "react-router-dom";
import navStyle from "./navStyle";

function NavWebsocktApi() {
  return (
    <>
      <nav>
        <NavLink to="order-book" style={navStyle}>
          실시간 오더북
        </NavLink>
        <NavLink to="real-time-price" style={navStyle}>
          실시간 가격
        </NavLink>
        <NavLink to="trade-history" style={navStyle}>
          실시간 체결 내역
        </NavLink>
      </nav>
      <hr />
      <Outlet />
    </>
  );
}

export default memo(NavWebsocktApi);
