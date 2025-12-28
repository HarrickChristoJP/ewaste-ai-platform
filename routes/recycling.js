const express = require('express');
const router = express.Router();

// Get nearby recycling centers
router.get('/centers', async (req, res) => {
  const { lat, lng, radius = 10 } = req.query;
  
  // Mock data - integrate with Google Maps API
  const centers = [
    {
      name: "E-Waste Recyclers Inc.",
      address: "123 Green Street, City",
      distance: "2.5 km",
      accepts: ["Batteries", "Circuit Boards", "Plastics"],
      rating: 4.5
    }
  ];
  
  res.json(centers);
});

module.exports = router;