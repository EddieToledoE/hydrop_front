import paho.mqtt.client as mqtt
import random
import time
import json

# Configuración del broker MQTT de CloudAMQP
broker_url = "toad.rmq.cloudamqp.com"
broker_port = 1883

# Credenciales MQTT
username = "jugilxxo:jugilxxo"
password = "aqvvDO1Y0hq2iW03wmz08TONcWdov1z0"

# Temas MQTT
sensor_topic = "hydrop/668dee66cf7b5b0a30fb22a4/6699defcf167387f3335e144/sensor_data"
pump_status_topic = "hydrop/668dee66cf7b5b0a30fb22a4/6699defcf167387f3335e144/pump_status"
nutrient_dispenser_status_topic = "hydrop/668dee66cf7b5b0a30fb22a4/6699defcf167387f3335e144/nutrient_dispenser_status"
pump_command_topic = "hydrop/668dee66cf7b5b0a30fb22a4/6699defcf167387f3335e144/pump/command"
nutrient_dispenser_command_topic = "hydrop/668dee66cf7b5b0a30fb22a4/6699defcf167387f3335e144/nutrient_dispenser/command"

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
    ph = round(random.uniform(5.5, 7.5), 2)
    ec = round(random.uniform(1.0, 2.5), 2)
    humidity = random.randint(30, 90)
    temperature = random.randint(15, 38)
    water_temp = random.randint(10, 30)
    water_level = random.randint(0, 100)
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
