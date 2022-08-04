import { memo } from "react";

function RequestCounter({ count, setCount }) {
  const handleCount = (evt) => {
    const changedCount = evt.target.value;
    if (changedCount >= 0 && changedCount <= 200) {
      setCount(evt.target.value);
    } else if (changedCount > 200) {
      setCount(200);
    } else {
      setCount(1);
    }
  };
  return (
    <div>
      <label>
        Count | 최근
        <input
          type="number"
          name="count"
          min={1}
          max={200}
          step={1}
          value={count}
          onChange={handleCount}
        />
        개의 내역 조회(1~200개)
      </label>
    </div>
  );
}

export default memo(RequestCounter);
