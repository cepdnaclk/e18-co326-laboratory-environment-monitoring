#include <Adafruit_BMP280.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <WiFi.h>
#include <Wire.h>
#include <time.h>

#include "bmp.h"

// Replace the next variables with your SSID/Password combination
const char* ssid = "J-A-R-V-I-S";
const char* password = "11111111";

const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 19800;  // Replace with your GMT offset (seconds)
const int daylightOffset_sec = 0;  // Replace with your daylight offset (seconds)

char* fan_status = "OFF";
// Add your MQTT Broker IP address, example:
IPAddress mqtt_server(65, 0, 173, 201);  // MQTT server IP

// Initializes the espClient. You should change the espClient name if you have multiple ESPs running in your home automation system
WiFiClient espClient22;
PubSubClient client(espClient22);
Adafruit_BMP280 bmp;  // Makin I2c support
// Adafruit_BMP280 bmp; // Makin I2c support headeI2C

// Lamp - LED - GPIO 4 = D2 on ESP-12E NodeMCU board
// onst int motor = 4;
const int led = 13;
int auton = 0;

// Motor control pins
const int motorEN = 4;    // Enable pin (EN) of the L298N
const int motorIN1 = 16;  // Input 3 (IN1) pin of the L298N
const int motorIN2 = 17;  // Input 4 (IN2) pin of the L298N

// setting PWM properties
const int freq = 5000;
const int ledChannel = 0;
const int resolution = 8;

// Connect your NodeMCU to your router
void setup_wifi() {
    delay(10);

    Serial.println();

    Serial.print("Connecting to ");
    Serial.println(ssid);
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(100);
        Serial.print(".");
    }
    Serial.println("");
    Serial.print("WiFi connected - NodeMCU IP address: ");
    Serial.println(WiFi.localIP());
}

// This functions is executed when some device publishes a message to a topic that your NodeMCU is subscribed to

void callback(String topic, byte* message, unsigned int length) {
    Serial.print("Message arrived on topic: ");
    Serial.print(topic);
    Serial.print(". Message: ");
    String messageInfo;

    for (int i = 0; i < length; i++) {
        Serial.print((char)message[i]);
        messageInfo += (char)message[i];
    }
    Serial.println();

    if (topic == "UoP/CO326/E18/Group4/LED") {
        ledcWrite(ledChannel, messageInfo.toInt());
    }

    // If a message is received on the topic room/lamp, you check if the message is either on or off. Turns the lamp GPIO according to the message
    if (topic == "UoP/CO326/E18/Group4/Motor") {
        if (messageInfo == "on") {
            // digitalWrite(motor, HIGH);
            motorOn();
            Serial.print("On");
            fan_status = "ON";

        } else if (messageInfo == "off") {
            // digitalWrite(motor, LOW);
            motorOff();
            Serial.print("Off");
            fan_status = "OFF";
        }
        // Serial.print("Changing Room Light to ");
    }
    Serial.println();
}

// This functions reconnects your ESP8266 to your MQTT broker
// Change the function below if you want to subscribe to more topics with your ESP8266
void reconnect() {
    // Loop until we're reconnected
    while (!client.connected()) {
        Serial.print("Attempting MQTT connection...");

        if (client.connect("ESP8266Client22")) {
            Serial.println("connected");
            // Subscribe or resubscribe to a topic
            // You can subscribe to more topics (to control more LEDs in this example)
            client.subscribe("UoP/CO326/E18/Group4/Motor");
            client.subscribe("UoP/CO326/E18/Group4/LED");
        } else {
            Serial.print("failed, rc=");
            Serial.print(client.state());
            Serial.println(" try again in 5 seconds");
            // Wait 5 seconds before retrying
            delay(5000);
        }
    }
}

void publishMessage() {
    StaticJsonDocument<200> doc;
    // doc["time"] = millis();
    doc["time"] = getTime();
    doc["temperature"] = getTemperature();
    doc["pressure"] = getPressure();
    doc["altitude"] = getAltitude();
    doc["fan_status"] = fan_status;
    // doc["time"]
    char jsonBuffer[512];
    serializeJson(doc, jsonBuffer);  // print to client

    Serial.println(client.publish("UoP/CO326/E18/Group4/BMP280", jsonBuffer));
}

// The setup function sets your ESP GPIOs to Outputs, starts the serial communication at a baud rate of 115200
// Sets your mqtt broker and sets the callback function
// The callback function is what receives messages and actually controls the LEDs
void setup() {
    // configure LED PWM functionalitites
    ledcSetup(ledChannel, freq, resolution);

    // attach the channel to the GPIO to be controlled
    ledcAttachPin(led, ledChannel);
    // pinMode(motor, OUTPUT);
    pinMode(motorEN, OUTPUT);
    pinMode(motorIN1, OUTPUT);
    pinMode(motorIN2, OUTPUT);
    Serial.begin(115200);
    while (!Serial) delay(100);  // wait for native usb

    Serial.println(F("BMP280 test"));
    unsigned status;

    status = bmp.begin(0x76);

    if (!status) {
        Serial.println(F(
            "Could not find a valid BMP280 sensor, check wiring or "
            "try a different address!"));

        while (1) delay(10);
    }

    /* Default settings from datasheet. */
    bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,     /* Operating Mode. */
                    Adafruit_BMP280::SAMPLING_X2,     /* Temp. oversampling */
                    Adafruit_BMP280::SAMPLING_X16,    /* Pressure oversampling */
                    Adafruit_BMP280::FILTER_X16,      /* Filtering. */
                    Adafruit_BMP280::STANDBY_MS_500); /* Standby time. */
    setup_wifi();
    client.setServer(mqtt_server, 1883);
    client.setCallback(callback);
    // init and get the time
    configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
}

// For this project, you don't need to change anything in the loop function. Basically it ensures that the NodeMCU is connected to MQTT broker
void loop() {
    if (!client.connected()) {
        reconnect();
    }
    publishMessage();

    if (bmp.readTemperature() > 30) {
        // digitalWrite(motor, HIGH);
        motorOn();
        Serial.print("On");
        auton = 1;
        fan_status = "ON";
    } else {
        if (auton) {
            // digitalWrite(motor, LOW);
            motorOff();
            Serial.print("Off");
            auton = 0;
            fan_status = "OFF";
        }
    }
    delay(200);
    if (!client.loop())
        client.connect("ESP8266Client22");
}

void motorOn() {
    digitalWrite(motorIN1, HIGH);
    digitalWrite(motorIN2, LOW);
    analogWrite(motorEN, 200);  // Full speed, can be adjusted from 0 to 255
}

void motorOff() {
    digitalWrite(motorIN1, LOW);
    digitalWrite(motorIN2, LOW);
    analogWrite(motorEN, 0);  // Set speed to 0 to turn off the motor
}

char* getTime() {
    time_t now;
    struct tm* timeinfo;
    char* timeString = (char*)malloc(sizeof(char) * 20);

    time(&now);
    timeinfo = localtime(&now);
    strftime(timeString, 20, "%Y-%m-%d %H:%M:%S", timeinfo);

    return timeString;
}

float getTemperature() {
    return bmp.readTemperature();
}

float getPressure() {
    return bmp.readPressure();
}

float getAltitude() {
    return bmp.readAltitude(1013.25);
}
