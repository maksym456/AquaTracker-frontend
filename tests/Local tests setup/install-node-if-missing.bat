@echo off
echo.

where winget >nul 2>&1
if not errorlevel 1 (
    echo Installing Node.js via winget...
    winget install OpenJS.NodeJS.LTS -e --silent --accept-package-agreements --accept-source-agreements
    exit /b %errorlevel%
)

echo winget not available - downloading .msi manually...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ProgressPreference='SilentlyContinue';  '; ^
   $json = (Invoke-WebRequest 'https://nodejs.org/dist/index.json' -UseBasicParsing).Content | ConvertFrom-Json; ^
   $lts = $json | Where-Object lts | Select-Object -First 1; ^
   $ver = $lts.version.Substring(1); ^
   $file = 'node-v' + $ver + '-x64.msi'; ^
   $url = 'https://nodejs.org/dist/v' + $ver + '/' + $file; ^
   Write-Host 'Downloading Node.js' $ver '...'; ^
   Invoke-WebRequest $url -OutFile \"$env:TEMP\$file\"; ^
   Write-Host 'Installing...'; ^
   msiexec /i \"$env:TEMP\$file\" /quiet /norestart | Out-Null; ^
   Remove-Item \"$env:TEMP\$file\""

exit /b %errorlevel%