import { useState, useEffect } from "react";
import { Client } from "colyseus.js";

const useColyseusClient = () => {
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const newClient = new Client(
      process.env.NEXT_PUBLIC_SERVER_ENDPOINT || "http://localhost:2567"
    );
    setClient(newClient);
  }, []);

  return client;
};

export { useColyseusClient };
