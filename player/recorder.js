/* The in-browser video recorder (the web page's Export: no helper, no ffmpeg, nothing leaves the computer).

   The copy layer is real HTML/CSS text, which a web page can't turn into pixels itself, so the recorder asks Chrome to
   capture this tab and keeps just the stage. It then steps through the piece one video frame at a time (never in real
   time): seek(t) → wait for a fresh captured picture → encode it as H.264 with its exact timestamp → MP4. The sound is
   read from a file, cut to the range and encoded as AAC.

   API (the contract with index.html):
     recordVideo({ stage, seek, t0, t1, fps = 30, width = 1920, height = 1080, audioUrl = null, videoBitrate, onProgress,
                   signal }) → Promise<Blob>           an .mp4: H.264 video, AAC sound when audioUrl is given, cut to [t0, t1]
       stage       the element to capture (the player's picture: WebGL canvas + CSS3D copy layer)
       seek(t)     shows display time t; resolves when that frame is fully drawn
       onProgress(fraction, { frame, frames, eta, phase, message, method, captureSize, notes, paused })
       signal      an AbortSignal: cancel cleans up and rejects with an AbortError
     The Blob also carries blob.notes (plain-words remarks, e.g. "silent: this browser can't make AAC sound") and
     blob.info ({ version, method, captureSize, frames, fps, width, height, seconds, secondsPerFrame, audio, audioDelay,
     audioBitrate, codec, bitrate }). secondsPerFrame is this computer's real speed: good for the next estimate.
     Errors are plain words (err.message, for the person) with err.code for the player: 'unsupported', 'busy',
     'permission' (Allow wasn't chosen), 'activation' (not straight after a click), 'wrong-surface', 'capture',
     'stage-offscreen', 'stage-hidden', 'no-frames', 'capture-ended' (Stop sharing), 'capture-error', 'codec', 'encoder',
     'sound-load', 'sound-decode'. Cancelling rejects with a DOMException named 'AbortError'.
     recorderSupport() → { ok, reason, version }         reason is plain words when ok is false
     RECORDER_VERSION                                     this file's version (also in recorderSupport() and blob.info.version),
                                                          so a page can show which recorder it has. BUMP IT WHEN THIS FILE CHANGES,
                                                          and rebuild the site (node tools/site.mjs): the site's version code
                                                          doesn't cover player/, so a stale copy there wouldn't show otherwise.
     (For testing only: debug: { capture: 'region' | 'tab', grabber: 'video' } skips the better capture methods, or reads
     the pictures through a <video> as older Chrome does. The player never passes it.)

   How the capture works (best first; each is checked by actually receiving pictures, and the next one is tried if not):
     1. Element Capture (track.restrictTo): only the stage and what's inside it, whatever is drawn on top of it (a progress
        panel, a dialog). The stage gets `will-change: opacity` while recording, which Chrome needs to allow it (it must
        be a "backdrop root"); it changes nothing on screen. Chrome renders the stage at exactly width × height, so the
        text is sharp at 4K whatever the stage's size on screen (a <canvas> keeps its own resolution: for a sharp 4K 3D
        picture the WebGL canvas must be 3840 × 2160, v2.js setRenderScale(2)).
        THE STAGE MUST BE ENTIRELY INSIDE THE WINDOW: Chrome only captures the part that's on screen. It can be any size
        (1:1, width / devicePixelRatio, is best for 1080p when it fits; for 4K that is 1920 × 1080 CSS px on a Retina
        screen, bigger than most laptop windows, so fit it to the window instead). Chrome's "sharing this tab" bar makes
        the window about 40 px shorter once the capture starts: re-fit on resize. The recorder waits up to 3 s for the
        stage to be fully visible, stops with a plain message if it isn't, and checks again on every frame.
        While Chrome captures a tab it may raise the page's devicePixelRatio (2 → 4 on a Retina Mac, measured): the
        capture asks for up to 7680 × 4320, so Chrome draws the tab sharper, and that is what makes 4K text sharp with the
        stage smaller than 3840 device px on screen. It doesn't change the video (always width × height). A page that
        re-fits the stage from devicePixelRatio on resize sees it shrink (e.g. 480 × 270 CSS px at 1080p); sizing it from
        the ratio measured before recording keeps it as it was. Both record correctly.
     2. Region Capture (track.cropTo): the tab cut to the stage's box, overlays included.
     3. The whole tab, cut to the stage's box here. Overlays on the stage are recorded too, and the stage must be fully
        in the window.
   A picture is "fresh" when it differs from the previous frame's. When none arrives (the same picture twice, or Chrome
   skipped a capture), the moment is drawn again, which always makes Chrome send a new picture of it.

   Sound: the AAC encoder puts a short silence (its "priming", 2112 samples in Chrome on a Mac) before the sound. The
   recorder measures it once (it encodes a click and decodes it back) and writes an edit list (plus the AAC "roll" group
   Apple's decoder needs to honour it) into the file, as ffmpeg does: the muxer can't, so they're added to the finished
   index, in the room reserved for it. Every sound lands on its sample in ffmpeg, QuickTime/Safari and Chrome (measured),
   and the whole range is heard. If the delay can't be measured, the sound may be about 40 ms late (blob.notes says).
   The sound is AAC at 256 kb/s like the Mac exporter's (192 where the browser's encoder can't: Windows tops out there).
   It can only be as good as the file it's given. Measured against the WAV over the whole piece (signal-to-noise): the
   Mac export 27.4 dB; the web page's .m4a made by ffmpeg at 160 kb/s 19.6 dB, recorded from it 19.3 (18.9 at 192 kb/s);
   an .m4a made by Apple's encoder (afconvert) at 160 kb/s, the same size, recorded 24.1; at 256 kb/s (4.7 MB) 28.7; a
   lossless file (WAV, FLAC) 30.4. Chrome decodes all of them to the WAV's exact length, with no offset.

   Compared with the Mac exporter (tools/export.mjs, headless Chrome + x264), measured: the same frames, frame-exact, and
   the same sound timing; the 3D is equal; the copy's edges can sit 0.5–2 px apart, because a visible Chrome draws the
   HTML text slightly differently from a headless one (a plain screenshot shows the same); the files are ~2.5× bigger
   (the hardware H.264 encoder needs the room to keep the gradients free of bands). The Mac export is the one for final
   delivery.

   Needs Chrome or Edge 94+ on a computer (Element Capture: Chrome 132+). Vendored: ../vendor/mp4-muxer.esm.js (MIT). */

