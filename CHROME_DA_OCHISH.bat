@echo off
setlocal
set "KOINOT_PAGE=%~dp0index.html"
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
 start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" "%KOINOT_PAGE%"
 exit /b
)
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
 start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" "%KOINOT_PAGE%"
 exit /b
)
if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" (
 start "" "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" "%KOINOT_PAGE%"
 exit /b
)
echo Chrome topilmadi. index.html faylini Chrome bilan oching.
pause
