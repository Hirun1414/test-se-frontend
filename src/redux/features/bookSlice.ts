import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type BookState = {
    bookItems: BookingItem[]
}

const initialState:BookState = { bookItems:[]};

export const bookSlice = createSlice({
    name: "book",
    initialState,
    reducers: {
        addBooking: (state, action: PayloadAction<BookingItem>) => {
            const newItem = action.payload;
            const index = state.bookItems.findIndex(
                (item) =>
                item.hotel === newItem.hotel &&
                item.bookDate === newItem.bookDate
            );

            if (index !== -1) {
                state.bookItems[index] = newItem;
            } else {
                state.bookItems.push(newItem);
            }
        },
        removeBooking: (state, action:PayloadAction<BookingItem>) => {
            const remainItems = state.bookItems.filter(obj => {
                return ( (obj.nameLastname !== action.payload.nameLastname)
                || (obj.tel !== action.payload.tel)
                || (obj.hotel !== action.payload.hotel)
                || (obj.bookDate !== action.payload.bookDate))
            })
            state.bookItems = remainItems;
        }
    }
})

export const {addBooking, removeBooking} = bookSlice.actions
export default bookSlice.reducer