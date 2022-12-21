require("dotenv").config()

const cors = require("cors")
const express = require("express")

const router = require("./routes/index.js")

const port = process.env.PORT || 8090

const app = express()

app.use(express.json())
app.use(cors())

app.use("/api", router)

app.listen(port, () => console.log("Express server listening on port", port))