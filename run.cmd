@echo off
chcp 65001 >nul
echo ========================================
echo   GestaoPsi - Iniciando Sistema
echo ========================================
echo.

REM Verificar se estamos na pasta correta
if not exist "package.json" (
    echo ERRO: Nao encontrado package.json
    echo Certifique-se de estar na pasta correta
    pause
    exit /b 1
)

echo Verificando Node.js...
where node >nul 2>nul
if errorlevel 1 (
    echo.
    echo ERRO: Node.js nao encontrado no PATH
    echo.
    echo Solucao:
    echo 1. Instale Node.js 18+ de https://nodejs.org/
    echo 2. Marque "Add to PATH" durante a instalacao
    echo 3. Reinicie o computador
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set "NODE_VER=%%i"
for /f "tokens=*" %%i in ('npm --version') do set "NPM_VER=%%i"
echo Node.js: %NODE_VER%
echo npm: %NPM_VER%

echo.
echo Executando npm run dev...
echo Acesse: http://localhost:3000
echo Pressione Ctrl+C para parar
echo.

npm run dev