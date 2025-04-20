import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Define the shape of your Zustand store
interface GameState {
  blockCount: number;
  playerLavel: number;
  startTime: number;
  endTime: number;
  phase: 'ready' | 'playing' | 'ended';

  start: () => void;
  restart: () => void;
  end: () => void;
  updateLevel: () => void;
}

const useGame = create<GameState>()(
  subscribeWithSelector((set) => ({
    blockCount: 15,
    playerLavel: +(JSON.parse(localStorage.getItem('level') as any) ?? 0),
    startTime: 0,
    endTime: 0,
    phase: 'ready',

    start: () => {
      set((state) => {
        if (state.phase === 'ready') {
          return { phase: 'playing', startTime: Date.now() };
        }
        return {};
      });
    },

    restart: () => {
      set((state) => {
        if (state.phase === 'playing' || state.phase === 'ended') {
          return { phase: 'ready' };
        }
        return {};
      });
    },

    end: () => {
      set((state) => {
        if (state.phase === 'playing') {
          return { phase: 'ended', endTime: Date.now() };
        }
        return {};
      });
    },

    updateLevel: () => {
      set((state) => {
        const levels = state.playerLavel + 1;
        localStorage.setItem('level', JSON.stringify(levels));
        return { playerLavel: levels };
      });
    },
  }))
);

export default useGame;
