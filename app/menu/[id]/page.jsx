"use client"
import Header from "@/components/Header";
import estios from "app/Home.css";
import Logo from "@/public/logo.png";
import Bar from "@/components/Bar-1";
import { closeBar, openBar } from "@/store/barSlice";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import Axios from "axios";
import { useSession } from "next-auth/react";
import ToggleSwitch from "components/ToggleSwitch";

const apiKey = "002501a48460cb00c15f9e2bcf247347";
const city = "Suchiapa";

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
                <a className="custom-link">Apagado/Encendido</a>
                <ToggleSwitch />
              </div>
            </div>
            <div className="linea"></div>
            <div className="inventario-pendiente">
              <div className="inf">
                <button className="dispensar">Dispensar</button>
              </div>
            </div>
          </div>
        </div>
        <div className="tabla">
          <div className="mas-vendidos">
            <div className="inventario">
              <div className="Citas">
                <a className="titulo-citas">Sensor</a>
              </div>
              <div className="citas-pendientes">
                <div className="inf">
                  <h2 className="citas-inf">Temperatura:</h2>
                  <MetricCard value={sensorData[0].value} level={sensorData[0].level} />
                </div>
              </div>
              <div className="linea"></div>
              <div className="inventario-pendiente">
                <div className="inf">
                  <h2 className="citas-inf">Humedad:</h2>
                  <MetricCard value={sensorData[2].value} level={sensorData[2].level} />
                </div>
              </div>
            </div>
            <div className="inventario">
              <div className="Citas">
                <a className="titulo-citas">Sensor</a>
              </div>
              <div className="citas-pendientes">
                <div className="inf">
                  <h2 className="citas-inf">pH:</h2>
                  <MetricCard value={sensorData[1].value} level={sensorData[1].level} />
                </div>
              </div>
              <div className="linea"></div>
              <div className="inventario-pendiente">
                <div className="inf">
                  <h2 className="citas-inf">Conductividad:</h2>
                  <MetricCard value={sensorData[3].value} level={sensorData[3].level} />
                </div>
              </div>
            </div>
            <div className="inventario">
              <div className="Citas">
                <a className="titulo-citas">Sensor</a>
              </div>
              <div className="citas-pendientes">
                <div className="inf-sensores">
                  <div className="inf">
                    <h2 className="citas-inf">T. Agua:</h2>
                    <MetricCard value={sensorData[0].value} level={sensorData[0].level} />
                  </div>
                </div>
              </div>
              <div className="linea"></div>
              <div className="inventario-pendiente">
                <div className="inf">
                  <h2 className="citas-inf">Nivel Agua:</h2>
                  <MetricCard value={sensorData[3].value} level={sensorData[3].level} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <a> Recomendación :</a>
        </div>
      </div>
    </section>
  );
}
