@echo off
echo ========================================
echo   Iniciando GestaoPsi
echo ========================================
echo.

REM Verificar se o Node.js está instalado
echo Procurando Node.js...
where node >nul 2>nul
if errorlevel 1 (
    echo.
    echo Node.js não encontrado no PATH.
    echo.
    echo Solução:
    echo 1. Instale Node.js 18+ de: https://nodejs.org/
    echo 2. Durante a instalação, marque "Add to PATH"
    echo 3. Reinicie o computador
    echo.
    echo Se já instalou, tente usar o caminho completo:
    echo "C:\Program Files\nodejs\npm.cmd" run dev
    echo.
    pause
    exit /b 1
)

echo Node.js encontrado!
echo.

REM Tentar executar npm normalmente
echo Executando npm run dev...
echo Acesse: http://localhost:3000
echo Pressione Ctrl+C para parar
echo.

npm run dev

if errorlevel 1 (
    echo.
    echo Tentando com caminho completo do npm...
    echo.
    "C:\Program Files\nodejs\npm.cmd" run dev
)