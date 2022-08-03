import { memo } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { selectedCoinInfoState, selectedCoinState } from "./atom";

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
  grid-template-columns: 1fr 1fr 1.2fr;
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
const AccTradePrice24hInfoBox = styled.div``;

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

export default memo(CoinInfo);
