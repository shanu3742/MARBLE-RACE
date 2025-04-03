import Level from '../Level/Level'
import Lights from '../Lights/Lights'
import { OrbitControls } from "@react-three/drei"
import { Physics } from '@react-three/rapier'
import './RollTheBallExperience.css'

const RollTheBallExperience = () => {
    return (
        <>
            <OrbitControls />
            <Physics debug>
                <Level />
                <Lights />
            </Physics>

        </>
    )
}

export default RollTheBallExperience
