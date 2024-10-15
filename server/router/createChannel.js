// server/router/createChannel.js
const Channel = require('../models/Channel');
const Group = require('../models/Group');

module.exports = function(req, res) {
  const { groupId, name } = req.body;
  const userId = req.user._id;

  // Check if user is admin of the group
  Group.findOne({ _id: groupId, admins: userId })
    .then(group => {
      if (!group) return res.status(403).json({ ok: false, error: 'Not authorized' });

      const channel = new Channel({
        name,
        group: groupId,
        users: group.users
      });

      return channel.save()
        .then(channel => {
          group.channels.push(channel._id);
          return group.save()
            .then(() => res.json({ ok: true, channel }));
        });
    })
    .catch(err => res.status(500).json({ ok: false, error: err.message }));
};
