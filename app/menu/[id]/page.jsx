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
import ToggleSwitch from "components/ToggleSwitch";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
const apiKey = "002501a48460cb00c15f9e2bcf247347";

const sensorData = [
  { value: 25, level: "normal" },
  { value: 7, level: "normal" },
  { value: 60, level: "medium" },
  { value: 30, level: "low" },
];

const recommendations = [
  "Revisar el nivel de agua.",
  "Ajustar el pH.",
  "Verificar la humedad.",
];

function MetricCard({ value, level }) {
  const levelColors = {
    low: "red",
    normal: "green",
    medium: "yellow",
  };

  const valueColorClass = level === "low" || level === "normal" || level === "medium"
    ? "white" : "";

  return (
    <div className="metric-card-container">
      <div className={`metric-card ${levelColors[level]}`}>
        <div className={`metric-value ${valueColorClass}`}>{value}</div>
      </div>
    </div>
  );
}

export default function Home() {
  const isBarOpen = useSelector((state) => state.bar.isBarOpen);
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();
  const idDinamico = usePathname();
  const arreglo = idDinamico.split("/");
  const stationId = arreglo[arreglo.length - 1];

  const [city, setCity] = useState("");
  const [sensorData, setSensorData] = useState({});
  const [actuatorStatus, setActuatorStatus] = useState({});

  useEffect(() => {
    if (stationId) {
      Axios.get(`/api/auth/stations/${stationId}`)
        .then((response) => {
          setCity(response.data.city);
        })
        .catch((error) => {
          console.error("Error al obtener datos de la estación:", error);
        });
    }
  }, [stationId]);

  useEffect(() => {
    const socket = io("http://localhost:8080");

    socket.emit("join_station", stationId); // Unirse a la sala de la estación

    socket.on("mqtt_message", (message) => {
      try {
        console.log("Mensaje MQTT recibido:", message);
        const data = JSON.parse(message);
        setSensorData(data.sensor_data);
        setActuatorStatus(data.actuator_status);
      } catch (error) {
        console.error("Error al parsear el mensaje MQTT:", error);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [stationId]);

  const handleDivClick = () => {
    const windowWidth = window.innerWidth;
    if (isBarOpen && windowWidth <= 800) {
      console.log("Div clickeado");
      dispatch(closeBar());
    }
  };

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
          <div className="inventory-card">
            <div className="card-title">
              <a className="title">Accionadores</a>
            </div>
            <div className="card-content">
              <div className="info">
                <a className="link">Apagado/Encendido</a>
                <ToggleSwitch isOn={actuatorStatus.pump_status === 'on'} />
              </div>
            </div>
            <div className="divider"></div>
            <div className="card-content">
              <div className="info">
                <button className="dispensar">Dispensar</button>
              </div>
            </div>
          </div>
        </div>
        <div className={tableClass}>
          <div className="inventory-card">
            <div className="card-title">
              <a className="title">Temperatura:</a>
            </div>
            <div className="card-content">
              <MetricCard value={sensorData.temperature} level={sensorData.temperature_level} />
            </div>
          </div>
          <div className="inventory-card">
            <div className="card-title">
              <a className="title">Humedad:</a>
            </div>
            <div className="card-content">
              <MetricCard value={sensorData.humidity} level={sensorData.humidity_level} />
            </div>
          </div>
          <div className="inventory-card">
            <div className="card-title">
              <a className="title">pH:</a>
            </div>
            <div className="card-content">
              <MetricCard value={sensorData.ph} level={sensorData.ph_level} />
            </div>
          </div>
          <div className="inventory-card">
            <div className="card-title">
              <a className="title">Conductividad:</a>
            </div>
            <div className="card-content">
              <MetricCard value={sensorData.ec} level={sensorData.ec_level} />
            </div>
          </div>
          <div className="inventory-card">
            <div className="card-title">
              <a className="title">T. Agua:</a>
            </div>
            <div className="card-content">
              <MetricCard value={sensorData.water_temp} level={sensorData.water_temp_level} />
            </div>
          </div>
          <div className="inventory-card">
            <div className="card-title">
              <a className="title">Nivel Agua:</a>
            </div>
            <div className="card-content">
              <MetricCard value={sensorData.water_level} level={sensorData.water_level_level} />
            </div>
          </div>
        </div>
        <div className="recommendation">
          <a>Recomendaciones :</a>
        </div>
      </div>
    </section>
  );
}