import { Muxer, StreamTarget } from '../vendor/mp4-muxer.esm.js';

export const RECORDER_VERSION = '2026-09-28.2';       // (bump when this file changes; see the top)

const SAMPLE_RATE = 48000, CHANNELS = 2, AAC = 'mp4a.40.2', AAC_BITRATES = [256000, 192000];   // best first (the Mac exporter: 256)
const KEYFRAME_SECONDS = 2;
const SIG_W = 256, SIG_H = 144;                        // the size a picture is compared at, to tell a fresh one from the last
const QUIET_MS = 250;                                  // no changed picture this long after a seek: draw the moment again
const RETRY_MS = 800, RETRIES = 8;                     // then wait this long for a picture, this many times
let busy = false;

const abortError = () => new DOMException('The recording was cancelled.', 'AbortError');
const plainError = (message, code) => Object.assign(new Error(message), { code });
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------------------------------------------------------------- support */

export function recorderSupport() {
  const no = reason => ({ ok: false, reason, version: RECORDER_VERSION });
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return no('Recording only works in a web browser.');
  const ua = navigator.userAgent || '', uad = navigator.userAgentData;
  const mobile = uad ? !!uad.mobile : /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  const chromium = uad && Array.isArray(uad.brands) ? uad.brands.some(b => /Chromium|Google Chrome|Microsoft Edge/i.test(b.brand))
    : /Chrome\/|Edg\//.test(ua) && !/Firefox\/|FxiOS|OPR\/|SamsungBrowser/.test(ua);
  if (mobile) return no('Recording works on a computer, not on a phone or tablet. Open this page in Chrome or Edge on a computer.');
  if (!chromium) return no('Recording needs Chrome or Edge on a computer. Open this page there to make a video.');
  if (!window.isSecureContext) return no('Recording needs the page to be opened from its https:// address (or from this computer).');
  if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) return no('This browser can’t capture the page. Update Chrome or Edge, and use it on a computer.');
  if (!('VideoEncoder' in window) || !('VideoFrame' in window) || !('OffscreenCanvas' in window)) return no('This browser can’t make video files. Update Chrome or Edge to the latest version.');
  if (!('MediaStreamTrackProcessor' in window) && !('requestVideoFrameCallback' in HTMLVideoElement.prototype)) return no('This browser can’t read the captured picture. Update Chrome or Edge to the latest version.');
  return { ok: true, reason: '', version: RECORDER_VERSION, elementCapture: 'RestrictionTarget' in window, regionCapture: 'CropTarget' in window, sound: 'AudioEncoder' in window };
}

/* ---------------------------------------------------------------- encoding choices */

// H.264 High profile at the lowest level that fits the size and frame rate (4.1 at least: the usual 1080p level)
function avcCodecs(w, h, fps) {
  const mbs = Math.ceil(w / 16) * Math.ceil(h / 16), rate = mbs * fps;
  const LV = [[0x29, 8192, 245760], [0x2A, 8704, 522240], [0x32, 22080, 589824], [0x33, 36864, 983040], [0x34, 36864, 2073600],
    [0x3C, 139264, 4177920], [0x3D, 139264, 8355840], [0x3E, 139264, 16711680]];
  const lv = (LV.find(([, fs, r]) => mbs <= fs && rate <= r) || LV[LV.length - 1])[0].toString(16).toUpperCase().padStart(2, '0');
  return [`avc1.6400${lv}`, `avc1.4D00${lv}`, `avc1.4200${lv}`];            // High, then Main, then Baseline
}
// about 0.25 bits per pixel: ~15.5 Mbit/s at 1080p30, ~62 at 4K30 (the smooth gradients need room), at most 100
const defaultBitrate = (w, h, fps) => Math.round(Math.min(100e6, Math.max(4e6, w * h * fps * 0.25)));

/* ---------------------------------------------------------------- the MP4 file, kept as Blob parts
   The muxer's "reserved space" fast start: the header, with room for the index, is written first; the pictures and sound
   follow in order; at the end the index is written into the room left for it (and the media box's size is patched). The
   header stays in memory for those patches; everything after it goes into Blobs, which the browser may keep on disk, so a
   long 4K recording doesn't need its whole size in memory. */
class BlobSink {
  constructor() { this.head = new Uint8Array(0); this.headLen = -1; this.parts = []; this.buf = []; this.bufBytes = 0; this.end = 0; }
  write(data, pos) {
    if (this.headLen < 0) {                                          // still writing the header: grow it (gaps stay zero)
      const need = pos + data.byteLength;
      if (need > this.head.length) { const h = new Uint8Array(need); h.set(this.head); this.head = h; }
      this.head.set(data, pos); return;
    }
    if (pos < this.headLen) {                                        // a patch inside the header (the index, the box size)
      const n = Math.min(data.byteLength, this.headLen - pos);
      this.head.set(data.subarray(0, n), pos);
      data = data.subarray(n); pos += n;
      if (!data.byteLength) return;
    }
    if (pos < this.end) throw new Error(`the video file was written out of order (at ${pos}, expected ${this.end})`);
    if (pos > this.end) this.push(new Uint8Array(pos - this.end));
    this.push(data.slice());
  }
  push(d) { this.buf.push(d); this.bufBytes += d.byteLength; this.end += d.byteLength; if (this.bufBytes >= 8 << 20) this.spill(); }
  spill() { if (this.buf.length) { this.parts.push(new Blob(this.buf)); this.buf = []; this.bufBytes = 0; } }
  freeze() { this.headLen = this.head.length; this.end = this.headLen; }
  blob(type) { this.spill(); return new Blob([this.head, ...this.parts], { type }); }
  get size() { return Math.max(this.end, this.head.length); }
}

