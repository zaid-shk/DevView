import { createSlice } from "@reduxjs/toolkit";

const initialDevices = [
  { id: "mobile-m", name: "Mobile M", width: 375, height: 667, scale: 0.4, icon: "smartphone", category: "mobile" },
  { id: "mobile-l", name: "Mobile L", width: 425, height: 926, scale: 0.4, icon: "smartphone", category: "mobile" },
  { id: "tablet", name: "Tablet", width: 768, height: 1024, scale: 0.4, icon: "tablet", category: "tablet" },
  { id: "laptop", name: "Laptop", width: 1024, height: 768, scale: 0.4, icon: "laptop", category: "desktop" },
  { id: "desktop", name: "Desktop", width: 1440, height: 900, scale: 0.45, icon: "monitor", category: "desktop" },
  { id: "desktop-l", name: "Desktop L", width: 1920, height: 1080, scale: 0.35, icon: "monitor", category: "desktop" },
];

const screenSlice = createSlice({
  name: "screen",
  initialState: {
    previewUrl: "",
    devices: initialDevices,
    visibleDeviceIds: ["mobile-m", "tablet", "desktop"],
  },
  reducers: {
    setPreviewUrl: (state, action) => {
      state.previewUrl = action.payload;
    },
    toggleDevice: (state, action) => {
      const deviceId = action.payload;
      if (state.visibleDeviceIds.includes(deviceId)) {
        if (state.visibleDeviceIds.length > 1) {
          state.visibleDeviceIds = state.visibleDeviceIds.filter(id => id !== deviceId);
        }
      } else {
        state.visibleDeviceIds.push(deviceId);
      }
    },
    setVisibleDevices: (state, action) => {
      state.visibleDeviceIds = action.payload;
    },
    addCustomDevice: (state, action) => {
      const { name, width, height } = action.payload;
      const id = `custom-${Date.now()}`;
      
      // Calculate a reasonable scale
      const scale = width > 1000 ? 0.4 : 0.6;

      const newDevice = {
        id,
        name,
        width: parseInt(width),
        height: parseInt(height),
        scale,
        icon: "monitor",
        category: "custom"
      };

      state.devices.push(newDevice);
      state.visibleDeviceIds.push(id);
    },
  },
});

export const { setPreviewUrl, toggleDevice, setVisibleDevices, addCustomDevice } = screenSlice.actions;
export default screenSlice.reducer;

