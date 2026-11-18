
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  isLocationReady: boolean;
}

const initialState: LocationState = {
  latitude: null,
  longitude: null,
  isLocationReady: false,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setUserLocation: (
      state,
      action: PayloadAction<{
        latitude: number;
        longitude: number;
      }>
    ) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.isLocationReady = true;
    },

    clearUserLocation: (state) => {
      state.latitude = null;
      state.longitude = null;
      state.isLocationReady = false;
    },
  },
});

export const { setUserLocation, clearUserLocation } =
  locationSlice.actions;

export default locationSlice.reducer;
