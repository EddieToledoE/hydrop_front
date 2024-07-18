import React, { useState, useEffect } from "react";
import styles from "../styles/Agenda.css";
import Swal from "sweetalert2";

const Agenda = ({ setTimeLeft }) => {
  const [intervalHours, setIntervalHours] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (schedules.length > 0) {
      const interval = schedules[0].intervalHours * 60 * 60 * 1000;
      const duration = schedules[0].durationMinutes * 60 * 1000;
      const now = Date.now();
      const nextInterval = now + interval;

      const intervalId = setInterval(() => {
        const currentTime = Date.now();
        const timeRemaining = Math.max(0, Math.floor((nextInterval - currentTime) / 1000));
        setTimeLeft(timeRemaining);

        if (currentTime >= nextInterval) {
          console.log(`Ejecutando cada ${schedules[0].intervalHours} horas por ${schedules[0].durationMinutes} minutos`);
          // Aquí puedes agregar el código que debe ejecutarse cada vez que se cumpla el intervalo
          setTimeout(() => {
            console.log(`Duración de ${schedules[0].durationMinutes} minutos completada`);
            // Aquí puedes agregar el código que debe ejecutarse cuando finalice la duración
          }, duration);
        }
      }, 1000);

      setTimer(intervalId);

      return () => clearInterval(intervalId);
    }
  }, [schedules]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (intervalHours && durationMinutes) {
      setSchedules([...schedules, { intervalHours, durationMinutes }]);
      setIntervalHours("");
      setDurationMinutes("");
      Swal.fire(
        "Intervalo guardado",
        `Cada ${intervalHours} horas por ${durationMinutes} minutos`,
        "success"
      );
    } else {
      Swal.fire("Error", "Por favor, completa ambos campos", "error");
    }
  };

  const handleDelete = (index) => {
    const updatedSchedules = schedules.filter((_, i) => i !== index);
    setSchedules(updatedSchedules);
    Swal.fire("Intervalo eliminado", "", "success");

    // Limpiar el temporizador si se elimina el intervalo
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    setTimeLeft(0);
  };

  return (
    <div className="agendaContainer">
      <h2>Configurar Intervalos de la Estación</h2>
      <form onSubmit={handleSubmit} className="agendaForm">
        <div className="inputGroup">
          <label htmlFor="interval-hours">Intervalo (horas):</label>
          <input
            type="number"
            id="interval-hours"
            value={intervalHours}
            onChange={(e) => setIntervalHours(e.target.value)}
            required
            min="1"
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="duration-minutes">Duración (minutos):</label>
          <input
            type="number"
            id="duration-minutes"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            required
            min="1"
          />
        </div>
        <button type="submit" className="submitButton">Guardar Intervalo</button>
      </form>
      <div className="scheduleList">
        <h3>Intervalos Guardados</h3>
        <ul>
          {schedules.map((schedule, index) => (
            <li key={index}>
              <span>
                Cada {schedule.intervalHours} horas por {schedule.durationMinutes} minutos
              </span>
              <button className="deleteButton" onClick={() => handleDelete(index)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Agenda;
