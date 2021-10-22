"use strict";

const express = require('express');
const cors = require('cors');
const apiRoutes = require("./routes/api.routes");

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', apiRoutes);

app.listen(3000);