import { memo, useEffect, useState } from "react";
import DateSelector from "../components/DateSelector";
import getTodayDate from "../functions/getTodayDate";
import RequestCounter from "../components/RequestCounter";
import MarketCodeSelector from "../components/MarketCodeSelector";
import { useFetchMarketCode } from "use-upbit-api";

const UnitSelector = memo(function UnitSelector({ isWeek, setIsWeek }) {
  const handleUnit = (evt) => {
    const unit = evt.target.value;
    if (unit == "weeks") setIsWeek(true);
    else if (unit == "months") setIsWeek(false);
  };

  return (
    <div>
      <label>
        Unit |
        <select
          name="unit"
          onChange={handleUnit}
          value={isWeek ? "weeks" : "months"}
        >
          <option value={"weeks"}>주봉</option>
          <option value={"months"}>월봉</option>
        </select>
      </label>
    </div>
  );
});

const WeekMonthCandleTable = memo(function WeekMonthCandleTable({
  fetchedData,
}) {
  return (
    <div>
      <div>
        <div>Market: {fetchedData[0].market}</div>
      </div>
      <table>
        <thead>
          <tr>
            <th> 시간-KST </th>
            <th> 고가 </th>
            <th> 저가 </th>
            <th> 시가 </th>
            <th> 종가 </th>
            <th> 거래량 </th>
            <th> 거래금액 </th>
          </tr>
        </thead>
        <tbody>
          {fetchedData.map((data, index) => (
            <tr key={`${data.market}_${index}`}>
              <td>{data.candle_date_time_kst} </td>
              <td>{data.high_price} </td>
              <td>{data.low_price} </td>
              <td>{data.opening_price} </td>
              <td>{data.trade_price} </td>
              <td>{data.candle_acc_trade_volume} </td>
              <td>{data.candle_acc_trade_price} </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

//REST API 통신 방식 사용
function WeekMonthCandleData() {
  //isWeek state 세팅
  const [isWeek, setIsWeek] = useState(true);

  // MarketCodeSelector state
  const { isLoading, marketCodes } = useFetchMarketCode();
  const [curMarketCode, setCurMarketCode] = useState("KRW-BTC");

  // dateSelector state
  const [startDate, setStartDate] = useState(getTodayDate());

  // MarketCode selector state
  const [fetchedData, setFetchedData] = useState();

  // counter
  const [count, setCount] = useState(1);

  // 조회 button
  const handleRequest = (evt) => {
    fetchWeekCandle(isWeek, curMarketCode, startDate, count);
  };

  // Upbit 일봉 fetch 함수
  const options = { method: "GET", headers: { Accept: "application/json" } };
  async function fetchWeekCandle(isWeek, marketCode, date, count) {
    try {
      console.log("fetching Week Candle Started!");
      const response = await fetch(
        `https://api.upbit.com/v1/candles/${
          isWeek ? "weeks" : "months"
        }?market=${marketCode}&to=${date}T09:00:00Z&count=${count}`,
        options
      );
      const result = await response.json();
      console.log("fetching Week Candle Finished!");
      setFetchedData(result);
    } catch (error) {
      console.error(error);
    }
  }

  // fetchedData state update시 콘솔에 출력
  useEffect(() => {
    if (fetchedData) console.log(fetchedData);
  }, [fetchedData]);

  return (
    <>
      <h3>WeekMonthCandleData Example</h3>
      <UnitSelector isWeek={isWeek} setIsWeek={setIsWeek} />
      <MarketCodeSelector
        curMarketCode={curMarketCode}
        setCurMarketCode={setCurMarketCode}
        isLoading={isLoading}
        marketCodes={marketCodes}
      />
      <DateSelector startDate={startDate} setStartDate={setStartDate} />
      <RequestCounter count={count} setCount={setCount} />
      {isLoading ? null : <button onClick={handleRequest}>조회</button>}
      {fetchedData ? <WeekMonthCandleTable fetchedData={fetchedData} /> : null}
    </>
  );
}

export default WeekMonthCandleData;
