"use client";
import React, { useState } from "react";
import Bar from "@/components/Bar-1.jsx";
import styles from "@/app/Home.css";
import Header from "@/components/Header.jsx";
import { closeBar, openBar } from "@/store/barSlice";
import { useSelector, useDispatch } from "react-redux";
import estiloinfo from "@/styles/inventario.css";
import Axios from "axios";
import Calendario from "@/components/Calendario2";
import Agenda from "@/components/Agenda";
import { useEffect } from "react";

function Envios() {
  const isBarOpen = useSelector((state) => state.bar.isBarOpen);
  const dispatch = useDispatch();
  const [timeLeft, setTimeLeft] = useState(0);

  const handleDivClick = () => {
    const windowWidth = window.innerWidth;
    if (isBarOpen && windowWidth <= 800) {
      console.log("Div clickeado");
      dispatch(closeBar());
    }
  };

  const hola = isBarOpen ? "hola-true" : "hola";
  const avisos = isBarOpen ? "avisos-estacion-true" : "avisos-estacion";

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <section className="seccion1">
      <div className="bar1">
        <Bar />
      </div>
      <div className={hola} onClick={handleDivClick}>
        <Header />
        <div className={avisos}>
          <div className="estacion-container">
            <div className="Citas">
              <a className="titulo-citas">Configura tiempo</a>
            </div>
            <div className="estacion-informacion">
              <Agenda setTimeLeft={setTimeLeft} />
            </div>
          </div>
          <div className="estacion-container">
            <div className="Citas">
              <a className="titulo-citas">Temporizador</a>
            </div>
            <div className="estacion-informacion">
              {timeLeft > 0 && (
                <div className="timerDisplay clock-style">
                  <h3>Tiempo restante para el próximo intervalo:</h3>
                  <p>{formatTime(timeLeft)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Envios;
