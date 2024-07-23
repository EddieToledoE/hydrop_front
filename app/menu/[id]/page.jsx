"use client";
import Header from "@/components/Header";
import estios from "@/styles/menu-id.css";
import { usePathname } from "next/navigation";
import Bar from "@/components/Bar-1";
import { closeBar, openBar } from "@/store/barSlice";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import Axios from "axios";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import LineChart from "@/components/graficas";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { set } from "mongoose";

const apiKey = "002501a48460cb00c15f9e2bcf247347";

// Mapeo de títulos en español a nombres de sensores en inglés
const sensorMapping = {
  "Temperatura": "temperature",
  "Humedad": "humidity",
  "pH": "ph",
  "Conductividad": "ec",
  "T. Agua": "water_temp",
  "Nivel Agua": "water_level"
};

function MetricCard({ value, level, optimalRange }) {
  const levelColors = {
    low: "red",
    normal: "green",
    high: "red",
  };

  const valueColorClass =
    level === "low" || level === "normal" || level === "high" ? "white" : "";

  return (
    <div className="metric-card-container">
      <div className={`metric-card ${levelColors[level]}`}>
        <div className={`metric-value ${valueColorClass}`}>{value}</div>
        <div className="optimal-range">
          Óptimo: {optimalRange ? `${optimalRange.min} - ${optimalRange.max}` : 'N/A'}
        </div>
      </div>
    </div>
  );
}

