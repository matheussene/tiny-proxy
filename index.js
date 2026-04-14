import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/orders", async (req, res) => {
  try {
    const { page, page_size, access_token } = req.body;

    if (!access_token) {
      return res.status(401).json({ error: "Token não enviado" });
    }

    const tinyUrl = `https://api.tiny.com.br/api/v3/orders?page=${page}&page_size=${page_size}`;

    const tinyResponse = await fetch(tinyUrl, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + access_token,
        "Accept": "application/json"
      }
    });

    const data = await tinyResponse.text();

    res.status(tinyResponse.status).send(data);

  } catch (err) {
    console.error("Erro no proxy:", err);
    res.status(500).json({ error: "Erro interno no proxy" });
  }
});

app.get("/", (req, res) => {
  res.send("Proxy Tiny ativo");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Servidor rodando na porta " + port));
