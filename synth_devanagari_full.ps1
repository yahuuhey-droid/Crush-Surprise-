
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

$hindiText = "शुभ दीपावली! आप सभी को दीपावली की हार्दिक शुभकामनाएं। चेतन साहू जी की तरफ से आपको और आपके पूरे परिवार को दीपोत्सव की बहुत-बहुत बधाई। मां लक्ष्मी और भगवान श्री गणेश जी की कृपा से आपका जीवन सुख, समृद्धि और आरोग्य के दिव्य प्रकाश से सदैव जगमगाता रहे। हैप्पी दिवाली! शुभ दीपावली!"

$op = $synth.SynthesizeTextToStreamAsync($hindiText)
$stream = Await $op ([Windows.Media.SpeechSynthesis.SpeechSynthesisStream])

$reader = New-Object Windows.Storage.Streams.DataReader($stream.GetInputStreamAt(0))
$loadOp = $reader.LoadAsync($stream.Size)
$bytesLoaded = Await $loadOp ([System.UInt32])

$bytes = New-Object byte[] $bytesLoaded
$reader.ReadBytes($bytes)

[System.IO.File]::WriteAllBytes("hindi_voice_devanagari.wav", $bytes)
Write-Output ("Saved hindi_voice_devanagari.wav, bytes: " + $bytes.Length)
