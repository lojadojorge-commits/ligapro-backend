import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const FILE = "data.json";

function loadData() {
  if (!fs.existsSync(FILE)) {
    return { users: [], leagues: {} };
  }
  return JSON.parse(fs.readFileSync(FILE));
}

function saveData(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// ================= USUÁRIOS =================

// CADASTRO
app.post("/register", (req,res)=>{
  const data = loadData();
  const { email, password } = req.body;

  const exists = data.users.find(u => u.email === email);
  if (exists) return res.status(400).json({ error: "Usuário já existe" });

  const user = {
    id: Date.now(),
    email,
    password,
    plan: "free"
  };

  data.users.push(user);
  data.leagues[user.id] = { teams: [], matches: [] };

  saveData(data);

  res.json({ message: "Usuário criado" });
});

// LOGIN
app.post("/login", (req,res)=>{
  const data = loadData();
  const { email, password } = req.body;

  const user = data.users.find(u => u.email === email && u.password === password);

  if (!user) return res.status(401).json({ error: "Login inválido" });

  res.json({ userId: user.id });
});

// ================= TIMES =================

app.post("/teams", (req,res)=>{
  const data = loadData();
  const { userId, name } = req.body;

  const team = { id: Date.now(), name };

  data.leagues[userId].teams.push(team);
  saveData(data);

  res.json({ message: "Time criado" });
});

app.get("/teams/:userId", (req,res)=>{
  const data = loadData();
  res.json(data.leagues[req.params.userId].teams);
});

// ================= JOGOS =================

app.post("/matches", (req,res)=>{
  const data = loadData();
  const { userId, team1_id, team2_id } = req.body;

  const match = {
    id: Date.now(),
    team1_id,
    team2_id,
    score1: 0,
    score2: 0
  };

  data.leagues[userId].matches.push(match);
  saveData(data);

  res.json({ message: "Jogo criado" });
});

app.get("/matches/:userId", (req,res)=>{
  const data = loadData();
  const league = data.leagues[req.params.userId];

  const jogos = league.matches.map(m => {
    const t1 = league.teams.find(t => t.id == m.team1_id);
    const t2 = league.teams.find(t => t.id == m.team2_id);

    return {
      id: m.id,
      team1: t1?.name,
      team2: t2?.name,
      score1: m.score1,
      score2: m.score2
    };
  });

  res.json(jogos);
});

app.listen(3001, ()=>console.log("LigaPro SaaS rodando"));
