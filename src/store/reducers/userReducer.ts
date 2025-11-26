import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface InitialStateType {
    dob: Date;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    profile_image: string;
    id: string;
}

const initialState: InitialStateType = {
    dob: new Date(),
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    profile_image: "",
    id: "",
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        update: (state, action) => {
            const { dob, email, first_name, last_name, phone, profile_image, id } = action.payload;
            state.dob = dob
            state.email = email;
            state.first_name = first_name;
            state.last_name = last_name
            state.phone = phone;
            state.profile_image = profile_image;
            state.id = id;
            Cookies.set("id", id);
            localStorage.setItem('user', JSON.stringify(state));
        },
    }
});
export const { update } = userSlice.actions;

export default userSlice.reducer;
