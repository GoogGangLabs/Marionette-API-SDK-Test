import { ClassBinding } from "./decorator";
import { BlendshapeResult } from "./types";

@ClassBinding
class LowPassFilter {
  a: number;
  y: number;
  s: number;
  initialized: boolean;

  setAlpha(alpha) {
    this.a = alpha;
  }

  constructor(alpha: number, initval = 0.0) {
    this.y = this.s = initval;
    this.setAlpha(alpha);
    this.initialized = false;
  }

  filter(value: number) {
    let result: number;
    if (this.initialized) result = this.a * value + (1.0 - this.a) * this.s;
    else {
      result = value;
      this.initialized = true;
    }
    this.y = value;
    this.s = result;
    return result;
  }

  filterWithAlpha(value: number, alpha: number) {
    this.setAlpha(alpha);
    return this.filter(value);
  }

  hasLastRawValue() {
    return this.initialized;
  }

  lastRawValue() {
    return this.y;
  }

  reset() {
    this.initialized = false;
  }
}

class OneEuroFilter {
  freq: number;
  mincutoff: number;
  beta: number;
  dcutoff: number;

  x: LowPassFilter;
  dx: LowPassFilter;
  lasttime: number;

  alpha(cutoff: number) {
    let te = 1.0 / this.freq;
    let tau = 1.0 / (2 * Math.PI * cutoff);
    return 1.0 / (1.0 + tau / te);
  }

  setFrequency(f: number) {
    this.freq = f;
  }

  setMinCutoff(mc: number) {
    this.mincutoff = mc;
  }

  setBeta(b: number) {
    this.beta = b;
  }

  setDerivateCutoff(dc: number) {
    this.dcutoff = dc;
  }

  constructor(freq = 15, mincutoff = 1.0, beta = 0.0, dcutoff = 1.0) {
    this.setFrequency(freq);
    this.setMinCutoff(mincutoff);
    this.setBeta(beta);
    this.setDerivateCutoff(dcutoff);
    this.x = new LowPassFilter(this.alpha(mincutoff));
    this.dx = new LowPassFilter(this.alpha(dcutoff));
    this.lasttime = undefined;
  }

  reset() {
    this.x.reset();
    this.dx.reset();
    this.lasttime = undefined;
  }

  filter(value: number) {
    let dvalue = this.x.hasLastRawValue() ? (value - this.x.lastRawValue()) * this.freq : 0.0;
    let edvalue = this.dx.filterWithAlpha(dvalue, this.alpha(this.dcutoff));
    let cutoff = this.mincutoff + this.beta * Math.abs(edvalue);
    return this.x.filterWithAlpha(value, this.alpha(cutoff));
  }
}

@ClassBinding
export class BlendshapeFilter {
  private readonly sessionStore: Map<string, OneEuroFilter[]> = new Map();

  init = (sessionId: string) => {
    if (this.sessionStore.has(sessionId)) return;

    const session = Array.from({ length: 55 }, () => {
      const filter = new OneEuroFilter();
      filter.reset();
      return filter;
    });
    this.sessionStore.set(sessionId, session);
  };

  drop = (sessionId: string) => {
    this.sessionStore.delete(sessionId);
  };

  filter = (sessionId: string, optimizedValue: number, result: BlendshapeResult) => {
    const prevResult = this.sessionStore.get(sessionId);
    const filteredLandmarks: BlendshapeResult = [];

    for (let idx = 0; idx < prevResult.length; idx++) {
      if (!result[idx]) {
        prevResult[idx].reset();
        filteredLandmarks[idx] = 0;
      } else {
        filteredLandmarks[idx] = prevResult[idx].filter(result[idx] / optimizedValue);
      }
    }

    return filteredLandmarks;
  };
}
