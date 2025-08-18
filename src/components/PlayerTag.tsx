import { useFrame } from "@react-three/fiber";
import { Image, Root, Text } from "@react-three/uikit";
import { useViverseProfile } from "@react-three/viverse";
import { useRef } from "react";
import { Group } from "three";

export const PlayerTag = () => {
  const profile = useViverseProfile() ?? {
    name: "Anonymous",
    activeAvatar: { headIconUrl: "https://picsum.photos/200" },
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
    <group ref={ref} position-y={2.15}>
      <Root
        depthTest={false}
        renderOrder={1}
        backgroundOpacity={0.5}
        borderRadius={10}
        paddingX={2}
        height={20}
        backgroundColor="white"
        flexDirection="row"
        alignItems="center"
        gap={4}
      >
        <Image
          width={16}
          height={16}
          borderRadius={14}
          src={profile.activeAvatar?.headIconUrl}
        />
        <Text fontWeight="bold" fontSize={12} marginRight={3}>
          {profile.name}
        </Text>
      </Root>
    </group>
  );
};
