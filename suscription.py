import paho.mqtt.client as mqtt

# Configuración del broker MQTT de CloudAMQP
broker_url = "toad.rmq.cloudamqp.com"
broker_port = 1883

# Credenciales MQTT
username = "jugilxxo:jugilxxo"
password = "aqvvDO1Y0hq2iW03wmz08TONcWdov1z0"

# Tema MQTT al que suscribirse
topic = "hydrop/#"

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Conectado al broker MQTT!")
        client.subscribe(topic)
    else:
        print(f"Error de conexión, código de retorno: {rc}")

def on_message(client, userdata, msg):
    print(f"Mensaje recibido en el tema {msg.topic}: {msg.payload.decode()}")

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.username_pw_set(username, password)
client.connect(broker_url, broker_port)
client.loop_forever()
