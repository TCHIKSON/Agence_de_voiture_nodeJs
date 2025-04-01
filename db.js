import mysli from "mysql2/promise";

const connect = mysli.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "gestion_agence",
});

export default connect;
