import { useGLTF, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
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

export const BlockStart = ({ position = [0, 0, 0] }) => {
    return (
        <group position={position}>
            <mesh geometry={boxGeometry} material={stepOneMaterial} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
        </group>
    )
}
export const BlockEnd = ({ position = [0, 0, 0] }) => {
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

    return (
        <group position={position}>
            <mesh geometry={boxGeometry} material={stepOneMaterial} position={[0, 0, 0]} scale={[4, 0.2, 4]} receiveShadow />
            <group position-y={0.56}>
                <RigidBody type='fixed' colliders="hull" restitution={0.2} friction={0}>
                    {/* <primitive object={dragon.scene} scale={2} /> */}
                    <mesh geometry={dragonGeo} receiveShadow castShadow >
                        <meshBasicMaterial map={dragonTexture} />
                    </mesh>
                </RigidBody>
            </group>

        </group>
    )
}
export const BlockSpinner = ({ position = [0, 0, 0], rotationSpeed, rotationDirection }) => {
    if (!rotationDirection) {
        rotationDirection = (Math.random() - 0.5) < 0 ? rotationDirEnum.antiClockwise : rotationDirEnum.clockwise
    }
    if (!rotationSpeed) {
        rotationSpeed = 1 + Math.random() * 0.5
    }
    const obstacle = useRef();
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const rotation = new THREE.Quaternion();
        rotation.setFromEuler(new THREE.Euler(0, time * rotationSpeed * rotationDirection, 0))
        obstacle.current.setNextKinematicRotation(rotation)
    })
    return (
        <group position={position}>
            <mesh geometry={boxGeometry} material={stepTwoMaterial} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
            <RigidBody
                ref={obstacle}
                type='kinematicPosition'
                position={[0, 0.3, 0]}
                restitution={0.2}
                friction={1}
                linearDamping={0.5}
                angularDamping={0.5}
            >
                <mesh geometry={boxGeometry} material={obstacleMaterial} scale={[3.5, 0.3, 0.3]} castShadow receiveShadow />
            </RigidBody>

        </group>
    )
}


export const BlockLimbo = ({ position = [0, 0, 0] }) => {
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2)
    const obstacle = useRef();
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const y = Math.sin(time + timeOffset) + 1.15;
        obstacle.current.setNextKinematicTranslation({ x: position[0], y: position[1] + y, z: position[2] })
    })
    return (
        <group position={position}>
            <mesh geometry={boxGeometry} material={stepTwoMaterial} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
            <RigidBody ref={obstacle} type='kinematicPosition' position={[0, 0.3, 0]} restitution={0.2} friction={0}>
                <mesh geometry={boxGeometry} material={obstacleMaterial} scale={[3.5, 0.3, 0.3]} castShadow receiveShadow />
            </RigidBody>

        </group>
    )
}

export const BlockAxe = ({ position = [0, 0, 0] }) => {
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2)
    const obstacle = useRef();
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const x = Math.sin(time + timeOffset) * 1.25;
        obstacle.current.setNextKinematicTranslation({ x: position[0] + x, y: position[1] + 0.75, z: position[2] })
    })
    return (
        <group position={position}>
            <mesh geometry={boxGeometry} material={stepTwoMaterial} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
            <RigidBody ref={obstacle} type='kinematicPosition' position={[0, 0.3, 0]} restitution={0.2} friction={0}>
                <mesh geometry={boxGeometry} material={obstacleMaterial} scale={[1.5, 1.5, 0.3]} castShadow receiveShadow />
            </RigidBody>

        </group>
    )
}


const Bounds = ({ length = 1 }) => {
    return (
        <RigidBody type='fixed' restitution={0.2} friction={0}>
            <mesh
                position={[2.15, 0.75, -(length * 2) + 2]}
                geometry={boxGeometry}
                material={wallMaterial}
                scale={[0.3, 1.5, 4 * length]}
                castShadow />

            <mesh
                position={[-2.15, 0.75, -(length * 2) + 2]}
                geometry={boxGeometry}
                material={wallMaterial}
                scale={[0.3, 1.5, 4 * length]}
                receiveShadow />
            <mesh
                position={[0, 0.75, -(length * 4) + 2]}
                geometry={boxGeometry}
                material={wallMaterial}
                scale={[4, 1.5, 0.3]}
                receiveShadow />

            <CuboidCollider args={[2, 0.1, 2 * length]} position={[0, -0.1, -(length * 2) + 2]} restitution={0.2} friction={1} />
        </RigidBody>
    );
}
const Level = ({ level = 5, types = [BlockSpinner, BlockLimbo, BlockAxe] }) => {
    const blocks = useMemo(() => {
        const blockList = [];
        for (let i = 0; i < level; i++) {
            let selectedBlock = Math.floor(Math.random() * types.length);
            const type = types[selectedBlock];
            blockList.push(type)
        }
        return blockList
    }, [level, types])

    return (
        <>

            <BlockStart position={[0, 0, 0]} />
            {
                blocks.map((Block, BlockIndex) => {
                    return <Block key={BlockIndex} position={[0, 0, -(BlockIndex + 1) * 4]} />
                })
            }

            <BlockEnd position={[0, 0, -(level + 1) * 4]} />
            <Bounds length={level + 2} />
        </>
    )
}

export default Level
