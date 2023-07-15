const express = require('express');
const router = express.Router();
const DonationService = require('../services/donation.services');

router.get('/', async (req, res) => {
    // 1 is ascending, -1 is descending
    var result = await DonationService.GetListDonation(10, -1);
    // console.log('result-donation: ', result);
    res.send(result);
});

module.exports = router;
