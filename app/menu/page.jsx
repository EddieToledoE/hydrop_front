"use client";
import Header from "@/components/Header";
import estios from "app/Home.css";
import Logo from "@/public/logo.png";
import Bar from "@/components/Bar-1";
import { closeBar, openBar } from "@/store/barSlice";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import Axios from "axios";
import { useSession } from "next-auth/react";

const apiKey = "002501a48460cb00c15f9e2bcf247347";
const city = "Suchiapa";

const sensorData = [
  { name: "Temp.", value: 25, level: "normal" }, // Ejemplo de datos
  { name: "pH", value: 7, level: "normal" },
  { name: "Humedad", value: 60, level: "medium" },
  { name: "Nivel de agua", value: 30, level: "low" },
];

const recommendations = [
  "Revisar el nivel de agua.",
  "Ajustar el pH.",
  "Verificar la humedad.",
];

function MetricCard({ name, value, level }) {
  const levelColors = {
    low: "red",
    normal: "green",
    medium: "yellow",
  };

  return (
    <div className="metric-card">
      <div className="metric-name">{name}</div>
      <div className={`metric-value ${levelColors[level]}`}>{value}</div>
    </div>
  );
}

export default function Home() {
  const isBarOpen = useSelector((state) => state.bar.isBarOpen);
  const { data: session } = useSession();
  console.log(session);
  const dispatch = useDispatch();

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
    const fetchWeatherData = async () => {
      try {
        const response = await Axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );
        const hourlyForecast = response.data.list.slice(0, 4); // Pronóstico para las próximas 12 horas (cada 3 horas)
        setWeatherData(hourlyForecast);
      } catch (error) {
        setError("Error al obtener datos del clima");
        console.error("Error al obtener datos del clima:", error);
      }
    };
    fetchWeatherData();
  }, []);

  const hola = isBarOpen ? "hola-true" : "hola";
  const grafica = isBarOpen ? "grafica-true" : "grafica";
  const avisos = isBarOpen ? "avisos-true" : "avisos";
  const tabla = isBarOpen ? "tabla-true" : "tabla";
  const imageStyle = {
    borderRadius: "2px",
    position: "absolute",
  };

  return (
    <section className="seccion1">
      <div className="bar1">
        <Bar />
      </div>
      <div className={hola} onClick={handleDivClick}>
        <Header />
        <div className={avisos}>
          <div className="citas">
            <div className="Citas">
              <a className="titulo-citas">Clima en tu ciudad</a>
            </div>
            <div className="citas-pendientes">
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
          <div className="inventario">
            <div className="Citas">
              <a className="titulo-citas">Accionadores</a>
            </div>
            <div className="citas-pendientes">
              <div className="inf">
                <button className="citas-inf">Encender/Apagar</button>
              </div>
            </div>
            <div className="linea"></div>
            <div className="inventario-pendiente">
              <div className="inf">
                <button className="citas-inf">Dispensar</button>
              </div>
            </div>
          </div>
        </div>
        <div className={tabla}>
          <div className="mas-vendidos">
            <div className="inventario">
              <div className="Citas">
                <a className="titulo-citas">Sensor</a>
              </div>
              <div className="citas-pendientes">
                <div className="inf">
                  <button className="citas-inf">Temperatura : </button>
                </div>
              </div>
              <div className="linea"></div>
              <div className="inventario-pendiente">
                <div className="inf">
                  <button className="citas-inf">Humedad : </button>
                </div>
              </div>
            </div>
            <div className="inventario">
              <div className="Citas">
                <a className="titulo-citas">Sensor</a>
              </div>
              <div className="citas-pendientes">
                <div className="inf">
                  <button className="citas-inf">pH :</button>
                </div>
              </div>
              <div className="linea"></div>
              <div className="inventario-pendiente">
                <div className="inf">
                  <button className="citas-inf">Conductividad : </button>
                </div>
              </div>
            </div>
            <div className="inventario">
              <div className="Citas">
                <a className="titulo-citas">Sensor</a>
              </div>
              <div className="citas-pendientes">
                <div className="inf-sensores">
                  <button className="citas-inf">Temperatura Agua : </button>
                  <a> Recomendación :</a>
                </div>
              </div>
              <div className="linea"></div>
              <div className="inventario-pendiente">
                <div className="inf">
                  <button className="citas-inf">Nivel Agua : </button>
                </div>
              </div>
            </div>
            {/* <div className="metricas-container">
              <h2>Métricas</h2>
              <div className="metricas">
                {sensorData.map((sensor, index) => (
                  <MetricCard
                    key={index}
                    name={sensor.name}
                    value={sensor.value}
                    level={sensor.level}
                  />
                ))}
              </div>
              <h3>Recomendaciones</h3>
              <ul>
                {recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
