import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';

export function startAetherGame(): Phaser.Game | null {
  const container = document.getElementById('phaser-canvas-parent');
  if (!container) return null;

  const rect = container.getBoundingClientRect();
  const initialW = Math.max(360, Math.floor(rect.width || window.innerWidth));
  const initialH = Math.max(360, Math.floor(rect.height || window.innerHeight - 60));

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'phaser-canvas-parent',
    width: initialW,
    height: initialH,
    backgroundColor: '#2a4528',
    scene: [GameScene],
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.NO_CENTER,
    },
    render: {
      pixelArt: true,
      antialias: false,
      roundPixels: true,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
  };

  return new Phaser.Game(config);
}
