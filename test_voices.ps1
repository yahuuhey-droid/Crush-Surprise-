
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