/* ---------------------------------------------------------------- captured pictures */

// keeps the newest captured picture (older ones are closed at once, so Chrome's capture never runs out of buffers)
class Grabber {
  constructor(track, useVideo = false) {
    this.track = track; this.latest = null; this.seq = 0; this.waiters = new Set(); this.stopped = false; this.error = null;
    if ('MediaStreamTrackProcessor' in window && !useVideo) this.startProcessor(); else this.startVideo();
  }
  got(frame) {
    if (this.stopped) { frame.close(); return; }
    if (this.latest) this.latest.close();
    this.latest = frame; this.seq++;
    for (const w of this.waiters) w();
  }
  startProcessor() {
    this.kind = 'processor';
    this.reader = new MediaStreamTrackProcessor({ track: this.track }).readable.getReader();
    (async () => {
      try { for (;;) { const { value, done } = await this.reader.read(); if (done) break; this.got(value); } }
      catch (e) { if (!this.stopped) this.error = e; }
    })();
  }
  startVideo() {                                                     // older Chrome: a hidden <video> playing the capture
    this.kind = 'video';
    const v = this.video = document.createElement('video');
    v.muted = true; v.playsInline = true; v.srcObject = new MediaStream([this.track]);
    Object.assign(v.style, { position: 'fixed', right: '0', bottom: '0', width: '2px', height: '2px', opacity: '0.01', pointerEvents: 'none', zIndex: '-1' });
    document.body.appendChild(v);
    const onFrame = () => {
      if (this.stopped) return;
      try { this.got(new VideoFrame(v, { timestamp: 0 })); } catch {}
      v.requestVideoFrameCallback(onFrame);
    };
    v.requestVideoFrameCallback(onFrame);
    v.play().catch(e => { this.error = e; });
  }
  // resolves true when a picture newer than `seq` has arrived, false after `ms`
  newer(seq, ms) {
    if (this.seq > seq) return Promise.resolve(true);
    return new Promise(resolve => {
      const done = ok => { clearTimeout(timer); this.waiters.delete(wake); resolve(ok); };
      const wake = () => { if (this.seq > seq) done(true); };
      const timer = setTimeout(() => done(false), ms);
      this.waiters.add(wake);
    });
  }
  stop() {
    this.stopped = true;
    for (const w of this.waiters) w();
    try { this.reader && this.reader.cancel().catch(() => {}); } catch {}
    if (this.video) { try { this.video.pause(); this.video.srcObject = null; this.video.remove(); } catch {} }
    if (this.latest) { this.latest.close(); this.latest = null; }
  }
}

/* ---------------------------------------------------------------- sound */

// tries the AAC encoder at `bitrate` on a click, then decodes it back to find the encoder's delay in samples.
// → { ok: the encoder made sound at this bitrate, delay: the delay, or null if it couldn't be measured }
async function aacProbe(bitrate) {
  const N = 16384, AT = 6000, chunks = [];
  let config = null, failed = null;
  const enc = new AudioEncoder({ output: (c, m) => { const b = new Uint8Array(c.byteLength); c.copyTo(b); chunks.push({ t: c.timestamp, d: c.duration, b }); if (m && m.decoderConfig) config = m.decoderConfig; }, error: e => { failed = e; } });
  try {
    enc.configure({ codec: AAC, sampleRate: SAMPLE_RATE, numberOfChannels: CHANNELS, bitrate });
    const x = new Float32Array(N * CHANNELS);
    for (let c = 0; c < CHANNELS; c++) x[c * N + AT] = 0.9;
    const a = new AudioData({ format: 'f32-planar', sampleRate: SAMPLE_RATE, numberOfFrames: N, numberOfChannels: CHANNELS, timestamp: 0, data: x });
    enc.encode(a); a.close();
    await enc.flush();
  } catch (e) { failed = failed || e; }
  try { if (enc.state !== 'closed') enc.close(); } catch {}
  if (failed || !config || !chunks.length) return { ok: false, delay: null };
  if (!('AudioDecoder' in window)) return { ok: true, delay: null };
  const pcm = [];
  const dec = new AudioDecoder({ output: d => { const f = new Float32Array(d.numberOfFrames); d.copyTo(f, { planeIndex: 0, format: 'f32-planar' }); pcm.push(f); d.close(); }, error: e => { failed = e; } });
  try {
    dec.configure(config);
    for (const c of chunks) dec.decode(new EncodedAudioChunk({ type: 'key', timestamp: c.t, duration: c.d, data: c.b }));
    await dec.flush();
  } catch (e) { failed = failed || e; }
  try { if (dec.state !== 'closed') dec.close(); } catch {}
  if (failed) return { ok: true, delay: null };
  let best = -1, i = 0, peak = 0;
  for (const f of pcm) for (let k = 0; k < f.length; k++, i++) if (Math.abs(f[k]) > peak) { peak = Math.abs(f[k]); best = i; }
  const delay = best - AT;
  return { ok: true, delay: peak > 0.2 && delay >= 0 && delay <= 8192 ? delay : null };
}

