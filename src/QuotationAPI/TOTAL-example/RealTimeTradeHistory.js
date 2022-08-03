import { memo } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import useUpbitWebSocket from "../hooks/useUpbitWebSocket";
import { selectedCoinState } from "./atom";

const TradeHistoryContainer = styled.div`
  grid-column: 1 / span 2;
  background-color: white;
  font-size: 11px;
  overflow: overlay;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  padding: 5px;
`;
const TradeTableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  padding-bottom: 2px;
  border-bottom: lightgrey 1px solid;
  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
const TradeTableHeaderChild = styled.div``;
const TradeRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  border-bottom: whitesmoke 1px solid;
  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const TradeLogBox = styled.div`
  margin: 2px;
`;

const TradePriceBox = styled(TradeLogBox)``;
const TradeTimeBox = styled(TradeLogBox)``;
const TradeSizeBox = styled(TradeLogBox)`
  color: ${(props) => (props.tradeType === "ASK" ? "#EF1C1C" : "#1261C4")};
`;

const timestampToTime = (timestamp) => {
  const time = new Date(timestamp);
  const timeStr = time.toLocaleTimeString();
  return timeStr;
};

function RealTimeTradeHistory() {
  const selectedCoin = useRecoilValue(selectedCoinState);
  const webSocketOptions = { THROTTLE_TIME: 400, MAX_LENGTH_QUEUE: 100 };
  const [socket, isConnected, socketData] = useUpbitWebSocket(
    selectedCoin,
    "trade",
    webSocketOptions
  );

  return (
    <TradeHistoryContainer>
      <TradeTableHeader>
        <TradeTableHeaderChild>체결시간</TradeTableHeaderChild>
        <TradeTableHeaderChild>체결가격</TradeTableHeaderChild>
        <TradeTableHeaderChild>체결량</TradeTableHeaderChild>
        <TradeTableHeaderChild>체결금액</TradeTableHeaderChild>
      </TradeTableHeader>
      {socketData
        ? [...socketData].reverse().map((data, index) => (
            <TradeRow key={index}>
              <TradeTimeBox>
                {timestampToTime(data.trade_timestamp)}
              </TradeTimeBox>
              <TradePriceBox>
                {data.trade_price
                  ? data.trade_price.toLocaleString("ko-KR")
                  : null}
                원
              </TradePriceBox>
              <TradeSizeBox tradeType={data.ask_bid}>
                {data.trade_volume}
              </TradeSizeBox>
              <TradeSizeBox tradeType={data.ask_bid}>
                {Math.ceil(data.trade_price * data.trade_volume).toLocaleString(
                  "ko-KR"
                )}
                원
              </TradeSizeBox>
            </TradeRow>
          ))
        : "Loading..."}
    </TradeHistoryContainer>
  );
}

export default memo(RealTimeTradeHistory);
