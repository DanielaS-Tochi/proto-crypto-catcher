class SoundManager {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.muted = false;
        this.musicOsc = null;
        this.lfo = null;
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.muted) {
            this.stopMusic();
        } else {
            // Music restart is handled by game logic if needed
        }
        return this.muted;
    }

    playTone(freq, type, duration, vol = 0.1) {
        if (this.muted) return;

        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playCatchGood() {
        this.playTone(880, 'sine', 0.1, 0.1);
        setTimeout(() => this.playTone(1760, 'sine', 0.1, 0.1), 50);
    }

    playCatchBad() {
        this.playTone(150, 'sawtooth', 0.3, 0.1);
    }

    playLevelUp() {
        [440, 554, 659, 880].forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 'square', 0.1, 0.05), i * 100);
        });
    }

    playGameOver() {
        if (this.muted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(55, this.ctx.currentTime + 1);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 1);
    }

    startMusic() {
        // Background music disabled by user request
    }

    stopMusic() {
        // Background music disabled by user request
    }
}

export const soundManager = new SoundManager();
