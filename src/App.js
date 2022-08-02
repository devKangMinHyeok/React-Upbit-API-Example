import "./table.css";
import { NavLink, Outlet } from "react-router-dom";
import navStyle from "./navStyle";
function App() {
  return (
    <>
      <h1>React Example for Upbit API</h1>
      <nav>
        <NavLink to="rest-api" style={navStyle}>
          REST API Example
        </NavLink>
        <NavLink to="websocket-api" style={navStyle}>
          WEBSOCKET API Example
        </NavLink>
        <NavLink to="total-example" style={navStyle}>
          TOTAL Example
        </NavLink>
      </nav>
      <hr />
      <Outlet />
    </>
  );
}

export default App;
