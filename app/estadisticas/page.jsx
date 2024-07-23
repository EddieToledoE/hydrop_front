"use client";

import React from "react";
import "@/styles/Estadistica.css"; // Asegúrate de que esta ruta es correcta
import Bar from "@/components/Bar-1";
import Header from "@/components/Header";
import { closeBar, openBar } from "@/store/barSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import Grafica from "@/components/Grafica";
import Grafica2 from "@/components/Grafica2";
import Grafica3 from "@/components/Grafica3";
import Grafica4 from "@/components/Grafica4";

export default function Estadistica() {
  // Logica para mandar y recibir los estados de la libreria "Redux"
  const isBarOpen = useSelector((state) => state.bar.isBarOpen);
  const dispatch = useDispatch();
  const handleDivClick = () => {
    const windowWidth = window.innerWidth;

    // Condicion para que cambie de estado unicamente cuando isBarOpen sea true y la pantalla tenga un width maximo de 800 px
    if (isBarOpen && windowWidth <= 800) {
      console.log("Div clickeado");
      dispatch(closeBar());
    }
  };

  const [phData, setPhData] = useState([]);
  const [waterTempData, setWaterTempData] = useState([]);
  const [ecData, setEcData] = useState([]);
  const [waterLevelData, setWaterLevelData] = useState([]);
  const [showPh, setShowPh] = useState(true);
  const [showWaterTemp, setShowWaterTemp] = useState(true);
  const [showEc, setShowEc] = useState(true);
  const [showWaterLevel, setShowWaterLevel] = useState(true);

  useEffect(() => {
    const fetchPhData = async () => {
      try {
        const response = await axios.get("/api/auth/sensor-ph");
        setPhData(response.data);
      } catch (error) {
        console.error("Error al obtener datos de pH", error);
      }
    };

    const fetchWaterTempData = async () => {
      try {
        const response = await axios.get("/api/auth/sensor-watertemp");
        setWaterTempData(response.data);
      } catch (error) {
        console.error("Error al obtener datos de temperatura del agua", error);
      }
    };

    const fetchEcData = async () => {
      try {
        const response = await axios.get("/api/auth/sensor-ec");
        setEcData(response.data);
      } catch (error) {
        console.error("Error al obtener datos de conductividad eléctrica", error);
      }
    };

    const fetchWaterLevelData = async () => {
      try {
        const response = await axios.get("/api/auth/sensor-waterlevel");
        setWaterLevelData(response.data);
      } catch (error) {
        console.error("Error al obtener datos de nivel del agua", error);
      }
    };

    fetchPhData();
    fetchWaterTempData();
    fetchEcData();
    fetchWaterLevelData();
  }, []);

  return (
    <section className="Container">
      <div className="bar-1">
        <Bar />
      </div>
      <div className="Main-Second" onClick={handleDivClick}>
        <Header />
        <div className="Buttons-Container">
          <button onClick={() => setShowPh(!showPh)}>
            {showPh ? "Ocultar" : "Mostrar"} Gráfico de pH
          </button>
          <button onClick={() => setShowWaterTemp(!showWaterTemp)}>
            {showWaterTemp ? "Ocultar" : "Mostrar"} Gráfico de Temperatura del Agua
          </button>
          <button onClick={() => setShowEc(!showEc)}>
            {showEc ? "Ocultar" : "Mostrar"} Gráfico de Conductividad Eléctrica
          </button>
          <button onClick={() => setShowWaterLevel(!showWaterLevel)}>
            {showWaterLevel ? "Ocultar" : "Mostrar"} Gráfico de Nivel del Agua
          </button>
        </div>
        {showPh && (
          <div className="Contenedor-Clientes">
            <div className="Grafica-Contenedor">
              <Grafica data={phData} />
            </div>
          </div>
        )}
        {showWaterTemp && (
          <div className="Contenedor-Envios">
            <div className="Grafica-Contenedor">
              <Grafica2 data={waterTempData} />
            </div>
          </div>
        )}
        {showEc && (
          <div className="Contenedor-Envios">
            <div className="Grafica-Contenedor">
              <Grafica3 data={ecData} />
            </div>
          </div>
        )}
        {showWaterLevel && (
          <div className="Contenedor-Envios">
            <div className="Grafica-Contenedor">
              <Grafica4 data={waterLevelData} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
