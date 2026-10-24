
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$asTaskGeneric = [System.WindowsRuntimeSystemExtensions].GetMethods() | ? { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.IsGenericMethod } | Select-Object -First 1

function Await($winRtOp, $resultType) {
    $asTask = $asTaskGeneric.MakeGenericMethod($resultType)
    $netTask = $asTask.Invoke($null, @($winRtOp))
    $netTask.Wait(-1) | Out-Null
    $netTask.Result
}

[Windows.Media.SpeechSynthesis.SpeechSynthesizer, Windows.Media.SpeechSynthesis, ContentType = WindowsRuntime] | Out-Null

function SynthVoice($voiceName, $outFile) {
    $synth = New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer
    $voice = [Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices | Where-Object { $_.DisplayName -like "*$voiceName*" } | Select-Object -First 1
    $synth.Voice = $voice
    
    $ssml = @"
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-IN">
    <voice name="$($voice.DisplayName)">
        <prosody rate="0.92" pitch="+1st">
            Shubh Deepawali! Happy Diwali!
            <break time="500ms"/>
            Chetan Sahu ji ki taraf se aap sabhi ko Deepawali ki hardik shubhkaamnayein!
            <break time="600ms"/>
            Maa Lakshmi aur Bhagwaan Shree Ganesh ji ki kripa aap par sadaiv bani rahe.
            <break time="500ms"/>
            Wishing you and your entire family a very joyful, prosperous, and auspicious Deepawali!
            <break time="600ms"/>
            Shubh Deepawali!
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

    [System.IO.File]::WriteAllBytes($outFile, $bytes)
    Write-Output ("Saved " + $outFile + " (" + $voice.DisplayName + "): " + $bytes.Length + " bytes")
}

SynthVoice "Heera" "voice_heera.wav"
SynthVoice "Ravi" "voice_ravi.wav"
