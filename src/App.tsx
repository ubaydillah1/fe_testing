/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Update interface to only include action and timestamp
interface DbChangeEvent {
  action: "INSERT" | "UPDATE" | "DELETE";
  timestamp: string;
}

const socket: Socket = io("http://localhost:4000");

function App() {
  const [notif, setNotif] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const handleDbChange = (data: DbChangeEvent) => {
      console.log("✅ Received database change event:", data);

      let message = "";

      // Generate message based on action
      switch (data.action) {
        case "INSERT":
          message = `Data baru ditambahkan.`;
          break;
        case "UPDATE":
          message = `Data diperbarui.`;
          break;
        case "DELETE":
          message = `Data dihapus.`;
          break;
      }

      setNotif(message);

      // If needed, refetch data or take other actions here
      console.log("🔄 Data needs to be refetched"); // Placeholder for refetch logic
    };

    // Handle connection and disconnection events
    const onConnect = () => {
      console.log("✅ Connected to WebSocket server");
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log("❌ Disconnected from WebSocket server");
      setIsConnected(false);
    };

    // Register event listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("db_change", handleDbChange);

    // Set initial connection state
    setIsConnected(socket.connected);

    // Cleanup event listeners on unmount
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("db_change", handleDbChange);
    };
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    // Koneksi WebSocket
    const socket = io("http://localhost:4000");

    // Cleanup saat komponen tidak lagi digunakan
    return () => {
      socket.disconnect(); // Disconnect WebSocket saat komponen dibersihkan
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">React WebSocket Client</h1>

      <div className="mb-4">
        <span
          className={`inline-block w-3 h-3 rounded-full mr-2 ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span>
          {isConnected ? "Connected to server" : "Disconnected from server"}
        </span>
      </div>

      {notif && (
        <div className="p-4 bg-blue-100 border border-blue-300 rounded mb-4">
          <p>{notif}</p>
        </div>
      )}
    </div>
  );
}

export default App;
