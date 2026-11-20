import os
import subprocess
import sys

TARGET_DIR = r"c:\Users\admin\Herd\Video_Editor\public\videos"
IMAGES_DIR = r"c:\Users\admin\Herd\Video_Editor\public\images"
os.makedirs(TARGET_DIR, exist_ok=True)
os.makedirs(IMAGES_DIR, exist_ok=True)

VIDEOS = [
    {
        "id": "6kYRUsXtS4s",
        "name": "showreel-cinematic.mp4",
        "title": "Master Showreel",
        "copy_to": "showreel-loop.mp4"
    },
    {
        "id": "Nz5EXDeCzGw",
        "name": "credit-card-viral-reel.mp4",
        "title": "Viral Instagram / Short-Form Reel"
    },
    {
        "id": "GiuNmNF3MV4",
        "name": "moksha-d2c-commercial.mp4",
        "title": "D2C Brand Commercial Ad"
    },
    {
        "id": "aJjmG6l6vu8",
        "name": "quick-commerce-youtube.mp4",
        "title": "YouTube Video Essay / Documentary"
    },
    {
        "id": "GoVs5FcFfgY",
        "name": "udaipur-royal-wedding.mp4",
        "title": "Royal Cinematic Wedding Teaser"
    },
    {
        "id": "HnFmX1YdSgA",
        "name": "kredo-brand-anthem.mp4",
        "title": "Brand Anthem Film"
    },
    {
        "id": "n_1QuRG5zMk",
        "name": "modern-founder-podcast.mp4",
        "title": "Multi-Cam Podcast Studio Edit"
    },
    {
        "id": "oM64pxKoZVQ",
        "name": "kala-motion-graphics.mp4",
        "title": "Motion Graphics & Kinetic Showreel"
    },
    {
        "id": "_Rf6l9aOgw8",
        "name": "himalayan-expedition.mp4",
        "title": "Cinematic Travel & Documentary Reel"
    }
]

for item in VIDEOS:
    vid_id = item["id"]
    name = item["name"]
    out_path = os.path.join(TARGET_DIR, name)
    temp_path = os.path.join(TARGET_DIR, f"temp_{vid_id}.mp4")
    
    print(f"Downloading {item['title']} ({vid_id})...")
    url = f"https://www.youtube.com/watch?v={vid_id}"
    
    # Download 720p/1080p MP4 with audio
    dl_cmd = [
        "python", "-m", "yt_dlp",
        "--no-warnings",
        "-f", "bv*[ext=mp4][height<=1080]+ba[ext=m4a]/b[ext=mp4]/best",
        "--merge-output-format", "mp4",
        "-o", temp_path,
        url
    ]
    res = subprocess.run(dl_cmd, capture_output=True, text=True, errors="ignore")
    if not os.path.exists(temp_path):
        print(f"Failed to download {vid_id}: {res.stderr}")
        continue
    
    # Transcode or copy cleanly with faststart for web streaming
    # Limit max duration to 60s if it's long, or copy if short
    ff_cmd = [
        "ffmpeg", "-y", "-i", temp_path,
        "-t", "65",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "22",
        "-c:a", "aac", "-b:a", "160k",
        "-movflags", "+faststart",
        out_path
    ]
    subprocess.run(ff_cmd, capture_output=True)
    if os.path.exists(temp_path):
        try:
            os.remove(temp_path)
        except Exception:
            pass
            
    if "copy_to" in item:
        copy_dest = os.path.join(TARGET_DIR, item["copy_to"])
        subprocess.run(["ffmpeg", "-y", "-i", out_path, "-c", "copy", copy_dest], capture_output=True)
        print(f"  Copied to {item['copy_to']}")
        
    # Generate poster image
    poster_name = name.replace(".mp4", "-poster.jpg")
    poster_path = os.path.join(IMAGES_DIR, poster_name)
    ff_thumb = [
        "ffmpeg", "-y", "-ss", "00:00:03", "-i", out_path,
        "-frames:v", "1", "-q:v", "2", poster_path
    ]
    subprocess.run(ff_thumb, capture_output=True)
    print(f"  Saved {name} ({os.path.getsize(out_path)} bytes) & poster {poster_name}")

print("All downloads finished!")
