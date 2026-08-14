Add-Type -AssemblyName System.IO.Compression.FileSystem

function Extract-Docx([string]$src, [string]$outTxt) {
  $copy = $src + ".tmpcopy.docx"
  Copy-Item $src $copy -Force
  $z = [IO.Compression.ZipFile]::OpenRead($copy)
  $e = $z.GetEntry('word/document.xml')
  $sr = New-Object IO.StreamReader($e.Open())
  $xml = $sr.ReadToEnd()
  $sr.Close(); $z.Dispose()
  Remove-Item $copy -Force
  $t = [regex]::Replace($xml, '<[^>]+>', ' ')
  $t = [regex]::Replace($t, '\s+', ' ')
  [IO.File]::WriteAllText($outTxt, $t)
  Write-Output ("OK " + (Split-Path $src -Leaf) + " len=" + $t.Length)
}

Extract-Docx 'C:\Users\user\Downloads\Homepage-details (1) (1).docx' 'C:\Users\user\Desktop\Urlaubspanda\tmp-screenshots\req-homepage.txt'
Extract-Docx 'C:\Users\user\Downloads\buchungsstrecke (1) (1).docx' 'C:\Users\user\Desktop\Urlaubspanda\tmp-screenshots\req-booking.txt'
