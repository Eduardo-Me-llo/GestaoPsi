@echo off
REM ========================================
REM   GestaoPsi - Script Universal
REM   Funciona em CMD e PowerShell
REM ========================================

setlocal

set NODE_PATH=C:\Users\eduardo.de.mello\Downloads\node-v24.18.0-win-x64\node-v24.18.0-win-x64
set NPM_CMD=%NODE_PATH%\npm.cmd

echo ========================================
echo   GestaoPsi - Iniciando Sistema
echo ========================================
echo.

echo Verificando Node.js...
if not exist "%NODE_PATH%\node.exe" (
    echo ERRO: node.exe nao encontrado!
    echo.
    echo Caminho verificado: %NODE_PATH%
    echo.
    echo Solucao:
    echo 1. Verifique se a pasta existe
    echo 2. Ou instale Node.msi de: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✓ Node.js encontrado
echo.

echo Verificando npm...
if not exist "%NPM_CMD%" (
    echo AVISO: npm.cmd nao encontrado, procurando npm...
    if exist "%NODE_PATH%\npm" (
        set NPM_CMD=%NODE_PATH%\npm
        echo ✓ npm encontrado
    ) else (
        echo ERRO: npm nao encontrado!
        echo.
        echo Verifique se o Node.js esta completo.
        pause
        exit /b 1
    )
) else (
    echo ✓ npm.cmd encontrado
)

echo.
echo Testando Node.js...
"%NODE_PATH%\node.exe" --version
if errorlevel 1 (
    echo ERRO: Node.js nao funciona
    pause
    exit /b 1
)

echo Testando npm...
call "%NPM_CMD%" --version
if errorlevel 1 (
    echo ERRO: npm nao funciona
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Tudo configurado! Iniciando...
echo ========================================
echo.
echo Acesse: http://localhost:3000
echo Pressione Ctrl+C para parar
echo.

call "%NPM_CMD%" run dev

endlocal