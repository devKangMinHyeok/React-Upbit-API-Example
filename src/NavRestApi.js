import { memo } from "react";
import { NavLink, Outlet } from "react-router-dom";
import navStyle from "./navStyle";

function NavRestApi() {
  return (
    <>
      <nav>
        <NavLink to="marketcode" style={navStyle}>
          마켓코드 요청
        </NavLink>
        <NavLink to="minute-candle-data" style={navStyle}>
          분봉 데이터 요청
        </NavLink>
        <NavLink to="day-candle-data" style={navStyle}>
          일봉 데이터 요청
        </NavLink>
        <NavLink to="week-month-candle-data" style={navStyle}>
          주봉과 월봉 데이터 요청
        </NavLink>
        <NavLink to="trade-history-data" style={navStyle}>
          체결 내역 데이터 요청
        </NavLink>
      </nav>
      <hr />
      <Outlet />
    </>
  );
}

export default memo(NavRestApi);
