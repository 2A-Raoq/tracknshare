export interface EmojiItem {
  emoji: string
  name: string
  keywords: string[]
}

export interface EmojiCategory {
  id: string
  label: string
  icon: string
  emojis: EmojiItem[]
}

export const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    id: 'smileys',
    label: 'Smileys',
    icon: '😀',
    emojis: [
      { emoji: '😀', name: 'grinning', keywords: ['sourire', 'content', 'joie'] },
      { emoji: '😂', name: 'joy', keywords: ['rire', 'lol', 'mort'] },
      { emoji: '🤣', name: 'rofl', keywords: ['rire', 'sol', 'hilare'] },
      { emoji: '😊', name: 'smile', keywords: ['sourire', 'doux', 'sympa'] },
      { emoji: '😎', name: 'sunglasses', keywords: ['cool', 'lunettes', 'swag'] },
      { emoji: '😍', name: 'heart_eyes', keywords: ['amour', 'yeux', 'coeur'] },
      { emoji: '🥰', name: 'smiling_hearts', keywords: ['amour', 'coeur', 'affection'] },
      { emoji: '😘', name: 'kissing_heart', keywords: ['bisou', 'coeur', 'kiss'] },
      { emoji: '🤔', name: 'thinking', keywords: ['reflexion', 'hmm', 'pensee'] },
      { emoji: '😅', name: 'sweat_smile', keywords: ['sueur', 'rire', 'genant'] },
      { emoji: '😭', name: 'crying', keywords: ['pleurer', 'triste', 'larmes'] },
      { emoji: '😤', name: 'triumph', keywords: ['colere', 'arrogant', 'humph'] },
      { emoji: '😡', name: 'angry', keywords: ['colere', 'rage', 'furieux'] },
      { emoji: '🤯', name: 'exploding_head', keywords: ['choc', 'esprit', 'ouf'] },
      { emoji: '🥳', name: 'partying', keywords: ['fete', 'celebration', 'party'] },
      { emoji: '😴', name: 'sleeping', keywords: ['dormir', 'ennui', 'fatigue'] },
      { emoji: '🫡', name: 'saluting', keywords: ['salut', 'respect', 'soldat'] },
      { emoji: '😏', name: 'smirk', keywords: ['malicieux', 'satisfait', 'arrogant'] },
      { emoji: '🙄', name: 'eyeroll', keywords: ['soupir', 'yeux', 'blasé'] },
      { emoji: '😬', name: 'grimace', keywords: ['gene', 'malaise', 'awkward'] },
      { emoji: '🤗', name: 'hugging', keywords: ['calin', 'tendresse', 'hug'] },
      { emoji: '😇', name: 'angel', keywords: ['ange', 'innocent', 'saint'] },
      { emoji: '🤩', name: 'star_struck', keywords: ['etoile', 'impressionne', 'wow'] },
      { emoji: '😒', name: 'unamused', keywords: ['ennui', 'bof', 'indifferent'] },
    ],
  },
  {
    id: 'gestures',
    label: 'Gestes',
    icon: '👋',
    emojis: [
      { emoji: '👋', name: 'wave', keywords: ['salut', 'aurevoir', 'hello'] },
      { emoji: '👍', name: 'thumbsup', keywords: ['ok', 'bien', 'approuve'] },
      { emoji: '👎', name: 'thumbsdown', keywords: ['non', 'mauvais', 'nope'] },
      { emoji: '👏', name: 'clap', keywords: ['applaudir', 'bravo', 'clap'] },
      { emoji: '🙌', name: 'raised_hands', keywords: ['celebration', 'haut', 'yes'] },
      { emoji: '🤝', name: 'handshake', keywords: ['accord', 'deal', 'poignee'] },
      { emoji: '🫶', name: 'heart_hands', keywords: ['coeur', 'mains', 'amour'] },
      { emoji: '✌️', name: 'peace', keywords: ['paix', 'victoire', 'deux'] },
      { emoji: '🤞', name: 'fingers_crossed', keywords: ['chance', 'espoir', 'croises'] },
      { emoji: '🤙', name: 'call_me', keywords: ['appelle', 'shaka', 'cool'] },
      { emoji: '💪', name: 'muscle', keywords: ['force', 'bras', 'fort'] },
      { emoji: '🫵', name: 'pointing', keywords: ['toi', 'pointer', 'vous'] },
      { emoji: '🤜', name: 'fist_right', keywords: ['poing', 'bump', 'fight'] },
      { emoji: '🤛', name: 'fist_left', keywords: ['poing', 'bump', 'gauche'] },
      { emoji: '🖐️', name: 'raised_hand', keywords: ['stop', 'cinq', 'main'] },
      { emoji: '🙏', name: 'pray', keywords: ['priere', 'merci', 'please'] },
    ],
  },
  {
    id: 'hearts',
    label: 'Cœurs',
    icon: '❤️',
    emojis: [
      { emoji: '❤️', name: 'red_heart', keywords: ['coeur', 'amour', 'rouge'] },
      { emoji: '🧡', name: 'orange_heart', keywords: ['coeur', 'orange'] },
      { emoji: '💛', name: 'yellow_heart', keywords: ['coeur', 'jaune'] },
      { emoji: '💚', name: 'green_heart', keywords: ['coeur', 'vert'] },
      { emoji: '💙', name: 'blue_heart', keywords: ['coeur', 'bleu'] },
      { emoji: '💜', name: 'purple_heart', keywords: ['coeur', 'violet'] },
      { emoji: '🖤', name: 'black_heart', keywords: ['coeur', 'noir', 'dark'] },
      { emoji: '🤍', name: 'white_heart', keywords: ['coeur', 'blanc'] },
      { emoji: '💔', name: 'broken_heart', keywords: ['coeur', 'brise', 'triste'] },
      { emoji: '❤️‍🔥', name: 'heart_fire', keywords: ['coeur', 'feu', 'passion'] },
      { emoji: '💕', name: 'two_hearts', keywords: ['coeur', 'deux', 'amour'] },
      { emoji: '💞', name: 'revolving_hearts', keywords: ['coeur', 'tournant'] },
      { emoji: '💓', name: 'beating_heart', keywords: ['coeur', 'battant'] },
      { emoji: '✨', name: 'sparkles', keywords: ['etincelles', 'brillant', 'magie'] },
      { emoji: '⭐', name: 'star', keywords: ['etoile', 'cool', 'super'] },
      { emoji: '🌟', name: 'glowing_star', keywords: ['etoile', 'brillant', 'top'] },
    ],
  },
  {
    id: 'gaming',
    label: 'Gaming',
    icon: '🎮',
    emojis: [
      { emoji: '🎮', name: 'gaming', keywords: ['jeu', 'manette', 'game'] },
      { emoji: '🏆', name: 'trophy', keywords: ['trophee', 'victoire', 'win'] },
      { emoji: '🥇', name: 'gold_medal', keywords: ['or', 'premier', 'podium'] },
      { emoji: '🎯', name: 'dart', keywords: ['cible', 'precision', 'bullseye'] },
      { emoji: '⚡', name: 'lightning', keywords: ['eclair', 'rapide', 'flash'] },
      { emoji: '💥', name: 'boom', keywords: ['explosion', 'impact', 'crash'] },
      { emoji: '⚔️', name: 'swords', keywords: ['epees', 'combat', 'fight'] },
      { emoji: '🛡️', name: 'shield', keywords: ['bouclier', 'defense', 'tank'] },
      { emoji: '💎', name: 'gem', keywords: ['diamant', 'rare', 'valeur'] },
      { emoji: '👑', name: 'crown', keywords: ['couronne', 'roi', 'rank'] },
      { emoji: '🚀', name: 'rocket', keywords: ['fusee', 'rapide', 'boost'] },
      { emoji: '🔥', name: 'fire', keywords: ['feu', 'chaud', 'hot', 'gg'] },
      { emoji: '💀', name: 'skull', keywords: ['crane', 'mort', 'kill', 'rip'] },
      { emoji: '🎲', name: 'dice', keywords: ['de', 'chance', 'random'] },
      { emoji: '🏅', name: 'medal', keywords: ['medaille', 'podium', 'top'] },
      { emoji: '🎖️', name: 'military_medal', keywords: ['medaille', 'militaire', 'rank'] },
      { emoji: '💣', name: 'bomb', keywords: ['bombe', 'explosion', 'grenade'] },
      { emoji: '🎪', name: 'circus', keywords: ['cirque', 'show', 'event'] },
      { emoji: '🕹️', name: 'joystick', keywords: ['joystick', 'arcade', 'retro'] },
      { emoji: '🃏', name: 'joker_card', keywords: ['carte', 'joker', 'wild'] },
    ],
  },
  {
    id: 'misc',
    label: 'Divers',
    icon: '💬',
    emojis: [
      { emoji: '💬', name: 'speech', keywords: ['message', 'parole', 'chat'] },
      { emoji: '📢', name: 'loudspeaker', keywords: ['annonce', 'micro', 'loud'] },
      { emoji: '✅', name: 'check', keywords: ['ok', 'valide', 'yes', 'done'] },
      { emoji: '❌', name: 'cross', keywords: ['non', 'faux', 'no', 'erreur'] },
      { emoji: '⚠️', name: 'warning', keywords: ['attention', 'alerte', 'warn'] },
      { emoji: '📌', name: 'pin', keywords: ['epingle', 'important', 'note'] },
      { emoji: '🔔', name: 'bell', keywords: ['cloche', 'notif', 'son'] },
      { emoji: '🎉', name: 'party', keywords: ['fete', 'confetti', 'bravo'] },
      { emoji: '🎊', name: 'confetti', keywords: ['confetti', 'celebration'] },
      { emoji: '🤖', name: 'robot', keywords: ['robot', 'bot', 'ia', 'auto'] },
      { emoji: '👾', name: 'alien_monster', keywords: ['monstre', 'pixel', 'arcade'] },
      { emoji: '💤', name: 'zzz', keywords: ['dormir', 'ennui', 'zzz', 'afk'] },
      { emoji: '🌙', name: 'moon', keywords: ['lune', 'nuit', 'dark'] },
      { emoji: '☀️', name: 'sun', keywords: ['soleil', 'jour', 'bright'] },
      { emoji: '❓', name: 'question', keywords: ['question', 'quoi', 'pourquoi'] },
      { emoji: '‼️', name: 'exclamation', keywords: ['important', 'alerte', 'urgent'] },
      { emoji: '💯', name: 'hundred', keywords: ['cent', 'parfait', 'top', '100'] },
      { emoji: '🆙', name: 'up', keywords: ['up', 'monte', 'haut'] },
      { emoji: '🔑', name: 'key', keywords: ['cle', 'acces', 'unlock'] },
      { emoji: '⏰', name: 'alarm', keywords: ['alarme', 'heure', 'temps'] },
    ],
  },
]

export const ALL_EMOJIS: EmojiItem[] = EMOJI_CATEGORIES.flatMap((cat) => cat.emojis)

export function searchEmojis(query: string): EmojiItem[] {
  const q = query.toLowerCase()
  return ALL_EMOJIS.filter(
    (e) =>
      e.name.includes(q) ||
      e.keywords.some((k) => k.includes(q)),
  ).slice(0, 8)
}
