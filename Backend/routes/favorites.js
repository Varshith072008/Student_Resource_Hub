const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
    try {
        const { user_id, title, author, year, file_url, file_name } = req.body;
        
        if (!user_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        let resourceQuery = await pool.query(
            "SELECT id FROM resources WHERE LOWER(file_url) = LOWER($1)",
            [file_url]
        );

        let resource_id;
        if (resourceQuery.rows.length > 0) {
            resource_id = resourceQuery.rows[0].id;
        } else {
            const resolvedFileName = file_name || 'External Textbook';
            const newRes = await pool.query(
                "INSERT INTO resources (title, author, year, file_name, file_url) VALUES ($1, $2, $3, $4, $5) RETURNING id",
                [title, author || 'Unknown', year || 2000, resolvedFileName, file_url]
            );
            resource_id = newRes.rows[0].id;
        }

        const newFav = await pool.query(
            "INSERT INTO favorites (user_id, resource_id) VALUES ($1, $2) RETURNING *",
            [user_id, resource_id]
        );
        res.status(201).json(newFav.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: "Already in favorites" });
        }
        console.error("Favorites POST Error:", err.message);
        res.status(500).json({ error: "Server error adding favorite" });
    }
});

router.delete('/:user_id/:resource_id', async (req, res) => {
    try {
        const { user_id, resource_id } = req.params;

        await pool.query(
            "DELETE FROM favorites WHERE user_id = $1 AND resource_id = $2",
            [user_id, resource_id]
        );
        res.json({ message: "Removed from favorites successfully" });
    } catch (err) {
        console.error("Favorites DELETE Error:", err.message);
        res.status(500).json({ error: "Server error removing favorite" });
    }
});

router.get('/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params;

        const favorites = await pool.query(
            `SELECT r.* FROM resources r 
             JOIN favorites f ON r.id = f.resource_id 
             WHERE f.user_id = $1`,
            [user_id]
        );
        res.json(favorites.rows);
    } catch (err) {
        console.error("Favorites GET Error:", err.message);
        res.status(500).json({ error: "Server error fetching favorites" });
    }
});

module.exports = router;