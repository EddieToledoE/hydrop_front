"use client";
import Header from "@/components/Header";
import styles from "@/styles/menu-hidrop.css";
import Bar from "@/components/Bar-1";
import { closeBar, openBar } from "@/store/barSlice";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import Axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const isBarOpen = useSelector((state) => state.bar.isBarOpen);
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();

  const [error, setError] = useState(null);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    if (session) {
      Axios.get(`/api/auth/userstation?id=${session.user.id}`)
        .then((response) => {
          setStations(response.data);
        })
        .catch((error) => {
          console.error(error);
          setError("Error al obtener las estaciones hidropónicas.");
        });
    }
  }, [session]);

  const handleDivClick = () => {
    const windowWidth = window.innerWidth;
    if (isBarOpen && windowWidth <= 800) {
      dispatch(closeBar());
    }
  };

  const handleStationClick = (id) => {
    router.push(`/menu/${id}`);
  };

  const containerClass = isBarOpen ? "container-open" : "container";
  const sectionClass = isBarOpen ? "section-open" : "section";
  const headerClass = isBarOpen ? "header-open" : "header";
  const contentClass = isBarOpen ? "content-open" : "content";
  const titleClass = isBarOpen ? "title-open" : "title";
  const stationsClass = isBarOpen ? "stations-open" : "stations";

  return (
    <section className="containerGeneral">
      <div className="sidebar">
        <Bar />
      </div>
      <div className={containerClass} onClick={handleDivClick}>
        <Header />
        <div className={headerClass}>
          <h1>Bienvenido de nuevo</h1>
          <h2>{session?.user?.name}</h2>
          <p>Tus {stations.length} estaciones te esperan.</p>
        </div>
        <div className={contentClass}>
          <div className={titleClass}>
            <h2>Estaciones Hidropónicas</h2>
          </div>
          <div className={stationsClass}>
            {stations.length === 0 ? (
              <p>No tienes estaciones hidropónicas registradas.</p>
            ) : (
              <div className="station-cards">
                {stations.map((station) => (
                  <div className="station-card" key={station._id} onClick={() => handleStationClick(station._id)}>
                    <img src="torre.webp" alt="Estación" className="station-image" />
                    <div className="station-info">
                      <h3>{station.name}</h3>
                      <p>{station.city}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
