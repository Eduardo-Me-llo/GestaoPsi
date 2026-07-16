@echo off
echo ========================================
echo   Iniciando GestãoPsi - Sistema Local
echo ========================================
echo.

echo Verificando Node.js...
where node >nul 2>nul
if errorlevel 1 (
    echo ERRO: Node.js nao encontrado no PATH!
    echo Instale o Node.js 18+ e adicione ao PATH.
    echo Acesse: https://nodejs.org/
    pause
    exit /b 1
)

echo Verificando npm...
where npm >nul 2>nul
if errorlevel 1 (
    echo ERRO: npm nao encontrado!
    echo Certifique-se de que o Node.js foi instalado corretamente.
    pause
    exit /b 1
)

echo.
echo Node.js: %node_version%
for /f "delims=" %%i in ('node --version') do set "node_version=%%i"
echo Node.js: %node_version%
for /f "delims=" %%i in ('npm --version') do set "npm_version=%%i"
echo npm: %npm_version%

echo.
echo Instalando dependencias...
call npm install
if errorlevel 1 (
    echo ERRO: Falha na instalacao das dependencias.
    pause
    exit /b 1
)

echo.
echo Iniciando servidor de desenvolvimento...
echo Aplicacao disponivel em: http://localhost:3000
echo.
call npm run dev

pause