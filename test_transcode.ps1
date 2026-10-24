
Add-Type -AssemblyName System.Runtime.WindowsRuntime
# Check if MediaTranscoder is available
$transcoder = New-Object Windows.Media.Transcoding.MediaTranscoder
$profile = [Windows.Media.MediaProperties.MediaEncodingProfile]::CreateMp3([Windows.Media.MediaProperties.AudioEncodingQuality]::Medium)
Write-Output ("MP3 profile sample rate: " + $profile.Audio.SampleRate + ", bitrate: " + $profile.Audio.Bitrate)
