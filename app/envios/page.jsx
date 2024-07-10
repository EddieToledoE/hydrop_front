"use client";
import React from "react";
import Bar from "@/components/Bar-1.jsx";
import styles from "@/app/Home.css";
import Header from "@/components/Header.jsx";
import { closeBar, openBar } from "@/store/barSlice";
import { useSelector, useDispatch } from "react-redux";
import estiloinfo from "@/styles/inventario.css";
import Axios from "axios";
import Calendario from "@/components/Calendario2";
import { useState, useEffect } from "react";
function Envios() {
  const Swal = require("sweetalert2");
  const isBarOpen = useSelector((state) => state.bar.isBarOpen);
  const dispatch = useDispatch();

  const handleDivClick = () => {
    const windowWidth = window.innerWidth;

    //Condicion para que cambie de estado unicamente cuando isBarOpen sea true y la pantalla tenga un width maximo de 800 px
    if (isBarOpen && windowWidth <= 800) {
      console.log("Div clickeado");
      //Si cumple las condiciones se manda el cambio de estado
      dispatch(closeBar());
    }
  };

  const hola = isBarOpen ? "hola-true" : "hola";
  const inv = isBarOpen ? "inv-open" : "inv";
  const protector = isBarOpen ? "protectorOpen" : "protector";
  const avisos = isBarOpen ? "avisos-estacion-true" : "avisos-estacion";
  const [claseDiv, setClaseDiv] = useState("Registrar-close");
  const [claseDiv2, setClaseDiv2] = useState("Registrar-close2");
  const [claseF, setclaseF] = useState("Fondo-Close");
  // Función para cambiar la clase en el componente padre
  const cambiarClaseEnPadre = () => {
    setClaseDiv("Registrar-close");
    setclaseF("Fondo-Close");
    console.log("Se modifico la clase");
    console.log(claseDiv);
  };
  const cambiarClase = () => {
    setClaseDiv("Registrar-envio");
    setclaseF("Fondo-Open");
    console.log("Hola mundo");
    console.log(claseDiv);
  };
  const cambiarClaseEnPadre2 = () => {
    setClaseDiv2("Registrar-close2");
    setclaseF("Fondo-Close");
    console.log("Se modifico la clase");
    console.log(claseDiv);
  };
  const cambiarClase2 = () => {
    setClaseDiv2("Registrar-envio2");
    setclaseF("Fondo-Open");
    console.log("Hola mundo");
    console.log(claseDiv);
  };



  return (
    <section className="seccion1">
      <div className={claseF}></div>
      <div className="bar1">
        <Bar />
      </div>

      <div className={hola} onClick={handleDivClick}>
        <Header />

        <div className={avisos}>
          <div className="estacion-container">
            <div className="Citas">
              <a className="titulo-citas">Estacion</a>
            </div>
            <div className="estacion-informacion">
              <div className="inf"></div>
            </div>
          </div>
          <div className="estacion-container">
            <div className="Citas">
              <a className="titulo-citas">Cosechas</a>
            </div>
            <div className="estacion-informacion">
            <div
                style={{
                  width: "70%",
                  height: "95%",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  fontWeight: "100",
                  marginTop: "40px", 
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Calendario />
                <a className="estacion-cosecha" >Control de los cultivos</a>
                <button>Añadir cultivos</button>
                <a >Espacios utilizados : n /24</a>
                <div>
                  <a >Cultivo 1</a>
                  <a >Cultivo 2</a>
                  <a >Cultivo 3</a>
                </div>
              </div>
               
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Envios;
