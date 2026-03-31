
import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();

app.use(cors());
app.use(express.json());

// CONEXÃO COM MYSQL
const db = mysql.createConnection({
  host: "SEU_HOST",
  user: "SEU_USUARIO",
  password: "SUA_SENHA",
  database: "SEU_BANCO"
});

db.connect(err => {
  if (err) {
    console.log("Erro no banco:", err);
  } else {
    console.log("Banco conectado");
  }
});

// TESTE
app.get("/", (req,res)=>res.send("LigaPro API rodando"));

// CRIAR TIME
app.post("/teams", (req,res)=>{
  const { name } = req.body;

  db.query(
    "INSERT INTO teams (name) VALUES (?)",
    [name],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Time salvo no banco" });
    }
  );
});

// LISTAR TIMES
app.get("/teams", (req,res)=>{
  db.query("SELECT * FROM teams", (err, result)=>{
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.listen(3001, ()=>console.log("LigaPro backend ativo"));
