import { RealtimeLipSyncPipeline } from "../pipeline/lipSyncPipeline.js";
import { AvatarEmotionStateManager } from "../engine/emotionStateManager.js";
import { FacialAnimationOrchestrator } from "../engine/facialAnimationOrchestrator.js";
import { ThreeAvatarRenderingContainer } from "../rendering/threeAvatarRenderer.js";
import { RealtimeAvatarWebsocketSynchronization } from "../sync/avatarWebsocketSync.js";
import { AudioChunk, Emotion } from "../types/avatar.js";

export class AvatarSessionLifecycleManager {
  private active = false;

  constructor(
    private readonly pipeline: RealtimeLipSyncPipeline,
    private readonly emotionManager: AvatarEmotionStateManager,
    private readonly orchestrator: FacialAnimationOrchestrator,
    private readonly renderer: ThreeAvatarRenderingContainer,
    private readonly sync: RealtimeAvatarWebsocketSynchronization
  ) {}

  async startSession(): Promise<void> {
    await this.pipeline.warmup();
    this.renderer.initialize();
    this.sync.start();
    this.active = true;
  }

  async ingestAudio(audio: AudioChunk): Promise<void> {
    if (!this.active) return;
    const visemes = await this.pipeline.processAudio(audio);
    for (const viseme of visemes) {
      const frame = this.orchestrator.composeFrame(viseme, true);
      this.renderer.enqueueFrame(frame);
      this.sync.broadcastFrame(frame);
    }
  }

  setEmotion(emotion: Emotion): void {
    this.emotionManager.setEmotion(emotion);
  }

  stopSession(): void {
    this.active = false;
  }
}
