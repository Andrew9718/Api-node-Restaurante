const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const Restaurantes = require("./routes/restaurantes");
app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/", (req, res) => {
    res.json({ message: "ok" });
});

app.use("/Restaurantes", Restaurantes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
    return;
});
app.listen(port, () => {
    console.log(`Vista en puesto Local http://localhost:${port}`);
});