import subprocess

ps_script = """
Add-Type -AssemblyName System.Runtime.WindowsRuntime
# Check if MediaTranscoder is available
$transcoder = New-Object Windows.Media.Transcoding.MediaTranscoder
$profile = [Windows.Media.MediaProperties.MediaEncodingProfile]::CreateMp3([Windows.Media.MediaProperties.AudioEncodingQuality]::Medium)
Write-Output ("MP3 profile sample rate: " + $profile.Audio.SampleRate + ", bitrate: " + $profile.Audio.Bitrate)
"""

with open("test_transcode.ps1", "w", encoding="utf-8") as f:
    f.write(ps_script)

res = subprocess.run(["powershell", "-ExecutionPolicy", "Bypass", "-File", "test_transcode.ps1"], capture_output=True, text=True)
print("STDOUT:", res.stdout)
print("STDERR:", res.stderr)
