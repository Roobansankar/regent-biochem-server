const pool = require('../db');

exports.getFilterOptions = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM product_filter_options ORDER BY group_name, sort_order'
    );
    if (req.query.raw === '1') {
      return res.json({ options: rows });
    }
    const groups = {};
    for (const row of rows) {
      if (!groups[row.group_name]) groups[row.group_name] = [];
      groups[row.group_name].push(row.option_value);
    }
    const result = Object.entries(groups).map(([title, options]) => ({ title, options }));
    res.json({ groups: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch filter options' });
  }
};

exports.addOption = async (req, res) => {
  const { group_name, option_value } = req.body;
  if (!group_name || !option_value) {
    return res.status(400).json({ error: 'group_name and option_value are required' });
  }
  try {
    const [maxRow] = await pool.query(
      'SELECT COALESCE(MAX(sort_order), 0) + 1 as next FROM product_filter_options WHERE group_name = ?',
      [group_name]
    );
    const sort_order = maxRow[0].next;
    const [result] = await pool.query(
      'INSERT INTO product_filter_options (group_name, option_value, sort_order) VALUES (?, ?, ?)',
      [group_name, option_value, sort_order]
    );
    res.status(201).json({ id: result.insertId, message: 'Option added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add option' });
  }
};

exports.updateOption = async (req, res) => {
  const { id } = req.params;
  const { option_value } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE product_filter_options SET option_value = ? WHERE id = ?',
      [option_value, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Option not found' });
    res.json({ message: 'Option updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update option' });
  }
};

exports.deleteOption = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM product_filter_options WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Option not found' });
    res.json({ message: 'Option deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete option' });
  }
};
