const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

// middleware especificados nessa rota (tourRoutes.js), serão apenas para essa rota
// middleware function que é executada conforme um parametro
//router.param('id', tourController.checkID);

router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.createTour); //roda primeiro um middleware e depois outro

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;