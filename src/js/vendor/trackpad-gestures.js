// Copied from fast-gallery (src/client/trackpad-gestures.js); keep the two in sync.
/**
 * PhotoSwipe 5 plugin: trackpad gestures.
 *
 *   two-finger swipe left/right -> next/previous slide, following the fingers
 *   two-finger swipe up/down    -> close, the way a touch drag does
 *
 * Browsers report trackpad swipes as wheel events. PhotoSwipe only uses those
 * to pan a zoomed-in image, so at normal size this takes them over; zoomed
 * in, and for pinch-zoom (ctrlKey), PhotoSwipe keeps them.
 *
 * The tricky part is momentum: macOS keeps sending wheel events for up to a
 * second after the fingers lift, decaying as they go. Waiting for them to
 * stop feels sluggish, so the plugin spots the lift (deltas shrinking
 * steadily), estimates where the momentum would carry, and decides then.
 * The rest of that stream is ignored until either the events stop or a fresh
 * swipe starts (a delta that jumps up rather than decays), and after a close
 * it's kept from scrolling the page underneath.
 *
 * Usage:
 *   const lightbox = new PhotoSwipeLightbox({ ... });
 *   new PhotoSwipeTrackpadGestures(lightbox);
 *   lightbox.init();
 *
 * Written as a classic script so it can be inlined into a page as-is.
 */
class PhotoSwipeTrackpadGestures {
  constructor(lightbox, options = {}) {
    this.options = {
      // Silence that ends a gesture (fingers held still), in ms. Events come
      // every ~16ms while anything is moving.
      gestureEnd: 90,
      // Movement before a gesture commits to an axis, in px.
      axisLock: 6,
      // Steadily shrinking deltas mean the fingers have lifted and this is
      // momentum: this many shrinking in a row, each below `liftDrop` of the
      // swipe's peak.
      liftDecays: 3,
      liftDrop: 0.75,
      // Fraction of a slide, including where momentum would carry it, that
      // advances to the next one...
      nextRatio: 0.25,
      // ...and that advances straight away, mid-swipe.
      nextRatioImmediate: 0.5,
      // How far down (or up) closes, as PhotoSwipe measures it: 1 = a third of
      // the viewport. 0.4 matches PhotoSwipe's own drag-to-close.
      closeRatio: 0.4,
      // ...and that closes straight away, mid-swipe.
      closeRatioImmediate: 1,
      ...options,
    };
    this.lightbox = lightbox;
    lightbox.on('beforeOpen', () => this.attach(lightbox.pswp));
  }

  attach(pswp) {
    this.pswp = pswp;
    this.reset();
    pswp.on('wheel', (e) => this.onWheel(e));
    pswp.on('destroy', () => clearTimeout(this.timer));
  }

  reset() {
    // idle -> x | y -> idle, or -> locked (ignoring the momentum tail)
    this.state = 'idle';
    this.dx = 0;
    this.dy = 0;
    this.lastAbs = 0;
    this.trough = Infinity;
    this.peak = 0;
    this.decays = 0;
    this.velocity = 0;
    this.lastTime = 0;
  }

  onWheel(event) {
    const e = event.originalEvent;
    const { pswp } = this;
    const slide = pswp.currSlide;
    // Pinch-zoom, and panning a zoomed-in image, stay PhotoSwipe's.
    if (e.ctrlKey || !slide || slide.isPannable()) return;
    event.preventDefault();

    const scale = e.deltaMode === 1 ? 18 : e.deltaMode === 2 ? pswp.viewportSize.y : 1;
    const dx = e.deltaX * scale;
    const dy = e.deltaY * scale;
    const abs = Math.max(Math.abs(dx), Math.abs(dy));
    const now = e.timeStamp || Date.now();

    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.end(), this.options.gestureEnd);

    if (this.state === 'locked') {
      // Momentum only ever decays. Deltas climbing well above the lowest point
      // it reached are a new swipe, so pick it up rather than making the user
      // wait for the tail to run out.
      this.trough = Math.min(this.trough, abs);
      const fresh = abs > 8 && abs > this.lastAbs && abs > this.trough * 2;
      this.lastAbs = abs;
      if (!fresh) return;
      this.reset();
    }

    if (this.state === 'idle') {
      this.lastAbs = abs;
      this.dx += dx;
      this.dy += dy;
      if (Math.abs(this.dx) + Math.abs(this.dy) < this.options.axisLock) return;
      if (Math.abs(this.dx) >= Math.abs(this.dy)) {
        this.state = 'x';
        pswp.animations.stopAll();
        this.startX = pswp.mainScroll.x;
        this.moveX(this.dx, now);
      } else if (pswp.options.closeOnVerticalDrag && PhotoSwipeTrackpadGestures.isTrackpad(e)) {
        this.state = 'y';
        pswp.animations.stopAll();
        this.startY = slide.bounds.center.y;
        this.moveY(this.dy);
      } else {
        // A mouse wheel scrolling vertically shouldn't close anything.
        this.state = 'locked';
      }
      return;
    }

    const d = this.state === 'x' ? dx : dy;
    const lifted = this.lifted(Math.abs(d));
    if (this.state === 'x') this.moveX(dx, now);
    else this.moveY(dy);

