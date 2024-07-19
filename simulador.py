import paho.mqtt.client as mqtt
import random
import time

# Configuración del broker MQTT de CloudAMQP
broker_url = "toad.rmq.cloudamqp.com"
broker_port = 1883

# Credenciales MQTT
username = "jugilxxo:jugilxxo"
password = "aqvvDO1Y0hq2iW03wmz08TONcWdov1z0"

# Tema MQTT y mensaje
topic = "hydrop/668dee66cf7b5b0a30fb22a4/6699defcf167387f3335e144"

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

def simulate_actuator_status():
    pump_status = random.choice(["on", "off"])
    nutrient_dispenser_status = random.choice(["on", "off"])
    return {
        "pump_status": pump_status,
        "nutrient_dispenser_status": nutrient_dispenser_status
    }

client = mqtt.Client()
client.on_connect = on_connect
client.on_publish = on_publish
client.username_pw_set(username, password)
client.connect(broker_url, broker_port)
client.loop_start()

try:
    while True:
        sensor_data = simulate_sensor_data()
        actuator_status = simulate_actuator_status()

        message = {
            "sensor_data": sensor_data,
            "actuator_status": actuator_status
        }

        result = client.publish(topic, str(message))
        result.wait_for_publish()

        print(f"Mensaje publicado: {message}")

        time.sleep(10)  # Espera de 5 segundos antes de enviar el siguiente mensaje
except KeyboardInterrupt:
    print("Interrupción del usuario. Desconectando...")

client.loop_stop()
client.disconnect()
