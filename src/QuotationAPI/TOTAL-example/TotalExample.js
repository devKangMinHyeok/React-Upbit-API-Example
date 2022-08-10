import { useEffect } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { useFetchMarketCode } from "use-upbit-api";
import { marketCodesState } from "./atom";
import CoinDetails from "./CoinDetails";
import CoinSelector from "./CoinSelector";

const DisplayBoard = styled.main`
  width: 1250px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 300px 950px;
  background-color: whitesmoke;

  font-family: Arial, Helvetica, sans-serif;

  *::-webkit-scrollbar,
  *::-webkit-scrollbar-thumb {
    width: 0px;
  }

  *::-webkit-scrollbar-thumb {
  }
  *:hover::-webkit-scrollbar,
  *:hover::-webkit-scrollbar-thumb {
    width: 26px;
    border-radius: 13px;
    background-clip: padding-box;
    border: 12px solid transparent;
    color: grey;
  }

  *:hover::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 0 10px;
  }

  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`;

function TotalExample() {
  const { isLoading, marketCodes: fetchedMC } = useFetchMarketCode();
  const [marketCodes, setMarketCodes] = useRecoilState(marketCodesState);

  useEffect(() => {
    const MarketCodes_KRW = fetchedMC.filter((code) =>
      code.market.includes("KRW")
    );
    setMarketCodes(MarketCodes_KRW);
  }, [fetchedMC]);

  return (
    <DisplayBoard>
      <CoinSelector />
      <CoinDetails />
    </DisplayBoard>
  );
}
export default TotalExample;
