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

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Conectado al broker MQTT!")
    else:
        print(f"Error de conexión, código de retorno: {rc}")

def on_publish(client, userdata, mid):
    print(f"Mensaje publicado con mid: {mid}")

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

def simulate_pump_status():
    return random.choice(["on", "off"])

def simulate_nutrient_dispenser_status():
    return random.choice(["on", "off"])

client = mqtt.Client()
client.on_connect = on_connect
client.on_publish = on_publish
client.username_pw_set(username, password)
client.connect(broker_url, broker_port)
client.loop_start()

try:
    while True:
        sensor_data = simulate_sensor_data()
        pump_status = simulate_pump_status()
        nutrient_dispenser_status = simulate_nutrient_dispenser_status()

        sensor_message = json.dumps(sensor_data)  # Convertir los datos del sensor a JSON
        pump_status_message = json.dumps({"pump_status": pump_status})  # Convertir el estado de la bomba a JSON
        nutrient_dispenser_status_message = json.dumps({"nutrient_dispenser_status": nutrient_dispenser_status})  # Convertir el estado del dispensador de nutrientes a JSON

        # Publicar datos del sensor
        result_sensor = client.publish(sensor_topic, sensor_message)
        result_sensor.wait_for_publish()

        # Publicar estado de la bomba
        result_pump = client.publish(pump_status_topic, pump_status_message)
        result_pump.wait_for_publish()

        # Publicar estado del dispensador de nutrientes
        result_nutrient_dispenser = client.publish(nutrient_dispenser_status_topic, nutrient_dispenser_status_message)
        result_nutrient_dispenser.wait_for_publish()

        print(f"Datos del sensor publicados: {sensor_message}")
        print(f"Estado de la bomba publicado: {pump_status_message}")
        print(f"Estado del dispensador de nutrientes publicado: {nutrient_dispenser_status_message}")

        time.sleep(10)  # Espera de 10 segundos antes de enviar el siguiente mensaje
except KeyboardInterrupt:
    print("Interrupción del usuario. Desconectando...")

client.loop_stop()
client.disconnect()
