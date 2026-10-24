import wave
import struct
import math

def generate_festive_track(voice_path, output_path):
    # Read the voice wave
    with wave.open(voice_path, 'rb') as vf:
        n_channels = vf.getnchannels()
        sampwidth = vf.getsampwidth()
        framerate = vf.getframerate() # 16000
        n_frames = vf.getnframes()
        voice_bytes = vf.readframes(n_frames)
    
    # Unpack voice samples
    voice_samples = list(struct.unpack(f"<{n_frames * n_channels}h", voice_bytes))
    if n_channels == 2:
        voice_samples = [voice_samples[i*2] for i in range(n_frames)]
    
    duration_voice = len(voice_samples) / framerate
    print(f"Voice duration: {duration_voice:.2f} seconds, sample rate: {framerate}")

    # Add intro (1.8s temple bell + flute) and outro (3.0s peaceful bells fadeout)
    intro_dur = 1.8
    outro_dur = 3.5
    total_dur = intro_dur + duration_voice + outro_dur
    total_frames = int(total_dur * framerate)
    
    voice_start_frame = int(intro_dur * framerate)

    # Master buffers for Stereo 16-bit 16000Hz (or Mono)
    out_samples_left = [0.0] * total_frames
    out_samples_right = [0.0] * total_frames

    # 1. Add Sacred Temple Bells
    # Bell chime function
    def add_bell(time_sec, base_freq=523.25, volume=0.35):
        start_frame = int(time_sec * framerate)
        decay_time = 3.8
        bell_frames = int(decay_time * framerate)
        harmonics = [
            (1.0, 1.0, 0.45),
            (2.0, 1.3, 0.28),
            (3.01, 1.8, 0.16),
            (4.15, 2.4, 0.09),
            (5.42, 3.2, 0.05)
        ]
        for f in range(bell_frames):
            idx = start_frame + f
            if idx >= total_frames:
                break
            t = f / framerate
            sample = 0.0
            env = math.exp(-t * 1.8)
            for mult, decay_mult, gain in harmonics:
                freq = base_freq * mult
                h_env = math.exp(-t * (1.2 * decay_mult))
                sample += math.sin(2.0 * math.pi * freq * t) * gain * h_env
            out_samples_left[idx] += sample * volume * 0.95
            out_samples_right[idx] += sample * volume * 1.05

    # 2. Add Soft Melodic Indian Chimes (Bansuri / Santoor notes in Raag Yaman / Bhupali: C, D, E, G, A)
    # Notes in Hz: C5=523.25, D5=587.33, E5=659.25, G5=783.99, A5=880.00, C6=1046.50
    def add_melodic_chime(time_sec, freq, duration=1.2, volume=0.14, pan=0.0):
        start_frame = int(time_sec * framerate)
        note_frames = int(duration * framerate)
        for f in range(note_frames):
            idx = start_frame + f
            if idx >= total_frames:
                break
            t = f / framerate
            # Soft attack and gentle exponential decay (flute/chime tone)
            attack = min(1.0, t / 0.06)
            decay = math.exp(-t * 2.2)
            env = attack * decay
            # Warm harmonics (flute tone: fundamental + soft 2nd & 3rd harmonic)
            val = math.sin(2.0 * math.pi * freq * t) + 0.35 * math.sin(2.0 * math.pi * freq * 2 * t) + 0.15 * math.sin(2.0 * math.pi * freq * 3 * t)
            left_gain = volume * (0.5 - pan * 0.4)
            right_gain = volume * (0.5 + pan * 0.4)
            out_samples_left[idx] += val * env * left_gain
            out_samples_right[idx] += val * env * right_gain

    # 3. Add Gentle Warm Tanpura Ambient Drone (Pancham C3, G3, C4)
    # Warm sine waves with low vibrato, NO harsh sawtooth!
    drone_freqs = [130.81, 196.00, 261.63] # C3, G3, C4
    for i in range(total_frames):
        t = i / framerate
        # Soft fade-in and fade-out of drone
        fade_in = min(1.0, t / 1.5)
        fade_out = min(1.0, (total_dur - t) / 2.5) if (total_dur - t) < 2.5 else 1.0
        env = fade_in * fade_out * 0.08
        
        d_val = 0.0
        for idx, df in enumerate(drone_freqs):
            # Slow micro-breathing modulation
            vib = math.sin(2.0 * math.pi * (0.2 + idx * 0.07) * t) * 0.6
            d_val += math.sin(2.0 * math.pi * (df + vib) * t) * (0.45 / (idx + 1))
        out_samples_left[i] += d_val * env
        out_samples_right[i] += d_val * env

    # Schedule Temple Bells:
    # Grand opening bell at 0.2s
    add_bell(0.2, 523.25, volume=0.42)
    # Secondary bell at 0.8s
    add_bell(0.8, 659.25, volume=0.28)
    
    # Melodic intro arpeggio before voice begins:
    add_melodic_chime(0.5, 523.25, duration=1.4, volume=0.18, pan=-0.2)
    add_melodic_chime(0.9, 659.25, duration=1.4, volume=0.18, pan=0.2)
    add_melodic_chime(1.3, 783.99, duration=1.6, volume=0.20, pan=0.0)

    # Intermittent gentle chimes throughout voice pauses:
    # Voice says: "Shubh Deepawali! Happy Diwali!" -> pause around 4.5s
    add_bell(4.8, 783.99, volume=0.24)
    add_melodic_chime(5.2, 880.00, duration=1.2, volume=0.14, pan=0.3)

    # Voice says: "Chetan Sahu ji ki taraf se aap sabhi ko Deepawali ki hardik shubhkaamnayein!" -> pause around 12.0s
    add_bell(12.2, 523.25, volume=0.25)
    add_melodic_chime(12.6, 659.25, duration=1.3, volume=0.15, pan=-0.2)
    add_melodic_chime(13.0, 783.99, duration=1.5, volume=0.16, pan=0.2)

    # Voice says: "Maa Lakshmi aur Bhagwaan Shree Ganesh ji..." -> pause around 20.0s
    add_bell(20.2, 659.25, volume=0.22)
    add_melodic_chime(20.5, 523.25, duration=1.4, volume=0.14, pan=0.0)

    # Outro bells and chimes when voice finishes:
    outro_start = voice_start_frame / framerate + duration_voice + 0.3
    add_bell(outro_start, 523.25, volume=0.38)
    add_bell(outro_start + 0.6, 783.99, volume=0.28)
    add_melodic_chime(outro_start + 0.4, 659.25, duration=2.0, volume=0.20, pan=-0.2)
    add_melodic_chime(outro_start + 1.0, 880.00, duration=2.0, volume=0.20, pan=0.2)
    add_bell(outro_start + 1.6, 1046.50, volume=0.22)

    # 4. Mix Voice with Ducking
    max_voice = max(abs(s) for s in voice_samples) or 1
    voice_norm = [s / max_voice for s in voice_samples]
    
    for i in range(len(voice_samples)):
        idx = voice_start_frame + i
        if idx >= total_frames:
            break
        v = voice_norm[i] * 0.92 # Voice in foreground at 92% volume
        out_samples_left[idx] += v
        out_samples_right[idx] += v

    # 5. Normalization & Clipping Prevention
    max_val = 0.0
    for i in range(total_frames):
        max_val = max(max_val, abs(out_samples_left[i]), abs(out_samples_right[i]))
    
    scale = 32000.0 / max(1.0, max_val)
    print(f"Peak amplitude: {max_val:.3f}, normalization scale: {scale:.2f}")

    # Pack into 16-bit Stereo PCM WAV
    out_bytes = bytearray()
    for i in range(total_frames):
        left_int = int(max(-32767, min(32767, out_samples_left[i] * scale)))
        right_int = int(max(-32767, min(32767, out_samples_right[i] * scale)))
        out_bytes.extend(struct.pack("<hh", left_int, right_int))

    with wave.open(output_path, 'wb') as out_f:
        out_f.setnchannels(2) # Stereo
        out_f.setsampwidth(2) # 16-bit
        out_f.setframerate(framerate) # 16000
        out_f.writeframes(out_bytes)

    import os
    print(f"Generated {output_path}: {os.path.getsize(output_path)} bytes, duration: {total_dur:.2f}s")

if __name__ == '__main__':
    generate_festive_track('voice_heera.wav', 'diwali_festive_voice.wav')
