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
  const [showPlantInfoModal, setShowPlantInfoModal] = useState(false);
  const [cantidadCultivos, setCantidadCultivos] = useState(0);
  const [selectedPlantId, setSelectedPlantId] = useState("");
  const [selectedPlantInfo, setSelectedPlantInfo] = useState(null);
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

  const openPlantInfoModal = (plantInfo) => {
    setSelectedPlantInfo(plantInfo);
    setShowPlantInfoModal(true);
  };

  const closePlantInfoModal = () => {
    setShowPlantInfoModal(false);
  };

  const handleAddCultivos = async () => {
    try {
      const selectedPlant = plantCatalog.find(plant => plant._id === selectedPlantId);

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
      Swal.fire({
        icon: 'success',
        title: 'Cultivos añadidos',
        text: 'Los cultivos han sido añadidos correctamente.',
      });
    } catch (error) {
      console.error("Error al agregar plantas:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al agregar las plantas.',
      });
    }
  };

  const handleDeleteCultivo = async (plantId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Axios.delete(`/api/auth/delete-plant?plantId=${plantId}`);
          fetchStationPlants();
          Swal.fire(
            '¡Eliminado!',
            'El cultivo ha sido eliminado.',
            'success'
          );
        } catch (error) {
          console.error("Error al eliminar el cultivo:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al eliminar el cultivo.',
          });
        }
      }
    });
  };

  const handleHarvestCultivo = async (plantId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esto marcará el cultivo como cosechado.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cosechar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Axios.patch(`/api/auth/harvest-plant`, { plantId });
          fetchStationPlants();
          Swal.fire(
            '¡Cosechado!',
            'El cultivo ha sido marcado como cosechado.',
            'success'
          );
        } catch (error) {
          console.error("Error al cosechar el cultivo:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al cosechar el cultivo.',
          });
        }
      }
    });
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
          <div className="estacion-container2">
            <div className="Citas">
              <a className="titulo-citas">{stationName ? stationName : "Tu estación"}</a>
            </div>
            <div className="estacion-info-grid">
              {cultivos.map((cultivo, index) => (
                <div
                  key={index}
                  className="plant-circle"
                  onClick={() => openPlantInfoModal(cultivo)}
                >
                  <img src={cultivo.plant_id.image} alt={cultivo.plant_id.name} className="plant-image-circle" />
                </div>
              ))}
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
                  height: "40%",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  fontWeight: "100",
                  marginTop: "40px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                
                }}
              >
               <Calendario stationId={stationId} />
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
                  {cultivos.map((cultivo) => (
                    <div key={cultivo._id} className="cultivo-item">
                      <img src={cultivo.plant_id.image} alt={cultivo.plant_id.name} className="plant-image" />
                      <a>{cultivo.plant_id.name}</a>
                      <a>{cultivo.status}</a>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteCultivo(cultivo._id)}
                      >
                        Eliminar
                      </button>
                      <button
                        className="harvest-button"
                        onClick={() => handleHarvestCultivo(cultivo._id)}
                      >
                        Cosechar
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
              {harvestedCultivos.map((cultivo) => (
                <div key={cultivo._id} className="cultivo-item">
                  <img src={cultivo.plant_id.image} alt={cultivo.plant_id.name} className="plant-image" />
                  <a>{cultivo.plant_id.name}</a>            
                  <a>{cultivo.actual_harvest_date ? new Date(cultivo.actual_harvest_date).toLocaleDateString() : 'No cosechada'}</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showPlantInfoModal && selectedPlantInfo && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closePlantInfoModal}>
              &times;
            </span>
            <h2>Información de la Planta</h2>
            <div>
              <img src={selectedPlantInfo.plant_id.image} alt={selectedPlantInfo.plant_id.name} className="plant-image" />
              <p>Nombre: {selectedPlantInfo.plant_id.name}</p>
              <p>Status: {selectedPlantInfo.status}</p>
              <p>Fecha de siembra: {new Date(selectedPlantInfo.date_planted).toLocaleDateString()}</p>
              <p>Fecha estimada de cosecha: {new Date(selectedPlantInfo.estimated_harvest_date).toLocaleDateString()}</p>
              <p>Fecha de cosecha actual: {selectedPlantInfo.actual_harvest_date ? new Date(selectedPlantInfo.actual_harvest_date).toLocaleDateString() : 'No cosechada'}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default EstacionId;
