@echo off
setlocal ENABLEEXTENSIONS ENABLEDELAYEDEXPANSION

echo %CMDCMDLINE% | find /i "powershell.exe" >nul
if not errorlevel 1 (
    "%ComSpec%" /c "%~f0" %*
    exit /b
)
echo %CMDCMDLINE% | find /i "pwsh" >nul
if not errorlevel 1 (
    "%ComSpec%" /c "%~f0" %*
    exit /b
)
cls
echo.
echo ===========================================================================
echo                         Tests Setup
echo ===========================================================================
echo.
echo Checking for Node.js...

node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js not found - installing latest LTS automatically...
    call "%~dp0install-node-if-missing.bat"
    if errorlevel 1 (
        echo.
        echo ERROR: Could not install Node.js
        pause
        exit /b 1
    )
    echo.
    echo Node.js installed! Please CLOSE this window and run the file AGAIN.
    pause
    exit /b 0
)

for /f "delims=" %%v in ('node --version') do set NODE_VER=%%v
echo Found Node.js version: !NODE_VER!
echo.
echo Node.js is ready - continuing setup...
echo.

set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%.."

pushd "%PROJECT_ROOT%" >nul 2>&1
if errorlevel 1 (
    echo ERROR: Cannot change to project root:
    echo   %PROJECT_ROOT%
    pause
    exit /b 1
)

echo Installing npm dependencies...
echo.

if exist package-lock.json (
    npm ci
) else (
    npm install
)

if errorlevel 1 (
    echo.
    echo ERROR: npm dependency installation failed!
    popd
    pause
    exit /b 1
)

echo.
echo NPM dependencies installed successfully.
echo.
echo Installing Playwright browsers and system dependencies...
echo.

npx playwright install --with-deps
if errorlevel 1 (
    echo.
    echo ERROR: Playwright installation failed!
    popd
    pause
    exit /b 1
)

echo.
echo ===========================================================================
echo                           SETUP COMPLETE
echo ===========================================================================
echo.
echo You can now run the tests with any of these commands (from project root):
echo   npx playwright test
echo   npx playwright test --ui
echo   npx playwright test --headed
echo   npx playwright test --debug
echo.
echo All tests run in headless mode by default.
echo ===========================================================================

if "%cmdcmdline:~0,6%"=="cmd /c" (
    goto :skip_pause
)
pause >nul

:skip_pause
popd
exit /b 0
