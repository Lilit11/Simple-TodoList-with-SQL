const express = require("express");
const app = express();
const bp = require("body-parser");
app.use(bp.json());
const { Op, Sequelize, DataTypes } = require("sequelize");

const sql = new Sequelize({
  dialect: "sqlite",
  storage: "./mydb.sqlite",
});

const Todos = sql.define("Todo", {
  title: DataTypes.STRING,
  start: DataTypes.DATE,
  end: DataTypes.DATE,
});

sql.sync().then(() => {
  console.log("Sync is done");
});

app.get("/", async (req, res) => {
  const result = await Todos.findAll();
  res.status(200).send(result);
});

app.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await Todos.findByPk(id);
  res.status(200).send(result);
});

app.post("/", async (req, res) => {
  const { title, start, end } = req.body;
  const todo = await Todos.create({ title, start, end });
  res.status(201).send(todo);
});

app.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const { title, start, end } = req.body;
  const todo = await Todos.findByPk(id);
  todo.title = title;
  todo.start = start;
  todo.end = end;
  todo.save();
  res.status(200).send(todo);
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const todo = await Todos.findByPk(id);
  await todo.destroy();
  res.status(200).send(" Todo successfully deleted");
});
app.listen(3002, () => {
  console.log("server is running");
});