// fetch + decode the sound file at 48 kHz, stereo
async function loadSound(url, signal) {
  let res;
  try { res = await fetch(url, { signal }); }
  catch (e) { if (signal && signal.aborted) throw abortError(); throw plainError(`The sound file couldn’t be loaded (${url}): ${e.message}. Check the connection and try again, or record without sound.`, 'sound-load'); }
  if (!res.ok) throw plainError(`The sound file couldn’t be loaded (${url}: the web page answered ${res.status}). Record without sound, or try again later.`, 'sound-load');
  const bytes = await res.arrayBuffer();
  let buf;
  try { buf = await new OfflineAudioContext(CHANNELS, 1, SAMPLE_RATE).decodeAudioData(bytes); }
  catch (e) { throw plainError(`The sound file (${url}) couldn’t be read as sound: ${e.message || e}.`, 'sound-decode'); }
  const ch = [buf.getChannelData(0), buf.getChannelData(Math.min(1, buf.numberOfChannels - 1))];
  return { ch, length: buf.length };
}

/* The sound track's timing boxes, as ffmpeg writes them for AAC (the muxer writes neither):
   - an edit list: play `samples` samples starting after the encoder's `delay` (movie time 0 = sound sample `delay`);
   - an AAC "roll" sample group (each packet needs the one before it decoded first). Without it Apple's decoder
     (QuickTime, Safari, Final Cut) assumes the default 2112-sample delay and trims that as well as the edit list, so
     the sound played 44 ms early there (measured); with it, ffmpeg, Apple and Chrome all play it to the sample.
   The index (moov) sits in the room reserved at the start of the file with a `free` box after it; the new bytes come out
   of that free box, so nothing after it moves and every chunk offset stays right. The sound track's and the movie's
   durations become the picture's length. (mp4-muxer writes version-0 boxes, mvhd first.) */
function addSoundTiming(head, delay, samples, rate) {
  const dv = new DataView(head.buffer, head.byteOffset, head.byteLength);
  const type = o => String.fromCharCode(head[o + 4], head[o + 5], head[o + 6], head[o + 7]);
  const kids = (o, end) => {
    const out = [];
    for (o += 8; o + 8 <= end;) { const s = dv.getUint32(o); if (s < 8 || o + s > end) throw new Error(`unexpected box at ${o}`); out.push({ o, s, t: type(o) }); o += s; }
    return out;
  };
  const child = (b, t) => kids(b.o, b.o + b.s).find(k => k.t === t);
  const top = [];
  for (let o = 0; o + 8 <= head.length;) { const s = dv.getUint32(o), t = type(o); top.push({ o, s, t }); if (t === 'mdat' || s < 8) break; o += s; }
  const mi = top.findIndex(b => b.t === 'moov'), moov = top[mi], free = top[mi + 1];
  if (!moov || !free || free.t !== 'free' || free.s < 36 + 54 + 8) throw new Error('no room for it');
  const mvhd = child(moov, 'mvhd');
  if (!mvhd || head[mvhd.o + 8] !== 0) throw new Error('unexpected movie header');
  const traks = kids(moov.o, moov.o + moov.s).filter(b => b.t === 'trak').map(tr => {
    const tkhd = child(tr, 'tkhd'), mdia = child(tr, 'mdia'), hdlr = mdia && child(mdia, 'hdlr');
    return { tr, tkhd, mdia, handler: hdlr ? String.fromCharCode(...head.subarray(hdlr.o + 16, hdlr.o + 20)) : '', dur: tkhd ? dv.getUint32(tkhd.o + 28) : 0 };
  });
  const snd = traks.find(t => t.handler === 'soun');
  if (!snd || !snd.tkhd || head[snd.tkhd.o + 8] !== 0 || child(snd.tr, 'edts') || mvhd.o > snd.tr.o) throw new Error('unexpected sound track');
  const minf = child(snd.mdia, 'minf'), stbl = minf && child(minf, 'stbl'), stsz = stbl && child(stbl, 'stsz');
  if (!stsz || child(stbl, 'sgpd')) throw new Error('unexpected sound tables');
  const packets = dv.getUint32(stsz.o + 16);
  // puts `bytes` at `at`, growing the boxes whose headers are at `parents` (all before `at`); the free box shrinks
  let freeAt = free.o, freeSize = free.s;
  const insert = (at, bytes, parents) => {
    const k = bytes.length;
    head.copyWithin(at + k, at, freeAt);
    head.set(bytes, at);
    freeAt += k; freeSize -= k;
    dv.setUint32(freeAt, freeSize); head.set([0x66, 0x72, 0x65, 0x65], freeAt + 4); head.fill(0, freeAt + 8, freeAt + freeSize);
    for (const o of parents) dv.setUint32(o, dv.getUint32(o) + k);
  };
  const tag = (b, o, t) => { for (let i = 0; i < 4; i++) b[o + i] = t.charCodeAt(i); };
  // 1. the roll group at the end of the sound's sample tables (the later spot first, so the earlier one doesn't move it)
  const roll = new Uint8Array(54), rv = new DataView(roll.buffer);
  rv.setUint32(0, 26); tag(roll, 4, 'sgpd'); roll[8] = 1; tag(roll, 12, 'roll'); rv.setUint32(16, 2); rv.setUint32(20, 1); rv.setInt16(24, -1);
  rv.setUint32(26, 28); tag(roll, 30, 'sbgp'); tag(roll, 38, 'roll'); rv.setUint32(42, 1); rv.setUint32(46, packets); rv.setUint32(50, 1);
  insert(stbl.o + stbl.s, roll, [moov.o, snd.tr.o, snd.mdia.o, minf.o, stbl.o]);
  // 2. the edit list, straight after the track header
  const seg = Math.round(samples / rate * dv.getUint32(mvhd.o + 20));   // (in the movie's timescale)
  const edts = new Uint8Array(36), ev = new DataView(edts.buffer);
  ev.setUint32(0, 36); tag(edts, 4, 'edts'); ev.setUint32(8, 28); tag(edts, 12, 'elst'); ev.setUint32(20, 1);
  ev.setUint32(24, seg); ev.setInt32(28, delay); ev.setInt16(32, 1);     // duration, start (in sound samples), rate 1
  insert(snd.tkhd.o + snd.tkhd.s, edts, [moov.o, snd.tr.o]);
  // 3. durations: the sound track's, and the movie's (its longest track)
  dv.setUint32(snd.tkhd.o + 28, seg);
  dv.setUint32(mvhd.o + 24, Math.max(seg, ...traks.filter(t => t !== snd).map(t => t.dur)));
}

