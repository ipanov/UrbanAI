#!/usr/bin/env python3

import sys
import json
from youtube_transcript_api import YouTubeTranscriptApi

def extract_transcript(video_url):
    """Extract transcript from YouTube video URL"""
    try:
        # Extract video ID from URL
        if "watch?v=" in video_url:
            video_id = video_url.split("watch?v=")[1].split("&")[0]
        elif "youtu.be/" in video_url:
            video_id = video_url.split("youtu.be/")[1].split("?")[0]
        else:
            video_id = video_url

        print(f"🎥 Extracting transcript for video ID: {video_id}")

        # Get the transcript using the new API
        api = YouTubeTranscriptApi()

        # Try to get English transcript first, then any available
        try:
            fetched_transcript = api.fetch(video_id, languages=['en'])
            transcript = list(fetched_transcript)  # Convert to list of snippets
        except:
            # If English not available, try other languages
            try:
                fetched_transcript = api.fetch(video_id, languages=['en', 'es', 'fr', 'de'])
                transcript = list(fetched_transcript)
            except:
                # Last resort: list all available and pick first
                transcript_list = api.list(video_id)
                available_transcripts = list(transcript_list)
                if not available_transcripts:
                    raise Exception("No transcripts available for this video")
                transcript = list(available_transcripts[0].fetch())

        # Combine all text - handle both dict and snippet objects
        full_text = " ".join([
            entry.text if hasattr(entry, 'text') else entry['text']
            for entry in transcript
        ])

        # Also provide structured format
        result = {
            "video_id": video_id,
            "video_url": f"https://www.youtube.com/watch?v={video_id}",
            "full_transcript": full_text,
            "structured_transcript": [
                {
                    "text": entry.text if hasattr(entry, 'text') else entry['text'],
                    "start": entry.start if hasattr(entry, 'start') else entry['start'],
                    "duration": entry.duration if hasattr(entry, 'duration') else entry['duration']
                }
                for entry in transcript
            ],
            "total_duration": (
                (transcript[-1].start if hasattr(transcript[-1], 'start') else transcript[-1]['start']) +
                (transcript[-1].duration if hasattr(transcript[-1], 'duration') else transcript[-1]['duration'])
            ) if transcript else 0,
            "word_count": len(full_text.split())
        }

        return result

    except Exception as e:
        return {"error": str(e), "video_id": video_id if 'video_id' in locals() else "unknown"}

def main():
    if len(sys.argv) < 2:
        print("Usage: python extract-youtube-transcript.py <youtube_url>")
        print("Example: python extract-youtube-transcript.py https://www.youtube.com/watch?v=xOO8Wt_i72s")
        sys.exit(1)

    video_url = sys.argv[1]
    result = extract_transcript(video_url)

    if "error" in result:
        print(f"❌ Error extracting transcript: {result['error']}")
        sys.exit(1)

    print(f"✅ Successfully extracted transcript")
    print(f"📊 Duration: {result['total_duration']:.1f} seconds")
    print(f"📝 Word count: {result['word_count']} words")
    print()
    print("=" * 80)
    print("FULL TRANSCRIPT:")
    print("=" * 80)
    print(result['full_transcript'])
    print()

    # Save to file
    output_file = f"transcript-{result['video_id']}.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"💾 Transcript saved to: {output_file}")

if __name__ == "__main__":
    main()