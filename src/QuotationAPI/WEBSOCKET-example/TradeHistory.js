import { memo, useEffect, useState } from "react";

import useFetchMarketCode from "../hooks/useFetchMarketCode";
import useUpbitWebSocket from "../hooks/useUpbitWebSocket";
import MarketCodeSelector from "../components/MarketCodeSelector";

function TradeTable({ isTargetChanged, targetMarketCode }) {
  const [socket, isConnected, socketData] = useUpbitWebSocket(
    isTargetChanged,
    targetMarketCode,
    "trade"
  );

  // 연결 컨트롤 버튼 이벤트 핸들러
  const connectButtonHandler = (evt) => {
    if (isConnected && socket) {
      socket.close();
    }
  };

  return (
    <>
      <div>Connected : {isConnected ? "🟢" : "🔴"}</div>
      <button onClick={connectButtonHandler}>{"연결종료"}</button>
      {socketData ? (
        <table>
          <thead>
            <tr>
              <th>코인</th>
              <th>체결 ID</th>
              <th>체결 시간</th>
              <th>ASK/BID</th>
              <th>체결 가격</th>
            </tr>
          </thead>
          <tbody>
            {[...socketData].reverse().map((ele, index) => (
              <tr key={index}>
                <th>{ele.code} </th>
                <th>{ele.sequential_id} </th>
                <th>
                  {ele.trade_date} {ele.trade_time}
                </th>
                <th>{ele.ask_bid} </th>
                <th>{ele.prev_closing_price} </th>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}

function TradeHistory() {
  // fetch all marketcode custom hook
  const [isLoading, marketCodes] = useFetchMarketCode();
  const [curMarketCode, setCurMarketCode] = useState("KRW-BTC");
  const [targetMarketCode, setTargetMarketCode] = useState([]);
  const [isTargetChanged, setIsTargetChanged] = useState(false);

  useEffect(() => {
    if (marketCodes) {
      const target = marketCodes.filter(
        (code) => code.market === curMarketCode
      );
      setTargetMarketCode(target);
      setIsTargetChanged((prev) => !prev);
    }
  }, [curMarketCode, marketCodes]);

  return (
    <>
      <div>Trade History Example</div>
      <h3>Trade History</h3>
      <MarketCodeSelector
        curMarketCode={curMarketCode}
        setCurMarketCode={setCurMarketCode}
        isLoading={isLoading}
        marketCodes={marketCodes}
      />
      <TradeTable
        isTargetChanged={isTargetChanged}
        targetMarketCode={targetMarketCode}
      />
    </>
  );
}

export default memo(TradeHistory);
