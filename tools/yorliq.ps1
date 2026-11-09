# KOINOT - ish stoliga va Start menyusiga yorliq yaratish (Windows).
# Yorliq Chrome'ni (bo'lmasa Edge'ni) "ilova rejimi"da ochadi: manzil qatori va tablarsiz, alohida oyna.
# Hech narsa o'rnatilmaydi, hech qaysi fayl o'zgartirilmaydi. Olib tashlash: KOINOT_yorliqni_olib_tashlash.bat
param([switch]$Remove)
$ErrorActionPreference = 'Stop'
$root    = Split-Path -Parent $PSScriptRoot
$index   = Join-Path $root 'index.html'
$icon    = Join-Path $root 'assets\ui\koinot.ico'
$lnkDesk = Join-Path ([Environment]::GetFolderPath('Desktop')) 'KOINOT.lnk'
$lnkMenu = Join-Path ([Environment]::GetFolderPath('Programs')) 'KOINOT.lnk'

if ($Remove) {
  foreach ($f in @($lnkDesk, $lnkMenu)) { if (Test-Path $f) { Remove-Item $f -Force; Write-Host "Olib tashlandi: $f" } }
  Write-Host 'Tayyor. (KOINOT papkasi va ma''lumotlaringiz o''chirilmadi.)'
  exit 0
}
if (-not (Test-Path $index)) {
  Write-Host "XATO: index.html topilmadi: $index"
  Write-Host "Bu fayl KOINOT papkasi ichida bo'lishi kerak (papkaning o'zi, ZIP ichidan emas)."
  exit 1
}

function Find-Exe($names, $rels) {
  foreach ($n in $names) {
    foreach ($h in 'HKLM', 'HKCU') {
      try {
        $v = (Get-ItemProperty -Path ($h + ':\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\' + $n) -ErrorAction Stop).'(default)'
        if ($v -and (Test-Path $v)) { return $v }
      } catch { }
    }
  }
  foreach ($b in @($env:ProgramFiles, ${env:ProgramFiles(x86)}, $env:LOCALAPPDATA)) {
    if (-not $b) { continue }
    foreach ($r in $rels) { $p = Join-Path $b $r; if (Test-Path $p) { return $p } }
  }
  return $null
}

$browser = Find-Exe @('chrome.exe') @('Google\Chrome\Application\chrome.exe')
$bname = 'Chrome'
if (-not $browser) { $browser = Find-Exe @('msedge.exe') @('Microsoft\Edge\Application\msedge.exe'); $bname = 'Edge' }

$uri = ([System.Uri]$index).AbsoluteUri
$ws = New-Object -ComObject WScript.Shell
function New-Lnk($path, $target, $argLine) {
  $s = $ws.CreateShortcut($path)
  $s.TargetPath = $target
  $s.Arguments = $argLine
  $s.WorkingDirectory = $root
  if (Test-Path $icon) { $s.IconLocation = "$icon,0" }
  $s.Description = 'KOINOT - interaktiv 3D koinot atlasi'
  $s.Save()
}

if ($browser) {
  $argLine = '--app="' + $uri + '" --window-size=1400,880'
  New-Lnk $lnkDesk $browser $argLine
  New-Lnk $lnkMenu $browser $argLine
  Write-Host "Yorliq yaratildi ($bname ilova rejimi): $lnkDesk"
} else {
  New-Lnk $lnkDesk $index ''
  New-Lnk $lnkMenu $index ''
  Write-Host "Chrome ham, Edge ham topilmadi. Yorliq oddiy brauzerda ochadi: $lnkDesk"
}
Write-Host ''
Write-Host "Ish stolida 'KOINOT' ikonkasi paydo bo'ldi (Start menyusida ham bor)."
Write-Host "Diqqat: KOINOT papkasini boshqa joyga ko'chirsangiz, bu faylni qayta ishga tushiring."
