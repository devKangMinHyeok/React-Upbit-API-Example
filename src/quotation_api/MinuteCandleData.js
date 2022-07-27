import "./table.css";
import { useEffect, useState } from "react";

//REST API 통신 방식 사용
function MinuteCandleData() {
  // isLoading, fetchedData state 세팅
  const [isLoading, setIsLoading] = useState(true); // marketcode 데이터 fetch 완료 전까지 조회 버튼 렌더링 방지
  const [fetchedData, setFetchedData] = useState();

  // MarketCode selector
  const [marketCodes, setMarketCodes] = useState();
  const [curMarketCode, setCurMarketCode] = useState("KRW-BTC");
  const handleMarket = (evt) => {
    setCurMarketCode(evt.target.value);
  };

  // unit selector
  const MINUTE_UNITS = [1, 3, 5, 10, 15, 30, 60, 240];
  const [currentUnit, setCurrentUnit] = useState(1);
  const handleUnit = (evt) => {
    setCurrentUnit(evt.target.value);
  };

  // counter
  const [count, setCount] = useState(1);
  const handleCount = (evt) => {
    setCount(evt.target.value);
  };

  // 조회 button
  const handleRequest = (evt) => {
    evt.preventDefault();
    fetchMinuteCandle(curMarketCode, currentUnit, count);
  };

  // form onSubmit 함수
  const onSubmit = (evt) => {
    evt.preventDefault();
  };

  // marketcodes fetch 함수
  const options = { method: "GET", headers: { Accept: "application/json" } };

  async function fetchMarketCodes() {
    const response = await fetch(
      "https://api.upbit.com/v1/market/all?isDetails=false",
      options
    );
    const result = await response.json();
    setMarketCodes(result);
    setIsLoading(false);
  }

  // Upbit 분봉 fetch 함수
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

  // 첫 렌더링 시 marketcode 데이터 fetch
  useEffect(() => {
    fetchMarketCodes();
  }, []);

  // fetchedData state update시 콘솔에 출력
  useEffect(() => {
    if (fetchedData) console.log(fetchedData);
  }, [fetchedData]);

  return (
    <>
      <h3>MiniuteCandleData Example</h3>
      <form onSubmit={onSubmit}>
        <div>
          <label>
            Market Code |
            <select
              name="marketcode"
              onChange={handleMarket}
              value={curMarketCode}
            >
              {marketCodes
                ? marketCodes.map((code) => (
                    <option
                      key={`${code.market}_${code.english_name}`}
                      value={code.market}
                    >
                      {code.market}
                    </option>
                  ))
                : null}
            </select>
          </label>
        </div>
        <div>
          <label>
            분 단위 |
            <select onChange={handleUnit}>
              {MINUTE_UNITS.map((min) => (
                <option key={min} value={min}>
                  {min}
                </option>
              ))}
            </select>
            분
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
            개의 {currentUnit}분봉 조회(1~200개)
          </label>
        </div>
      </form>
      {isLoading ? null : <button onClick={handleRequest}>조회</button>}
      {fetchedData ? (
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
      ) : null}
    </>
  );
}

export default MinuteCandleData;
