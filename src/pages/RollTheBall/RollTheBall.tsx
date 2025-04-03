
import { Canvas } from '@react-three/fiber'
import RollTheBallExperience from '../../components/RollTheBallExperience/RollTheBallExperience'
import './RollTheBall.css'
const RollTheBall = () => {
    return (
        <>
            <Canvas>
                <RollTheBallExperience />
            </Canvas>
        </>
    )
}

export default RollTheBall
