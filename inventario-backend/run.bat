@echo off
REM Script para iniciar el backend
REM Uso: Doble clic o ejecutar desde la terminal

echo ===============================================
echo 🚀 Iniciando Backend - Inventario API
echo ===============================================
echo.

REM Forzar UTF-8 en Windows
chcp 65001 >nul
set PYTHONIOENCODING=utf-8
set PYTHONUTF8=1

REM Activar entorno virtual
call .venv\Scripts\activate

REM Ir a la carpeta del código
cd src\inventarioback

REM Correr el servidor
python app.py

pause
