(function () {
  let audio = null;
  function getAudio() {
    if (!audio) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      audio = new AudioCtx();
    }
    if (audio.state === 'suspended') audio.resume();
    return audio;
  }

  function tone(context, type, start, duration, from, to, volume) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(from, start);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, to), start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.01);
  }

  window.SOUNDS = {
    flap: function () {
      try {
        const context = getAudio();
        if (!context) return;
        const now = context.currentTime;
        tone(context, 'triangle', now, 0.12, 210, 125, 0.12);
      } catch (error) {}
    },
    score: function () {
      try {
        const context = getAudio();
        if (!context) return;
        const now = context.currentTime;
        tone(context, 'sine', now, 0.16, 170, 250, 0.14);
        tone(context, 'triangle', now + 0.035, 0.18, 125, 185, 0.1);
      } catch (error) {}
    },
    crash: function () {
      try {
        const context = getAudio();
        if (!context) return;
        const now = context.currentTime;
        tone(context, 'sawtooth', now, 0.24, 150, 55, 0.16);
        tone(context, 'triangle', now + 0.02, 0.3, 95, 42, 0.1);
      } catch (error) {}
    }
  };
})();
