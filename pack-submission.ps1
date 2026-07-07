# FitTrack — arhiva aplicatie (sub 100 MB), fara a modifica proiectul sursa.
# Ruleaza din C:\FitTrack:  .\pack-submission.ps1

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$appRoot = Join-Path $root 'FitTrack'
$outDir = Join-Path $root 'FitTrack-submission-staging'
$zipPath = Join-Path $root 'FitTrack_Aplicatie_BolchisRazvan.zip'

if (-not (Test-Path $appRoot)) {
  throw "Nu gasesc folderul $appRoot"
}

$excludeDirs = @(
  'node_modules',
  'android\app\build',
  'android\build',
  'android\.gradle',
  'android\app\.cxx',
  'ios\Pods',
  'ios\build',
  'FitnessAppExpo',
  'FitnessAppClean',
  'scripts',
  '.git',
  '.idea',
  '.vscode',
  '.bundle',
  'coverage',
  'FitTrack-submission-staging'
)

$excludeFiles = @(
  'test.bundle',
  'muscleWikiUnofficialWorkouts.json',
  'INCERCARI_DEVELOPMENT.md',
  'FitTrack_Google_Interview_Prep.md',
  'Licenta_BolchisRazvan.pdf',
  'Licenta-documentatie-semifinala.pdf',
  'Bachelor_Thesis_Bolchis_Razvan.pdf'
)

function Should-Skip($relativePath) {
  $rel = $relativePath -replace '/', '\'
  foreach ($d in $excludeDirs) {
    if ($rel -like "$d\*" -or $rel -eq $d) { return $true }
  }
  $name = Split-Path $rel -Leaf
  if ($excludeFiles -contains $name) { return $true }
  if ($name -like '*.apk') { return $true }
  if ($name -like '*.aab') { return $true }
  if ($rel -like '*\build\reports\*') { return $true }
  return $false
}

Write-Host "Curat staging vechi..."
if (Test-Path $outDir) { Remove-Item $outDir -Recurse -Force }
New-Item -ItemType Directory -Path $outDir | Out-Null

Write-Host "Copiez surse (fara node_modules / build)..."
$files = Get-ChildItem $appRoot -Recurse -File -Force
$copied = 0
foreach ($f in $files) {
  $rel = $f.FullName.Substring($appRoot.Length + 1)
  if (Should-Skip $rel) { continue }
  $dest = Join-Path $outDir $rel
  $destParent = Split-Path $dest -Parent
  if (-not (Test-Path $destParent)) {
    New-Item -ItemType Directory -Path $destParent -Force | Out-Null
  }
  Copy-Item $f.FullName $dest -Force
  $copied++
}

Write-Host "README..."
$readmeCandidates = @(
  (Join-Path $appRoot 'README.md'),
  (Join-Path $root 'README.md')
)
foreach ($readmeSrc in $readmeCandidates) {
  if (Test-Path $readmeSrc) {
    Copy-Item $readmeSrc (Join-Path $outDir 'README.md') -Force
    break
  }
}

Write-Host "Folder Anexe (diagrama + screenshots)..."
$anexe = Join-Path $outDir 'Anexe'
New-Item -ItemType Directory -Path $anexe -Force | Out-Null
$anexeSources = @(
  'android\screenshots\FitTrack_Firestore_ERD.png',
  'android\screenshots\Arhitecture.png',
  'android\screenshots\FitTrack_HighLevel_Architecture.png',
  'android\screenshots\FitTrack_Client_Layered_Architecture.png',
  'firestore.rules',
  'storage.rules'
)
foreach ($rel in $anexeSources) {
  $src = Join-Path $appRoot $rel
  if (Test-Path $src) {
    Copy-Item $src (Join-Path $anexe (Split-Path $rel -Leaf)) -Force
  }
}
$screenshotsSrc = Join-Path $appRoot 'android\screenshots'
if (Test-Path $screenshotsSrc) {
  $screensDest = Join-Path $anexe 'screenshots'
  New-Item -ItemType Directory -Path $screensDest -Force | Out-Null
  Get-ChildItem $screenshotsSrc -File | Copy-Item -Destination $screensDest -Force
}

if (-not (Test-Path (Join-Path $outDir 'android\app\google-services.json'))) {
  Write-Warning 'Lipseste android\app\google-services.json — adauga-l manual in staging daca vrei demo Firebase.'
}
if (-not (Test-Path (Join-Path $outDir 'src\config\muscleWiki.local.ts'))) {
  Write-Warning 'Lipseste src\config\muscleWiki.local.ts — copiaza-l din proiectul tau (cheie API).'
}

Write-Host "Creez ZIP: $zipPath"
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Compress-Archive -Path (Join-Path $outDir '*') -DestinationPath $zipPath -CompressionLevel Optimal

$sizeMb = [math]::Round((Get-Item $zipPath).Length / 1MB, 1)
Write-Host ""
Write-Host "Gata: $zipPath"
Write-Host "Fisiere copiate: $copied | Dimensiune ZIP: $sizeMb MB"
if ($sizeMb -gt 100) {
  Write-Warning 'ZIP peste 100 MB — verifica ce a ramas inclus.'
} else {
  Write-Host 'OK pentru upload (limita 100 MB).'
}
Write-Host ""
Write-Host 'Upload separat: lucrarea = un singur PDF (nu in acest zip).'
Write-Host 'Staging ramane in FitTrack-submission-staging/ — poti sterge dupa verificare.'
