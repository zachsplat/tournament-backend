// controllers/bracketController.js
const { Bracket, Tournament, Ticket, Profile } = require('../models');

exports.generateBracket = async (req, res, next) => {
  try {
    const tournamentId = req.params.id;

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
    const players = tickets.map(ticket => ticket.Profile);

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
      public_url: `http://${req.get('host')}/api/brackets/${bracket.bracket_id}`,
    });
  } catch (error) {
    console.error('Generate Bracket Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.getBracket = async (req, res, next) => {
  try {
    const bracketId = req.params.id;

    const bracket = await Bracket.findByPk(bracketId);
    if (!bracket) {
      return res.status(404).json({ error: 'Bracket not found.' });
    }

    res.status(200).json(bracket);
  } catch (error) {
    console.error('Get Bracket Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Helper function to generate bracket data
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
  let currentRound = 1;
  while (matches.length > 1) {
    currentRound += 1;
    const nextRoundMatches = [];
    for (let i = 0; i < matches.length; i += 2) {
      nextRoundMatches.push({
        player1: null,
        player2: null,
        winner: null,
      });
    }
    bracket.rounds.push({
      round: currentRound,
      matches: nextRoundMatches,
    });
    matches = nextRoundMatches;
  }

  return bracket;
}
