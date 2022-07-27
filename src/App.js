import MarketCode from "./quotation_api/MarketCode";
import MinuteCandleData from "./quotation_api/MinuteCandleData";
import DayCandleData from "./quotation_api/DayCandleData";
import WeekMonthCandleData from "./quotation_api/WeekMonthCandleData";
import OrderBook from "./quotation_api/OrderBook";
import RealTimePrice from "./quotation_api/RealTimePrice";
import TradeHistory from "./quotation_api/TradeHistory";

function App() {
  return (
    <>
      <h1>React Example for Upbit</h1>
      <OrderBook />
      <RealTimePrice />
      <TradeHistory />
    </>
  );
}

export default App;
