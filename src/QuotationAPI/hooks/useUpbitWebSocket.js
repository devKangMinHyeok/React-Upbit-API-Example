import { useCallback, useEffect, useRef, useState } from "react";
import _, { throttle } from "lodash";

const socketDataEncoder = (socketData) => {
  const encoder = new TextDecoder("utf-8");
  const rawData = new Uint8Array(socketData);
  const data = JSON.parse(encoder.decode(rawData));

  return data;
};

const typeChecker = (type) => {
  let isValid = true;
  if (type != "ticker" && type != "orderbook" && type != "trade") {
    isValid = false;
  }
  return isValid;
};

const getLastBuffers = (buffer, maxNumResult) => {
  let result = [];

  for (let i = buffer.length - 1; i >= 0; i--) {
    let isExist = false;

    for (let j = 0; j < result.length; j++) {
      if (result[j].code === buffer[i].code) {
        isExist = true;
      } else continue;
    }

    if (!isExist) result.push(buffer[i]);
    else {
      if (maxNumResult <= result.length) break;
      else continue;
    }
  }

  return result;
};

const sortBuffers = (originalBuffers, sortOrder) => {
  let result = [];
  for (let i = 0; i < sortOrder.length; i++) {
    const targetCode = sortOrder[i].market;
    for (let j = 0; j < originalBuffers.length; j++) {
      if (targetCode === originalBuffers[j].code) {
        result.push(originalBuffers[j]);
        break;
      } else continue;
    }
  }
  return result;
};

const updateSocketData = (origininalData, newData) => {
  const copyOriginal = _.cloneDeep(origininalData);
  const copyNew = _.cloneDeep(newData);

  if (copyOriginal && newData) {
    for (let i = 0; i < copyOriginal.length; i++) {
      const target = copyOriginal[i];
      for (let j = 0; j < newData.length; j++) {
        if (target.code === newData[j].code) {
          copyOriginal[i] = newData[j];
          copyNew[j] = null;
          break;
        } else continue;
      }
    }

    // 원본 데이터에 없는 market 데이터가 새롭게 받은 데이터에 존재하는 case
    const remainNew = copyNew.filter((element) => element !== null);
    if (remainNew.length > 0) {
      copyOriginal.push(...remainNew);
    }
  }
  return copyOriginal;
};

const updateQueueBuffer = (buffer, maxSize) => {
  const copyBuffer = _.cloneDeep(buffer);
  while (copyBuffer.length >= maxSize) {
    copyBuffer.shift();
  }
  return copyBuffer;
};

function useUpbitWebSocket(targetMarketCodes, type) {
  const SOCKET_URL = "wss://api.upbit.com/websocket/v1";
  const THROTTLE_TIME = 1000;
  const MAX_LENGTH_QUEUE = 100;

  const socket = useRef(null);
  const buffer = useRef([]);

  const [isConnected, setIsConnected] = useState(false);
  const [loadingBuffer, setLoadingBuffer] = useState([]);
  const [socketData, setSocketData] = useState();
  const throttled = useCallback(
    throttle(() => {
      const lastBuffers = getLastBuffers(
        buffer.current,
        targetMarketCodes.length
      );

      switch (type) {
        case "ticker":
          const sortedBuffers = sortBuffers(lastBuffers, targetMarketCodes);
          setLoadingBuffer(sortedBuffers);
          buffer.current = [];
          break;

        case "orderbook":
          setSocketData(...lastBuffers);
          buffer.current = [];
          break;

        case "trade":
          const updatedBuffer = updateQueueBuffer(
            buffer.current,
            MAX_LENGTH_QUEUE
          );
          buffer.current = updatedBuffer;
          setSocketData(updatedBuffer);
          break;

        default:
          break;
      }
    }, THROTTLE_TIME)
  );
  // socket 세팅
  useEffect(() => {
    const isTypeValid = typeChecker(type);
    if (!isTypeValid) {
      console.log(
        "[Error] | input type is unknown. (input type should be 'ticker' or 'orderbook' or 'trade')"
      );
    }

    if (targetMarketCodes.length > 0 && !socket.current) {
      socket.current = new WebSocket(SOCKET_URL);
      socket.current.binaryType = "arraybuffer";

      const socketOpenHandler = (evt) => {
        setIsConnected(true);
        console.log("[연결완료] | socket Open Type: ", type);
        if (socket.current.readyState == 1) {
          const sendContent = [
            { ticket: "test" },
            { type: type, codes: targetMarketCodes.map((code) => code.market) },
          ];
          socket.current.send(JSON.stringify(sendContent));
          console.log("message sending done");
        }
      };

      const socketCloseHandler = (evt) => {
        setIsConnected(false);
        setLoadingBuffer([]);
        setSocketData(null);
        buffer.current = [];
        console.log("연결종료");
      };

      const socketErrorHandler = (error) => {
        console.log("[Error]", error);
      };

      const socketMessageHandler = (evt) => {
        const data = socketDataEncoder(evt.data);
        buffer.current.push(data);
        throttled();
      };

      socket.current.onopen = socketOpenHandler;
      socket.current.onclose = socketCloseHandler;
      socket.current.onerror = socketErrorHandler;
      socket.current.onmessage = socketMessageHandler;
    }
    return () => {
      if (socket.current) {
        if (socket.current.readyState != 0) {
          socket.current.close();
          socket.current = null;
        }
      }
    };
  }, [targetMarketCodes]);

  useEffect(() => {
    if (loadingBuffer.length > 0) {
      if (!socketData) {
        setSocketData(loadingBuffer);
      } else {
        setSocketData((prev) => {
          return updateSocketData(prev, loadingBuffer);
        });
        setLoadingBuffer([]);
      }
    }
  }, [loadingBuffer]);

  return [socket.current, isConnected, socketData];
}

export default useUpbitWebSocket;
