// controllers/bracketController.js
const { Bracket, Tournament, Ticket, Profile } = require('../models');
const { Op } = require('sequelize');

/**
 * Generate a tournament bracket.
 * This method pairs checked-in participants and creates a bracket.
 */
exports.generateBracket = async (req, res) => {
  try {
    const tournamentId = req.params.tournamentId;

    // Find tournament
    const tournament = await Tournament.findByPk(tournamentId);
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found.' });
    }

    // Get checked-in tickets
    const tickets = await Ticket.findAll({
      where: { tournament_id: tournament.tournament_id, status: 'checked_in' },
      include: [{ model: Profile, attributes: ['profile_id', 'name'] }],
    });

    if (tickets.length < 2) {
      return res.status(400).json({ error: 'Not enough players to generate a bracket.' });
    }

    // Extract player profiles
    const players = tickets.map((ticket) => ticket.Profile);

    // Generate bracket data
    const bracketData = generateBracketData(players);

    // Create or update bracket
    let bracket = await Bracket.findOne({ where: { tournament_id: tournament.tournament_id } });
    if (bracket) {
      // Update existing bracket
      bracket.bracket_data = bracketData;
      await bracket.save();
    } else {
      // Create new bracket
      bracket = await Bracket.create({
        tournament_id: tournament.tournament_id,
        bracket_data: bracketData,
      });
    }

    res.status(201).json({
      bracket_id: bracket.bracket_id,
      message: 'Bracket generated successfully.',
      bracket_data: bracket.bracket_data,
    });
  } catch (error) {
    console.error('Generate Bracket Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
/**
 * Get a tournament bracket by ID.
 */
exports.getBracketByTournamentId = async (req, res) => {
  try {
    const tournamentId = req.params.tournamentId;

    const bracket = await Bracket.findOne({ where: { tournament_id: tournamentId } });
    if (!bracket) {
      return res.status(404).json({ error: 'Bracket not found.' });
    }

    res.status(200).json({ data: bracket });
  } catch (error) {
    console.error('Get Bracket Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Helper function to generate bracket data.
 */
function generateBracketData(players) {
  // Shuffle players
  const shuffled = players.sort(() => 0.5 - Math.random());

  // Create initial matches
  const matches = [];
  for (let i = 0; i < shuffled.length; i += 2) {
    matches.push({
      player1: shuffled[i],
      player2: shuffled[i + 1] || null, // Handle odd number of players
      winner: null,
    });
  }

  const bracket = {
    rounds: [
      {
        round: 1,
        matches,
      },
    ],
  };

  // Generate subsequent rounds
  let currentMatches = matches;
  let roundNumber = 1;
  while (currentMatches.length > 1) {
    roundNumber += 1;
    const nextRoundMatches = [];
    for (let i = 0; i < currentMatches.length; i += 2) {
      nextRoundMatches.push({
        player1: null,
        player2: null,
        winner: null,
      });
    }
    bracket.rounds.push({
      round: roundNumber,
      matches: nextRoundMatches,
    });
    currentMatches = nextRoundMatches;
  }

  return bracket;
}

