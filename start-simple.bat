@echo off
echo ========================================
echo   GestaoPsi - Sistema Local
echo ========================================
echo.

echo Verificando Node.js...
where node >nul 2>nul
if errorlevel 1 (
    echo ERRO: Node.js nao encontrado!
    echo Baixe e instale Node.js 18+ de: https://nodejs.org/
    pause
    exit /b 1
)

echo Verificando npm...
where npm >nul 2>nul
if errorlevel 1 (
    echo ERRO: npm nao encontrado!
    echo Reinicie o computador apos instalar o Node.js
    pause
    exit /b 1
)

echo.
echo Iniciando aplicacao...
echo Acesse: http://localhost:3000
echo Pressione Ctrl+C para parar
echo.

npm run dev