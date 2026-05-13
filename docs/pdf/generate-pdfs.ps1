# Automata PDF-generálás Chrome headless móddal
# Használat: PowerShell-ben futtasd ezt a mappából

$ErrorActionPreference = "Stop"

# Chrome keresése a gépen
$chromePaths = @(
    "${env:ProgramFiles}\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "${env:LOCALAPPDATA}\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles}\Microsoft\Edge\Application\msedge.exe",
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
)

$browser = $chromePaths | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $browser) {
    Write-Error "Nem találtam Chrome-ot / Edge-et. Telepítsd vagy nyisd meg kézzel a HTML fájlt és Ctrl+P -> Mentés PDF-ként."
    exit 1
}

Write-Host "Böngésző: $browser" -ForegroundColor Cyan

$here = Split-Path -Parent $MyInvocation.MyCommand.Definition
$files = @(
    "1_Fizetes_Elotti_Attekintes",
    "2_Sanity_CMS_Gyors_Bejaro",
    "3_Ellenorzesi_Email_Sablon"
)

foreach ($name in $files) {
    $htmlPath = Join-Path $here "$name.html"
    $pdfPath  = Join-Path $here "$name.pdf"
    $uri      = ([System.Uri]$htmlPath).AbsoluteUri

    Write-Host "-> $name.pdf" -ForegroundColor Yellow
    & $browser --headless --disable-gpu --no-margins `
        --print-to-pdf="$pdfPath" `
        --print-to-pdf-no-header `
        --no-pdf-header-footer `
        --virtual-time-budget=10000 `
        $uri | Out-Null

    if (Test-Path $pdfPath) {
        Write-Host "   OK: $pdfPath" -ForegroundColor Green
    } else {
        Write-Host "   HIBA" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Kesz! A PDF-ek a docs\pdf mappaban vannak." -ForegroundColor Green
