import { atom } from "recoil";

export const marketCodesState = atom({
  key: "marketCodesState",
  default: [],
});

export const selectedCoinState = atom({
  key: "selectedCoinState",
  default: [
    {
      market: "KRW-BTC",
      korean_name: "비트코인",
      english_name: "Bitcoin",
    },
  ],
});

export const selectedCoinInfoState = atom({
  key: "selectedCoinInfoState",
  default: {},
});
