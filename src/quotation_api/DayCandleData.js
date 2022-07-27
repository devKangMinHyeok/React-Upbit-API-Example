import "./table.css";
import { useEffect, useState } from "react";
import useFetchMarketCode from "./hooks/useFetchMarketCode";
import MarketCodeSelector from "./MarketCodeSelector";

//REST API 통신 방식 사용
function DayCandleData() {
  // fetchedData state 세팅
  const [fetchedData, setFetchedData] = useState();

  // MarketCode selector
  const [isLoading, marketCodes] = useFetchMarketCode();
  const [curMarketCode, setCurMarketCode] = useState("KRW-BTC");

  // date selector
  const getTodayDate = () => {
    const todayDate = new Date();
    const year = todayDate.getFullYear();
    const month = (todayDate.getMonth() + 1).toString().padStart(2, "0");
    const date = todayDate.getDate().toString().padStart(2, "0");
    const dateStr = year + "-" + month + "-" + date;
    return dateStr;
  };
  const [startDate, setStartDate] = useState(getTodayDate());
  const handleDate = (evt) => {
    setStartDate(evt.target.value);
  };

  // counter
  const [count, setCount] = useState(1);
  const handleCount = (evt) => {
    setCount(evt.target.value);
  };

  // 조회 button
  const handleRequest = (evt) => {
    evt.preventDefault();
    fetchDayCandle(curMarketCode, startDate, count);
  };

  // form onSubmit 함수
  const onSubmit = (evt) => {
    evt.preventDefault();
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
      <form onSubmit={onSubmit}>
        <MarketCodeSelector
          curMarketCode={curMarketCode}
          setCurMarketCode={setCurMarketCode}
          isLoading={isLoading}
          marketCodes={marketCodes}
        />
        <div>
          <label>
            Start Date |
            <input
              type="date"
              name="startdate"
              value={startDate}
              max={getTodayDate()}
              onChange={handleDate}
            />
            부터 (* Upbit 일봉은 매일 오전 9시 정각에 초기화)
          </label>
        </div>
        <div>
          <label>
            Count | 최근
            <input
              type="number"
              name="count"
              min={1}
              max={200}
              step={1}
              value={count}
              onChange={handleCount}
            />
            개의 일봉 조회(1~200개)
          </label>
        </div>
      </form>
      {isLoading ? null : <button onClick={handleRequest}>조회</button>}
      {fetchedData ? (
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
      ) : null}
    </>
  );
}

export default DayCandleData;
