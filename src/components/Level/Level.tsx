import { useGLTF, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three'
enum rotationDirEnum {
    clockwise = -1,
    antiClockwise = 1
}
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const stepOneMaterial = new THREE.MeshStandardMaterial({ color: "limegreen" })
const stepTwoMaterial = new THREE.MeshStandardMaterial({ color: "greenyellow" })
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "orangered" })
const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategrey" })

const BlockStart = ({ position = [0, 0, 0] }) => {
    return <group position={position}>
        <mesh geometry={boxGeometry} material={stepOneMaterial} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow>
        </mesh>
    </group>
}
const BlockEnd = ({ position = [0, 0, 0] }) => {
    const dragon = useGLTF('./gltf/dragon.glb');
    const dragonTexture = useTexture('./textures/dragon.png');

    let dragonGeo = useMemo(() => {
        let geometry;
        if (dragon.scene) {
            dragon.scene.traverse((child) => {
                if (child.isMesh) {
                    geometry = child.geometry
                }
            })
        }
        return geometry
    }, [])

    return <group position={position}>
        <mesh geometry={boxGeometry} material={stepOneMaterial} position={[0, 0, 0]} scale={[4, 0.2, 4]} receiveShadow>
        </mesh>

        <group position-y={0.56}>
            <RigidBody type='fixed'>
                {/* <primitive object={dragon.scene} scale={2} /> */}
                <mesh geometry={dragonGeo} >
                    <meshBasicMaterial map={dragonTexture} />
                </mesh>
            </RigidBody>
        </group>

    </group>
}
const BlockSpinner = ({ position = [0, 0, 0], rotationSpeed = 1, rotationDirection = rotationDirEnum.clockwise }) => {

    const obstacle = useRef();
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const rotation = new THREE.Quaternion();
        rotation.setFromEuler(new THREE.Euler(0, time * rotationSpeed * rotationDirection, 0))
        obstacle.current.setNextKinematicRotation(rotation)
    })
    return <group position={position}>
        <mesh geometry={boxGeometry} material={stepTwoMaterial} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
        <RigidBody ref={obstacle} type='kinematicPosition' position={[0, 0.3, 0]} restitution={0.2} friction={0}>
            <mesh geometry={boxGeometry} material={obstacleMaterial} scale={[3.5, 0.3, 0.3]} castShadow receiveShadow />
        </RigidBody>

    </group>
}


const BlockLimbo = ({ position = [0, 0, 0] }) => {
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2)
    const obstacle = useRef();
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const y = Math.sin(time + timeOffset) + 1.15;
        obstacle.current.setNextKinematicTranslation({ x: position[0], y: position[1] + y, z: position[2] })
    })
    return <group position={position}>
        <mesh geometry={boxGeometry} material={stepTwoMaterial} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
        <RigidBody ref={obstacle} type='kinematicPosition' position={[0, 0.3, 0]} restitution={0.2} friction={0}>
            <mesh geometry={boxGeometry} material={obstacleMaterial} scale={[3.5, 0.3, 0.3]} castShadow receiveShadow />
        </RigidBody>

    </group>
}

const BlockAxe = ({ position = [0, 0, 0] }) => {
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2)
    const obstacle = useRef();
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const x = Math.sin(time + timeOffset) * 1.25;
        obstacle.current.setNextKinematicTranslation({ x: position[0] + x, y: position[1] + 0.75, z: position[2] })
    })
    return <group position={position}>
        <mesh geometry={boxGeometry} material={stepTwoMaterial} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
        <RigidBody ref={obstacle} type='kinematicPosition' position={[0, 0.3, 0]} restitution={0.2} friction={0}>
            <mesh geometry={boxGeometry} material={obstacleMaterial} scale={[1.5, 1.5, 0.3]} castShadow receiveShadow />
        </RigidBody>

    </group>
}



const Level = () => {
    return <>

        <BlockStart position={[0, 0, 16]} />
        <BlockSpinner position={[0, 0, 12]} />
        <BlockLimbo position={[0, 0, 8]} />
        <BlockAxe position={[0, 0, 4]} />
        <BlockEnd position={[0, 0, 0]} />
    </>
}

export default Level
