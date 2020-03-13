import ProjectController from '../controllers/projectController';
import StandupController from '../controllers/standupController';
import AuthorizeController from '../controllers/authorizeController';

const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/slack', async (req, res, next) => {
  res.status(200).send('Welcome to slack server');
});

router.post('/interactive', StandupController.standupInteractive);
router.post('/projects/add-project', ProjectController.addProject);
router.get('/projects/list-projects', ProjectController.listProjects);
router.get('/standups/list-standups', StandupController.listStandUp);
router.get('/standups/list-daily-standups', StandupController.listDailyStandUp);
router.get('/authorize', AuthorizeController.authorizeApp);
module.exports = router;
