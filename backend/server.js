import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();

app.use(cors());
app.use(express.json());

const FILE = "data.json";

// carregar dados
function loadData() {
  if (!fs.existsSync(FILE)) {
    return { teams: [], matches: [] };
  }
  return JSON.parse(fs.readFileSync(FILE));
}

// salvar dados
function saveData(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// TESTE
app.get("/", (req,res)=>res.send("LigaPro API rodando"));

// ==================== TIMES ====================

app.post("/teams", (req,res)=>{
  const data = loadData();
  const { name } = req.body;

  const team = {
    id: Date.now(),
    name
  };

  data.teams.push(team);
  saveData(data);

  res.json({ message: "Time salvo" });
});

app.get("/teams", (req,res)=>{
  const data = loadData();
  res.json(data.teams);
});

// ==================== JOGOS ====================

app.post("/matches", (req,res)=>{
  const data = loadData();
  const { team1_id, team2_id } = req.body;

  const match = {
    id: Date.now(),
    team1_id,
    team2_id,
    score1: 0,
    score2: 0
  };

  data.matches.push(match);
  saveData(data);

  res.json({ message: "Jogo criado" });
});

app.get("/matches", (req,res)=>{
  const data = loadData();
  res.json(data.matches);
});

app.post("/matches/score", (req,res)=>{
  const data = loadData();
  const { id, score1, score2 } = req.body;

  const match = data.matches.find(m => m.id == id);

  if (match) {
    match.score1 = score1;
    match.score2 = score2;
    saveData(data);
  }

  res.json({ message: "Placar atualizado" });
});

// ==============================================

app.listen(3001, ()=>console.log("LigaPro backend ativo"));
