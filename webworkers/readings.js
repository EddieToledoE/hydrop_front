import axios from "axios";

self.onmessage = async (e) => {
  const { readings } = e.data; // Recibimos el objeto readings desde el hilo principal
  console.log("Readings recibidos en el worker", readings);
  try {
    // Enviar los readings al backend inmediatamente cuando el worker reciba el mensaje
    const response = await axios.post("/api/auth/readings", { readings });
    self.postMessage({ success: true, data: response.data }); // Mandamos respuesta al hilo principal
    console.log("Readings enviados al backend correctamente");
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};
