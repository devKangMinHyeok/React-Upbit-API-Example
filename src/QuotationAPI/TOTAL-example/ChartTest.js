import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { selectedCoinState } from "./atom";
import { createChart, ColorType } from "lightweight-charts";

function ChartComponent({ processedData }) {
  const chartContainerRef = useRef();

  const backgroundColor = "white";
  const lineColor = "#2962FF";
  const textColor = "black";
  const areaTopColor = "#2962FF";
  const areaBottomColor = "rgba(41, 98, 255, 0.28)";

  useEffect(() => {
    if (processedData) {
      const handleResize = () => {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      };

      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: backgroundColor },
          textColor,
        },
        width: chartContainerRef.current.clientWidth,
        height: 300,
      });
      chart.timeScale().fitContent();

      const newSeries = chart.addAreaSeries({
        lineColor,
        topColor: areaTopColor,
        bottomColor: areaBottomColor,
      });
      newSeries.setData(processedData);

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);

        chart.remove();
      };
    }
  }, [processedData]);

  return <div ref={chartContainerRef} style={{ gridColumn: "1 /span 3" }} />;
}

function ChartTest() {
  const selectedCoin = useRecoilValue(selectedCoinState);
  const [fetchedData, setFetchedData] = useState();
  const [processedData, setProcessedData] = useState();
  const options = { method: "GET", headers: { Accept: "application/json" } };
  async function fetchDayCandle(marketCode, date, count) {
    try {
      console.log("fetching Day Candle Started!");
      const response = await fetch(
        `https://api.upbit.com/v1/candles/days?market=${marketCode}&to=${date}T09:00:00Z&count=${count}&convertingPriceUnit=KRW`,
        options
      );
      const result = await response.json();
      console.log("fetching Day Candle Finished!");
      setFetchedData(result);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (selectedCoin) {
      fetchDayCandle(selectedCoin[0].market, "2022-08-02", 200);
    }
  }, [selectedCoin]);

  useEffect(() => {
    if (fetchedData) {
      const processed = [...fetchedData].reverse().map((data) => {
        return {
          time: data.candle_date_time_kst,
          // open: data.opening_price,
          // high: data.high_price,
          // low: data.low_price,
          // close: data.trade_price,
          value: data.trade_price,
        };
      });
      setProcessedData(processed);
    }
  }, [fetchedData]);

  return <ChartComponent processedData={processedData}></ChartComponent>;
}

export default ChartTest;
