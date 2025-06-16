const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

// Simple user for demo
const USERS = [{ username: "admin", password: "password" }];

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Simple login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) {
    // On success, redirect to dashboard (simple, no session)
    res.redirect("/dashboard.html");
  } else {
    // On failure, redirect back to login with error
    res.redirect("/index.html?error=Invalid%20Credentials");
  }
});

// API to simulate solar panel parameters
app.get("/api/solar", (req, res) => {
  res.json({
    power: 1200,
    voltage: 320,
    current: 3.75,
    temperature: 45,
    lightIntensity: 9000,
    solarIrradiance: 800
  });
});

// API to simulate battery parameters
app.get("/api/battery", (req, res) => {
  res.json({
    power: 500,
    voltage: 48,
    current: 10.4,
    temperature: 35
  });
});

// API to simulate solar tracking
app.get("/api/tracking", (req, res) => {
  res.json({
    position: "South-East",
    angle: 45
  });
});

// API to simulate alert system
app.get("/api/alerts", (req, res) => {
  // If any parameter below threshold, send alert
  res.json({
    alert: false,
    message: "No alert message"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



const mysql = require('mysql2');
//const express = require('express');
const axios = require('axios');
//const app = express();
//const PORT = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // change if needed
  password: '#Krithish20',       // your MySQL password
  database: 'blynk_data'
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ Connected to MySQL");
});


app.get('/store', async (req, res) => {
  const token = 'T7nJdhKmrKCrmGPgpXtHOVCJk2reqZ0U';  // your Blynk token

  try {
    const [voltage, current, ldr, temp, mppt] = await Promise.all([
      axios.get(`https://blynk.cloud/external/api/get?token=${token}&v0`),
      axios.get(`https://blynk.cloud/external/api/get?token=${token}&v1`),
      axios.get(`https://blynk.cloud/external/api/get?token=${token}&v2`),
      axios.get(`https://blynk.cloud/external/api/get?token=${token}&v3`),
      axios.get(`https://blynk.cloud/external/api/get?token=${token}&v4`)
    ]);

    const query = `
      INSERT INTO sensor_values (voltage, current, ldr_value, temperature, mppt_voltage)
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [voltage.data, current.data, ldr.data, temp.data, mppt.data];

    db.query(query, values, (err, result) => {
      if (err) throw err;
      res.send("✅ Sensor values inserted successfully.");
    });

  } catch (error) {
    console.error("❌ Error fetching or inserting data:", error);
    res.status(500).send("Error storing sensor values.");
  }
});


setInterval(() => {
  axios.get("http://localhost:3000/store")
       .then(() => console.log("✅ Data stored"))
       .catch(err => console.error("❌ Store error:", err));
}, 10000); // every 10 seconds
