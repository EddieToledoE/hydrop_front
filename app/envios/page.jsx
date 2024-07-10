"use client";
import React from "react";
import Bar from "@/components/Bar-1.jsx";
import diseño from "@/styles/Envios.css";
import styles from "@/app/Home.css";
import Header from "@/components/Header.jsx";
import { closeBar, openBar } from "@/store/barSlice";
import { useSelector, useDispatch } from "react-redux";
import estiloinfo from "@/styles/inventario.css";
import { red } from "@mui/material/colors";
import Pedidos from "components/hacerPedido";
import Cliente from "components/registrarCliente";
import Axios from "axios";

import {
  DataGrid,
  GridColumnHeaderFilterIconButton,
  GridPagination,
  GridToolbar,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import {
  GridToolbarContainer,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import { Avatar, Grid } from "@mui/material";
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
  const avisos = isBarOpen ? "avisos-true" : "avisos";
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

  const [envios, setEnvios] = useState([]);

  const ruta = "/api/auth/envio";
  const getData = async () => {
    try {
      const response = await Axios.get(ruta);
      const data = response.data;
      setEnvios(data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const [cantidadTotal, setCantidadTotal] = useState(0);
  const [cantidadEntregados, setCantidadEntregados] = useState(0);
  const [cantidadNoEntregados, setCantidadNoEntregados] = useState(0);

  useEffect(() => {
    const obtenerCantidades = async () => {
      try {
        const response = await Axios.get("/api/auth/envio/contador");

        setCantidadTotal(response.data.cantidadTotal);
        setCantidadEntregados(response.data.cantidadEntregados);
        setCantidadNoEntregados(response.data.cantidadNoEntregados);
      } catch (error) {
        console.error("Error al obtener cantidades:", error);
        // Manejar el error según tus necesidades
      }
    };

    obtenerCantidades();
  }, []);

  return (
    <section className="seccion1">
      <div className={claseF}></div>
      <div className="bar1">
        <Bar />
      </div>

      <div className={hola} onClick={handleDivClick}>
        <Header />

        <div className={avisos}>
          <div className="citas">
            <div className="Citas">
              <a className="titulo-citas">Estacion : </a>
            </div>
            <div className="citas-pendientes">
              <div className="inf"></div>
            </div>

            <div className="inventario-pendiente">
              <div className="inf"></div>
            </div>
          </div>
          <div className="inventario">
            <div className="Citas">
              <a className="titulo-citas">Opciones</a>
            </div>
            <div className="citas-pendientes">
              <div className="inf"></div>
            </div>

            <div className="inventario-pendiente">
              <div className="inf"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Envios;
