const Team = require('../models/Team');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/team (Public)
const listTeam = asyncHandler(async (req, res) => {
  const members = await Team.find().sort({ createdAt: 1 });
  res.status(200).json(members);
});

// POST /api/team (Admin only)
const createTeamMember = asyncHandler(async (req, res) => {
  const { name, role, image_url, bio, qualifications, experience, linkedin_url, twitter_url, email } = req.body;

  if (!name || !role) {
    return res.status(400).json({ detail: 'Name and role are required.' });
  }

  const member = await Team.create({
    name,
    role,
    image_url,
    bio,
    qualifications,
    experience,
    linkedin_url,
    twitter_url,
    email,
  });

  res.status(201).json(member);
});

// PUT /api/team/:id (Admin only)
const updateTeamMember = asyncHandler(async (req, res) => {
  const { name, role, image_url, bio, qualifications, experience, linkedin_url, twitter_url, email } = req.body;

  const member = await Team.findById(req.params.id);
  if (!member) {
    return res.status(404).json({ detail: 'Team member not found.' });
  }

  if (name !== undefined) member.name = name;
  if (role !== undefined) member.role = role;
  if (image_url !== undefined) member.image_url = image_url;
  if (bio !== undefined) member.bio = bio;
  if (qualifications !== undefined) member.qualifications = qualifications;
  if (experience !== undefined) member.experience = experience;
  if (linkedin_url !== undefined) member.linkedin_url = linkedin_url;
  if (twitter_url !== undefined) member.twitter_url = twitter_url;
  if (email !== undefined) member.email = email;

  await member.save();
  res.status(200).json(member);
});

// DELETE /api/team/:id (Admin only)
const deleteTeamMember = asyncHandler(async (req, res) => {
  const member = await Team.findByIdAndDelete(req.params.id);
  if (!member) {
    return res.status(404).json({ detail: 'Team member not found.' });
  }
  res.status(200).json({ detail: 'Team member deleted successfully.' });
});

module.exports = {
  listTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
};
