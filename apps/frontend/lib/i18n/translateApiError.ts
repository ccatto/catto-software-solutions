/**
 * Maps backend API error messages to i18n translation keys.
 *
 * Three lookup strategies applied in order:
 * 1. Exact match: for static error strings
 * 2. Pattern match: regex for dynamic errors, extracts ICU params
 * 3. Fallback: returns null (caller should use original message)
 */

// --- Exact Match Map ---
// Maps the exact backend error string to an i18n key under "apiErrors" namespace
const EXACT_ERROR_MAP: Record<string, string> = {
  // Auth
  'Invalid credentials': 'auth.invalidCredentials',
  'User not found': 'auth.userNotFound',
  'Please use social login for this account': 'auth.useSocialLogin',
  'User with this email already exists': 'auth.emailExists',
  'Invalid refresh token': 'auth.invalidRefreshToken',
  'Invalid reset token': 'auth.invalidResetToken',
  'Invalid or expired reset token': 'auth.invalidOrExpiredResetToken',
  'If this email exists, a reset link has been sent':
    'auth.resetLinkSentIfExists',
  'No valid authentication provided': 'auth.noValidAuth',
  'Authentication required': 'auth.authRequired',
  'Platform admin access required': 'auth.platformAdminRequired',

  // Messaging
  'Cannot message yourself': 'messaging.cannotMessageSelf',
  'Cannot message this user': 'messaging.cannotMessageUser',
  'You can only message friends': 'messaging.friendsOnly',
  'Invalid preset message key': 'messaging.invalidPresetKey',
  'Conversation not found': 'messaging.conversationNotFound',
  'You are not a participant in this conversation': 'messaging.notParticipant',

  // Friends
  'Cannot send a friend request to yourself': 'friends.cannotRequestSelf',
  'You are already friends with this user': 'friends.alreadyFriends',
  'A friend request already exists between you and this user':
    'friends.requestExists',
  'Friend request not found': 'friends.requestNotFound',
  'Only the recipient can accept a friend request':
    'friends.onlyRecipientAccept',
  'Only the recipient can decline a friend request':
    'friends.onlyRecipientDecline',
  'Only the sender can cancel a friend request': 'friends.onlySenderCancel',
  'Can only cancel pending requests': 'friends.canOnlyCancelPending',
  'You are not part of this friendship': 'friends.notPartOfFriendship',
  'Can only unfriend accepted requests': 'friends.canOnlyUnfriendAccepted',

  // Social (follow/block/report)
  'Cannot follow yourself': 'social.cannotFollowSelf',
  'Cannot block yourself': 'social.cannotBlockSelf',
  'Cannot report yourself': 'social.cannotReportSelf',
  'Reported user not found': 'social.reportedUserNotFound',

  // Invites
  'Invalid invite token or code': 'invites.invalidTokenOrCode',
  'This invite has expired': 'invites.expired',
  'This invite has reached its maximum uses': 'invites.maxUsesReached',
  'This invite was sent to a different email address': 'invites.wrongEmail',
  'You are already a member of this organization': 'invites.alreadyMember',
  'This invite is already revoked': 'invites.alreadyRevoked',
  'Invite not found': 'invites.notFound',
  'You are not a member of this organization': 'invites.notMember',
  'You do not have permission to create invites': 'invites.noCreatePermission',
  'You do not have permission to send this invite': 'invites.noSendPermission',
  'You do not have permission to revoke this invite':
    'invites.noRevokePermission',
  'You do not have permission to view invites': 'invites.noViewPermission',

  // OTP
  'Too many verification codes requested. Please try again in an hour.':
    'otp.tooManyRequests',
  'Invalid phone number format. Please use format: (555) 123-4567 or +15551234567':
    'otp.invalidPhoneFormat',
  'Failed to send verification code. Please try again.': 'otp.sendFailed',
  'Verification code expired or not found. Please request a new code.':
    'otp.codeExpiredOrNotFound',
  'Too many failed attempts. Please request a new verification code.':
    'otp.tooManyFailedAttempts',

  // Draft
  'Draft has already started': 'draft.alreadyStarted',
  'Draft is not in progress': 'draft.notInProgress',
  "It is not this team's turn to pick": 'draft.notYourTurn',
  'Player is not available for drafting': 'draft.playerNotAvailable',
  'Player is already in the draft pool': 'draft.playerAlreadyInPool',
  'Draft teams have already been finalized': 'draft.teamsAlreadyFinalized',
  'Cannot add players after draft has started': 'draft.cannotAddAfterStart',
  'Cannot designate captains after draft has started':
    'draft.cannotDesignateCaptainsAfterStart',
  'Cannot modify captains after draft has started':
    'draft.cannotModifyCaptainsAfterStart',
  'Cannot remove players after draft has started':
    'draft.cannotRemoveAfterStart',
  'Cannot finalize teams until draft is complete':
    'draft.cannotFinalizeUntilComplete',
  'Cannot modify draft tournament after draft has started':
    'draft.cannotModifyAfterStart',
  'Cannot delete draft tournament after draft has started':
    'draft.cannotDeleteAfterStart',
  'Must provide player_id, user_id, or player_name':
    'draft.mustProvidePlayerIdentifier',

  // Pickup / Open Play
  'You can only update your own check-ins': 'pickup.canOnlyUpdateOwn',
  'You can only cancel your own check-ins': 'pickup.canOnlyCancelOwn',
  "You can't react to your own check-in": 'pickup.cannotReactToOwn',
  'This session is not open for registration':
    'openPlay.notOpenForRegistration',
  'This session is full': 'openPlay.sessionFull',
  'You are already registered for this session': 'openPlay.alreadyRegistered',
  'Registration not found': 'common.registrationNotFound',
  'Organization not found': 'common.organizationNotFound',
  'Only organization admins can create open play sessions':
    'openPlay.adminOnlyCreate',
  'Only organization admins can perform this action':
    'openPlay.adminOnlyAction',

  // Scoring
  'Match or tournament not found': 'scoring.matchOrTournamentNotFound',
  'Score not found': 'scoring.scoreNotFound',
  'No dispute found for this score': 'scoring.noDisputeFound',

  // Tournament - general
  'No standings found for this tournament': 'tournament.noStandings',
  'Seed must be a positive number': 'tournament.seedMustBePositive',
  'One or more tournament teams not found': 'tournament.teamsNotFound',
  'Duplicate seeds detected in the update': 'tournament.duplicateSeeds',
  'All seeds must be positive numbers': 'tournament.allSeedsMustBePositive',
  'One or more division teams not found': 'tournament.divisionTeamsNotFound',

  // Tournament divisions
  'Tournament division not found': 'tournament.divisionNotFound',
  'Registration is closed for this division': 'tournament.registrationClosed',
  'Team is already registered for this division':
    'tournament.teamAlreadyRegistered',
  'This division is already added to the tournament':
    'tournament.divisionAlreadyAdded',
  'This is a singles division. Teams with two players cannot register.':
    'tournament.singlesDivisionNoDoubles',
  'This is a doubles division. A second player is required.':
    'tournament.doublesDivisionNeedTwo',
  'Cannot remove division with registered teams. Please remove team registrations first.':
    'tournament.cannotRemoveDivisionWithTeams',
  'Double elimination requires at least 4 teams':
    'tournament.doubleElimMin4Teams',

  // League
  'League season division not found': 'league.divisionNotFound',
  'Season not found': 'league.seasonNotFound',
  'Failed to generate playoffs': 'league.failedToGeneratePlayoffs',
  'This division is already added to the league season':
    'league.divisionAlreadyAdded',
  // Note: 'Cannot remove division with registered teams...' is mapped to tournament.cannotRemoveDivisionWithTeams above
  // (same message used by both league and tournament APIs)
  'Need at least 2 approved teams to generate a schedule':
    'league.needAtLeast2Teams',

  // QR Check-in
  'Invalid QR code': 'qr.invalidCode',
  'Only admins can check in players': 'qr.adminOnlyCheckIn',
  'No check-in found for this user': 'qr.noCheckInFound',

  // Division Templates
  'Division template not found': 'divisionTemplates.notFound',
  'System preset templates cannot be deleted':
    'divisionTemplates.cannotDeletePreset',
  'System preset templates can only be modified by platform admins':
    'divisionTemplates.platformAdminOnly',

  // Payments
  'Stripe is not configured': 'payments.stripeNotConfigured',
  'Failed to generate checkout URL': 'payments.checkoutUrlFailed',

  // Sports
  'Sport not found': 'sport.notFound',

  // Accounts
  'Account not found': 'accounts.notFound',

  // Organization
  'Organization member not found': 'organization.memberNotFound',
  'Organization role not found': 'organization.roleNotFound',

  // SMS
  'Telnyx is not configured on this server': 'sms.notConfigured',

  // Clinic Series
  'Clinic series not found': 'clinic.notFound',
  'Clinic is not open for registration': 'clinic.notOpen',
  'This clinic is full': 'clinic.full',
  'You are already registered for this clinic': 'clinic.alreadyRegistered',
  'Payment is required for paid clinics': 'clinic.paymentRequired',
  'Only draft clinics can be modified': 'clinic.onlyDraftModify',

  // Instructor / Booking
  'Instructor profile not found': 'instructor.profileNotFound',
  'This instructor is not currently active': 'instructor.notActive',
  'Payment required for paid lessons': 'instructor.paymentRequired',
  'This time slot is no longer available': 'instructor.slotTaken',
  'Only confirmed bookings can be cancelled': 'instructor.onlyConfirmedCancel',
  'Only confirmed bookings can be marked as completed':
    'instructor.onlyConfirmedComplete',
  'Booking not found': 'instructor.bookingNotFound',
  'Blocked date not found': 'instructor.blockedDateNotFound',
};

