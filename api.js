import express from 'express';
import methodOverride from 'method-override';
import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))




const sequelize = new Sequelize('gestion_agence', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    logging: console.log,
});


const Agence = sequelize.define('Agence', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nom: { type: DataTypes.STRING, allowNull: false },
    adresse: { type: DataTypes.STRING, allowNull: false },
    telephone: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false }
});

export const Vehicule = sequelize.define('Vehicule', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    marque: {
        type: DataTypes.STRING,
        allowNull: false
    },
    modele: {
        type: DataTypes.STRING,
        allowNull: false
    },
    immatriculation: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    annee: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    statut: {
        type: DataTypes.ENUM('disponible', 'loué', 'en réparation'),
        allowNull: false
    },
    prix_par_jour: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    agenceId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false 
});

Agence.hasMany(Vehicule, { foreignKey: 'agenceId' });
Vehicule.belongsTo(Agence, { foreignKey: 'agenceId' });

sequelize.sync();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.post('/agences', async (req, res) => {
    await Agence.create(req.body);
    res.redirect('/');
    
});

app.get('/agences', async (req, res) => {
    try {
        const agences = await Agence.findAll({ include: Vehicule });
        res.render('index', { agences });
    } catch (error) {
        console.error("Erreur lors de la récupération des agences :", error);
        res.status(500).json({ message: "Erreur interne du serveur", error });
    }
});
app.get("/agences/:id", async (req, res) => {
    try {
      const agence = await Agence.findByPk(req.params.id);
  
      if (agence) {
        res.json(agence);
      } else {
        res.status(404).json({ message: "Agence non trouvée" });
      }
  
    } catch (error) {
      console.error("Erreur lors de la récupération de l'agence :", error);
      res.status(500).json({ message: "Erreur interne du serveur", error });
    }
  });
  


  app.put('/agences/:id', async (req, res) => {
    console.log("Données reçues :", req.body); // DEBUG
    const [updated] = await Agence.update(req.body, { where: { id: req.params.id } });

    if (updated) {
        res.json({ message: "Agence mise à jour avec succès" });
    } else {
        res.status(400).json({ message: "Mise à jour échouée" });
    }
});


app.delete('/agences/:id', async (req, res) => {
    await Agence.destroy({ where: { id: req.params.id } });
    res.redirect('/');
});

app.get('/vehicles', async (req, res) => {
    try {
        const vehicles = await Vehicule.findAll();
        res.json(vehicles);
    } catch (error) {
        console.error("Erreur lors de la récupération des véhicules :", error);
        res.status(500).json({ message: "Erreur interne du serveur", error });
    }
});

app.post('/vehicules', async (req, res) => {
    await Vehicule.create(req.body);
    res.redirect('/');
});

app.get('/agences/:agenceId/vehicules', async (req, res) => {
    const vehicules = await Vehicule.findAll({ where: { agenceId: req.params.agenceId } });
    res.json(vehicules);
});

app.put('/vehicules/:id', async (req, res) => {
    await Vehicule.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Véhicule mis à jour' });
});

app.delete('/vehicules/:id', async (req, res) => {
    await Vehicule.destroy({ where: { id: req.params.id } });
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});
