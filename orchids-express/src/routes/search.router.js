const express = require('express');
const Logger = require('../utils/Logger');
const router = express.Router();
const searchService = require('../services/search.services');

// fetch search preview only (first 3 items of each category)
router.get('/', async (req, res) => {
    Logger.log('Searching');
    try {
        const { query } = req.query;
        if(query === '') {
            res.status(200).json();
            return;
        }
        const result = await searchService.searchByKeywordPreview(query);
        res.status(200).json(result);
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// fetch all search results (max 20 per category)
router.get('/all', async (req, res) => {
    Logger.log('Searching for all data')
    try {
        const { query } = req.query;
        if(query === '') {
            res.status(200).json();
            return;
        }
        const result = await searchService.searchByKeywordFull(query);
        res.status(200).json(result);
    } catch(error) {
        Logger.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = router;
