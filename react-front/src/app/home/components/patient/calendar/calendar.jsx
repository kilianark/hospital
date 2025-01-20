import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Button } from "@mui/material";

function Calendar() {
  let date = new Date();
  const [value, setValue] = React.useState(dayjs(date));

  const handleClick = () => {
    alert(`Your Appointment is booked on ${dayjs(value).format("DD-MM-YYYY")}`);
  };

  return (
    <div className="Calendar">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={value}
          onChange={(newValue) => {
            // console.log(newValue)
            setValue(newValue);
          }}
        ></DatePicker>
        <Button
          variant="contained"
          onClick={handleClick}
          style={{ marginLeft: "70%" }}
        >
          BOOK APPOINTMENT
        </Button>
      </LocalizationProvider>
    </div>
  );
}

export default Calendar;
