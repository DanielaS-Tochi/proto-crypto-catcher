# Bypass SSL certificate checks
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}

$url = "https://github.com/foundry-rs/foundry/releases/download/nightly/foundry_nightly_win32_amd64.zip"
$zipFile = "foundry.zip"
$extractPath = "foundry_bin"

Write-Host "Downloading Foundry from $url..."
try {
    Invoke-WebRequest -Uri $url -OutFile $zipFile -UseBasicParsing
} catch {
    Write-Error "Download failed: $_"
    exit 1
}

Write-Host "Extracting to $extractPath..."
if (Test-Path $extractPath) {
    Remove-Item -Path $extractPath -Recurse -Force
}
Expand-Archive -Path $zipFile -DestinationPath $extractPath -Force

Write-Host "Installation complete."
Write-Host "Binaries are in: $(Resolve-Path $extractPath)"
