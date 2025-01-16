import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import "./header.css";

function Header() {
  const [value, setValue] = React.useState("one");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        backgroundColor: "lightblue",
      }}
    >
      <div className="logo">
        <img
          src="https://www.pngitem.com/pimgs/m/42-428687_128-128-png-logo-hospital-icon.png"
          alt=""
        />
      </div>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="secondary tabs example"
      >
        <Tab
          onClick={() => (window.location.href = "/home")}
          value="home"
          label="Home"
        />
        <Tab
          onClick={() => (window.location.href = "/home/citas")}
          value="citas"
          label="Citas"
        />
        <Tab
          onClick={() => (window.location.href = "/home/calendar")}
          value="calendario"
          label="Calendario"
        />
      </Tabs>
    </Box>
  );
}

export default Header;
