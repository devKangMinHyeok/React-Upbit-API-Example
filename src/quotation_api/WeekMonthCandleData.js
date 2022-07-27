import "./table.css";
import { useEffect, useState } from "react";

//REST API 통신 방식 사용
function WeekMonthCandleData() {
  //isWeek state 세팅
  const [isWeek, setIsWeek] = useState(true);
  const handleUnit = (evt) => {
    const unit = evt.target.value;
    if (unit == "weeks") setIsWeek(true);
    else if (unit == "months") setIsWeek(false);
  };
  // isLoading, fetchedData state 세팅
  const [isLoading, setIsLoading] = useState(true); // marketcode 데이터 fetch 완료 전까지 조회 버튼 렌더링 방지
  const [fetchedData, setFetchedData] = useState();

  // MarketCode selector
  const [marketCodes, setMarketCodes] = useState();
  const [curMarketCode, setCurMarketCode] = useState("KRW-BTC");
  const handleMarket = (evt) => {
    setCurMarketCode(evt.target.value);
  };

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
    fetchWeekCandle(isWeek, curMarketCode, startDate, count);
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

  // Upbit 일봉 fetch 함수
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
      <h3>WeekMonthCandleData Example</h3>
      <form onSubmit={onSubmit}>
        <div>
          <lable>
            Unit |
            <select
              name="unit"
              onChange={handleUnit}
              value={isWeek ? "weeks" : "months"}
            >
              <option value={"weeks"}>주봉</option>
              <option value={"months"}>월봉</option>
            </select>
          </lable>
        </div>
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
            Start Date |
            <input
              type="date"
              name="startdate"
              value={startDate}
              max={getTodayDate()}
              onChange={handleDate}
            />
            부터 (* Upbit |주봉-매주 월요일 / 월봉-매월 1일| 오전 9시에 초기화)
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
            개의 주/월봉 조회(1~200개)
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

export default WeekMonthCandleData;
