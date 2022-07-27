import { memo, useEffect, useState } from "react";

const MarketCodeTable = memo(function MarketCodeTable({ marketCodes }) {
  return (
    <table>
      <thead>
        <tr>
          <th>마켓코드</th>
          <th>영문명</th>
          <th>국문명</th>
        </tr>
      </thead>
      <tbody>
        {marketCodes.map((marketCode) => {
          return (
            <tr
              key={`${marketCode.market}_${marketCode.english_name}`}
              id={`${marketCode.market}_${marketCode.english_name}`}
            >
              <th>{marketCode.market}</th>
              <th>{marketCode.english_name}</th>
              <th>{marketCode.korean_name}</th>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
});

//REST API 통신 방식 사용
function MarketCode() {
  // isLoading, marketCodes state 세팅
  const [isLoading, setIsLoading] = useState(true);
  const [marketCodes, setMarketCodes] = useState();

  // refresh button
  const [refresh, setRefresh] = useState(false); // 토글형 state로 사용
  const handleRefresh = () => {
    setIsLoading(true);
    setRefresh((prev) => !prev);
  };

  // Upbit 상장 코인 fetch 함수
  const options = { method: "GET", headers: { Accept: "application/json" } };
  async function fetchMarketCodes() {
    console.log("fetching Market Codes Started!");
    const response = await fetch(
      "https://api.upbit.com/v1/market/all?isDetails=false",
      options
    );
    const result = await response.json();
    console.log("fetching Market Codes Finished!");
    setMarketCodes(result);
    setIsLoading(false);
  }

  // useEffect에서 fetch 함수 제어
  useEffect(() => {
    fetchMarketCodes();
  }, [refresh]); // refresh update시 fetch marketCode 재실행

  // marketCodes update시 콘솔에 출력
  useEffect(() => {
    console.log(marketCodes);
  }, [marketCodes]);

  return (
    <>
      <h3>getMarketCode Example</h3>
      <button onClick={handleRefresh}>Refresh</button>
      <h4>Result</h4>
      {isLoading ? "Loading..." : <MarketCodeTable marketCodes={marketCodes} />}
    </>
  );
}

export default MarketCode;
