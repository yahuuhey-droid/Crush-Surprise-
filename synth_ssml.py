import subprocess
import wave
import struct
import math

ps_script = """
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$asTaskGeneric = [System.WindowsRuntimeSystemExtensions].GetMethods() | ? { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.IsGenericMethod } | Select-Object -First 1

function Await($winRtOp, $resultType) {
    $asTask = $asTaskGeneric.MakeGenericMethod($resultType)
    $netTask = $asTask.Invoke($null, @($winRtOp))
    $netTask.Wait(-1) | Out-Null
    $netTask.Result
}

[Windows.Media.SpeechSynthesis.SpeechSynthesizer, Windows.Media.SpeechSynthesis, ContentType = WindowsRuntime] | Out-Null
$synth = New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer

$voices = [Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices
$heera = $voices | Where-Object { $_.DisplayName -like "*Heera*" } | Select-Object -First 1
if ($heera) {
    $synth.Voice = $heera
}

$ssml = @"
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-IN">
    <voice name="$($heera.DisplayName)">
        <prosody rate="0.95" pitch="+2st">
            Happy Diwali! Shubh Deepawali! 
            <break time="400ms"/>
            Chetan Sahu ji ki taraf se aap sabhi ko Deepawali ki dher saari shubhkaamnayein!
            <break time="500ms"/>
            Wishing you and your family a very joyful, peaceful, and prosperous Deepawali!
            <break time="400ms"/>
            May Goddess Lakshmi and Lord Ganesha bless your home with happiness, good health, and boundless wealth.
            <break time="500ms"/>
            Once again, a very Happy Deepawali!
        </prosody>
    </voice>
</speak>
"@

$op = $synth.SynthesizeSsmlToStreamAsync($ssml)
$stream = Await $op ([Windows.Media.SpeechSynthesis.SpeechSynthesisStream])

$reader = New-Object Windows.Storage.Streams.DataReader($stream.GetInputStreamAt(0))
$loadOp = $reader.LoadAsync($stream.Size)
$bytesLoaded = Await $loadOp ([System.UInt32])

$bytes = New-Object byte[] $bytesLoaded
$reader.ReadBytes($bytes)

[System.IO.File]::WriteAllBytes("diwali_voice_clean.wav", $bytes)
Write-Output ("Saved diwali_voice_clean.wav, size: " + $bytes.Length + " bytes")
"""

with open("synth_ssml.ps1", "w", encoding="utf-8") as f:
    f.write(ps_script)

res = subprocess.run(["powershell", "-ExecutionPolicy", "Bypass", "-File", "synth_ssml.ps1"], capture_output=True, text=True)
print("STDOUT:", res.stdout)
print("STDERR:", res.stderr)
