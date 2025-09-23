import { useFrame } from "@react-three/fiber";
import { Root, Text } from "@react-three/uikit";
import { useRef } from "react";
import { Group } from "three";

type PlayerTagProps = {
  name: string;
};

export const PlayerTag = (props: PlayerTagProps) => {
  const profile = {
    name: props.name,
  };

  const ref = useRef<Group>(null);

  // Make the tag always face the camera
  useFrame((state) => {
    if (ref.current == null) {
      return;
    }
    ref.current.quaternion.copy(state.camera.quaternion);
  });

  return (
    <group ref={ref} position-y={0.5}>
      <Root
        depthTest={false}
        renderOrder={1}
        backgroundOpacity={0.5}
        borderRadius={10}
        paddingX={4}
        height={20}
        backgroundColor="white"
        flexDirection="row"
        alignItems="center"
        gap={4}
      >
        <Text
          key={profile.name}
          fontFamily="notoSans"
          fontWeight="bold"
          fontSize={8}
        >
          {profile.name}
        </Text>
      </Root>
    </group>
  );
};
