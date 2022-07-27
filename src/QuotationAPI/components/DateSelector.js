import { memo } from "react";
import getTodayDate from "../functions/getTodayDate";

function DateSelector({ startDate, setStartDate }) {
  const handleDate = (evt) => {
    setStartDate(evt.target.value);
  };

  return (
    <div>
      <label>
        Start Date |
        <input
          type="date"
          name="startdate"
          value={startDate}
          max={getTodayDate()}
          onChange={handleDate}
        />
        부터 (* Upbit 일봉은 매일 오전 9시 정각에 초기화)
      </label>
    </div>
  );
}

export default memo(DateSelector);
