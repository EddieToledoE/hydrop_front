"use client";
import Bar from "@/components/Bar-1.jsx";
import Header from "@/components/Header.jsx";
import { closeBar, openBar } from "@/store/barSlice";
import { useSelector, useDispatch } from "react-redux";
import Axios from "axios";
import { usePathname } from "next/navigation";
import Calendario from "@/components/Calendario2";
import { useState, useEffect } from "react";
import estilos from "@/styles/estacion-id.css";

function EstacionId() {
  const Swal = require("sweetalert2");
  const isBarOpen = useSelector((state) => state.bar.isBarOpen);
  const dispatch = useDispatch();

  const idDinamico = usePathname();
  const arreglo = idDinamico.split("/");
  const stationId = arreglo[arreglo.length - 1];

  const handleDivClick = () => {
    const windowWidth = window.innerWidth;
    if (isBarOpen && windowWidth <= 800) {
      dispatch(closeBar());
    }
  };

  const hola = isBarOpen ? "hola-true" : "hola";
  const avisos = isBarOpen ? "avisos-estacion-true" : "avisos-estacion";
  const [claseF, setclaseF] = useState("Fondo-Close");
  const [showModal, setShowModal] = useState(false);
  const [showHarvestedModal, setShowHarvestedModal] = useState(false);
  const [cantidadCultivos, setCantidadCultivos] = useState(0);
  const [selectedPlantId, setSelectedPlantId] = useState("");
  const [cultivos, setCultivos] = useState([]);
  const [harvestedCultivos, setHarvestedCultivos] = useState([]);
  const [stationName, setStationName] = useState("");
  const [plantCatalog, setPlantCatalog] = useState([]);
  const [totalPlants, setTotalPlants] = useState(0);
  const [plantGroup, setPlantGroup] = useState("");

  const openModal = () => {
    setShowModal(true);
    fetchPlantCatalog();
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openHarvestedModal = () => {
    setShowHarvestedModal(true);
    fetchHarvestedPlants();
  };

  const closeHarvestedModal = () => {
    setShowHarvestedModal(false);
  };

  const handleAddCultivos = async () => {
    try {
      const selectedPlant = plantCatalog.find(plant => plant._id === selectedPlantId);

      // Verificar si la planta seleccionada pertenece al mismo grupo que las plantas existentes
      const existingGroup = plantGroup;
      console.log("existingGroup", existingGroup);
      console.log("selectedPlant.group_id =", selectedPlant.group_id);

      const selectedPlantGroupId = selectedPlant.group_id._id || selectedPlant.group_id;

      if (existingGroup && selectedPlantGroupId.toString() !== existingGroup.toString()) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pueden mezclar plantas de diferentes grupos en la misma estación.',
        });
        return;
      }

      // Verificar el límite de plantas
      const growingPlantsCount = cultivos.filter(cultivo => cultivo.status === 'growing').length;
      if (growingPlantsCount + parseInt(cantidadCultivos) > 24) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La suma de las plantas en crecimiento no puede exceder las 24 plantas.',
        });
        return;
      }

      await Axios.post("/api/auth/plants", {
        systemId: stationId,
        plantId: selectedPlantId,
        count: cantidadCultivos
      });
      
      fetchStationPlants();
      setShowModal(false);
    } catch (error) {
      console.error("Error al agregar plantas:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al agregar las plantas.',
      });
    }
  };

  const handleDeleteCultivo = (index) => {
    const newCultivos = [...cultivos];
    newCultivos.splice(index, 1);
    setCultivos(newCultivos);
  };

  useEffect(() => {
    if (stationId) {
      Axios.get(`/api/auth/stations/${stationId}`)
        .then((response) => {
          setStationName(response.data.name);
        })
        .catch((error) => {
          console.error("Error al obtener datos de la estación:", error);
        });
      fetchStationPlants();
    }
  }, [stationId]);

  const fetchStationPlants = () => {
    Axios.get(`/api/auth/growing-plants?systemId=${stationId}`)
      .then((response) => {
        setCultivos(response.data);
        setTotalPlants(response.data.filter(cultivo => cultivo.status === 'growing').length);

        // Determinar el grupo de plantas existentes
        if (response.data.length > 0) {
          const firstPlantGroup = response.data[0].plant_id.group_id;
          const sameGroup = response.data.every(cultivo => cultivo.plant_id.group_id.toString() === firstPlantGroup.toString());
          if (sameGroup) {
            setPlantGroup(firstPlantGroup.toString());
          } else {
            setPlantGroup("");
          }
        }
      })
      .catch((error) => {
        console.error("Error al obtener plantas de la estación:", error);
      });
  };

  const fetchHarvestedPlants = () => {
    Axios.get(`/api/auth/harvested-plants?systemId=${stationId}`)
      .then((response) => {
        setHarvestedCultivos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener plantas cosechadas de la estación:", error);
      });
  };

  const fetchPlantCatalog = () => {
    Axios.get("/api/auth/catalog")
      .then((response) => {
        setPlantCatalog(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener catálogo de plantas:", error);
      });
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
              <a className="titulo-citas">{stationName ? stationName : "Tu estación"}</a>
            </div>
            <div className="estacion-informacion"></div>
          </div>
          <div className="estacion-container">
            <div className="Citas">
              <a className="titulo-citas">Cosechas</a>
            </div>
            <div className="estacion-informacion">
              <div
                style={{
                  width: "70%",
                  height: "40%",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  fontWeight: "100",
                  marginTop: "40px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  border: "1px solid black"
                }}
              >
                <Calendario />
              </div>
              <a className="estacion-cosecha">Control de los cultivos</a>
              <div>
              <button className="Envios-Button" onClick={openModal}>
                  Añadir cultivos
                </button>
                <button className="Envios-Button" onClick={openHarvestedModal}>
                  Ver cosechadas
                </button>
              </div>
                <a>Espacios utilizados: {totalPlants} / 24</a>
                <div className="cultivos-list">
                  {cultivos.map((cultivo, index) => (
                    <div key={index} className="cultivo-item">
                      <img src={cultivo.plant_id.image} alt={cultivo.plant_id.name} className="plant-image" />
                      <a>{cultivo.plant_id.name}</a>
                      <a>{cultivo.status}</a>
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

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <h2>Añadir Cultivos</h2>
            <div className="plant-catalog">
              {plantCatalog.map((plant) => (
                <div
                  key={plant._id}
                  className={`plant-item ${selectedPlantId === plant._id ? "selected" : ""}`}
                  onClick={() => setSelectedPlantId(plant._id)}
                >
                  <img src={plant.image} alt={plant.name} className="plant-image" />
                  <a>{plant.name}</a>
                </div>
              ))}
            </div>
            <label htmlFor="cantidad">Cantidad:</label>
            <input
              type="number"
              id="cantidad"
              min="1"
              max={24 - totalPlants}
              value={cantidadCultivos}
              onChange={(e) => setCantidadCultivos(e.target.value)}
            />
            <button className="modal-button" onClick={handleAddCultivos}>
              Añadir
            </button>
          </div>
        </div>
      )}

      {showHarvestedModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeHarvestedModal}>
              &times;
            </span>
            <h2>Plantas Cosechadas</h2>
            <div className="harvested-list">
              {harvestedCultivos.map((cultivo, index) => (
                <div key={index} className="cultivo-item">
                  <img src={cultivo.plant_id.image} alt={cultivo.plant_id.name} className="plant-image" />
                  <a>{cultivo.plant_id.name}</a>
                  <a>{cultivo.status}</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default EstacionId;
