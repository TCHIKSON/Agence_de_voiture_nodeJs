import express from "express";
const app = express();
const port = 4000;
import connect from "./db.js";
app.use(express.json());


app.get("/agence", async (req, res) => {
  const [rows] = await connect.execute("SELECT * FROM agences");
  res.status(200).json(rows);
});

app.get("/agence/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const [rowId] = await connect.execute(
    "SELECT * FROM agences WHERE id =?"[id]
  );
  if (rowId.length>0) {
    res.status(200).json(rowId[0]);
  } else {
    res.status(404).json({ message: "Produit non trouvé" });
  }
});

app.post("/produits", (req, res) => {
  const nouveauProduit = req.body;
  nouveauProduit.id = produits.length + 1;
  produits.push(nouveauProduit);
  res.status(201).json(nouveauProduit);
});

app.put("/produits/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = produits.findIndex((p) => p.id === id);
  if (index !== -1) {
    produits[index] = { id, ...req.body };
    res.json(produits[index]);
  } else {
    res.status(404).json({ message: "Produit non trouvé" });
  }
});

app.delete("/produits/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = produits.findIndex((p) => p.id === id);
  if (index !== -1) {
    produits.splice(index, 1);
    res.json({ message: "Produit supprimé" });
  } else {
    res.status(404).json({ message: "Produit non trouvé" });
  }
});

app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
