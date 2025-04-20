
import { addEffect } from '@react-three/fiber';
import useGame from '../../store/useGame';
import './Interface.css'
import { useKeyboardControls } from '@react-three/drei'
import { useEffect, useRef } from 'react';
import useInterfaceEvent from '../../store/useInterfaceEvent';

const Interface = () => {
  const time = useRef();
  const restart = useGame((state) => state.restart)
  const phase = useGame((state) => state.phase)
  const forward = useKeyboardControls((state) => state.forward);
  const backward = useKeyboardControls((state) => state.backward);
  const leftward = useKeyboardControls((state) => state.leftward);
  const rightward = useKeyboardControls((state) => state.rightward);
  const jump = useKeyboardControls((state) => state.jump);


  useEffect(() => {
    const unsubscribeEffect = addEffect(() => {
      const state = useGame.getState();
      let elapsedTime = 0;
      if (state.phase === 'playing') {
        elapsedTime = Date.now() - state.startTime;
      }
      else if (state.phase === 'ended') {
        elapsedTime = state.endTime - state.startTime;
      }
      elapsedTime /= 1000;
      elapsedTime = elapsedTime.toFixed(2);

      if (time.current) {
        if (time.current.textContent !== elapsedTime) {
          time.current.textContent = elapsedTime
        }

      }

    })
    return () => unsubscribeEffect()
  }, [])

  const triggerEvent = useInterfaceEvent((state) => state.triggerEvent);
  const evenType = useInterfaceEvent((state) => state.event);
  const activeButtonType = evenType?.type;
  const start = useGame((state) => state.start);
  const playerClick = (clickType, clickEvent) => {
    triggerEvent(clickType, clickEvent)
    start()
  }
  const playerRestClick = () => {
    triggerEvent(null)
  }
  return <div className="interface">

    <div className="time" ref={time}>0.0</div>
    {
      phase === 'ended' && <div className="restart" onClick={restart}>Restart</div>
    }
    <div className='controls'>
      <div className="empty"></div>
      <button className={`button  ${forward || activeButtonType === 'forwardIn' ? 'active' : 'deactive'}`} onMouseDown={() => playerClick('forwardIn', { pressed: true })} onMouseUp={() => playerRestClick()} onTouchStart={() => playerClick('forwardIn', { pressed: true })} onTouchEnd={() => playerRestClick()} >↑</button>
      <div className="empty"></div>

      <button className={`button  ${leftward || activeButtonType === 'leftwardIn' ? 'active' : 'deactive'}`} onMouseDown={() => playerClick('leftwardIn', { pressed: true })} onMouseUp={() => playerRestClick()} onTouchStart={() => playerClick('leftwardIn', { pressed: true })} onTouchEnd={() => playerRestClick()} >←</button>
      <button className={`button  ${jump || activeButtonType === 'spaceIn' ? 'active' : 'deactive'}`} onMouseDown={() => playerClick('spaceIn', { pressed: true })} onMouseUp={() => playerRestClick()} onTouchStart={() => playerClick('spaceIn', { pressed: true })} onTouchEnd={() => playerRestClick()}  >⏺</button>
      <button className={`button  ${rightward || activeButtonType === 'rightwardIn' ? 'active' : 'deactive'}`} onMouseDown={() => playerClick('rightwardIn', { pressed: true })} onMouseUp={() => playerRestClick()} onTouchStart={() => playerClick('rightwardIn', { pressed: true })} onTouchEnd={() => playerRestClick()}>→</button>

      <div className="empty"></div>
      <button className={`button  ${backward || activeButtonType === 'backwardIn' ? 'active' : 'deactive'}`} onMouseDown={() => playerClick('backwardIn', { pressed: true })} onMouseUp={() => playerRestClick()} onTouchStart={() => playerClick('backwardIn', { pressed: true })} onTouchEnd={() => playerRestClick()}>↓</button>
      <div className="empty"></div>

    </div>
  </div>;
};

export default Interface;
