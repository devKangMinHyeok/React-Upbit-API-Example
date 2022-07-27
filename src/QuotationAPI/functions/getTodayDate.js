const getTodayDate = () => {
  const todayDate = new Date();
  const year = todayDate.getFullYear();
  const month = (todayDate.getMonth() + 1).toString().padStart(2, "0");
  const date = todayDate.getDate().toString().padStart(2, "0");
  const dateStr = year + "-" + month + "-" + date;
  return dateStr;
};

export default getTodayDate;
