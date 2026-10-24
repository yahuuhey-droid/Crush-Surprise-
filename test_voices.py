import subprocess
import json

ps_script = """
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$voices = @()
foreach ($v in $synth.GetInstalledVoices()) {
    $voices += @{
        Name = $v.VoiceInfo.Name
        Culture = $v.VoiceInfo.Culture.Name
        Gender = $v.VoiceInfo.Gender.ToString()
    }
}
$synth.Dispose()
$voices | ConvertTo-Json
"""

with open("test_voices.ps1", "w", encoding="utf-8") as f:
    f.write(ps_script)

res = subprocess.run(["powershell", "-ExecutionPolicy", "Bypass", "-File", "test_voices.ps1"], capture_output=True, text=True)
print("STDOUT:", res.stdout)
print("STDERR:", res.stderr)
