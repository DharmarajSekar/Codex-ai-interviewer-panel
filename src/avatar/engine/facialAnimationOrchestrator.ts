import { AvatarEmotionStateManager } from "./emotionStateManager.js";
import { BlinkSystem, EyeMovementSystem, HeadMovementEngine, IdleAnimationSystem } from "./motionEngine.js";
import { AvatarFrame, FacialPose, VisemeFrame } from "../types/avatar.js";

export class FacialAnimationOrchestrator {
  constructor(
    private readonly emotionManager: AvatarEmotionStateManager,
    private readonly eyeSystem = new EyeMovementSystem(),
    private readonly blinkSystem = new BlinkSystem(),
    private readonly headMovementEngine = new HeadMovementEngine(),
    private readonly idleSystem = new IdleAnimationSystem()
  ) {}

  composeFrame(viseme: VisemeFrame, speaking: boolean): AvatarFrame {
    const blink = this.blinkSystem.getBlink(viseme.timestampMs);
    const emotion = this.emotionManager.getEmotionBlendshapeWeights();

    let pose: FacialPose = {
      timestampMs: viseme.timestampMs,
      blendshapes: {
        ...emotion,
        jawOpen: viseme.jawOpen,
        lipPucker: viseme.lipPucker,
        ...viseme.visemeWeights
      },
      headEuler: this.headMovementEngine.getHeadEuler(viseme.timestampMs, speaking),
      gaze: this.eyeSystem.getGaze(viseme.timestampMs, speaking),
      blinkLeft: blink.left,
      blinkRight: blink.right
    };

    pose = this.idleSystem.applyIdleMicroMovement(pose);

    return {
      timestampMs: viseme.timestampMs,
      pose,
      emotion: this.emotionManager.getEmotion(),
      speaking
    };
  }
}
