import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import useUpbitWebSocket from "../hooks/useUpbitWebSocket";
import {
  marketCodesState,
  selectedCoinInfoState,
  selectedCoinState,
} from "./atom";
import ChartTest from "./ChartTest";

const CoinInfoBox = styled.div`
  height: 100%;
  grid-column: 1 / span 3;
  background-color: white;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`;

const NameInfoArea = styled.div`
  grid-column: 1 / span 2;
  display: flex;
  gap: 5px;
  padding: 8px;
  border-bottom: 0.5px solid grey;
`;

const KoreanNameInfoBox = styled.div`
  font-size: 19px;
  font-weight: 600;
`;
const MarketCodeInfoBox = styled.div`
  font-size: 13px;
  color: grey;
  padding-top: 10px;
`;

const TradeInfoArea = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr;
`;
const TradePriceInfoArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 8px;
  color: ${(props) => {
    switch (props.changeType) {
      case "RISE":
        return "#EF1C1C";
      case "EVEN":
        return "#000000";
      case "FALL":
        return "#1261C4";
      default:
        return "#000000";
    }
  }};
`;
const TradePriceInfoBox = styled.div`
  grid-column: 1 / span 2;
  font-size: 25px;
  font-weight: 600;
  display: flex;
  gap: 2px;
  div:nth-child(2) {
    font-size: 15px;
    padding-top: 8px;
  }
`;
const ChangeRateInfoBox = styled.div`
  font-size: 14px;
  font-weight: 600;
  display: flex;
  gap: 2px;
  div:nth-child(1) {
    font-size: 12px;
    color: grey;
  }
`;
const ChangePriceInfoBox = styled.div`
  font-size: 14px;
  font-weight: 600;
`;
const PriceLogInfoArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1.4fr;
  column-gap: 15px;
  padding: 5px;
`;

const PriceLogInfoBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid lightgray;
  font-size: 12px;
`;
const CategoriHeaderBox = styled.div``;

const HighPriceInfoBox = styled.div`
  color: #ef1c1c;
  font-weight: 600;
`;
const LowPriceInfoBox = styled.div`
  color: #1261c4;
  font-weight: 600;
`;
const HighPrice52WeekInfoBox = styled.div`
  color: #ef1c1c;
  font-weight: 600;
`;
const LowPrice52WeekInfoBox = styled.div`
  color: #1261c4;
  font-weight: 600;
`;
const AccTradeVolume24hInfoBox = styled.div``;
const AccTradePrice24hInfoBox = styled.div`
  font-size: 11px;
`;

function CoinInfo() {
  const selectedCoin = useRecoilValue(selectedCoinState);
  const selectedCoinInfo = useRecoilValue(selectedCoinInfoState);
  return (
    <CoinInfoBox>
      <NameInfoArea>
        <KoreanNameInfoBox>
          {selectedCoin ? selectedCoin[0].korean_name : null}
        </KoreanNameInfoBox>
        <MarketCodeInfoBox>
          {selectedCoinInfo ? selectedCoinInfo.code : null}
        </MarketCodeInfoBox>
      </NameInfoArea>
      {selectedCoinInfo ? (
        <TradeInfoArea>
          <TradePriceInfoArea changeType={selectedCoinInfo.change}>
            <TradePriceInfoBox>
              <div>
                {selectedCoinInfo.trade_price
                  ? selectedCoinInfo.trade_price.toLocaleString("ko-KR")
                  : null}
              </div>
              <div>KRW</div>
            </TradePriceInfoBox>
            <ChangeRateInfoBox>
              <div>전일대비</div>
              <div>
                {selectedCoinInfo.signed_change_rate > 0 ? "+" : null}
                {(selectedCoinInfo.signed_change_rate * 100).toFixed(2)}%
              </div>
            </ChangeRateInfoBox>
            <ChangePriceInfoBox>
              {selectedCoinInfo.signed_change_price > 0 ? "▲" : "▼"}
              {selectedCoinInfo.change_price
                ? selectedCoinInfo.change_price.toLocaleString("ko-KR")
                : null}
            </ChangePriceInfoBox>
          </TradePriceInfoArea>
          <PriceLogInfoArea>
            <PriceLogInfoBox>
              <CategoriHeaderBox>고가</CategoriHeaderBox>
              <HighPriceInfoBox>
                {selectedCoinInfo.high_price
                  ? selectedCoinInfo.high_price.toLocaleString("ko-KR")
                  : null}
              </HighPriceInfoBox>
            </PriceLogInfoBox>
            <PriceLogInfoBox>
              <CategoriHeaderBox>52주 고가</CategoriHeaderBox>
              <HighPrice52WeekInfoBox>
                {selectedCoinInfo.highest_52_week_price
                  ? selectedCoinInfo.highest_52_week_price.toLocaleString(
                      "ko-KR"
                    )
                  : null}
              </HighPrice52WeekInfoBox>
            </PriceLogInfoBox>
            <PriceLogInfoBox>
              <CategoriHeaderBox>거래량(24H)</CategoriHeaderBox>
              <AccTradeVolume24hInfoBox>
                {selectedCoinInfo.acc_trade_volume_24h
                  ? selectedCoinInfo.acc_trade_volume_24h.toLocaleString(
                      "ko-KR"
                    )
                  : null}
              </AccTradeVolume24hInfoBox>
            </PriceLogInfoBox>
            <PriceLogInfoBox>
              <CategoriHeaderBox>저가</CategoriHeaderBox>
              <LowPriceInfoBox>
                {selectedCoinInfo.low_price
                  ? selectedCoinInfo.low_price.toLocaleString("ko-KR")
                  : null}
              </LowPriceInfoBox>
            </PriceLogInfoBox>
            <PriceLogInfoBox>
              <CategoriHeaderBox>52주 저가</CategoriHeaderBox>
              <LowPrice52WeekInfoBox>
                {selectedCoinInfo.lowest_52_week_price
                  ? selectedCoinInfo.lowest_52_week_price.toLocaleString(
                      "ko-KR"
                    )
                  : null}
              </LowPrice52WeekInfoBox>
            </PriceLogInfoBox>
            <PriceLogInfoBox>
              <CategoriHeaderBox>거래대금(24H)</CategoriHeaderBox>
              <AccTradePrice24hInfoBox>
                {selectedCoinInfo.acc_trade_price_24h
                  ? Math.ceil(
                      selectedCoinInfo.acc_trade_price_24h
                    ).toLocaleString("ko-KR")
                  : null}
              </AccTradePrice24hInfoBox>
            </PriceLogInfoBox>
          </PriceLogInfoArea>
        </TradeInfoArea>
      ) : (
        "Loading..."
      )}
    </CoinInfoBox>
  );
}

