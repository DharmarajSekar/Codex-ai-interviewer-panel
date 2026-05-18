import { AvatarEmotionStateManager } from "./engine/emotionStateManager.js";
import { FacialAnimationOrchestrator } from "./engine/facialAnimationOrchestrator.js";
import { AvatarSessionLifecycleManager } from "./lifecycle/avatarSessionManager.js";
import { RealtimeLipSyncPipeline } from "./pipeline/lipSyncPipeline.js";
import { MuseTalkProvider } from "./providers/museTalkProvider.js";
import { SadTalkerProvider } from "./providers/sadTalkerProvider.js";
import { Wav2LipProvider } from "./providers/wav2lipProvider.js";
import { ThreeAvatarRenderingContainer } from "./rendering/threeAvatarRenderer.js";
import { RealtimeAvatarWebsocketSynchronization } from "./sync/avatarWebsocketSync.js";
import { AvatarPerformanceMode } from "./types/avatar.js";

export const createAvatarSession = (
  containerId: string,
  transport: ConstructorParameters<typeof RealtimeAvatarWebsocketSynchronization>[0],
  mode: AvatarPerformanceMode = { gpuAcceleration: true, cpuFallback: true, maxFps: 60 }
): AvatarSessionLifecycleManager => {
  const providers = [new MuseTalkProvider(), new SadTalkerProvider(), new Wav2LipProvider()];
  const pipeline = new RealtimeLipSyncPipeline(providers);
  const emotion = new AvatarEmotionStateManager();
  const orchestrator = new FacialAnimationOrchestrator(emotion);
  const renderer = new ThreeAvatarRenderingContainer(containerId, mode);
  const sync = new RealtimeAvatarWebsocketSynchronization(transport);

  return new AvatarSessionLifecycleManager(pipeline, emotion, orchestrator, renderer, sync);
};
