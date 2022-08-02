import App from "./App";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavRestApi from "./NavRestApi";
import MarketCode from "./QuotationAPI/RESTAPI-example/MarketCode";
import DayCandleData from "./QuotationAPI/RESTAPI-example/DayCandleData";
import MinuteCandleData from "./QuotationAPI/RESTAPI-example/MinuteCandleData";
import WeekMonthCandleData from "./QuotationAPI/RESTAPI-example/WeekMonthCandleData";
import OrderBook from "./QuotationAPI/WEBSOCKET-example/OrderBook";
import RealTimePrice from "./QuotationAPI/WEBSOCKET-example/RealTimePrice";
import TradeHistory from "./QuotationAPI/WEBSOCKET-example/TradeHistory";
import NavWebsocktApi from "./NavWebsocketApi";
import TotalExample from "./QuotationAPI/TOTAL-example/TotalExample";
import { RecoilRoot } from "recoil";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="rest-api" element={<NavRestApi />}>
            <Route path="marketcode" element={<MarketCode />} />
            <Route path="day-candle-data" element={<DayCandleData />} />
            <Route path="minute-candle-data" element={<MinuteCandleData />} />
            <Route
              path="week-month-candle-data"
              element={<WeekMonthCandleData />}
            />
          </Route>
          <Route path="websocket-api" element={<NavWebsocktApi />}>
            <Route path="order-book" element={<OrderBook />} />
            <Route path="real-time-price" element={<RealTimePrice />} />
            <Route path="trade-history" element={<TradeHistory />} />
          </Route>
          <Route
            path="total-example"
            element={
              <RecoilRoot>
                <TotalExample />
              </RecoilRoot>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
