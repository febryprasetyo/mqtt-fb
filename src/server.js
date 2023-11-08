const mqtt = require('mqtt');
require('dotenv').config();
const { db } = require('./utils/firebase');
// import { getDatabase, ref, set } from 'firebase/database';

const host = process.env.MQTT_HOST;
const port = process.env.MQTT_PORT;
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const connectUrl = `mqtt://${host}:${port}`;

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASSWORD,
  reconnectPeriod: process.env.MQTT_KEEP_ALIVE,
});

const topic = process.env.MQTT_TOPIC;

const initRef = db.collection('watermonitoring');
client.on('connect', () => {
  console.log('Connected');

  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`);
  });
});

client.on('message', async (topic, payload) => {
  console.log('Received Message:', topic, payload.toString());
  const jsonString = JSON.parse(payload.toString());

  let uuid = jsonString['uuid'];

  let dataStream =
    jsonString['data'] && jsonString['data'].length > 0
      ? jsonString['data']
      : [];
  for (let i = 0; i < dataStream.length; i++) {
    const el = dataStream[i];
    const monitoringRef = initRef.doc(uuid);

    const res = await monitoringRef.set({
      uuid: uuid,
      time: el['time'],
      temperature: el['Temperature'],
      do_: el['DO'],
      tur: el['TUR'],
      ph: el['PH'],
      bod: el['BOD'],
      cod: el['COD'],
      tss: el['TSS'],
      depeth: el['DEPTH'],
      no3_3: el['NO3-3'],
      n: el['N'],
      ct: el['CT'],
      no2: el['NO2'],
      orp: el['ORP'],
    });
    console.log('data store on firestore :' + uuid);
  }
});
