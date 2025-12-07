@echo off
REM Busca procesos que usan el puerto 3000 y mata sus PIDs

echo Buscando procesos que usan el puerto 3000...
setlocal enabledelayedexpansion
set FOUND=0

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do (
  set PID=%%a
  if defined PID (
    echo Matando PID !PID! ...
    taskkill /PID !PID! /F >nul 2>&1
    if !ERRORLEVEL! EQU 0 (
      echo PID !PID! eliminado.
      set FOUND=1
    ) else (
      echo No se pudo eliminar PID !PID! (probablemente permisos). Ejecuta como Administrador.
    )
  )
)

if "%FOUND%"=="0" (
  echo No se encontraron procesos en el puerto 3000.
)

pause
endlocal
