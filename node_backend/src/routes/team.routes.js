const express = require('express');
const router = express.Router();
const {
  listTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = require('../controllers/team.controller');
const { protect, requireAdmin } = require('../middlewares/auth.middleware');

router.get('/', listTeam);
router.post('/', protect, requireAdmin, createTeamMember);
router.put('/:id', protect, requireAdmin, updateTeamMember);
router.delete('/:id', protect, requireAdmin, deleteTeamMember);

module.exports = router;
