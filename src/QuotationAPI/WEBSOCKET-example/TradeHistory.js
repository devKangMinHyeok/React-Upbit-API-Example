import { memo, useEffect, useState } from "react";
import { useFetchMarketCode, useUpbitWebSocket } from "use-upbit-api";
import MarketCodeSelector from "../components/MarketCodeSelector";

const TradeTable = memo(function TradeTable({ targetMarketCode }) {
  const webSocketOptions = { throttle_time: 400, max_length_queue: 100 };
  const { socket, isConnected, socketData } = useUpbitWebSocket(
    targetMarketCode,
    "trade",
    webSocketOptions
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
});

function TradeHistory() {
  // fetch all marketcode custom hook
  const { isLoading, marketCodes } = useFetchMarketCode();
  const [curMarketCode, setCurMarketCode] = useState("KRW-BTC");
  const [targetMarketCode, setTargetMarketCode] = useState([]);

  useEffect(() => {
    if (marketCodes) {
      const target = marketCodes.filter(
        (code) => code.market === curMarketCode
      );
      setTargetMarketCode(target);
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
      <TradeTable targetMarketCode={targetMarketCode} />
    </>
  );
}

export default memo(TradeHistory);
