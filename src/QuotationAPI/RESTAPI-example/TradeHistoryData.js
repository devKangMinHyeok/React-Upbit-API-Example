import { memo, useEffect, useState } from "react";
import { useFetchMarketCode } from "use-upbit-api";
import MarketCodeSelector from "../components/MarketCodeSelector";
import RequestCounter from "../components/RequestCounter";

const timestampToTime = (timestamp) => {
  const time = new Date(timestamp);
  const timeStr = time.toLocaleTimeString();
  return timeStr;
};

const TradeHistoryTable = memo(function TradeHistoryTable({ fetchedData }) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th> 매수/매도 </th>
            <th> 체결 일자 </th>
            <th> 체결 가격 </th>
            <th> 체결량 </th>
            <th> 체결 금액 </th>
          </tr>
        </thead>
        <tbody>
          {fetchedData.map((data, index) => (
            <tr key={`${data.market}_${index}`}>
              <td>{data.ask_bid === "BID" ? "매수" : "매도"} </td>
              <td>{timestampToTime(data.timestamp)} </td>
              <td>{data.trade_price} </td>
              <td>{data.trade_volume} </td>
              <td>{data.trade_price * data.trade_volume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

//REST API 통신 방식 사용
function TradeHistoryData() {
  // MarketCode selector
  const { isLoading, marketCodes } = useFetchMarketCode();
  const [curMarketCode, setCurMarketCode] = useState("KRW-BTC");

  // counter
  const [count, setCount] = useState(1);

  // fetchedData state 세팅
  const [fetchedData, setFetchedData] = useState();

  // 조회 button
  const handleRequest = (evt) => {
    fetchTradeHistory(curMarketCode, count);
  };

  // Upbit 체결 내역 fetch 함수
  const options = { method: "GET", headers: { Accept: "application/json" } };
  async function fetchTradeHistory(marketCode, count) {
    try {
      console.log("fetching Trade History Started!");
      const response = await fetch(
        `https://api.upbit.com/v1/trades/ticks?market=${marketCode}&count=${count}`,
        options
      );
      const result = await response.json();
      console.log("fetching Trade History Finished!");
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
      <h3>TradeHistoryData Example</h3>
      <MarketCodeSelector
        curMarketCode={curMarketCode}
        setCurMarketCode={setCurMarketCode}
        isLoading={isLoading}
        marketCodes={marketCodes}
      />
      <RequestCounter count={count} setCount={setCount} />
      {isLoading ? null : <button onClick={handleRequest}>조회</button>}
      <h4>금일 체결 내역</h4>
      {fetchedData ? <TradeHistoryTable fetchedData={fetchedData} /> : null}
    </>
  );
}

export default TradeHistoryData;
