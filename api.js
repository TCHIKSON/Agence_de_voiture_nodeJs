import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('gestion_agence', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});


const Agence = sequelize.define('Agence', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nom: { type: DataTypes.STRING, allowNull: false },
    adresse: { type: DataTypes.STRING, allowNull: false },
    telephone: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false }
});

const Vehicule = sequelize.define('Vehicule', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    marque: { type: DataTypes.STRING, allowNull: false },
    modele: { type: DataTypes.STRING, allowNull: false },
    immatriculation: { type: DataTypes.STRING, allowNull: false, unique: true },
    annee: { type: DataTypes.INTEGER, allowNull: false },
    statut: { type: DataTypes.ENUM('disponible', 'loué', 'en réparation'), allowNull: false },
    prix_par_jour: { type: DataTypes.FLOAT, allowNull: false }
});

Agence.hasMany(Vehicule, { foreignKey: 'agenceId' });
Vehicule.belongsTo(Agence, { foreignKey: 'agenceId' });

sequelize.sync();

const app = express();
app.use(express.json());

app.post('/agences', async (req, res) => {
    const agence = await Agence.create(req.body);
    res.json(agence);
});

app.get('/agences', async (req, res) => {
    const agences = await Agence.findAll();
    res.json(agences);
});

app.put('/agences/:id', async (req, res) => {
    await Agence.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Agence mise à jour' });
});

app.delete('/agences/:id', async (req, res) => {
    await Agence.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Agence supprimée' });
});

app.post('/vehicules', async (req, res) => {
    const vehicule = await Vehicule.create(req.body);
    res.json(vehicule);
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
    res.json({ message: 'Véhicule supprimé' });
});

app.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});
