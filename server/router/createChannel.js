// server/router/createChannel.js
const Channel = require('../models/Channel');
const Group = require('../models/Group');

module.exports = async function(req, res) {
  const { groupId, name } = req.body;
  const userId = req.user._id;

  try {
    // Check if user is admin of the group
    const group = await Group.findOne({ _id: groupId, admins: userId });
    if (!group) {
      return res.status(403).json({ ok: false, error: 'Not authorized' });
    }

    const channel = new Channel({
      name,
      group: groupId,
      users: group.users,
    });

    const savedChannel = await channel.save();
    group.channels.push(savedChannel._id);
    await group.save();

    res.json({ ok: true, channel: savedChannel });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};
