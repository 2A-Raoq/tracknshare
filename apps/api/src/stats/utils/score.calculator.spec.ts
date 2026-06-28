import {
  calculateKdRatio,
  calculateWinrate,
  calculateScore,
} from './score.calculator';

describe('score.calculator', () => {
  describe('calculateKdRatio', () => {
    it('calcule le ratio kills/deaths arrondi à 2 décimales', () => {
      expect(calculateKdRatio(10, 4)).toBe(2.5);
      expect(calculateKdRatio(7, 3)).toBe(2.33);
    });

    it('traite 0 mort comme 1 mort pour éviter la division par zéro', () => {
      expect(calculateKdRatio(5, 0)).toBe(5);
      expect(calculateKdRatio(0, 0)).toBe(0);
    });

    it('renvoie 0 quand il n’y a aucun kill', () => {
      expect(calculateKdRatio(0, 10)).toBe(0);
    });
  });

  describe('calculateWinrate', () => {
    it('calcule le pourcentage de victoires arrondi à l’entier', () => {
      expect(calculateWinrate(50, 100)).toBe(50);
      expect(calculateWinrate(1, 3)).toBe(33);
      expect(calculateWinrate(2, 3)).toBe(67);
    });

    it('renvoie 0 quand aucune partie n’a été jouée', () => {
      expect(calculateWinrate(0, 0)).toBe(0);
      expect(calculateWinrate(5, 0)).toBe(0);
    });

    it('renvoie 100 quand toutes les parties sont gagnées', () => {
      expect(calculateWinrate(20, 20)).toBe(100);
    });
  });

  describe('calculateScore', () => {
    it('applique la formule officielle KD×50 + winrate×40 + parties×0.5', () => {
      // 2 * 50 + 60 * 40 + 100 * 0.5 = 100 + 2400 + 50 = 2550
      expect(calculateScore(2, 60, 100)).toBe(2550);
    });

    it('renvoie 0 quand aucune partie n’a été jouée', () => {
      expect(calculateScore(5, 100, 0)).toBe(0);
    });

    it('arrondit le résultat à l’entier le plus proche', () => {
      // 1.337 * 50 + 33 * 40 + 25 * 0.5 = 66.85 + 1320 + 12.5 = 1399.35 -> 1399
      expect(calculateScore(1.337, 33, 25)).toBe(1399);
    });

    it('reste cohérent avec les fonctions de calcul amont', () => {
      const kills = 30;
      const deaths = 20;
      const wins = 12;
      const matchesPlayed = 25;

      const kd = calculateKdRatio(kills, deaths); // 1.5
      const wr = calculateWinrate(wins, matchesPlayed); // 48
      const score = calculateScore(kd, wr, matchesPlayed);

      // 1.5 * 50 + 48 * 40 + 25 * 0.5 = 75 + 1920 + 12.5 = 2007.5 -> 2008
      expect(kd).toBe(1.5);
      expect(wr).toBe(48);
      expect(score).toBe(2008);
    });
  });
});