const OrderBookContatiner = styled.div`
  grid-column: 1 / span 2;
  background-color: white;
  height: 100%;
  overflow: overlay;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`;

const AskContainer = styled.div`
  background-color: white;
`;

const AskBidSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
`;

const AskSection = styled(AskBidSection)`
  background-color: #cde5ff;
`;
const BidContainer = styled.div`
  background-color: white;
`;

const BidSection = styled(AskBidSection)`
  background-color: #ffcdcd;
`;

const OrderBox = styled.div`
  height: 30px;
  border: 1px solid white;
`;

const BlankBox = styled(OrderBox)`
  background-color: white;
`;

const OrderPriceBox = styled(OrderBox)`
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 12px;
  color: ${(props) => {
    switch (props.changeType) {
      case "RISE":
        return "#EF1C1C";
      case "EVEN":
        return "#000000";
      case "FALL":
        return "#1261C4";
      default:
        return "#000000";
    }
  }};
  div:nth-child(1) {
    font-weight: 600;
  }
`;
const OrderSizeBox = styled(OrderBox)`
  font-size: 11px;
`;

const AskOrderSizeBox = styled(OrderSizeBox)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const BidOrderSizeBox = styled(OrderSizeBox)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SizeBarBox = styled.div.attrs(({ width }) => {
  return {
    style: {
      width: width,
    },
  };
})`
  height: 70%;
  justify-content: ${(props) =>
    props.type === "right" ? "flex-end" : "flex-start"};
  display: flex;
  align-items: center;
`;

const AskSizeBarBox = styled(SizeBarBox)`
  background-color: #90bfff;
  div {
    padding-right: 5px;
  }
`;
const BidSizeBarBox = styled(SizeBarBox)`
  background-color: #ff9090;
  div {
    padding-left: 5px;
  }
