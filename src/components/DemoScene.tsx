import { Sky } from "@react-three/drei";

export const DemoScene = () => {
  return (
    <>
      {/* Environment */}
      <Sky />

      {/* Basic lighting */}
      <directionalLight intensity={1.2} position={[5, 10, 10]} castShadow />
      <ambientLight intensity={1} />
    </>
  );
};
