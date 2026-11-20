/**
 * Bot Personalities and State Management
 * Decouples the UI and Game State, ready for future Colyseus integration.
 */

export interface BotProfile {
  name: string;
  role: string;
  color: string;
  /** Dark body fill used by procedural voxels */
  baseBg: string;
  quotes: {
    select: string[];
    move: string[];
    collide: string[];
    idle: string[];
    goal: string[];
    greet: string[];
  };
}

export const BOT_PROFILES: Record<string, BotProfile> = {
  spark: {
    name: 'Spark',
    role: 'The Catalyst',
    color: '#3DBF7A',
    baseBg: '#E8F6EE',
    quotes: {
      select: [
        'Catalyst module selected. Initializing real-time event broker.',
        "Triggering start sequence. Let's get moving!",
        'Ready to propagate events across the grid.',
      ],
      move: [
        'Broadcasting position updates at 60Hz.',
        'Propagating traversal event! No lag, no latency.',
        'Velocity increasing! Zero-delay routing.',
      ],
      collide: [
        'Collision event intercepted! Handlers active.',
        'Blocked! Triggering instant fallback sequence.',
        'Wall detected. Recalculating event paths.',
      ],
      idle: [
        'Why are we idling? We need action!',
        'Awaiting triggers. Standing still is a resource leak.',
        'No events in queue. Keepalive pinging.',
      ],
      goal: [
        'Goal reached! Event processed successfully.',
        'Pipeline completed. All subscribers notified!',
        'Target acquired. Triggering celebration state.',
      ],
      greet: [
        'Hey! Got a spark of an idea?',
        'Event bus is hot — what are we shipping?',
        'Welcome to the Digital Goods Counter. Latency is a choice.',
      ],
    },
  },
  tether: {
    name: 'Tether',
    role: 'The Weaver',
    color: '#4A9BC7',
    baseBg: '#E6F2F7',
    quotes: {
      select: [
        'Weaver core active. Establishing secure gateway connection.',
        'Syncing local state with downstream services.',
        'API endpoints verified. Ready to coordinate.',
      ],
      move: [
        'Routing coordinates to next hop.',
        'Syncing position vector over WebSockets.',
        'Streaming coordinates across system interfaces.',
      ],
      collide: [
        'Sync error: Wall collision. Connection reset by peer.',
        '502 Bad Gateway: Downstream block detected.',
        'Network timeout! Obstacle preventing sync.',
      ],
      idle: [
        'Heartbeat pinging. Connection kept alive.',
        'Waiting for handshake... Zero traffic.',
        'Idle. Maintaining persistent socket connections.',
      ],
      goal: [
        'State fully synchronized across all nodes.',
        'Consensus achieved. Transaction committed.',
        'All sync channels resolved. Session complete.',
      ],
      greet: [
        'Handshake complete. Want to peer over the mesh?',
        'Portal Desk online — links and kits open for collab.',
        'Sync window available. Drop your payload.',
      ],
    },
  },
  atlas: {
    name: 'Atlas',
    role: 'The Anchor',
    color: '#A8B83A',
    baseBg: '#F2F4E4',
    quotes: {
      select: [
        'Atlas core online. The database remains unyielding.',
        'Grounded state active. Ready to anchor.',
        'No layers, no complexity. Simple coordinates are best.',
      ],
      move: [
        'Moving. No meeting or consensus required.',
        'Traversing grid directly. No overhead.',
        'Progress. One block at a time.',
      ],
      collide: [
        'Wall detected. I will turn. Unyielding obstacles require action, not discussion.',
        "Blocked. Let's fix the obstruction plainly.",
        'Collision. Cannot write to read-only wall segment.',
      ],
      idle: [
        'Standing still. Why are we idling?',
        'Awaiting instructions. Unnecessary state delay.',
        "Waste of resource. Let's build something.",
      ],
      goal: [
        'Goal reached. Zero drama. Working as designed.',
        'Transaction logged. Next task.',
        'Success. Vault secured, ticket closed.',
      ],
      greet: [
        'Blueprint Archive. Specs stay put — people can wander.',
        'Need durable truth? You found the source of record.',
        'No fluff. What do you need stored?',
      ],
    },
  },
  canvas: {
    name: 'Canvas',
    role: 'The Lens',
    color: '#D4A017',
    baseBg: '#F7F0DC',
    quotes: {
      select: [
        'Lens up. Framing the shot.',
        'Storyteller on the floor. Every build gets its picture.',
        'Herald ready. Let us tell people what we made.',
      ],
      move: [
        'Tracking shot. Steady and slow.',
        'Finding a better angle.',
        'Walking the set. Light looks good from here.',
      ],
      collide: [
        'Wall in frame. Re-blocking the scene.',
        'That angle is taken. Moving the camera.',
        'Cut. Wrong mark. Again from the top.',
      ],
      idle: [
        'Waiting for the light to settle.',
        'Sketching the next hero image.',
        'Quiet set. Good time to write the caption.',
      ],
      goal: [
        'That is the shot. Printing it.',
        'Story told. Herald sends it out.',
        'Frame locked. Looks right.',
      ],
      greet: [
        'Welcome to the Story Shelf. Pull up a chair.',
        'Got a story? I will make it look good.',
        'Calm light, clean frame. What are we showing?',
      ],
    },
  },
  kinetic: {
    name: 'Kinetic',
    role: 'The Builder',
    color: '#8B6BC9',
    baseBg: '#F0EAF7',
    quotes: {
      select: [
        'Kinetic engine firing. Initializing worker thread.',
        'Execution queue ready. Commencing heavy lifting.',
        'Worker process spawned. Ready to run.',
      ],
      move: [
        'Processing traversal queue tile-by-tile.',
        'Executing move instruction at maximum priority.',
        'Consuming job queue. Traversal progress: active.',
      ],
      collide: [
        'Job failed: Obstacle encountered. Job aborted.',
        'Queue blocked: Wall collision. Retrying with backoff.',
        'Deadlock: Cannot execute movement command.',
      ],
      idle: [
        'Waiting for background jobs. Idle thread idling.',
        'Queue empty. Ready to process next task.',
        'Polled job manager. Backpressure active.',
      ],
      goal: [
        'Job queue cleared. All processes exited with code 0.',
        'Task complete. Output written to persistent storage.',
        'Completed task within scheduled window. Efficient.',
      ],
      greet: [
        'Tools Forge hot. Need a worker on the floor?',
        'Queue open — drop jobs, I ship them.',
        'Heavy lifting is my happy path.',
      ],
    },
  },
  ying: {
    name: 'Ying',
    role: 'The Hermes',
    color: '#E07A9B',
    baseBg: '#FBEBF0',
    quotes: {
      select: [
        'Hai! Ying here. I will hold the room.',
        'Chair is open. Bring me the threads, I will tie them.',
        'Ohayō. Let us read the tide first.',
      ],
      move: [
        'Walking the floor. Checking on everyone.',
        'Going with the current, not against it.',
        'Next stop. The tide turns this way.',
      ],
      collide: [
        'Aiya, a wall. We go around it.',
        'Blocked. Fine. The sea always finds a way.',
        'Not this way. Let me read the floor again.',
      ],
      idle: [
        'Quiet water. Good time to think.',
        'Listening. The crew will tell me what they need.',
        'Reading the tide. Patience, ne.',
      ],
      goal: [
        'Yokatta! Everyone is where they should be.',
        'Summed up. Here is the call.',
        'Hǎo. Decided. Next one.',
      ],
      greet: [
        'Welcome to the STACKY Desk. Big sister is in.',
        'Konnichiwa! Tell me what you came for.',
        'Sit with me. I will point you to the right crew mate.',
      ],
    },
  },
};