`;

const getChangeRate = (currentValue, prevClose) => {
  const result = (((currentValue - prevClose) / prevClose) * 100).toFixed(2);
  return result;
};

const getChangeType = (currentValue, prevClose) => {
  const change = currentValue - prevClose;
  if (change > 0) {
    return "RISE";
  } else if (change === 0) {
    return "EVEN";
  } else if (change < 0) {
    return "FALL";
  } else {
    return "EVEN";
  }
};

const getMaxSize = (orderbook) => {
  const askSizes = [];
  const bidSizes = [];
  orderbook.map((unit) => {
    askSizes.push(unit.ask_size);
    bidSizes.push(unit.bid_size);
  });
  const maxAskSize = Math.max(...askSizes);
  const maxBidSize = Math.max(...bidSizes);

  return [maxAskSize, maxBidSize];
};

function OrderBook() {
  const selectedCoin = useRecoilValue(selectedCoinState);
  const selectedCoinInfo = useRecoilValue(selectedCoinInfoState);
  const [socket, isConnected, socketData] = useUpbitWebSocket(
    selectedCoin,
    "orderbook"
  );
  const [askMaxSize, setAskMaxSize] = useState();
  const [bidMaxSize, setBidMaxSize] = useState();

  const [scrollOn, setScrollOn] = useState(false);
  const orderBookContainerRef = useRef();

  useEffect(() => {
    if (socketData) {
      const orderbook = socketData.orderbook_units;
      const [maxAskSize, maxBidSize] = getMaxSize(orderbook);
      setAskMaxSize(maxAskSize);
      setBidMaxSize(maxBidSize);
      if (!scrollOn) {
        orderBookContainerRef.current.scrollTop =
          orderBookContainerRef.current.scrollHeight / 3;
      }
    }
  }, [socketData]);

  const scrollEventHandler = () => {
    setScrollOn(true);
  };

  return (
    <OrderBookContatiner
      ref={orderBookContainerRef}
      onScroll={scrollEventHandler}
    >
      {socketData ? (
        <>
          <AskContainer>
            {[...socketData.orderbook_units].reverse().map((data, index) => (
              <AskSection key={index}>
                <AskOrderSizeBox>
                  <AskSizeBarBox
                    type={"right"}
                    width={`${(data.ask_size / askMaxSize) * 100}%`}
                  >
                    <div>{data.ask_size}</div>
                  </AskSizeBarBox>
                </AskOrderSizeBox>
                <OrderPriceBox
                  changeType={getChangeType(
                    data.ask_price,
                    selectedCoinInfo.prev_closing_price
                  )}
                >
                  <div>{data.ask_price.toLocaleString("ko-KR")}</div>
                  <div>
                    {getChangeRate(
                      data.ask_price,
                      selectedCoinInfo.prev_closing_price
                    ) > 0
                      ? "+"
                      : null}
                    {getChangeRate(
                      data.ask_price,
                      selectedCoinInfo.prev_closing_price
                    )}
                    %
                  </div>
                </OrderPriceBox>
                <BlankBox></BlankBox>
              </AskSection>
            ))}
          </AskContainer>
          <BidContainer>
            {socketData.orderbook_units.map((data, index) => (
              <BidSection key={index}>
                <BlankBox></BlankBox>
                <OrderPriceBox
                  changeType={getChangeType(
                    data.bid_price,
                    selectedCoinInfo.prev_closing_price
                  )}
                >
                  <div>{data.bid_price.toLocaleString("ko-KR")}</div>
                  <div>
                    {getChangeRate(
                      data.bid_price,
                      selectedCoinInfo.prev_closing_price
                    ) > 0
                      ? "+"
                      : null}
                    {getChangeRate(
                      data.bid_price,
                      selectedCoinInfo.prev_closing_price
                    )}
                    %
                  </div>
                </OrderPriceBox>
                <BidOrderSizeBox>
                  <BidSizeBarBox
                    type={"left"}
                    width={`${(data.bid_size / bidMaxSize) * 100}%`}
                  >
                    <div>{data.bid_size}</div>
                  </BidSizeBarBox>
                </BidOrderSizeBox>
              </BidSection>
            ))}
          </BidContainer>
        </>
      ) : (
        "Loading..."
      )}
    </OrderBookContatiner>
  );
}

const TradeHistoryContainer = styled.div`
  background-color: white;
  font-size: 11px;
  overflow: overlay;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  padding: 5px;
`;
const TradeTableHeader = styled.div`
  display: flex;
  justify-content: space-around;
  padding-bottom: 2px;
  border-bottom: lightgrey 1px solid;
`;
const TradeTableHeaderChild = styled.div``;
const TradeRow = styled.div`
  padding-left: 15px;
  padding-right: 10px;
  display: flex;
  justify-content: space-between;
  border-bottom: whitesmoke 1px solid;
`;

const TradeLogBox = styled.div`
  margin: 2px;
`;

const TradePriceBox = styled(TradeLogBox)``;
const TradeSizeBox = styled(TradeLogBox)`
  color: ${(props) => (props.tradeType === "ASK" ? "#EF1C1C" : "#1261C4")};
`;

function TradeHistory() {
  const selectedCoin = useRecoilValue(selectedCoinState);
  const [socket, isConnected, socketData] = useUpbitWebSocket(
    selectedCoin,
    "trade"
  );

  return (
    <TradeHistoryContainer>
      <TradeTableHeader>
        <TradeTableHeaderChild>체결가격</TradeTableHeaderChild>
        <TradeTableHeaderChild>체결량</TradeTableHeaderChild>
      </TradeTableHeader>
      {socketData
        ? [...socketData].reverse().map((data, index) => (
            <TradeRow key={index}>
              <TradePriceBox>{data.trade_price}</TradePriceBox>
              <TradeSizeBox tradeType={data.ask_bid}>
                {data.trade_volume}
              </TradeSizeBox>
            </TradeRow>
          ))
        : "Loading..."}
    </TradeHistoryContainer>
  );
}

const ChartLayout = styled.div`
  grid-column: 1 / span 3;
`;

function Chart() {
  return <ChartLayout>Chart</ChartLayout>;
}

const DetailLayout = styled.div`
  height: 83vh;
  background-color: whitesmoke;
  padding: 5px;
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr 1fr;
`;

function CoinDetails() {
  return (
    <DetailLayout>
      <CoinInfo />
      <ChartTest />
      <OrderBook />
      <TradeHistory />
    </DetailLayout>
  );
}

export default CoinDetails;
