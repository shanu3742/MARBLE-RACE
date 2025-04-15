
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
        time.current.textContent = elapsedTime
      }

    })
    return () => unsubscribeEffect()
  }, [])

  const triggerEvent = useInterfaceEvent((state) => state.triggerEvent);

  return <div className="interface">
    <div className="time" ref={time}>0.0</div>
    {
      phase === 'ended' && <div className="restart" onClick={restart}>Restart</div>
    }
    <div className='controls'>
      <div className="empty"></div>
      <button className={`button  ${forward ? 'active' : 'deactive'}`} onClick={() => triggerEvent('forwardIn', { pressed: true })} >↑</button>
      <div className="empty"></div>

      <button className={`button  ${leftward ? 'active' : 'deactive'}`} onClick={() => triggerEvent('leftwardIn', { pressed: true })} >←</button>
      <button className={`button  ${jump ? 'active' : 'deactive'}`} onClick={() => triggerEvent('spaceIn', { pressed: true })} >⏺</button>
      <button className={`button  ${rightward ? 'active' : 'deactive'}`} onClick={() => triggerEvent('rightwardIn', { pressed: true })} >→</button>

      <div className="empty"></div>
      <button className={`button  ${backward ? 'active' : 'deactive'}`} onClick={() => triggerEvent('backwardIn', { pressed: true })} >↓</button>
      <div className="empty"></div>

    </div>
  </div>;
};

export default Interface;