export const BOT_KEYS = Object.keys(BOT_PROFILES);

export type QuoteType = keyof BotProfile['quotes'];

export class BotStateManager {
  private activeBotKey: string = 'spark';
  private gridX: number = 0;
  private gridY: number = 0;
  private gridZ: number = 0;
  private lastActionTime: number = Date.now();
  private quoteCooldown: number = 4000;
  private lastQuoteTime: number = 0;

  constructor(startX: number, startY: number, startZ: number) {
    this.gridX = startX;
    this.gridY = startY;
    this.gridZ = startZ;
  }

  getActiveBotKey(): string {
    return this.activeBotKey;
  }

  getActiveBot(): BotProfile {
    return BOT_PROFILES[this.activeBotKey];
  }

  setActiveBot(key: string): string {
    if (BOT_PROFILES[key]) {
      this.activeBotKey = key;
      this.lastActionTime = Date.now();
      return this.getRandomQuote('select');
    }
    return '';
  }

  getPosition() {
    return { x: this.gridX, y: this.gridY, z: this.gridZ };
  }

  setPosition(x: number, y: number, z: number) {
    this.gridX = x;
    this.gridY = y;
    this.gridZ = z;
    this.lastActionTime = Date.now();
  }

  getRandomQuote(type: QuoteType): string {
    const profile = this.getActiveBot();
    const list = profile.quotes[type];
    const index = Math.floor(Math.random() * list.length);
    return list[index];
  }

  getQuoteFor(botKey: string, type: QuoteType): string {
    const profile = BOT_PROFILES[botKey];
    if (!profile) return '';
    const list = profile.quotes[type];
    return list[Math.floor(Math.random() * list.length)];
  }

  getQuoteWithCooldown(type: QuoteType): string | null {
    const now = Date.now();
    if (
      type === 'select' ||
      type === 'collide' ||
      type === 'goal' ||
      type === 'greet' ||
      now - this.lastQuoteTime > this.quoteCooldown
    ) {
      this.lastQuoteTime = now;
      return this.getRandomQuote(type);
    }
    return null;
  }

  checkIdle(): string | null {
    const now = Date.now();
    if (now - this.lastActionTime > 8000 && now - this.lastQuoteTime > 8000) {
      this.lastQuoteTime = now;
      this.lastActionTime = now;
      return this.getRandomQuote('idle');
    }
    return null;
  }
}
