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
        state.visibleDeviceIds = state.visibleDeviceIds.filter(id => id !== deviceId);
      } else {
        state.visibleDeviceIds.push(deviceId);
      }
    },
    setVisibleDevices: (state, action) => {
      state.visibleDeviceIds = action.payload;
    },
    addCustomDevice: (state, action) => {
      const { name, width, height, icon, category } = action.payload;
      const id = `custom-${Date.now()}`;
      
      // Calculate a reasonable scale
      const scale = parseInt(width) > 900 ? 0.4 : 0.6;

      const newDevice = {
        id,
        name,
        width: parseInt(width),
        height: parseInt(height),
        scale,
        icon: icon || "monitor",
        category: category || "custom"
      };

      state.devices.push(newDevice);
      state.visibleDeviceIds.push(id);
    },
    removeDevice: (state, action) => {
      const deviceId = action.payload;
      // Don't allow removing built-in devices from initial set
      state.devices = state.devices.filter(d => d.id !== deviceId);
      state.visibleDeviceIds = state.visibleDeviceIds.filter(id => id !== deviceId);
    },
    updateDevice: (state, action) => {
      const { id, name, width, height, icon, category } = action.payload;
      const device = state.devices.find(d => d.id === id);
      if (device) {
        if (name !== undefined) device.name = name;
        if (width !== undefined) device.width = parseInt(width);
        if (height !== undefined) device.height = parseInt(height);
        if (icon !== undefined) device.icon = icon;
        if (category !== undefined) device.category = category;
        device.scale = parseInt(width || device.width) > 900 ? 0.4 : 0.6;
      }
    },
    resetDevices: (state) => {
      state.devices = initialDevices;
      state.visibleDeviceIds = ["mobile-m", "tablet", "desktop"];
    },
  },
});

export const { setPreviewUrl, toggleDevice, setVisibleDevices, addCustomDevice, removeDevice, updateDevice, resetDevices } = screenSlice.actions;
export default screenSlice.reducer;

