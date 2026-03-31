
import express from "express";
const app = express();
app.use(express.json());

app.get("/", (req,res)=>res.send("LigaPro API rodando"));

app.listen(3001, ()=>console.log("LigaPro backend ativo"));
