const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());


app.use('/repositories/:id', (req, res, next) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: 'Id invalid' });
  }

  return next();
});

const repositories = [];

app.get("/repositories", (request, response) => {  
  response.json(repositories);
});

app.post("/repositories", (request, response) => {  
  const { title, url, techs } = request.body; 
   
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => { 
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const index = repositories.findIndex(repository =>  repository.id == id);

  if (index < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  const updates = {
    title,
    url,
    techs
  };

  repositories[index] = Object.assign({}, repositories[index], updates);

  return response.json(repositories[index]);

});

app.delete("/repositories/:id", (request, response) => {  
  const { id } = request.params;

  const index = repositories.findIndex(repository =>  repository.id == id);

  if (index < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {

  const { id } = request.params;

  const index = repositories.findIndex(repository =>  repository.id == id);

  if (index < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  repositories[index].likes += 1;

  return response.json(repositories[index]);
  
});

module.exports = app;
