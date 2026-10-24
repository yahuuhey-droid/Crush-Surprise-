
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
    Write-Output ("Using voice: " + $heera.DisplayName)
} else {
    Write-Output "Heera voice not found, using default"
}

$text = "Shubh Deepawali! Happy Diwali to all of you from Chetan Sahu ji! May this festival of lights illuminate your life with joy, prosperity, good health and happiness. Happy Deepawali!"
$op = $synth.SynthesizeTextToStreamAsync($text)
$stream = Await $op ([Windows.Media.SpeechSynthesis.SpeechSynthesisStream])

$reader = New-Object Windows.Storage.Streams.DataReader($stream.GetInputStreamAt(0))
$loadOp = $reader.LoadAsync($stream.Size)
$bytesLoaded = Await $loadOp ([System.UInt32])

$bytes = New-Object byte[] $bytesLoaded
$reader.ReadBytes($bytes)

[System.IO.File]::WriteAllBytes("diwali_wish_voice.wav", $bytes)
Write-Output ("Saved diwali_wish_voice.wav, size: " + $bytes.Length + " bytes")
