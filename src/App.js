import DayCandleData from "./quotation_api/DayCandleData";
import MinuteCandleData from "./quotation_api/MinuteCandleData";
import WeekMonthCandleData from "./quotation_api/WeekMonthCandleData";

function App() {
  return (
    <>
      <h1>React Example for Upbit</h1>
      <WeekMonthCandleData />
    </>
  );
}

export default App;
