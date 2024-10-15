// server/router/createGroup.js
const Group = require('../models/Group');

module.exports = function(req, res) {
  const { name } = req.body;
  const userId = req.user._id;

  const group = new Group({
    name,
    admins: [userId],
    channels: [],
    users: [userId]
  });

  group.save()
    .then(group => res.json({ ok: true, group }))
    .catch(err => res.status(500).json({ ok: false, error: err.message }));
};
