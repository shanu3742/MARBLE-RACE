import Level from '../Level/Level'
import Lights from '../Lights/Lights'
import { Physics } from '@react-three/rapier'
import './RollTheBallExperience.css'
import { Perf } from 'r3f-perf'
import Player from '../Player/Player'
import useGame from '../../store/useGame'
import Effect from '../../Effect/Effect'
const RollTheBallExperience = () => {
    const blockCount = useGame((state) => state.blockCount);
    return (
        <>
            {/* <Perf position='top-left' /> */}
            <color args={['#252731']} attach='background' />
            <Physics debug={false}>
                <Level level={blockCount} />
                <Lights />
                <Player />
            </Physics>
            <Effect />

        </>
    )
}

export default RollTheBallExperience
