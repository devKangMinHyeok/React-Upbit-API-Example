import DayCandleData from "./quotation_api/DayCandleData";
import MarketCode from "./quotation_api/MarketCode";
import MinuteCandleData from "./quotation_api/MinuteCandleData";
import OrderBook from "./quotation_api/OrderBook";
import RealTimePrice from "./quotation_api/RealTimePrice";
import TradeHistory from "./quotation_api/TradeHistory";
import WeekMonthCandleData from "./quotation_api/WeekMonthCandleData";

function App() {
  return (
    <>
      <h1>React Example for Upbit</h1>
      <RealTimePrice />
      <OrderBook />
      <TradeHistory />
    </>
  );
}

export default App;
