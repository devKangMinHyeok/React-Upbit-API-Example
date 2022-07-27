import { memo, useEffect, useState } from "react";

import useFetchMarketCode from "./hooks/useFetchMarketCode";
import useUpbitWebSocket from "./hooks/useUpbitWebSocket";

function MarketCodeSelector({
  curMarketCode,
  setCurMarketCode,
  isLoading,
  marketCodes,
}) {
  const handleMarket = (evt) => {
    setCurMarketCode(evt.target.value);
  };

  return (
    <>
      {!isLoading ? (
        <div>
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
        </div>
      ) : (
        "Market Code Loading..."
      )}
    </>
  );
}

function OrderTable({ isTargetChanged, targetMarketCode }) {
  const [socket, isConnected, socketData] = useUpbitWebSocket(
    isTargetChanged,
    targetMarketCode,
    "orderbook"
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
        <div>
          <div>코인 : {socketData.code}</div>
          <div>총 매도 물량 : {socketData.total_ask_size}</div>
          <div>총 매수 물량 : {socketData.total_bid_size}</div>
          <table>
            <thead>
              <tr>
                <th>매도 물량</th>
                <th>가격</th>
                <th>매수 물량</th>
              </tr>
            </thead>
            <tbody>
              {[...socketData.orderbook_units].reverse().map((ele, index) => (
                <tr key={`ask_${index}`}>
                  <th>{ele.ask_size}</th>
                  <th>{ele.ask_price}</th>
                  <th>-</th>
                </tr>
              ))}
              {[...socketData.orderbook_units].map((ele, index) => (
                <tr key={`bid_${index}`}>
                  <th>-</th>
                  <th>{ele.bid_price}</th>
                  <th>{ele.bid_size}</th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>Orderbook Loading...</div>
      )}
    </>
  );
}

function OrderBook() {
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
      <div>OrderBook Example</div>
      <h3>Orderbook</h3>
      <MarketCodeSelector
        curMarketCode={curMarketCode}
        setCurMarketCode={setCurMarketCode}
        isLoading={isLoading}
        marketCodes={marketCodes}
      />
      <OrderTable
        isTargetChanged={isTargetChanged}
        targetMarketCode={targetMarketCode}
      />
    </>
  );
}

export default memo(OrderBook);
