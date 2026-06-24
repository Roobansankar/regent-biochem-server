const pool = require('../db');

exports.createJob = async (req, res) => {
  const { title, department, location, type, experience, description, overview, responsibilities, qualification, experience_detail, skills } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO jobs (title, department, location, type, experience, description, overview, responsibilities, qualification, experience_detail, skills) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, department, location, type, experience, description, overview, JSON.stringify(responsibilities), qualification, experience_detail, JSON.stringify(skills)]
    );
    res.status(201).json({ id: result.insertId, message: 'Job created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create job' });
  }
};

exports.getJobs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [totalRows] = await pool.query('SELECT COUNT(*) as total FROM jobs');
    const total = totalRows[0].total;
    const [rows] = await pool.query(
      'SELECT * FROM jobs ORDER BY created_at ASC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const jobs = rows.map(job => ({
      ...job,
      responsibilities: typeof job.responsibilities === 'string' ? JSON.parse(job.responsibilities) : job.responsibilities,
      skills: typeof job.skills === 'string' ? JSON.parse(job.skills) : job.skills
    }));

    res.json({ jobs, total, page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

exports.getJobById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Job not found' });

    const job = rows[0];
    job.responsibilities = typeof job.responsibilities === 'string' ? JSON.parse(job.responsibilities) : job.responsibilities;
    job.skills = typeof job.skills === 'string' ? JSON.parse(job.skills) : job.skills;

    res.json({ job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
};

exports.updateJob = async (req, res) => {
  const { id } = req.params;
  const { title, department, location, type, experience, description, overview, responsibilities, qualification, experience_detail, skills } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE jobs SET title=?, department=?, location=?, type=?, experience=?, description=?, overview=?, responsibilities=?, qualification=?, experience_detail=?, skills=? WHERE id=?',
      [title, department, location, type, experience, description, overview, JSON.stringify(responsibilities), qualification, experience_detail, JSON.stringify(skills), id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update job' });
  }
};

exports.deleteJob = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM jobs WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete job' });
  }
};
