// controllers/profileController.js

const { Profile } = require('../models');
const { validationResult } = require('express-validator');
const path = require('path');

/**
 * Create a new profile.
 */
exports.createProfile = async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Handle avatar upload
    let avatarUrl = null;
    if (req.file) {
      avatarUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;
    }

    // Create profile
    const profile = await Profile.create({
      user_id: req.user.user_id,
      name: req.body.name,
      avatar: avatarUrl,
      bio: req.body.bio || null,
    });

    res.status(201).json({
      success: true,
      data: {
        profile_id: profile.profile_id,
        message: 'Profile created successfully.',
        avatar: avatarUrl,
      },
    });
  } catch (error) {
    console.error('Create Profile Error:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};

/**
 * Get all profiles for the authenticated user with pagination and filtering.
 */
exports.getUserProfiles = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, name } = req.query;
    const offset = (page - 1) * limit;

    const where = { user_id: req.user.user_id };

    if (name) {
      where.name = { [Op.iLike]: `%${name}%` };
    }

    const { rows: profiles, count } = await Profile.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']],
    });

    res.status(200).json({
      success: true,
      data: profiles,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Get User Profiles Error:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};

/**
 * Update an existing profile.
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const { name, bio } = req.body;

    // Find profile
    const profile = await Profile.findOne({
      where: { profile_id: profileId, user_id: req.user.user_id },
    });

    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found.' });
    }

    // Handle avatar upload
    if (req.file) {
      profile.avatar = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;
    }

    // Update other fields
    if (name) profile.name = name;
    if (bio) profile.bio = bio;

    await profile.save();

    res.status(200).json({
      success: true,
      data: {
        message: 'Profile updated successfully.',
        profile,
      },
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};

/**
 * Delete an existing profile.
 */
exports.deleteProfile = async (req, res, next) => {
  try {
    const { profileId } = req.params;

    // Find profile
    const profile = await Profile.findOne({
      where: { profile_id: profileId, user_id: req.user.user_id },
    });

    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found.' });
    }

    // Optional: Check for dependencies (e.g., tickets) before deletion
    // const ticketCount = await Ticket.count({ where: { profile_id: profileId } });
    // if (ticketCount > 0) {
    //   return res.status(400).json({ success: false, error: 'Cannot delete profile with existing tickets.' });
    // }

    // Delete profile
    await profile.destroy();

    res.status(200).json({ success: true, message: 'Profile deleted successfully.' });
  } catch (error) {
    console.error('Delete Profile Error:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};

exports.createProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let avatarPath = null;
    if (req.file) {
      avatarPath = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;
    }

    const profile = await Profile.create({
      user_id: req.user.user_id,
      name: req.body.name,
      avatar: avatarPath,
      bio: req.body.bio || null,
    });

    res.status(201).json({ profile_id: profile.profile_id, message: 'Profile created successfully.' });
  } catch (error) {
    console.error('Create Profile Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const profile = await Profile.findOne({ where: { profile_id: profileId, user_id: req.user.user_id } });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found.' });
    }

    const { name, bio } = req.body;
    if (req.file) {
      profile.avatar = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;
    }
    profile.name = name || profile.name;
    profile.bio = bio || profile.bio;

    await profile.save();

    res.status(200).json({ message: 'Profile updated successfully.', profile });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.getUserProfiles = async (req, res, next) => {
  try {
    const profiles = await Profile.findAll({ where: { user_id: req.user.user_id } });
    res.status(200).json(profiles);
  } catch (error) {
    console.error('Get Profiles Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
