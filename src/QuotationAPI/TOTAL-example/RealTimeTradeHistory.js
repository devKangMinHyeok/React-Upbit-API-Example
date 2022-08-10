import { cloneDeep } from "lodash";
import { memo, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { useUpbitWebSocket } from "use-upbit-api";
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
  const webSocketOptions = { throttle_time: 400, max_length_queue: 100 };
  const { socket, isConnected, socketData } = useUpbitWebSocket(
    selectedCoin,
    "trade",
    webSocketOptions
  );
  const [fetchedData, setFetchedData] = useState();
  const preFetchedCount = useRef(30);
  const removedLength = useRef(0);

  // Upbit 체결 내역 fetch 함수
  const options = { method: "GET", headers: { Accept: "application/json" } };
  async function fetchTradeHistory(marketCode, count) {
    try {
      const response = await fetch(
        `https://api.upbit.com/v1/trades/ticks?market=${marketCode}&count=${count}`,
        options
      );
      const result = await response.json();
      setFetchedData(result);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (selectedCoin) {
      fetchTradeHistory(selectedCoin[0].market, preFetchedCount.current);
      return () => {
        setFetchedData(null);
      };
    }
  }, [selectedCoin]);

  useEffect(() => {
    if (socketData && fetchedData) {
      if (socketData.length > 0 && fetchedData.length > 0) {
        const curRemoveLength = socketData.length - removedLength.current;
        setFetchedData((prev) => {
          const data = cloneDeep(prev);
          for (let i = 0; i < curRemoveLength; i++) {
            data.pop();
          }
          return data;
        });
        removedLength.current = removedLength.current + curRemoveLength;
      }
    }
  }, [socketData]);

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
      {fetchedData
        ? fetchedData.slice(2).map((data, index) => (
            <TradeRow key={index}>
              <TradeTimeBox>{timestampToTime(data.timestamp)}</TradeTimeBox>
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
        : null}
    </TradeHistoryContainer>
  );
}

export default memo(RealTimeTradeHistory);
