@echo off
REM Script para iniciar el frontend
REM Uso: Doble clic o ejecutar desde la terminal

echo ===============================================
echo 🌐 Iniciando Frontend - Next.js
echo ===============================================
echo.

REM Forzar UTF-8
chcp 65001 >nul

REM Correr el servidor
npm run dev

pause
