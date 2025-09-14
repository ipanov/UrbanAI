#!/usr/bin/env python3
import os
import json
from pathlib import Path
from datetime import timedelta

try:
    from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound, VideoUnavailable
except ImportError:
    print("ERROR: youtube-transcript-api is not installed. Install it with: python -m pip install --user youtube-transcript-api")
    raise

VIDEO_IDS = [
    "McJluKfjVGk",
    "YJ3Z9XhlF5w",
    "xOO8Wt_i72s",
]

DEST_DIR = Path("docs/research/ux/transcripts")


def format_time(seconds: float) -> str:
    td = timedelta(seconds=float(seconds))
    # Format as mm:ss (or hh:mm:ss if needed)
    total_seconds = int(td.total_seconds())
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    secs = total_seconds % 60
    if hours:
        return f"{hours:02d}:{minutes:02d}:{secs:02d}"
    return f"{minutes:02d}:{secs:02d}"


def ensure_dest():
    DEST_DIR.mkdir(parents=True, exist_ok=True)


def fetch_and_save(video_id: str) -> dict:
    """
    Fetch transcript for a video ID, store JSON and TXT artifacts.
    Returns metadata dict for index.
    """
    transcript = []
    try:
        # Prefer English, try manually created transcripts first, then generated
        preferred_langs = ["en", "en-US", "en-GB", "en-CA", "en-AU"]
        transcripts = YouTubeTranscriptApi.list_transcripts(video_id)

        selected = None
        for lang in preferred_langs:
            try:
                selected = transcripts.find_transcript([lang])
                break
            except Exception:
                pass

        if selected is None:
            for lang in preferred_langs:
                try:
                    selected = transcripts.find_generated_transcript([lang])
                    break
                except Exception:
                    pass

        if selected is not None:
            transcript = selected.fetch()
    except TranscriptsDisabled:
        print(f"[WARN] Transcripts are disabled for video {video_id}")
        transcript = []
    except NoTranscriptFound:
        print(f"[WARN] No transcript found for video {video_id}")
        transcript = []
    except VideoUnavailable:
        print(f"[WARN] Video unavailable {video_id}")
        transcript = []
    except Exception as e:
        print(f"[ERROR] Unexpected error fetching transcript for {video_id}: {e}")
        transcript = []

    # Save JSON
    json_path = DEST_DIR / f"{video_id}.json"
    with json_path.open("w", encoding="utf-8") as f:
        json.dump(transcript, f, ensure_ascii=False, indent=2)

    # Save plain text with timecodes
    txt_path = DEST_DIR / f"{video_id}.txt"
    with txt_path.open("w", encoding="utf-8") as f:
        if not transcript:
            f.write("[No transcript available]\n")
        else:
            for seg in transcript:
                start = format_time(seg.get("start", 0))
                text = seg.get("text", "").replace("\n", " ").strip()
                f.write(f"[{start}] {text}\n")

    meta = {
        "id": video_id,
        "videoUrl": f"https://www.youtube.com/watch?v={video_id}",
        "jsonFile": str(json_path),
        "txtFile": str(txt_path),
        "jsonSizeBytes": json_path.stat().st_size if json_path.exists() else 0,
        "txtSizeBytes": txt_path.stat().st_size if txt_path.exists() else 0,
    }
    return meta


def main():
    ensure_dest()
    index = []
    for vid in VIDEO_IDS:
        print(f"[INFO] Fetching transcript for {vid} ...")
        meta = fetch_and_save(vid)
        index.append(meta)

    index_path = DEST_DIR / "index.json"
    with index_path.open("w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)

    print(f"[INFO] Wrote index: {index_path}")
    for item in index:
        print(f"- {item['id']} -> {item['txtFile']} ({item['txtSizeBytes']} bytes)")

if __name__ == "__main__":
    main()
