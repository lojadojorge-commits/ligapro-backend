
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

let teams = []; // simulação de banco (por enquanto)

// TESTE
app.get("/", (req,res)=>res.send("LigaPro API rodando"));

// CRIAR TIME
app.post("/teams", (req,res)=>{
  const { name } = req.body;
  teams.push({ id: teams.length + 1, name });
  res.json({ message: "Time criado" });
});

// LISTAR TIMES
app.get("/teams", (req,res)=>{
  res.json(teams);
});

app.listen(3001, ()=>console.log("LigaPro backend ativo"));
