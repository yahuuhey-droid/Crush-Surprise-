
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
$heera = [Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices | Where-Object { $_.DisplayName -like "*Heera*" } | Select-Object -First 1
$synth.Voice = $heera

$hindiText = "शुभ दीपावली! हैप्पी दिवाली! चेतन साहू जी की तरफ से आप सभी को दीपावली की हार्दिक शुभकामनाएं।"
try {
    $op = $synth.SynthesizeTextToStreamAsync($hindiText)
    $stream = Await $op ([Windows.Media.SpeechSynthesis.SpeechSynthesisStream])
    Write-Output ("Devanagari synthesized successfully! Stream size: " + $stream.Size)
} catch {
    Write-Output ("Devanagari error: " + $_.Exception.Message)
}