    // Don't wait out the momentum: decide now, as if it had run its course.
    if (lifted && (this.state === 'x' || this.state === 'y')) {
      const carry = this.momentumLeft(d);
      if (this.state === 'x') this.settleX(this.velocity, carry);
      else this.settleY(carry);
      this.state = 'locked';
    }
    this.lastAbs = abs;
  }

  // Whether the fingers have left the trackpad, judging by the deltas.
  lifted(abs) {
    this.decays = abs < this.lastAbs ? this.decays + 1 : 0;
    this.peak = Math.max(this.peak, abs);
    return this.decays >= this.options.liftDecays && abs <= this.peak * this.options.liftDrop;
  }

  // Roughly how much further momentum would travel: it decays geometrically,
  // so the rest of the tail is d * r / (1 - r).
  momentumLeft(d) {
    const r = Math.min(0.95, Math.abs(d) / Math.max(this.lastAbs, 1));
    return (d * r) / (1 - r);
  }

  moveX(dx, now) {
    const { mainScroll } = this.pswp;
    const dt = Math.max(1, now - (this.lastTime || now - 16));
    this.velocity = -dx / dt;
    this.lastTime = now;
    mainScroll.moveTo(mainScroll.x - dx, true);

    if (Math.abs(this.shiftRatio()) >= this.options.nextRatioImmediate) {
      this.settleX(this.velocity);
      this.state = 'locked';
    }
  }

  // How far this swipe has moved the strip: -1 is a whole slide towards the
  // next one, 1 towards the previous one. Measured from where the swipe
  // started, not from the current slide: a swipe can interrupt the previous
  // one's animation halfway, and that leftover distance isn't this swipe's.
  shiftRatio() {
    const { mainScroll } = this.pswp;
    return (mainScroll.x - this.startX) / mainScroll.slideWidth;
  }

  // Snap to the nearest slide, counting `carry` px of momentum still to come,
  // and carrying on at `velocity` (px/ms).
  settleX(velocity = 0, carry = 0) {
    const ratio = this.shiftRatio() - carry / this.pswp.mainScroll.slideWidth;
    let diff = 0;
    if (ratio <= -this.options.nextRatio) diff = 1;
    else if (ratio >= this.options.nextRatio) diff = -1;
    this.pswp.mainScroll.moveIndexBy(diff, true, velocity);
  }

  // PhotoSwipe's own measure: 1 = moved a third of the viewport height.
  dragRatio(offset = 0) {
    const slide = this.pswp.currSlide;
    return (slide.pan.y + offset - this.startY) / (this.pswp.viewportSize.y / 3);
  }

  moveY(dy) {
    const { pswp } = this;
    const slide = pswp.currSlide;
    // Natural scrolling: fingers moving down report a negative deltaY.
    slide.pan.y -= dy;
    pswp.applyBgOpacity(1 - Math.min(1, Math.abs(this.dragRatio())));
    slide.applyCurrentZoomPan();

    if (Math.abs(this.dragRatio()) >= this.options.closeRatioImmediate) this.close();
  }

  // Close, or spring back to centre, counting `carry` px of momentum to come.
  settleY(carry = 0) {
    const { pswp } = this;
    const slide = pswp.currSlide;
    if (Math.abs(this.dragRatio(-carry)) >= this.options.closeRatio) {
      this.close();
      return;
    }
    const start = slide.pan.y;
    const end = this.startY;
    const startOpacity = pswp.bgOpacity;
    pswp.animations.startSpring({
      name: 'panGesturey',
      isPan: true,
      start,
      end,
      velocity: 0,
      onUpdate: (pos) => {
        const progress = start === end ? 1 : (pos - start) / (end - start);
        pswp.applyBgOpacity(Math.min(1, Math.max(0, startOpacity + (1 - startOpacity) * progress)));
        slide.pan.y = Math.round(pos);
        slide.applyCurrentZoomPan();
      },
    });
  }

  close() {
    this.state = 'locked';
    this.swallowTail();
    this.pswp.close();
  }

  // Once the lightbox starts closing, the rest of the momentum would land on
  // the page behind it and scroll it, jolting the thumbnail the photo is
  // shrinking back into. Eat those events until the tail dies out -- but let a
  // genuinely new scroll through straight away.
  swallowTail() {
    const opts = { capture: true, passive: false };
    let last = this.lastAbs;
    let trough = this.lastAbs;
    let quiet;
    const release = () => {
      clearTimeout(quiet);
      clearTimeout(cap);
      window.removeEventListener('wheel', onWheel, opts);
    };
    const onWheel = (e) => {
      const abs = Math.max(Math.abs(e.deltaX), Math.abs(e.deltaY));
      trough = Math.min(trough, abs);
      if (abs > 8 && abs > last && abs > trough * 2) {
        release();
        return;
      }
      last = abs;
      e.preventDefault();
      clearTimeout(quiet);
      quiet = setTimeout(release, 150);
    };
    window.addEventListener('wheel', onWheel, opts);
    quiet = setTimeout(release, 150);
    const cap = setTimeout(release, 2000);
  }

  // The fingers stopped, or the momentum ran out: nothing is moving any more.
  end() {
    if (this.state === 'x') this.settleX();
    else if (this.state === 'y') this.settleY();
    this.reset();
  }

  /**
   * Best guess at whether a wheel event came from a trackpad. Mouse wheels
   * report in lines (Firefox), or in steps where Chrome and Safari's legacy
   * wheelDeltaY isn't about -3x deltaY. Not perfect: a smooth-scrolling mouse
   * on macOS can pass for a trackpad, though it then needs a long, deliberate
   * scroll to close anything.
   */
  static isTrackpad(e) {
    if (e.deltaMode !== 0) return false;
    if (e.wheelDeltaY) return Math.abs(e.wheelDeltaY + 3 * e.deltaY) <= 3;
    return true;
  }
}

export default PhotoSwipeTrackpadGestures;
