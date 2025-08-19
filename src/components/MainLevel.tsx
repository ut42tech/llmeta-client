import { BvhPhysicsBody, PrototypeBox } from "@react-three/viverse";

export const MainLevel = () => {
  return (
    <>
      <BvhPhysicsBody>
        <PrototypeBox
          color="#ffffff"
          scale={[10, 0.5, 10]}
          position={[0, -2, 0]}
        />

        {/* Platforms */}
        <PrototypeBox color="#cccccc" scale={[2, 1, 3]} position={[4, 0, 0]} />
        <PrototypeBox
          color="#ffccff"
          scale={[3, 1, 3]}
          position={[3, 1.5, -1]}
        />
        <PrototypeBox
          color="#ccffff"
          scale={[2, 0.5, 3]}
          position={[2, 2.5, -3]}
        />
        <PrototypeBox
          color="#ffccff"
          scale={[2, 1, 3]}
          position={[-3, 0, -2]}
        />
        <PrototypeBox color="#ccffff" scale={[1, 1, 4]} position={[0, -1, 0]} />
        <PrototypeBox
          color="#ffffcc"
          scale={[4, 1, 1]}
          position={[0, 3.5, 0]}
        />
      </BvhPhysicsBody>
    </>
  );
};
