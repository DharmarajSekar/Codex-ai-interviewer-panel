import { AvatarFrame, AvatarPerformanceMode } from "../types/avatar.js";

export class ThreeAvatarRenderingContainer {
  private frameQueue: AvatarFrame[] = [];

  constructor(
    private readonly containerId: string,
    private readonly mode: AvatarPerformanceMode
  ) {}

  initialize(): void {
    // Placeholder: initialize Three.js scene, camera, lights, and avatar mesh.
    // Keep RAF cadence aligned with mode.maxFps and browser GPU capability.
  }

  enqueueFrame(frame: AvatarFrame): void {
    this.frameQueue.push(frame);
    if (this.frameQueue.length > 4) this.frameQueue.shift();
  }

  renderTick(): AvatarFrame | undefined {
    const next = this.frameQueue.shift();
    if (!next) return undefined;
    // Placeholder: apply blendshapes and transforms in Three.js.
    return next;
  }

  getPerformanceMode(): AvatarPerformanceMode {
    return this.mode;
  }

  getContainerId(): string {
    return this.containerId;
  }
}
