const models = require('../models');

const { Project } = models;

const ProjectController = {
  async addProject(req, res) {
    try {
      const { name, description } = req.body;
      if (!name) return res.status(500).send({ status: 'Error', data: 'name of project cannot be empty' });
      const project = await Project.create({
        name,
        description,
      });
      return res.status(200).send({ status: 'Success', data: project });
    } catch (e) {
      console.log(e);
      return res.status(500).send({ status: 'Error', data: 'an error occured' });
    }
  },

  async listProjects(req, res) {
    try {
      const projects = await Project.findAll();
      return res.status(200).send({ status: 'Success', data: projects });
    } catch (e) {
      console.log(e);
      return res.status(500).send({ status: 'Error', data: 'an error occured' });
    }
  },
};

export default ProjectController;