// --- Pattern Match Rules ---
interface PatternRule {
  pattern: RegExp;
  key: string;
  extract: (match: RegExpMatchArray) => Record<string, string>;
}

const PATTERN_RULES: PatternRule[] = [
  // OTP attempts remaining
  {
    pattern: /^Invalid verification code\. (\d+) attempts? remaining\.$/,
    key: 'otp.invalidCodeAttemptsRemaining',
    extract: (m) => ({ attempts: m[1] }),
  },
  // Friend request already actioned
  {
    pattern: /^This request has already been (\w+)$/,
    key: 'friends.requestAlreadyActioned',
    extract: (m) => ({ status: m[1] }),
  },
  // Invite has been status
  {
    pattern: /^This invite has been (\w+)$/,
    key: 'invites.hasBeenStatus',
    extract: (m) => ({ status: m[1] }),
  },
  // Draft captains needed
  {
    pattern: /^Need (\d+) captains to start draft, only (\d+) designated$/,
    key: 'draft.needMoreCaptains',
    extract: (m) => ({ needed: m[1], actual: m[2] }),
  },
  // Draft captains needed (alternate)
  {
    pattern: /^Need (\d+) captains, only (\d+) designated$/,
    key: 'draft.needMoreCaptains',
    extract: (m) => ({ needed: m[1], actual: m[2] }),
  },
  // Draft players needed
  {
    pattern:
      /^Need (\d+) available players for (\d+) teams of (\d+), only (\d+) available$/,
    key: 'draft.needMorePlayers',
    extract: (m) => ({
      needed: m[1],
      teams: m[2],
      rosterSize: m[3],
      available: m[4],
    }),
  },
  // Draft position already assigned
  {
    pattern: /^Draft position (\d+) is already assigned$/,
    key: 'draft.positionAlreadyAssigned',
    extract: (m) => ({ position: m[1] }),
  },
  // Maximum captains allowed
  {
    pattern: /^Maximum (\d+) captains allowed$/,
    key: 'draft.maxCaptainsAllowed',
    extract: (m) => ({ max: m[1] }),
  },
  // Rating below minimum
  {
    pattern:
      /^(.+?) rating \(([0-9.]+)\) is below the minimum required(?: rating)? \(([0-9.]+)\) for this division\.$/,
    key: 'tournament.ratingBelowMinimum',
    extract: (m) => ({ subject: m[1], rating: m[2], minimum: m[3] }),
  },
  // Rating exceeds maximum
  {
    pattern:
      /^(.+?) rating \(([0-9.]+)\) exceeds the maximum allowed(?: rating)? \(([0-9.]+)\) for this division\.$/,
    key: 'tournament.ratingExceedsMaximum',
    extract: (m) => ({ subject: m[1], rating: m[2], maximum: m[3] }),
  },
  // Team average rating below minimum
  {
    pattern:
      /^Team average rating \(([0-9.]+)\) is below the minimum required \(([0-9.]+)\) for this division\.$/,
    key: 'tournament.teamAvgRatingBelowMinimum',
    extract: (m) => ({ rating: m[1], minimum: m[2] }),
  },
  // Team average rating exceeds maximum
  {
    pattern:
      /^Team average rating \(([0-9.]+)\) exceeds the maximum allowed \(([0-9.]+)\) for this division\.$/,
    key: 'tournament.teamAvgRatingExceedsMaximum',
    extract: (m) => ({ rating: m[1], maximum: m[2] }),
  },
  // Tournament status transition
  {
    pattern: /^Cannot transition from "(.+?)" to "(.+?)"\./,
    key: 'tournament.invalidTransition',
    extract: (m) => ({ from: m[1], to: m[2] }),
  },
  // League playoff seeds
  {
    pattern: /^Number of seeds must be (.+)$/,
    key: 'league.invalidSeedCount',
    extract: (m) => ({ validCounts: m[1] }),
  },
  // Not enough teams for playoffs
  {
    pattern:
      /^Not enough teams\. Requested (\d+) seeds but only (\d+) teams have standings\.$/,
    key: 'league.notEnoughTeamsForPlayoffs',
    extract: (m) => ({ requested: m[1], available: m[2] }),
  },
  // Division template already exists
  {
    pattern: /^Division template "(.+?)" already exists/,
    key: 'divisionTemplates.alreadyExists',
    extract: (m) => ({ name: m[1] }),
  },
  // Draft tournament already exists
  {
    pattern: /^Draft tournament already exists for tournament (\d+)$/,
    key: 'draft.tournamentAlreadyExists',
    extract: (m) => ({ id: m[1] }),
  },
  // Generic resource with ID not found (must be last - catches many patterns)
  {
    pattern: /^(.+?) with ID "?(\S+?)"? not found$/,
    key: 'generic.resourceNotFound',
    extract: (m) => ({ resource: m[1], id: m[2] }),
  },
  // Generic resource + id not found (e.g., "Tournament 42 not found")
  {
    pattern: /^(\w[\w\s]*?) (\d+) not found$/,
    key: 'generic.resourceNotFound',
    extract: (m) => ({ resource: m[1], id: m[2] }),
  },
];

/**
 * Resolve a backend API error message to an i18n key + params.
 * Returns null if no mapping is found (caller should fall back to original message).
 */
export function resolveApiErrorKey(
  message: string,
): { key: string; params: Record<string, string> } | null {
  // 1. Exact match
  const exactKey = EXACT_ERROR_MAP[message];
  if (exactKey) {
    return { key: exactKey, params: {} };
  }

  // 2. Pattern match
  for (const rule of PATTERN_RULES) {
    const match = message.match(rule.pattern);
    if (match) {
      return { key: rule.key, params: rule.extract(match) };
    }
  }

  // 3. No match
  return null;
}
