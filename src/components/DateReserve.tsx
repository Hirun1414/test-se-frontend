"use client"

import { useState, useEffect } from "react";
import { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Select, MenuItem } from "@mui/material";

export default function DateReserve({locationId, hotelsJson, onDateChange, onLocationChange}:{locationId:string, hotelsJson: HotelJson, onDateChange:Function, onLocationChange:Function}) {

    const [reserveDate, setReserveDate] = useState<Dayjs | null>(null);
    const [location, setLocation] = useState<string>('');

    useEffect(() => {
    const found = hotelsJson.data.find(v => v._id === locationId);
        if (found) {
            setLocation(found._id);
            onLocationChange(found._id);
        }
    }, [locationId, hotelsJson]);

    return(
        <div className="bg-slate-100 rounded-lg space-x-5 space-y-2 w-fit px-10 py-5 flex gap-5 items-center">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker className="bg-white"
                value={reserveDate}
                onChange={(value) => {setReserveDate(value); onDateChange(value);}}/>
            </LocalizationProvider>
            
            <Select variant="standard" name="hotel" id="hotel" value={location} displayEmpty
            onChange={(e) => {setLocation(e.target.value); onLocationChange(e.target.value);}}
            className="h-[2em] w-[200px]">
                <MenuItem value="" sx={{ color: 'gray', fontStyle: 'italic' }}>-- Select Hotel --</MenuItem>
                {hotelsJson.data.map((hotel) => (
                    <MenuItem key={hotel._id} value={hotel._id}>{hotel.name}</MenuItem>
                ))}
            </Select>
        </div>
    );
}