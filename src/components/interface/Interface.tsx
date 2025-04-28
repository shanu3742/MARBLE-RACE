
import { addEffect } from '@react-three/fiber';
import useGame from '../../store/useGame';
import './Interface.css'
import { useKeyboardControls } from '@react-three/drei'
import { useEffect, useRef } from 'react';
import useInterfaceEvent from '../../store/useInterfaceEvent';
import { IonButton, IonIcon, isPlatform } from '@ionic/react';
import { arrowDown } from 'ionicons/icons';

const Interface = () => {
  const time = useRef<HTMLDivElement | null>(null);
  const restart = useGame((state) => state.restart)
  const updateLevel = useGame((state) => state.updateLevel)
  const phase = useGame((state) => state.phase)
  const forward = useKeyboardControls((state) => state.forward);
  const backward = useKeyboardControls((state) => state.backward);
  const leftward = useKeyboardControls((state) => state.leftward);
  const rightward = useKeyboardControls((state) => state.rightward);
  const jump = useKeyboardControls((state) => state.jump);
  const playerLavel = useGame((state) => state.playerLavel);


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
      elapsedTime = elapsedTime.toFixed(2) as any;

      if (time.current) {
        if ((time.current.textContent as any) !== (elapsedTime as any)) {
          time.current.textContent = elapsedTime as any
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
    triggerEvent(null!)
  }

  const OnRestart = () => {
    restart()
    updateLevel()
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/download/app-release.apk';
    link.download = 'marbleRace.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return <div className="interface">
    {
      !isPlatform('capacitor') && <div className='download-button'>
        <IonButton size="small" shape="round" color="medium" onClick={handleDownload}>
          <IonIcon slot="icon-only" icon={arrowDown}></IonIcon>
        </IonButton>
      </div>
    }
    <div className='player-level' style={{ color: 'yellow' }}>Player Level:<span style={{ color: 'red' }}>{playerLavel + 1}</span></div>
    <div className="time" ref={time}>0.0</div>
    {
      phase === 'ended' && <div className="restart" onClick={OnRestart}>Restart</div>
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