/* ---------------------------------------------------------------- the recorder */

export async function recordVideo({ stage, seek, t0, t1, fps = 30, width = 1920, height = 1080, audioUrl = null, videoBitrate, onProgress, signal, debug = {} } = {}) {
  const support = recorderSupport();
  if (!support.ok) throw plainError(support.reason, 'unsupported');
  if (!(stage instanceof Element)) throw new TypeError('recordVideo: stage must be an element');
  if (typeof seek !== 'function') throw new TypeError('recordVideo: seek must be a function');
  t0 = +t0; t1 = +t1; fps = +fps; width = Math.round(+width); height = Math.round(+height);
  if (!Number.isFinite(t0) || !Number.isFinite(t1) || !(t1 > t0) || t0 < 0) throw new RangeError(`recordVideo: the range must be t0 < t1 (got ${t0}–${t1})`);
  if (!Number.isInteger(fps) || fps < 1 || fps > 120) throw new RangeError(`recordVideo: fps must be a whole number from 1 to 120 (got ${fps})`);
  if (!(width >= 16 && height >= 16) || width % 2 || height % 2) throw new RangeError(`recordVideo: the size must be even numbers of pixels (got ${width}×${height})`);
  if (signal && signal.aborted) throw abortError();
  if (busy) throw plainError('A recording is already running in this tab.', 'busy');
  busy = true;
  debug = debug || {};

  const frames = Math.max(1, Math.round((t1 - t0) * fps));
  const notes = [];
  let method = null, captureSize = null, lastFraction = 0;
  const report = (fraction, info = {}) => {
    lastFraction = fraction;
    if (!onProgress) return;
    try { onProgress(fraction, { frame: 0, frames, eta: null, method, captureSize, notes: notes.slice(), ...info }); } catch (e) { console.error(e); }
  };
  const cleanups = [];
  let track = null, grab = null, venc = null, aenc = null, ended = false, aborted = !!(signal && signal.aborted);
  const onAbort = () => { aborted = true; if (grab) for (const w of grab.waiters) w(); };
  if (signal) { signal.addEventListener('abort', onAbort); cleanups.push(() => signal.removeEventListener('abort', onAbort)); }
  const check = () => {
    if (aborted) throw abortError();
    if (ended) throw plainError('Sharing this tab stopped (“Stop sharing” was pressed, or the tab was closed), so the recording stopped. Press Record to start again.', 'capture-ended');
    if (grab && grab.error) throw plainError(`The captured picture stopped arriving: ${grab.error.message || grab.error}. Try again.`, 'capture-error');
  };
  const untilAbort = p => new Promise((resolve, reject) => {
    const fail = () => { try { check(); } catch (e) { reject(e); } };
    if (signal) signal.addEventListener('abort', fail, { once: true });
    Promise.resolve(p).then(resolve, reject).finally(() => signal && signal.removeEventListener('abort', fail));
  });
  // a hidden tab draws nothing (and sends no pictures): wait until it's back in front
  const whileHidden = async () => {
    if (document.visibilityState !== 'hidden') return;
    report(lastFraction, { paused: true, phase: 'paused', message: 'Paused: this tab is in the background. Bring it back to the front to carry on recording.' });
    await untilAbort(new Promise(r => { const f = () => { if (document.visibilityState !== 'hidden') { document.removeEventListener('visibilitychange', f); r(); } }; document.addEventListener('visibilitychange', f); }));
    report(lastFraction, { paused: false, phase: 'recording', message: 'Recording…' });
  };
  const show = async t => { check(); await whileHidden(); await untilAbort(seek(t)); check(); };

  try {
    /* 1. ask to capture this tab. This comes first: Chrome only allows it straight after a click. */
    report(0, { phase: 'starting', message: 'Asking to capture this tab…' });
    const handle = 'enhertu-rec-' + Math.random().toString(36).slice(2);
    try { navigator.mediaDevices.setCaptureHandleConfig && navigator.mediaDevices.setCaptureHandleConfig({ handle, exposeOrigin: false, permittedOrigins: [location.origin] }); } catch {}   // (to check the capture is this tab)
    let stream;
    try {
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'browser', frameRate: { ideal: 60, max: 60 }, width: { max: 7680 }, height: { max: 4320 } },
        audio: false, preferCurrentTab: true, selfBrowserSurface: 'include', surfaceSwitching: 'exclude', monitorTypeSurfaces: 'exclude', systemAudio: 'exclude',
      });
    } catch (e) {
      if (aborted) throw abortError();
      if (e && e.name === 'NotAllowedError') throw plainError('Recording needs permission to capture this tab. Press Record again and choose “Allow” (or “Share”) when Chrome asks.', 'permission');
      if (e && e.name === 'InvalidStateError') throw plainError('Chrome only allows capturing the tab right after a click. Press Record again.', 'activation');
      throw plainError(`This tab couldn’t be captured: ${e && e.message || e}.`, 'capture');
    }
    track = stream.getVideoTracks()[0];
    cleanups.push(() => { try { track.stop(); } catch {} });
    track.addEventListener('ended', () => { ended = true; if (grab) for (const w of grab.waiters) w(); });
    const st = track.getSettings ? track.getSettings() : {};
    const handleOf = track.getCaptureHandle ? track.getCaptureHandle() : null;
    if ((st.displaySurface && st.displaySurface !== 'browser') || (handleOf && handleOf.handle && handleOf.handle !== handle))
      throw plainError('Something other than this tab was chosen. Press Record again and choose this tab (“Allow” / “This tab”).', 'wrong-surface');
    check();

    /* 2. the encoders (checked before any pictures are taken) */
    let codec = null;
    const bitrate = Math.round(+videoBitrate || defaultBitrate(width, height, fps));
    const vbase = { width, height, bitrate, framerate: fps, bitrateMode: 'variable', latencyMode: 'quality', avc: { format: 'avc' } };
    for (const c of avcCodecs(width, height, fps)) {
      try { if ((await VideoEncoder.isConfigSupported({ ...vbase, codec: c })).supported) { codec = c; break; } } catch {}
    }
    if (!codec) throw plainError(`This browser can’t make H.264 video at ${width}×${height}, ${fps} fps. Try 1080p, or another computer.`, 'codec');
    // the sound: the best AAC bitrate this browser's encoder really makes (tried on a click, which also measures its delay)
    let withSound = !!audioUrl, audioBitrate = null, delay = 0;
    if (withSound) {
      let measured = null;
      for (const br of AAC_BITRATES) {
        let ok = false;
        try { ok = 'AudioEncoder' in window && (await AudioEncoder.isConfigSupported({ codec: AAC, sampleRate: SAMPLE_RATE, numberOfChannels: CHANNELS, bitrate: br })).supported; } catch {}
        if (!ok) continue;
        const p = await aacProbe(br).catch(() => ({ ok: false, delay: null }));
        check();
        if (p.ok) { audioBitrate = br; measured = p.delay; break; }
      }
      if (!audioBitrate) { withSound = false; notes.push('This browser can’t make AAC sound, so the video is silent. Chrome or Edge on a Mac or Windows computer can; or add the sound afterwards in an editor.'); }
      else if (measured == null) notes.push('The sound encoder’s delay couldn’t be measured, so the sound may be about 40 ms late.');
      delay = measured || 0;
    }
    check();

    /* 3. capture just the stage (Element Capture → Region Capture → the whole tab, cut here) */
    const saved = { willChange: stage.style.willChange };
    cleanups.push(() => { stage.style.willChange = saved.willChange; });
    const cs = getComputedStyle(stage).willChange || '';
    if (!/\b(opacity|filter)\b/.test(cs)) stage.style.willChange = saved.willChange && saved.willChange !== 'auto' ? `${saved.willChange}, opacity` : 'opacity';
    grab = new Grabber(track, debug.grabber === 'video');
    cleanups.push(() => grab && grab.stop());
    // the stage must be entirely inside the window (a capture only has what's on screen)
    const inView = () => {
      const r = stage.getBoundingClientRect(), de = document.documentElement;
      const vw = Math.min(innerWidth, de.clientWidth || innerWidth), vh = Math.min(innerHeight, de.clientHeight || innerHeight);
      return r.width > 1 && r.height > 1 && r.left >= -0.5 && r.top >= -0.5 && r.right <= vw + 0.5 && r.bottom <= vh + 0.5;
    };
    const OFFSCREEN = 'The whole picture has to be visible in the window while it records (Chrome only captures what’s on screen). Make the window bigger, or zoom the page out (Cmd/Ctrl and minus), and record again.';
    for (const until = performance.now() + 3000; !inView();) {        // (the "sharing" bar resizes the window: give the page a moment)
      if (performance.now() > until) throw plainError(OFFSCREEN, 'stage-offscreen');
      await sleep(100); check();
    }
    const wantSize = f => f && f.displayWidth === width && f.displayHeight === height;
    // after a change of capture: draw the first moment, wait for pictures, then until they settle; true if any came
    const settle = async (expectExact) => {
      const until = performance.now() + 2500;
      let got = false;
      while (performance.now() < until) {
        const s = grab.seq;
        await show(t0);
        if (await grab.newer(s, 500)) { got = true; break; }
        check();
      }
      if (!got) return false;
      for (let quiet = 0; quiet < 3 && performance.now() < until + 2000;) {
        const s = grab.seq;
        if (await grab.newer(s, 120)) { quiet = 0; continue; }
        check();
        if (expectExact && !wantSize(grab.latest)) { await show(t0); continue; }
        quiet++;
      }
      return !!grab.latest;
    };
    let crop = null;                                                   // the whole-tab mode: the stage's box, per frame
    if ('RestrictionTarget' in window && track.restrictTo && !debug.capture) {
      try {
        await track.restrictTo(await RestrictionTarget.fromElement(stage));
        await track.applyConstraints({ width, height, frameRate: { max: 60 } });
        if (await settle(true)) method = 'element';
        else await track.restrictTo(null);
      } catch (e) { check(); try { await track.restrictTo(null); } catch {} }
    }
    if (!method && 'CropTarget' in window && track.cropTo && debug.capture !== 'tab') {
      try {
        await track.cropTo(await CropTarget.fromElement(stage));
        await track.applyConstraints({ width, height, frameRate: { max: 60 } });
        if (await settle(false)) method = 'region';
        else await track.cropTo(null);
      } catch (e) { check(); try { await track.cropTo(null); } catch {} }
    }
    if (!method) {
      const r = stage.getBoundingClientRect();
      if (!(r.width > 0 && r.height > 0)) throw plainError('The picture isn’t showing on the page, so it can’t be recorded.', 'stage-hidden');
      if (r.left < -0.5 || r.top < -0.5 || r.right > innerWidth + 0.5 || r.bottom > innerHeight + 0.5)
        throw plainError('The whole picture has to be inside the window while recording. Make the window bigger (or zoom the page out) and try again.', 'stage-offscreen');
      const k = Math.min(7680 / innerWidth, 4320 / innerHeight, Math.max(width / r.width, height / r.height));
      await track.applyConstraints({ width: Math.round(innerWidth * k), height: Math.round(innerHeight * k), frameRate: { max: 60 } });
      crop = f => {
        const b = stage.getBoundingClientRect(), sx = f.displayWidth / innerWidth, sy = f.displayHeight / innerHeight;
        return [b.left * sx, b.top * sy, b.width * sx, b.height * sy];
      };
      if (!(await settle(false))) throw plainError('Chrome isn’t sending the picture of this tab. Keep the tab in front and try again.', 'no-frames');
      method = 'tab';
      notes.push('This browser captured the whole tab and kept the picture’s area, so anything drawn over the picture while recording is in the video too.');
    }
    captureSize = [grab.latest.displayWidth, grab.latest.displayHeight];
    if (!crop && Math.abs(captureSize[0] / captureSize[1] - width / height) > 0.01 * width / height)
      throw plainError(`${OFFSCREEN} (The captured picture came out ${captureSize[0]}×${captureSize[1]}, not the shape of a ${width}×${height} video.)`, 'stage-offscreen');
    const direct = !crop && wantSize(grab.latest);                     // the captured picture is the video frame as it is
    if (!crop && !direct) notes.push(`The captured picture came out at ${captureSize[0]}×${captureSize[1]} and was scaled to ${width}×${height}.`);
    report(0, { phase: 'starting', message: 'Capturing the picture…' });

    // compare pictures small: the stage part only (whole-tab mode)
    const sig = new OffscreenCanvas(SIG_W, SIG_H), sigCtx = sig.getContext('2d', { alpha: false });
    const signature = f => {
      if (crop) { const [x, y, w, h] = crop(f); sigCtx.drawImage(f, x, y, w, h, 0, 0, SIG_W, SIG_H); }
      else sigCtx.drawImage(f, 0, 0, SIG_W, SIG_H);
      return new Uint32Array(sigCtx.getImageData(0, 0, SIG_W, SIG_H).data.buffer);
    };
    const same = (a, b) => { if (!a || !b || a.length !== b.length) return false; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false; return true; };
    let prevSig = null;
    // the picture of display time t, fresh (see the top of this file). Returns a VideoFrame the caller closes.
    let redraws = 0, slow = 0;
    const freshFrame = async t => {
      let base = grab.seq;
      await show(t);
      const quietUntil = performance.now() + QUIET_MS;
      for (;;) {
        const left = quietUntil - performance.now();
        if (left <= 0 || !(await grab.newer(base, left))) break;
        check();
        base = grab.seq;
        const s = signature(grab.latest);
        if (!same(s, prevSig)) { prevSig = s; return grab.latest.clone(); }
      }
      check();
      slow++;
      for (let k = 0; k < RETRIES; k++) {                          // the same picture as before, or a skipped capture: draw it again
        base = grab.seq; redraws++;
        await show(t);
        if (await grab.newer(base, RETRY_MS)) {
          check();
          for (let s = grab.seq; await grab.newer(s, 40); s = grab.seq) check();   // take the newest once they stop coming
          prevSig = signature(grab.latest);
          return grab.latest.clone();
        }
        check();
      }
      throw plainError('Chrome stopped sending the picture of this tab, so the recording stopped. Keep the tab in front (not minimised or covered) while it records, and try again.', 'no-frames');
    };

    /* 4. the MP4 */
    const A = Math.round(frames / fps * SAMPLE_RATE);                 // sound samples in the video (as long as the picture)
    const sink = new BlobSink();
    const muxer = new Muxer({
      target: new StreamTarget({ onData: (data, position) => sink.write(data, position) }),
      video: { codec: 'avc', width, height, frameRate: fps },
      audio: withSound ? { codec: 'aac', numberOfChannels: CHANNELS, sampleRate: SAMPLE_RATE } : undefined,
      fastStart: { expectedVideoChunks: frames + 4, expectedAudioChunks: withSound ? Math.ceil((A + 8192) / 1024) + 16 : undefined },
      firstTimestampBehavior: 'strict',
    });
    sink.freeze();
    let encError = null;
    venc = new VideoEncoder({ output: (chunk, meta) => { try { muxer.addVideoChunk(chunk, meta); } catch (e) { encError = e; } }, error: e => { encError = e; } });
    venc.configure({ ...vbase, codec });
    cleanups.push(() => { try { if (venc.state !== 'closed') venc.close(); } catch {} });

    /* 5. the sound: loaded while the pictures are recorded; fed in step with them */
    let sound = null, soundErr = null, fed = 0, soundDone = !withSound;
    if (withSound) {
      loadSound(audioUrl, signal).then(s => { sound = s; }, e => { soundErr = e; });
      aenc = new AudioEncoder({
        output: (chunk, meta) => {
          try {
            // cut the sound to the encoder's delay + the picture's length (the last packet made shorter; any beyond dropped)
            const end = A + delay, start = Math.round(chunk.timestamp * SAMPLE_RATE / 1e6), n = Math.round(chunk.duration * SAMPLE_RATE / 1e6) || 1024;
            if (start >= end) return;
            if (start + n > end) {
              const b = new Uint8Array(chunk.byteLength); chunk.copyTo(b);
              chunk = new EncodedAudioChunk({ type: chunk.type, timestamp: chunk.timestamp, duration: Math.round((end - start) / SAMPLE_RATE * 1e6), data: b });
            }
            muxer.addAudioChunk(chunk, meta);
          } catch (e) { encError = e; }
        },
        error: e => { encError = e; },
      });
      aenc.configure({ codec: AAC, sampleRate: SAMPLE_RATE, numberOfChannels: CHANNELS, bitrate: audioBitrate });
      cleanups.push(() => { try { if (aenc.state !== 'closed') aenc.close(); } catch {} });
    }
    const S0 = Math.round(t0 * SAMPLE_RATE), BLOCK = 4800;
    // feed the encoder the sound up to `upTo` samples of the video (input j is the piece's sample S0 + j; the edit list
    // skips the encoder's leading silence)
    const feedSound = upTo => {
      if (!sound || soundDone) return;
      const total = A, target = Math.min(total, Math.max(0, upTo));
      while (fed < target) {
        const n = Math.min(BLOCK, target - fed), data = new Float32Array(n * CHANNELS);
        for (let c = 0; c < CHANNELS; c++) {
          const src = sound.ch[c], from = S0 + fed, a = Math.max(0, from), b = Math.min(sound.length, from + n);
          if (b > a) data.set(src.subarray(a, b), c * n + (a - from));
        }
        const ad = new AudioData({ format: 'f32-planar', sampleRate: SAMPLE_RATE, numberOfFrames: n, numberOfChannels: CHANNELS, timestamp: Math.round(fed / SAMPLE_RATE * 1e6), data });
        aenc.encode(ad); ad.close();
        fed += n;
      }
      if (fed >= total) soundDone = true;
    };

    /* 6. frame by frame */
    report(0, { phase: 'recording', message: `Recording frame 1 of ${frames}…` });
    const keyEvery = Math.max(1, Math.round(KEYFRAME_SECONDS * fps));
    const canvas = direct ? null : new OffscreenCanvas(width, height);
    const ctx = canvas && canvas.getContext('2d', { alpha: false });
    if (ctx) { ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; }
    const started = performance.now();
    for (let i = 0; i < frames; i++) {
      check();
      if (encError) throw plainError(`The video encoder stopped: ${encError.message || encError}.`, 'encoder');
      if (soundErr) throw soundErr;
      const t = t0 + i / fps;
      if (!inView()) throw plainError(OFFSCREEN, 'stage-offscreen');
      const src = await freshFrame(t);
      const ts = Math.round(i * 1e6 / fps), dur = Math.round((i + 1) * 1e6 / fps) - ts;
      let vf;
      try {
        if (direct && wantSize(src)) vf = new VideoFrame(src, { timestamp: ts, duration: dur });
        else {
          const c2 = canvas || new OffscreenCanvas(width, height), g = ctx || c2.getContext('2d', { alpha: false });
          if (crop) { const [x, y, w, h] = crop(src); g.drawImage(src, x, y, w, h, 0, 0, width, height); }
          else g.drawImage(src, 0, 0, width, height);
          vf = new VideoFrame(c2, { timestamp: ts, duration: dur, alpha: 'discard' });
        }
      } finally { src.close(); }
      venc.encode(vf, { keyFrame: i % keyEvery === 0 });
      vf.close();
      while (venc.encodeQueueSize > 2) { await new Promise(r => { venc.addEventListener('dequeue', r, { once: true }); setTimeout(r, 200); }); check(); }
      feedSound(Math.round((i + 1) / fps * SAMPLE_RATE));
      const done = i + 1, per = (performance.now() - started) / 1000 / done;
      if (done === frames || done % 3 === 0 || done < 4)
        report(done / frames * 0.97, { phase: 'recording', frame: done, frames, eta: done >= 5 ? per * (frames - done) + 2 : null, secondsPerFrame: per, message: `Recording frame ${done} of ${frames}…` });
    }
    const seconds = (performance.now() - started) / 1000;

    /* 7. finish */
    report(0.98, { phase: 'finishing', frame: frames, frames, eta: 2, message: withSound && !sound ? 'Waiting for the sound…' : 'Finishing the file…' });
    grab.stop(); try { track.stop(); } catch {}                        // done with the capture (the "sharing" bar goes)
    await untilAbort(venc.flush());
    if (withSound) {
      while (!sound && !soundErr) { check(); await sleep(50); }
      if (soundErr) throw soundErr;
      feedSound(A);
      await untilAbort(aenc.flush());
    }
    check();
    if (encError) throw plainError(`The video encoder stopped: ${encError.message || encError}.`, 'encoder');
    muxer.finalize();
    if (withSound && delay > 0) {
      try { addSoundTiming(sink.head, delay, A, SAMPLE_RATE); }
      catch (e) { notes.push(`The sound may start about ${Math.round(delay / SAMPLE_RATE * 1000)} ms late in some players (the file’s edit list couldn’t be written: ${e.message}).`); }
    }
    const blob = sink.blob('video/mp4');
    blob.notes = notes.slice();
    blob.info = { version: RECORDER_VERSION, method, captureSize, frames, fps, width, height, t0, t1, seconds, secondsPerFrame: seconds / frames, redraws, slowFrames: slow,
      audio: withSound, audioDelay: withSound ? delay : null, audioBitrate: withSound ? audioBitrate : null, codec, bitrate, bytes: blob.size, grabber: grab.kind };
    report(1, { phase: 'done', frame: frames, frames, eta: 0, message: 'Done.' });
    return blob;
  } catch (e) {
    if (aborted || (e && e.name === 'AbortError')) throw abortError();
    throw e;
  } finally {
    for (const f of cleanups.reverse()) { try { f(); } catch {} }
    busy = false;
  }
}
