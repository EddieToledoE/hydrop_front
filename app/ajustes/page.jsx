"use client";
import Axios, { AxiosError } from "axios";
import { FormEvent, useState } from "react";
import Bar from "@/components/Bar-1";
import Header from "@/components/Header";
import "@/styles/Ajustes.css";
import { useSelector, useDispatch } from "react-redux";
import { closeBar, openBar } from "@/store/barSlice";

export default function Ajustes() {
  const [error, setError] = useState();
  const [activeSection, setActiveSection] = useState("perfil");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    const persona = [
      {
        nombre: formdata.get("nombre"),
        apellido: formdata.get("apellido"),
        puesto: formdata.get("puesto"),
      },
    ];

    try {
      const res = await Axios.post("/api/auth/registro", {
        email: formdata.get("email"),
        contraseña: formdata.get("contraseña"),
        persona: persona,
      });
      if (res.data) {
        console.log(res.data);
      } else {
        console.log("La respuesta no contiene datos JSON válidos.");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        setError(error.response?.data.message);
      }
    }
  };

  // Implementación de método para ocultar la barra
  const isBarOpen = useSelector((state) => state.bar.isBarOpen);
  const dispatch = useDispatch();

  const handleDivClick = () => {
    const windowWidth = window.innerWidth;
    // Condición para que cambie de estado únicamente cuando isBarOpen sea true y la pantalla tenga un width máximo de 800 px
    if (isBarOpen && windowWidth <= 800) {
      console.log("Div clickeado");
      // Si cumple las condiciones se manda el cambio de estado
      dispatch(closeBar());
    }
  };
  const protector = isBarOpen ? "protectorOpen" : "protector";

  return (
    <section className="container">
      <Bar />
      <div className="main-content" onClick={handleDivClick}>
        <Header />
        <div className="settings-container">
          <nav className="settings-nav">
            <ul>
              <li
                className={activeSection === "perfil" ? "active" : ""}
                onClick={() => setActiveSection("perfil")}
              >
                Perfil
              </li>
              <li
                className={activeSection === "notificaciones" ? "active" : ""}
                onClick={() => setActiveSection("notificaciones")}
              >
                Notificaciones
              </li>
              <li
                className={activeSection === "seguridad" ? "active" : ""}
                onClick={() => setActiveSection("seguridad")}
              >
                Seguridad
              </li>
            </ul>
          </nav>
          <section className="settings-content">
            {activeSection === "perfil" && (
              <div className="settings-section">
                <h2>Perfil</h2>
                <form className="settings-form" onSubmit={handleSubmit}>
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    placeholder="Nombre"
                  />
                  <label htmlFor="apellido">Apellido</label>
                  <input
                    type="text"
                    name="apellido"
                    id="apellido"
                    placeholder="Apellido"
                  />
                  <label htmlFor="puesto">Puesto</label>
                  <select name="puesto" id="puesto">
                    <option value="Gerente">Gerente</option>
                    <option value="Vendedor">Vendedor</option>
                  </select>
                  <button type="submit">Guardar</button>
                </form>
              </div>
            )}
            {activeSection === "notificaciones" && (
              <div className="settings-section">
                <h2>Notificaciones</h2>
                <p>Configuración de notificaciones.</p>
                {/* Aquí puedes agregar la configuración de notificaciones */}
              </div>
            )}
            {activeSection === "seguridad" && (
              <div className="settings-section">
                <h2>Seguridad</h2>
                <form className="settings-form" onSubmit={handleSubmit}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                  />
                  <label htmlFor="contraseña">Contraseña</label>
                  <input
                    type="password"
                    name="contraseña"
                    id="contraseña"
                    placeholder="Contraseña"
                  />
                  <button type="submit">Guardar</button>
                  {error && <div className="error">{error}</div>}
                </form>
              </div>
            )}
          </section>
        </div>
      </div>
      <div className={protector}></div>
    </section>
  );
}
