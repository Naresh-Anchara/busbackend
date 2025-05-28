const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const Bus = require('../models/busModel');
const Booking = require('../models/bookingModel')
const authMiddlewares = require('../middlewares/authMiddlewares');

// Add Bus
router.post('/add-bus', authMiddlewares, async (req, res) => {
  try {
    const existingBus = await Bus.findOne({ number: req.body.number });
    if (existingBus) {
      return res.status(200).send({
        success: false,
        message: 'Bus already exists',
      });
    }
   
    const newBus = new Bus(req.body);
    await newBus.save();
    return res.status(200).send({
      success: true,
      message: 'Bus added successfully',
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Delete Bus
router.post("/delete-bus", authMiddlewares, async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.body._id);
    await Booking.deleteMany({ bus: new ObjectId(req.body._id) });
    return res.status(200).send({
      success: true,
      message: "Bus deleted successfully",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Update Bus
router.post("/update-bus", authMiddlewares, async (req, res) => {
  try {
    await Bus.findByIdAndUpdate(req.body._id, req.body);
    return res.status(200).send({
      success: true,
      message: "Bus updated successfully",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});


// Get all Buses (Changed POST to GET)
router.post("/get-all-buses", authMiddlewares, async (req, res) => {
  try {
    const buses = await Bus.find();
    const filteredBuses = buses.filter(bus => 
      (req.body.from ? bus.from.trim() === req.body.from : true) && 
      (req.body.to ? bus.to.trim() === req.body.to : true) && 
      (req.body.journeyDate ? bus.journeyDate === req.body.journeyDate : true)
    );    
    return res.status(200).send({
      success: true,
      message: "Buses fetched successfully",
      data: filteredBuses,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

//get bus by id
router.post("/get-bus-by-id", authMiddlewares, async (req, res) => {
  try {
    const bus = await Bus.findById(req.body._id);
    return res.status(200).send({
      success: true,
      message: "Buses fetched successfully",
      data: bus,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

module.exports = router;
