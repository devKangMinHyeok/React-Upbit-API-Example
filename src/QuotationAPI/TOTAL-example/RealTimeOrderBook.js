import { memo, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { useUpbitWebSocket } from "use-upbit-api";
import { selectedCoinInfoState, selectedCoinState } from "./atom";

const OrderBookContatiner = styled.div`
  grid-row: span 2;
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

function RealTimeOrderBook() {
  const selectedCoin = useRecoilValue(selectedCoinState);
  const selectedCoinInfo = useRecoilValue(selectedCoinInfoState);
  const webSocketOptions = { throttle_time: 400, max_length_queue: 100 };
  const { socket, isConnected, socketData } = useUpbitWebSocket(
    selectedCoin,
    "orderbook",
    webSocketOptions
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
      {socketData && selectedCoinInfo ? (
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

export default memo(RealTimeOrderBook);
