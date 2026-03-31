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

app.get("/matches", (req,res)=>{
  const data = loadData();

  const jogos = data.matches.map(m => {
    const t1 = data.teams.find(t => t.id == m.team1_id);
    const t2 = data.teams.find(t => t.id == m.team2_id);

    return {
      id: m.id,
      team1: t1 ? t1.name : "Desconhecido",
      team2: t2 ? t2.name : "Desconhecido",
      score1: m.score1,
      score2: m.score2
    };
  });

  res.json(jogos);
});

// ==============================================

app.listen(3001, ()=>console.log("LigaPro backend ativo"));

// CLASSIFICAÇÃO
app.get("/table", (req,res)=>{
  const data = loadData();

  const table = {};

  // inicializa times
  data.teams.forEach(t => {
    table[t.id] = {
      name: t.name,
      points: 0,
      goals_for: 0,
      goals_against: 0
    };
  });

  // percorre jogos
  data.matches.forEach(m => {
    const t1 = table[m.team1_id];
    const t2 = table[m.team2_id];

    if (!t1 || !t2) return;

    t1.goals_for += m.score1;
    t1.goals_against += m.score2;

    t2.goals_for += m.score2;
    t2.goals_against += m.score1;

    if (m.score1 > m.score2) {
      t1.points += 3;
    } else if (m.score2 > m.score1) {
      t2.points += 3;
    } else {
      t1.points += 1;
      t2.points += 1;
    }
  });

  // transforma em array e ordena
  const ranking = Object.values(table).sort((a,b)=>{
    if (b.points !== a.points) return b.points - a.points;
    return (b.goals_for - b.goals_against) - (a.goals_for - a.goals_against);
  });

  res.json(ranking);
});
