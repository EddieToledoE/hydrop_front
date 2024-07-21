"use client";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import Swal from 'sweetalert2';
import Axios from 'axios';
import { format, parseISO } from 'date-fns';
import React, { useEffect, useState } from 'react';

const Calendario = ({ stationId }) => {

  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    cargarEventos();
  }, [stationId]);

  const cargarEventos = async () => {
    try {
      const response = await Axios.get(`/api/auth/plants?systemId=${stationId}`);
      const plants = response.data;
      const eventosFormateados = plants.flatMap(plant => {
        const eventosPlant = [];
        if (plant.date_planted) {
          eventosPlant.push({
            title: `Plantado: ${plant.plant_id.name}`,
            start: plant.date_planted,
            color: "#28a745",
          });
        }
        if (plant.estimated_harvest_date) {
          eventosPlant.push({
            title: `Cosecha Estimada: ${plant.plant_id.name}`,
            start: plant.estimated_harvest_date,
            color: "#ffc107",
          });
        }
        if (plant.actual_harvest_date) {
          eventosPlant.push({
            title: `Cosechado: ${plant.plant_id.name}`,
            start: plant.actual_harvest_date,
            color: "#dc3545",
          });
        }
        return eventosPlant;
      });
      setEventos(eventosFormateados);
    } catch (error) {
      console.error("Error al obtener los eventos de tipo planta:", error);
    }
  };

  const handleEventClick = (arg) => {
    Swal.fire({
      title: arg.event.title,
      start: arg.event.startStr,
      confirmButtonColor: "#1eaa74",
    });
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
      eventClick={handleEventClick}
      dayMaxEvents={2}
      unselectAuto='true'
      selectMirror='true'
      locale={esLocale}
      footerToolbar={{
        start: "",
        center: "",
        end: ""
      }}
      headerToolbar={{
        start: "today prev,next",
        center: "title",
        end: "dayGridMonth,listWeek"
      }}
      buttonText={{
        today: 'Hoy',
        month: 'Meses',
        week: 'Semanas',
        day: 'Dias',
        list: 'Listas'
      }}
      selectOverlap='true'
      events={eventos}
      height={'36vh'}
    />
  );
}

export default Calendario;
