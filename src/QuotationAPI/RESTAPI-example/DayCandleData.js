import { memo, useEffect, useState } from "react";
import MarketCodeSelector from "../components/MarketCodeSelector";
import DateSelector from "../components/DateSelector";
import getTodayDate from "../functions/getTodayDate";
import RequestCounter from "../components/RequestCounter";
import { useFetchMarketCode } from "use-upbit-api";

const DayCandleTable = memo(function DayCandleTable({ fetchedData }) {
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
            <th> 종가(KRW) </th>
            <th> 등락금액 </th>
            <th> 등락율 </th>
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
              <td>
                {data.converted_trade_price
                  ? data.converted_trade_price
                  : data.trade_price}
              </td>
              <td>{data.change_price} </td>
              <td>{data.change_rate * 100}% </td>
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
function DayCandleData() {
  // MarketCode selector
  const { isLoading, marketCodes } = useFetchMarketCode();
  const [curMarketCode, setCurMarketCode] = useState("KRW-BTC");

  // Start Date selector
  const [startDate, setStartDate] = useState(getTodayDate());

  // counter
  const [count, setCount] = useState(1);

  // fetchedData state 세팅
  const [fetchedData, setFetchedData] = useState();

  // 조회 button
  const handleRequest = (evt) => {
    fetchDayCandle(curMarketCode, startDate, count);
  };

  // Upbit 일봉 fetch 함수
  const options = { method: "GET", headers: { Accept: "application/json" } };
  async function fetchDayCandle(marketCode, date, count) {
    try {
      console.log("fetching Day Candle Started!");
      const response = await fetch(
        `https://api.upbit.com/v1/candles/days?market=${marketCode}&to=${date}T09:00:00Z&count=${count}&convertingPriceUnit=KRW`,
        options
      );
      const result = await response.json();
      console.log("fetching Day Candle Finished!");
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
      <h3>DayCandleData Example</h3>
      <MarketCodeSelector
        curMarketCode={curMarketCode}
        setCurMarketCode={setCurMarketCode}
        isLoading={isLoading}
        marketCodes={marketCodes}
      />
      <DateSelector startDate={startDate} setStartDate={setStartDate} />
      <RequestCounter count={count} setCount={setCount} />
      {isLoading ? null : <button onClick={handleRequest}>조회</button>}
      {fetchedData ? <DayCandleTable fetchedData={fetchedData} /> : null}
    </>
  );
}

export default DayCandleData;
