// store/useEventStore.ts
import { create } from 'zustand';

interface TriggerEventPayload {
  pressed?: boolean;
}

interface Event {
  type: string;
  payload: TriggerEventPayload;
}

interface InterfaceEventState {
  event: Event | null;
  triggerEvent: (type: string, payload?: TriggerEventPayload) => void;
}

const useInterfaceEvent = create<InterfaceEventState>((set) => ({
  event: null,
  triggerEvent: (type: string, payload: TriggerEventPayload = {}) => {
    set({ event: { type, payload } });
    // Optionally reset after one tick if needed
    // setTimeout(() => set({ event: null }), 0);
  },
}));

export default useInterfaceEvent;
