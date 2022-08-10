import { memo, useEffect, useRef, useState } from "react";
import { useFetchMarketCode } from "use-upbit-api";
import MarketCodeSelector from "../components/MarketCodeSelector";
import RequestCounter from "../components/RequestCounter";

const MinuteUnitSelector = memo(function MinuteUnitSelector({
  setCurrentMinuteUnit,
}) {
  const MINUTE_UNITS = useRef([1, 3, 5, 10, 15, 30, 60, 240]);
  const handleUnit = (evt) => {
    setCurrentMinuteUnit(evt.target.value);
  };

  return (
    <div>
      <label>
        분 단위 |
        <select onChange={handleUnit}>
          {MINUTE_UNITS.current.map((min) => (
            <option key={min} value={min}>
              {min}
            </option>
          ))}
        </select>
        분
      </label>
    </div>
  );
});

const MinuteCandleTable = memo(function MinuteCandleTable({ fetchedData }) {
  return (
    <div>
      <div>
        <div>Market: {fetchedData[0].market}</div>
        <div>Unit: {fetchedData[0].unit}분봉</div>
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
function MinuteCandleData() {
  // fetchedData state 세팅
  const [fetchedData, setFetchedData] = useState();

  // MarketCode selector
  const { isLoading, marketCodes } = useFetchMarketCode();
  const [curMarketCode, setCurMarketCode] = useState("KRW-BTC");

  // unit selector
  const [currentMinuteUnit, setCurrentMinuteUnit] = useState(1);

  // counter
  const [count, setCount] = useState(1);

  // 조회 button
  const handleRequest = (evt) => {
    fetchMinuteCandle(curMarketCode, currentMinuteUnit, count);
  };

  // Upbit 분봉 fetch 함수
  const options = { method: "GET", headers: { Accept: "application/json" } };
  async function fetchMinuteCandle(marketCode, unit, count) {
    try {
      console.log("fetching Minute Candle Started!");
      const response = await fetch(
        `https://api.upbit.com/v1/candles/minutes/${unit}?market=${marketCode}&count=${count}`,
        options
      );
      const result = await response.json();
      console.log("fetching Minute Candle Finished!");
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
      <h3>MiniuteCandleData Example</h3>
      <MarketCodeSelector
        curMarketCode={curMarketCode}
        setCurMarketCode={setCurMarketCode}
        isLoading={isLoading}
        marketCodes={marketCodes}
      />
      <MinuteUnitSelector setCurrentMinuteUnit={setCurrentMinuteUnit} />
      <RequestCounter count={count} setCount={setCount} />
      {isLoading ? null : <button onClick={handleRequest}>조회</button>}
      {fetchedData ? <MinuteCandleTable fetchedData={fetchedData} /> : null}
    </>
  );
}

export default MinuteCandleData;