function Recommendations({ sensorData, plantGroup }) {
  const getRecommendationMessage = (sensor, level) => {
    const messages = {
      "temperature": {
        "low": "La temperatura es muy baja. Considera incrementar la temperatura moviendo el sistema a un lugar más cálido o usando lámparas adicionales.",
        "high": "La temperatura es muy alta. Considera disminuir la temperatura moviendo el sistema a un lugar más fresco, aumentando la ventilación o colocando recipientes con agua fría cerca.",
        "normal": "La temperatura está en un nivel óptimo."
      },
      "humidity": {
        "low": "La humedad es muy baja. Considera incrementar la humedad colocando bandejas con agua cerca del sistema o agrupando más plantas juntas.",
        "high": "La humedad es muy alta. Considera disminuir la humedad mejorando la ventilación o abriendo ventanas cercanas para permitir el flujo de aire.",
        "normal": "La humedad está en un nivel óptimo."
      },
      "ph": {
        "low": "El pH es muy bajo. Considera incrementar el pH añadiendo una solución de pH Up, como bicarbonato de sodio diluido.",
        "high": "El pH es muy alto. Considera disminuir el pH añadiendo una solución de pH Down, como vinagre diluido en agua.",
        "normal": "El pH está en un nivel óptimo."
      },
      "ec": {
        "low": "La conductividad es muy baja. Considera incrementar la conductividad añadiendo más solución nutritiva concentrada.",
        "high": "La conductividad es muy alta. Considera disminuir la conductividad diluyendo la solución con agua destilada o filtrada.",
        "normal": "La conductividad está en un nivel óptimo."
      },
      "water_temp": {
        "low": "La temperatura del agua es muy baja. Considera incrementar la temperatura usando agua tibia al rellenar el tanque.",
        "high": "La temperatura del agua es muy alta. Considera disminuir la temperatura añadiendo cubos de hielo al tanque o colocando el tanque en un lugar más fresco.",
        "normal": "La temperatura del agua está en un nivel óptimo."
      },
      "water_level": {
        "low": "El nivel de agua es muy bajo. Considera incrementar el nivel de agua añadiendo más agua al sistema.",
        "high": "El nivel de agua es muy alto. Considera disminuir el nivel de agua drenando el exceso.",
        "normal": "El nivel de agua está en un nivel óptimo."
      }
    };

    return messages[sensor][level];
  };

  const recommendations = [];

  const checkLevel = (sensorType, value, optimalRange) => {
    if (!optimalRange) return null;
    if (value < optimalRange.min) return "low";
    if (value > optimalRange.max) return "high";
    return "normal";
  };

  for (const sensor in sensorData) {
    if (sensorData[sensor].length > 0) {
      const latestValue = sensorData[sensor][sensorData[sensor].length - 1];
      let level = "normal";
      let optimalRange = null;

      switch (sensor) {
        case "temperature":
          optimalRange = plantGroup?.optimal_temp;
          level = checkLevel(sensor, latestValue, optimalRange);
          break;
        case "humidity":
          optimalRange = plantGroup?.optimal_humidity;
          level = checkLevel(sensor, latestValue, optimalRange);
          break;
        case "ph":
          optimalRange = plantGroup?.optimal_ph;
          level = checkLevel(sensor, latestValue, optimalRange);
          break;
        case "ec":
          optimalRange = plantGroup?.optimal_ec;
          level = checkLevel(sensor, latestValue, optimalRange);
          break;
        case "water_temp":
          optimalRange = { min: 20, max: 35 };
          level = checkLevel(sensor, latestValue, optimalRange);
          break;
        case "water_level":
          optimalRange = { min: 550, max: 999 };
          level = checkLevel(sensor, latestValue, optimalRange);
          break;
        default:
          break;
      }

      if (level === "low" || level === "high") {
        recommendations.push(getRecommendationMessage(sensor, level));
      }
    }
  }

  return (
    <div className="recommendations-container">
      <h3>Recomendaciones</h3>
      {recommendations.length > 0 ? (
        <ul>
          {recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      ) : (
        <p>Todos los niveles están dentro del rango óptimo.</p>
      )}
    </div>
  );
}

export default function Home() {
  const isBarOpen = useSelector((state) => state.bar.isBarOpen);
  const { data: session } = useSession();
  const [userId, setUserId] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const idDinamico = usePathname();
  const arreglo = idDinamico.split("/");
  const stationId = arreglo[arreglo.length - 1];

  useEffect(() => {
    setUserId(session?.user.id);
    console.log("ID de usuario:", userId);
  }, [session]);

  const [city, setCity] = useState("");
  const [sensorData, setSensorData] = useState({
    humidity: [],
    temperature: [],
    water_level: [],
    ph: [],
    ec: [],
    water_temp: [],
  });
  const [pumpStatus, setPumpStatus] = useState("off");
  const [nutrientDispenserStatus, setNutrientDispenserStatus] = useState("off");
  const [stationName, setStationName] = useState("");
  const [plantGroup, setPlantGroup] = useState(null);
  const [modalData, setModalData] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (stationId) {
      Axios.get(`/api/auth/station-plant-group/${stationId}`)
        .then((response) => {
          setCity(response.data.city);
          setStationName(response.data.name);
          if (response.data.plants.length > 0) {
            const firstPlantGroup = response.data.plants[0].plant_id.group_id;
            setPlantGroup(firstPlantGroup);
          }
        })
        .catch((error) => {
          console.error("Error al obtener datos de la estación:", error);
        });
    }
  }, [stationId]);

  useEffect(() => {
    if (stationId) {
      Axios.get(`http://localhost:3000/api/auth/plants?systemId=${stationId}`)
        .then((response) => {
          const groupId = response.data[0].plant_id.group_id;
          setPlantGroup((prevGroup) => ({
            ...prevGroup,
            group_id: groupId,
          }));

          return Axios.get(`http://localhost:3000/api/auth/plantgroup/${groupId}`);
        })
        .then((response) => {
          setPlantGroup((prevGroup) => ({
            ...prevGroup,
            optimal_temp: response.data.optimal_temp,
            optimal_humidity: response.data.optimal_humidity,
            optimal_ph: response.data.optimal_ph,
            optimal_ec: response.data.optimal_ec,
            name: response.data.name,
          }));
        })
        .catch((error) => {
          console.error("Error al obtener group_id o los datos del grupo de plantas:", error);
        });
    }
  }, [stationId]);

  useEffect(() => {
    const socket = io("http://localhost:8080");

    socket.emit("join_station", stationId); // Unirse a la sala de la estación

    socket.on("sensor_data", (data) => {
      console.log("Datos del sensor recibidos:", data);
      setSensorData((prevData) => ({
        ...prevData,
        humidity: [...prevData.humidity, data.humidity],
        temperature: [...prevData.temperature, data.temperature],
        water_level: [...prevData.water_level, data.water_level],
        ph: [...prevData.ph, data.ph],
        ec: [...prevData.ec, data.ec],
        water_temp: [...prevData.water_temp, data.water_temp],
      }));
    });

    socket.on("pump_status", (data) => {
      console.log("Estado de la bomba recibido:", data);
      setPumpStatus(data.pump_status);
    });

    socket.on("nutrient_dispenser_status", (data) => {
      console.log("Estado del dispensador de nutrientes recibido:", data);
      setNutrientDispenserStatus(data.nutrient_dispenser_status);
    });

    // Mantén el socket como estado para usarlo en otras funciones
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, [stationId]);

  const sendPumpCommand = (status) => {
    if (socket) {
      console.log(`Enviando comando de bomba: ${status}`);
      socket.emit('pump_command', { pump_status: status });
    } else {
      console.error("Socket no conectado");
    }
  };

  const sendNutrientDispenserCommand = (status) => {
    if (socket) {
      console.log(`Enviando comando de dispensador de nutrientes: ${status}`);
      socket.emit('nutrient_dispenser_command', { nutrient_dispenser_status: status });
    } else {
      console.error("Socket no conectado");
    }
  };

  const getLevel = (sensorType, value) => {
    if (!plantGroup) return "normal";

    let optimalRange;
    switch (sensorType) {
      case "temperature":
      case "temp":
        optimalRange = plantGroup.optimal_temp;
        break;
      case "humidity":
        optimalRange = plantGroup.optimal_humidity;
        break;
      case "ph":
        optimalRange = plantGroup.optimal_ph;
        break;
      case "ec":
        optimalRange = plantGroup.optimal_ec;
        break;
      case "water_temp":
        optimalRange = { min: 20, max: 35  };
        break;
      case "water_level":
        optimalRange = { min: 550, max: 999 };
        break;
      default:
        return "normal";
    }

    if (!optimalRange) return "normal";

    if (value < optimalRange.min) return "low";
    if (value > optimalRange.max) return "high";
    return "normal";
  };

  const handleDivClick = () => {
    const windowWidth = window.innerWidth;
    if (isBarOpen && windowWidth <= 800) {
      console.log("Div clickeado");
      dispatch(closeBar());
    }
  };

  const handleOpen = (sensorType, title) => {
    const sensorKey = sensorMapping[title];
    setModalTitle(title);
    setOpen(true);
    setModalData(sensorData[sensorKey] || []);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (open && modalTitle) {
      const sensorKey = sensorMapping[modalTitle];
      console.log(`Abriendo modal para: ${sensorKey}, datos:`, sensorData[sensorKey]);
      setModalData(sensorData[sensorKey] || []);
    }
  }, [sensorData, open, modalTitle]);

  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (city) {
      const fetchWeatherData = async () => {
        try {
          const response = await Axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
          );
          const hourlyForecast = response.data.list.slice(0, 4);
          setWeatherData(hourlyForecast);
        } catch (error) {
          setError("Error al obtener datos del clima");
          console.error("Error al obtener datos del clima:", error);
        }
      };
      fetchWeatherData();
    }
  }, [city]);

  const mainContentClass = isBarOpen ? "main-content-active" : "main-content";
  const weatherInfoClass = isBarOpen ? "weather-info-active" : "weather-info";
  const tableClass = isBarOpen ? "table-active" : "table";

  return (
    <section className="section">
      <div className="sidebar">
        <Bar />
      </div>
      <div className={mainContentClass} onClick={handleDivClick}>
        <Header />
        <div className={weatherInfoClass}>
          <div className="card">
            <div className="card-title">
              <a className="title">Clima en {city}</a>
            </div>
            <div className="card-content">
              <div className="weather-container">
                {error && <p>{error}</p>}
                {weatherData.length > 0 && (
                  <div className="weather-forecast">
                    {weatherData.map((forecast, index) => (
                      <div key={index} className="weather-item">
                        <p className="weather-time">
                          Hora: {new Date(forecast.dt_txt).toLocaleTimeString()}
                        </p>
                        <p className="weather-temp">
                          Temp: {forecast.main.temp}°C
                        </p>
                        <p className="weather-desc">
                          Condición: {forecast.weather[0].description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="actuators-container">
          <div className="inventory-card">
            <div className="card-title">
              <a className="title">
                Estado de: {stationName ? stationName : "Tu estación"}
              </a>
            </div>
            <div className="card-content">
              <div className="actuator-row">
                <button

                  className={`status-button ${pumpStatus === "on" ? "on" : "off"}`}
                >
                  Bomba de agua <br />
                  {pumpStatus === "on" ? "Encendido" : "Apagado"}
                </button>
                <div className="vertical-divider"></div>
                <button
                  className={`status-button ${nutrientDispenserStatus === "on" ? "on" : "off"}`}
                >
                   Dispensador de nutrientes <br />
                  {nutrientDispenserStatus === "on" ? "Encendido" : "Apagado"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="actuators-container">
          <div className="inventory-card">
            <div className="card-title">
              <a className="title">Bomba de Agua:</a>
              <Button onClick={() => sendPumpCommand('on')}>Encender Bomba</Button>
              <Button onClick={() => sendPumpCommand('off')}>Apagar Bomba</Button>
            </div>
          </div>
          <div className="inventory-card">
            <div className="card-title">
              <a className="title">Dispensador de Nutrientes:</a>
              <Button onClick={() => sendNutrientDispenserCommand('on')}>Encender Dispensador</Button>
              <Button onClick={() => sendNutrientDispenserCommand('off')}>Apagar Dispensador</Button>
            </div>
          </div>
        </div>
        <div className={tableClass}>
          <div className="inventory-card">
            <div className="card-title">
              <a className="title">Temperatura:</a>
              <Button onClick={() => handleOpen("temperature", "Temperatura")}>
                Ver Gráfica
              </Button>
            </div>
            <div className="card-content">
              <MetricCard
                value={sensorData.temperature[sensorData.temperature.length - 1]}
                level={getLevel("temperature", sensorData.temperature[sensorData.temperature.length - 1])}
                optimalRange={plantGroup?.optimal_temp}
              />
            </div>
          </div>
          <div className="inventory-card">
            <div className="card-title">
              <a className="title">Humedad:</a>
              <Button onClick={() => handleOpen("humidity", "Humedad")}>
                Ver Gráfica
              </Button>
            </div>
            <div className="card-content">
              <MetricCard
                value={sensorData.humidity[sensorData.humidity.length - 1]}
                level={getLevel("humidity", sensorData.humidity[sensorData.humidity.length - 1])}
                optimalRange={plantGroup?.optimal_humidity}
              />
            </div>
          </div>
          <div className="inventory-card">
            <div className="card-title">
              <a className="title">pH:</a>
              <Button onClick={() => handleOpen("ph", "pH")}>
                Ver Gráfica
              </Button>
            </div>
            <div className="card-content">
              <MetricCard
                value={sensorData.ph[sensorData.ph.length - 1]}
                level={getLevel("ph", sensorData.ph[sensorData.ph.length - 1])}
                optimalRange={plantGroup?.optimal_ph}
              />
            </div>
          </div>
          <div className="inventory-card">
            <div className="card-title">
              <a className="title">Conductividad:</a>
              <Button onClick={() => handleOpen("ec", "Conductividad")}>
                Ver Gráfica
              </Button>
            </div>
            <div className="card-content">
              <MetricCard
                value={sensorData.ec[sensorData.ec.length - 1]}
                level={getLevel("ec", sensorData.ec[sensorData.ec.length - 1])}
                optimalRange={plantGroup?.optimal_ec}
              />
            </div>
          </div>
          <div className="inventory-card">
            <div className="card-title">
              <a className="title">T. Agua:</a>
              <Button onClick={() => handleOpen("water_temp", "T. Agua")}>
                Ver Gráfica
              </Button>
            </div>
            <div className="card-content">
              <MetricCard
                value={sensorData.water_temp[sensorData.water_temp.length - 1]}
                level={getLevel("water_temp", sensorData.water_temp[sensorData.water_temp.length - 1])}
                optimalRange={{ min: 20, max: 35 }}
              />
            </div>
          </div>
          <div className="inventory-card">
            <div className="card-title">
              <a className="title">Nivel Agua:</a>
              <Button onClick={() => handleOpen("water_level", "Nivel Agua")}>
                Ver Gráfica
              </Button>
            </div>
            <div className="card-content">
              <MetricCard
                value={sensorData.water_level[sensorData.water_level.length - 1]}
                level={getLevel("water_level", sensorData.water_level[sensorData.water_level.length - 1])}
                optimalRange={{ min: 550, max: 999 }}
              />
            </div>
          </div>
        </div>
        {isClient && (
          <Recommendations sensorData={sensorData} plantGroup={plantGroup} />
        )}
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <LineChart height="400px" data={modalData} title={modalTitle} />
        </Box>
      </Modal>
    </section>
  );
}
