import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { io } from "socket.io-client";

export const socket = io("http://localhost:3001");
export const charactersAtom = atom([]);
export const mapAtom = atom(null);
export const userAtom = atom(null);

export const SocketManager = () => {
  const [_characters, setCharacters] = useAtom(charactersAtom);
  const [_map, setMap] = useAtom(mapAtom);
  const [_user, setUser] = useAtom(userAtom);

  useEffect(() => {
    function onConnect() {
      console.log("connected");
    }
    function onDisconnect() {
      console.log("disconnected");
    }

    function onHello(value: any) {
      setMap(value.map);
      setUser(value.id);
      // value.characters があればそれを、なければ value を fallback
      setCharacters((value as any).characters ?? value);
    }

    function onCharacters(value: any) {
      setCharacters(value);
    }

    function onPlayerMove(value: any) {
      setCharacters((prev: any) => {
        return prev.map((character: any) => {
          if (character.id === value.id) {
            return value;
          }
          return character;
        });
      });
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("hello", onHello);
    socket.on("characters", onCharacters);
    socket.on("playerMove", onPlayerMove);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("hello", onHello);
      socket.off("characters", onCharacters);
      socket.off("playerMove", onPlayerMove);
    };
  }, []);
};
