@echo off
chcp 65001 >nul
title KOINOT - yorliq yaratish
echo KOINOT uchun ish stoli yorlig'i yaratilmoqda...
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\yorliq.ps1"
echo.
pause
