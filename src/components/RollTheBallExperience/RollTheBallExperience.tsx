import Level from '../Level/Level'
import Lights from '../Lights/Lights'
import { OrbitControls } from "@react-three/drei"
import { Physics } from '@react-three/rapier'
import './RollTheBallExperience.css'
import { Perf } from 'r3f-perf'
import Player from '../Player/Player'
const RollTheBallExperience = () => {
    return (
        <>
            <Perf position='top-left' />
            <OrbitControls />
            <Physics debug>
                <Level />
                <Lights />
                <Player />
            </Physics>

        </>
    )
}

export default RollTheBallExperience
