"use client";
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
    if (isBarOpen && windowWidth <= 800) {
      console.log("Div clickeado");
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
  const [showModal, setShowModal] = useState(false);
  const [cantidadCultivos, setCantidadCultivos] = useState("");
  const [cultivos, setCultivos] = useState([]);

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

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleAddCultivos = () => {
    const newCultivos = [];
    for (let i = 1; i <= cantidadCultivos; i++) {
      newCultivos.push(`Cultivo ${cultivos.length + i}`);
    }
    setCultivos([...cultivos, ...newCultivos]);
    setShowModal(false);
  };

  const handleDeleteCultivo = (index) => {
    const newCultivos = [...cultivos];
    newCultivos.splice(index, 1);
    setCultivos(newCultivos);
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
                <a className="estacion-cosecha">Control de los cultivos</a>
                <button className="Envios-Button" onClick={openModal}>
                  Añadir cultivos
                </button>
                <a>Espacios utilizados : {cultivos.length} /24</a>
                <div className="cultivos-list">
                  {cultivos.map((cultivo, index) => (
                    <div key={index} className="cultivo-item">
                      <a>{cultivo}</a>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteCultivo(index)}
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <h2>Añadir Cultivos</h2>
            <label htmlFor="cantidad">Cantidad:</label>
            <input
              type="number"
              id="cantidad"
              value={cantidadCultivos}
              onChange={(e) => setCantidadCultivos(e.target.value)}
            />
            <button className="modal-button" onClick={handleAddCultivos}>
              Añadir
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Envios;
