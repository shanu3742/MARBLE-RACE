// store/useEventStore.js
import { create } from 'zustand';
const useInterfaceEvent = create((set) => ({
  event: null,
  triggerEvent: (type, payload = {}) => {
    set({ event: { type, payload } });
    // reset it in next tick (simulate one-time event)
    // setTimeout(() => set({ event: null }), 0);
  },
}));

export default useInterfaceEvent;
