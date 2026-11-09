@echo off
chcp 65001 >nul
title KOINOT - yorliqni olib tashlash
echo KOINOT yorliqlari olib tashlanmoqda...
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\yorliq.ps1" -Remove
echo.
pause
