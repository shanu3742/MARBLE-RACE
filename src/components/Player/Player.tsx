import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from 'three'
import useGame from "../../store/useGame";
import useInterfaceEvent from "../../store/useInterfaceEvent";


const Player = () => {
    const [hitSound] = useState(() => {
        return new Audio('./audio/ball-bounce.mp3')
    })
    const start = useGame((state) => state.start);
    const end = useGame((state) => state.end);
    const restart = useGame((state) => state.restart);
    const blockCount = useGame((state) => state.blockCount);


    const [smoothCameraPosition] = useState(() => new THREE.Vector3());
    const [smoothCameraTarget] = useState(() => new THREE.Vector3());
    const body = useRef();
    const { rapier, world } = useRapier();
    const [subscribeKeys, getKeys] = useKeyboardControls()
    useFrame((state, delta) => {
        // controll flow
        const { forward, backward, leftward, rightward } = getKeys();
        const userPressedEvent = useInterfaceEvent.getState();
        const eventType = userPressedEvent.event?.type;
        const impulse = { x: 0, y: 0, z: 0 };
        const torque = { x: 0, y: 0, z: 0 };

        const impulseStrength = 0.6 * delta;
        const torqueStrength = 0.2 * delta;
        if (forward || eventType === 'forwardIn') {
            impulse.z -= impulseStrength;
            torque.x -= torqueStrength;
        }
        if (rightward || eventType === 'rightwardIn') {
            impulse.x += impulseStrength;
            torque.z -= torqueStrength;
        }
        if (backward || eventType === 'backwardIn') {
            impulse.z += impulseStrength;
            torque.x += torqueStrength;
        }

        if (leftward || eventType === 'leftwardIn') {
            impulse.x -= impulseStrength;
            torque.z += torqueStrength;
        }
        if (eventType === 'spaceIn') {
            jump();
        }

        body.current.applyImpulse(impulse);
        body.current.applyTorqueImpulse(torque);

        /**
         * camera
         */

        const bodyPosition = body.current.translation();



        const cameraPosition = new THREE.Vector3();
        cameraPosition.copy(bodyPosition);
        cameraPosition.z += 2.25;
        cameraPosition.y += 0.65;

        const cameraTarget = new THREE.Vector3();
        cameraTarget.copy(bodyPosition)
        cameraTarget.y += 0.25;

        // lerping 
        //on each frame , the camera will get slightly closer to wher it's supposed to be and  it'll keep doing that

        smoothCameraPosition.lerp(cameraPosition, 5 * delta);
        smoothCameraTarget.lerp(cameraPosition, 5 * delta);
        state.camera.position.copy(smoothCameraPosition);
        // console.log('lookAt', state.camera.lookAt)
        state.camera.lookAt(smoothCameraTarget)

        /**
         * phase
         */

        if (bodyPosition.z < -(blockCount * 4 + 2)) {
            end()
        }

        if (bodyPosition.y < -4) {
            restart()
        }


    })

    const jump = () => {

        const origin = body.current.translation();
        origin.y -= 0.31;
        const direction = { x: 0, y: -1, z: 0 }
        const ray = new rapier.Ray(origin, direction)
        const hit = world.castRay(ray, 10, true);
        if (hit.timeOfImpact < 0.15) {
            body.current.applyImpulse({ x: 0, y: 0.5, z: 0 })
        }


    }

    const reset = () => {
        body.current.setTranslation({ x: 0, y: 1, z: 0 })
        body.current.setLinvel({ x: 0, y: 0, z: 0 })
        body.current.setAngvel({ x: 0, y: 0, z: 0 })
    }

    useEffect(() => {
        const unsubscribeReset = useGame.subscribe(
            (state) => state.phase,
            (phase) => {
                if (phase === 'ready') {
                    reset()
                }

            }
        )
        const unSubscribeJump = subscribeKeys(
            (state) => {
                return state.jump;
            },
            (value) => {
                if (value) {
                    jump()
                }
            }
        )

        const unsubscribeAny = subscribeKeys(() => {
            start()
        })
        return () => {
            unSubscribeJump()
            unsubscribeAny()
            unsubscribeReset()
        }
    }, [])
    const playSound = () => {
        hitSound.currentTime = 0;
        hitSound.volume = Math.random();
        hitSound.play()
    }
    return (
        <RigidBody ref={body} colliders="ball" position={[0, 1, 0]} restitution={0.2} friction={1} onCollisionEnter={playSound}>
            <mesh castShadow>
                <icosahedronGeometry args={[0.3, 1]} />
                <meshStandardMaterial flatShading color="mediumpurple" />
            </mesh>
        </RigidBody>
    );
}


export default Player