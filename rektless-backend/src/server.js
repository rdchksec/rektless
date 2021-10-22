"use strict";

const express = require('express');
const cors = require('cors');
const apiRoutes = require("./routes/api.routes");
const redis = require("./services/redis");

const app = express();

app.use(cors());
redis.init();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', apiRoutes);

app.listen(3000);