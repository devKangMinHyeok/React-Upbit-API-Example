import { memo, useEffect, useState } from "react";

import useFetchMarketCode from "../hooks/useFetchMarketCode";
import useUpbitWebSocket from "../hooks/useUpbitWebSocket";

const RealTimePriceTable = memo(function RealTimePriceTable({ socketData }) {
  return (
    <table>
      <thead>
        <tr>
          <th>코인</th>
          <th>현재가</th>
          <th>등락률</th>
        </tr>
      </thead>
      <tbody>
        {socketData.map((data) => (
          <tr key={data.code}>
            <td>{data.code}</td>
            <td>{data.trade_price}</td>
            <td>{(data.signed_change_rate * 100).toFixed(2)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});

function RealTimePrice() {
  // fetch all marketcode custom hook
  const [isLoading, marketCodes] = useFetchMarketCode();
  const [targetMarketCode, setTargetMarketCode] = useState([]);
  const [isTargetChanged, setIsTargetChanged] = useState(false);

  useEffect(() => {
    if (!isLoading && marketCodes) {
      setTargetMarketCode(marketCodes.slice(0, 20));
      setIsTargetChanged(true);
    }
  }, [isLoading, marketCodes]);

  // ticker socket state
  const webSocketOptions = { THROTTLE_TIME: 400 };
  const [socket, isConnected, socketData] = useUpbitWebSocket(
    targetMarketCode,
    "ticker",
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
      <div>RealTimePrice Example</div>
      <div>Connected : {isConnected ? "🟢" : "🔴"}</div>
      <button onClick={connectButtonHandler}>{"연결종료"}</button>
      <h3>Ticker</h3>
      {socketData ? (
        <RealTimePriceTable socketData={socketData} />
      ) : (
        <div>Ticker Loading...</div>
      )}
    </>
  );
}

export default memo(RealTimePrice);
