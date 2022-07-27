import "./table.css";
import OrderBook from "./QuotationAPI/WEBSOCKET-example/OrderBook";
import RealTimePrice from "./QuotationAPI/WEBSOCKET-example/RealTimePrice";
import TradeHistory from "./QuotationAPI/WEBSOCKET-example/TradeHistory";
import DayCandleData from "./QuotationAPI/RESTAPI-example/DayCandleData";
import MarketCode from "./QuotationAPI/RESTAPI-example/MarketCode";
import MinuteCandleData from "./QuotationAPI/RESTAPI-example/MinuteCandleData";
import WeekMonthCandleData from "./QuotationAPI/RESTAPI-example/WeekMonthCandleData";
function App() {
  return (
    <>
      <h1>React Example for Upbit</h1>
      <DayCandleData />
      <MarketCode />
      <MinuteCandleData />
      <WeekMonthCandleData />
      <OrderBook />
      <RealTimePrice />
      <TradeHistory />
    </>
  );
}

export default App;
