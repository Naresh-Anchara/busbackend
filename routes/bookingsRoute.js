const moogoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Booking = require('../models/bookingModel');
const Bus = require('../models/busModel');
const authMiddlewares = require('../middlewares/authMiddlewares');
// book a seat
router.post('/book-seat', authMiddlewares, async (req, res) => {
  try {
    const newBooking = new Booking({
      ...req.body,
      transactionId: "1234",
      user: req.body.userId,
    });
    await newBooking.save();

    const bus = await Bus.findById(req.body.bus);
    if (!bus) {
      return res.status(404).send({
        message: 'Bus not found',
        success: false,
      });
    }

    bus.seatBooked = [...bus.seatBooked, ...req.body.seats];
    await bus.save();

    res.status(200).send({
      message: 'Booking successful',
      data: newBooking,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Booking failed',
      data: error,
      success: false,
    });
  }
});
//get booking by user
router.post('/get-bookings-by-user-id',authMiddlewares,async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.body.userId })
    .populate("bus")
    .populate("user");

  res.status(200).send({
    message: 'Booking fetched successfully',
    data: bookings,
    success: true,
  });
  } 
  catch (error) {
    res.status(500).send({ 
        message: "Booking fetch failed",
        data : error,
        success: false,  
    });
  }
});
module.exports = router;