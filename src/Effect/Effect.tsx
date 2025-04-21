import { EffectComposer, Vignette } from "@react-three/postprocessing"

const Effect = () => {
    return (
        <EffectComposer>
            <Vignette eskil={false} offset={0.1} darkness={0.8} />
        </EffectComposer>
    )
}

export default Effect
