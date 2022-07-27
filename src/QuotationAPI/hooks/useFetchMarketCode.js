import { useEffect, useState } from "react";

function useFetchMarketCode() {
  const REST_API_URL = "https://api.upbit.com/v1";
  const [isLoading, setIsLoading] = useState(true);
  const [marketCodes, setMarketCodes] = useState([]);

  const options = { method: "GET", headers: { Accept: "application/json" } };

  async function fetchMarketCodes() {
    const response = await fetch(
      `${REST_API_URL}/market/all?isDetails=false`,
      options
    );
    const result = await response.json();

    setMarketCodes(result);
    setIsLoading(false);
  }

  // useEffect에서 fetch 함수 제어
  useEffect(() => {
    fetchMarketCodes();
  }, []);

  return [isLoading, marketCodes];
}

export default useFetchMarketCode;
