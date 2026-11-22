"use client";

import { useEffect } from "react";
import { REDUCED_MOTION, duration, easing } from "./tokens";

const TARGETS = "[data-reveal], [data-reveal-group] > *";
const STAGGER = 80;
const MAX_STEPS = 5;

/**
 * Scroll reveal for the whole site. Mark a block with `data-reveal`, or a grid
 * or list with `data-reveal-group` to stagger its children.
 *
 * Only elements still below the fold are animated, with the Web Animations API,
 * so there's no hidden state in the HTML: without JS, with reduced motion, when
 * printing, or above the fold, content is simply visible.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const reduced = window.matchMedia(REDUCED_MOTION);
    if (reduced.matches) return;

    const ms = duration("slower");
    const ease = easing();
    const seen = new WeakSet<Element>();
    const waiting = new Map<Element, Animation>();
    const running = new Set<Animation>();

    const io = new IntersectionObserver((entries) => {
      let step = 0;
      for (const { isIntersecting, target } of entries) {
        const animation = waiting.get(target);
        if (!isIntersecting || !animation) continue;
        waiting.delete(target);
        io.unobserve(target);
        animation.effect?.updateTiming({ delay: Math.min(step++, MAX_STEPS) * STAGGER });
        running.add(animation);
        animation.onfinish = () => running.delete(animation);
        animation.play();
      }
    });

    const showAll = () => {
      waiting.forEach((a) => a.cancel());
      running.forEach((a) => a.cancel());
      waiting.clear();
      running.clear();
      io.disconnect();
    };

    const release = (el: Element) => {
      waiting.get(el)?.cancel();
      waiting.delete(el);
      io.unobserve(el);
    };

    const scan = () => {
      if (reduced.matches) return;
      for (const el of waiting.keys()) if (!el.isConnected) release(el);
      for (const el of document.querySelectorAll(TARGETS)) {
        if (seen.has(el)) continue;
        seen.add(el);
        const box = el.getBoundingClientRect();
        if (!box.height || box.top < window.innerHeight) continue; // already on screen
        const animation = el.animate(
          [
            { opacity: 0, transform: "translateY(16px)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: ms, easing: ease, fill: "backwards" }
        );
        animation.pause();
        animation.currentTime = 0;
        waiting.set(el, animation);
        io.observe(el);
      }
    };

    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        scan();
      });
    };
    // Catches route changes and filtered lists.
    const mo = new MutationObserver(schedule);
    mo.observe(document.body, { childList: true, subtree: true });

    // Keyboard focus must never land on something invisible.
    const onFocus = (e: FocusEvent) => {
      for (const el of waiting.keys()) if (el.contains(e.target as Node)) release(el);
    };

    schedule();
    document.addEventListener("focusin", onFocus);
    window.addEventListener("beforeprint", showAll);
    reduced.addEventListener("change", showAll);
    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
      document.removeEventListener("focusin", onFocus);
      window.removeEventListener("beforeprint", showAll);
      reduced.removeEventListener("change", showAll);
      showAll();
    };
  }, []);

  return null;
}
