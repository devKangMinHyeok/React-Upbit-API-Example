import { memo } from "react";

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

export default memo(MarketCodeSelector);
