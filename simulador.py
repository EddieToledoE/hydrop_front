import os
import paho.mqtt.client as mqtt
import random
import time
import json

from dotenv import load_dotenv

load_dotenv()


broker_url = os.getenv("BROKER_URL")
broker_port = int(os.getenv("BROKER_PORT", 1883))  # Valor por defecto 1883 si no se encuentra
username = os.getenv("MQTT_USER")
password = os.getenv("MQTT_PASS")

# Temas MQTT
sensor_topic = os.getenv("SENSOR_TOPIC")
pump_status_topic = os.getenv("PUMP_STATUS_TOPIC")
nutrient_dispenser_status_topic = os.getenv("NUTRIENT_DISPENSER_STATUS_TOPIC")
pump_command_topic = os.getenv("PUMP_COMMAND_TOPIC")
nutrient_dispenser_command_topic = os.getenv("NUTRIENT_DISPENSER_COMMAND_TOPIC")
mqtt_topic = os.getenv("MQTT_TOPIC")

sensor_topic = mqtt_topic + "/sensor_data"
pump_command_topic = mqtt_topic + "/pump/command"
pump_status_topic = mqtt_topic + "/pump_status"
nutrient_dispenser_command_topic = mqtt_topic + "/nutrient_dispenser/command"
nutrient_dispenser_status_topic = mqtt_topic + "/nutrient_dispenser_status"


# Estados de los actuadores 
pump_status = "off"
nutrient_dispenser_status = "off"

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Conectado al broker MQTT!")
        client.subscribe([(pump_command_topic, 0), (nutrient_dispenser_command_topic, 0)])
        print(f"Suscrito a {pump_command_topic} y {nutrient_dispenser_command_topic}")
    else:
        print(f"Error de conexión, código de retorno: {rc}")

def on_publish(client, userdata, mid):
    print(f"Mensaje publicado con mid: {mid}")

def on_message(client, userdata, msg):
    global pump_status, nutrient_dispenser_status
    payload = json.loads(msg.payload)
    print(f"Mensaje recibido en el tema {msg.topic}: {payload}")

    if msg.topic == pump_command_topic:
        pump_status = payload["pump_status"]
        print(f"Actualizando estado de la bomba a {pump_status}")
        publish_status("pump", pump_status)
    elif msg.topic == nutrient_dispenser_command_topic:
        nutrient_dispenser_status = payload["nutrient_dispenser_status"]
        print(f"Actualizando estado del dispensador de nutrientes a {nutrient_dispenser_status}")
        publish_status("nutrient_dispenser", nutrient_dispenser_status)

def publish_status(actuator, status):
    if actuator == "pump":
        status_message = json.dumps({"pump_status": status})
        result = client.publish(pump_status_topic, status_message)
    elif actuator == "nutrient_dispenser":
        status_message = json.dumps({"nutrient_dispenser_status": status})
        result = client.publish(nutrient_dispenser_status_topic, status_message)
    print(f"Estado de {actuator} publicado: {status_message}")

def simulate_sensor_data():
    ph = round(random.uniform(5.5, 5.6), 2)
    ec = round(random.uniform(1100, 1150), 2)
    humidity = random.randint(60, 65)
    temperature = random.randint(27, 30)
    water_temp = random.randint(21, 22)
    water_level = random.randint(980, 999)
    return {
        "ph": ph,
        "ec": ec,
        "humidity": humidity,
        "temperature": temperature,
        "water_temp": water_temp,
        "water_level": water_level
    }

client = mqtt.Client()
client.on_connect = on_connect
client.on_publish = on_publish
client.on_message = on_message
client.username_pw_set(username, password)
client.connect(broker_url, broker_port)
client.loop_start()

try:
    while True:
        sensor_data = simulate_sensor_data()

        sensor_message = json.dumps(sensor_data)  # Convertir los datos del sensor a JSON

        # Publicar datos del sensor
        result_sensor = client.publish(sensor_topic, sensor_message)

        print(f"Datos del sensor publicados: {sensor_message}")

        time.sleep(10)  # Espera de 10 segundos antes de enviar el siguiente mensaje
except KeyboardInterrupt:
    print("Interrupción del usuario. Desconectando...")

client.loop_stop()
client.disconnect()
