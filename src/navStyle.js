const navStyle = ({ isActive }) => ({
  color: isActive ? "blue" : "grey",
  textDecoration: isActive ? "underline" : "none",
  fontWeight: "bold",
  margin: "10px",
  padding: "5px",
});

export default navStyle;
