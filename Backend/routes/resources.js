const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    try {
        const resources = await pool.query(
            'SELECT * FROM resources ORDER BY id DESC'
        );
        res.json(resources.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ 
            error: 'Server error fetching resources' 
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, author, year, file_name, file_url } = req.body;

        const newResource = await pool.query(
            'INSERT INTO resources (title, author, year, file_name, file_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, author, year, file_name, file_url]
        );

        res.status(201).json({ 
            message: 'Resource uploaded successfully!', 
            resource: newResource.rows[0] 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ 
            error: 'Server error uploading resource' 
        });
    } 
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const resourceCheck = await pool.query('SELECT * FROM resources WHERE id = $1', [id]);
        if (resourceCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        await pool.query('DELETE FROM resources WHERE id = $1', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error during deletion' });
    }
});

module.exports = router;