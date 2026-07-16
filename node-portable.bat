@echo off
echo ========================================
echo   GestaoPsi - Usando Node.js Portatil
echo ========================================
echo.

set NODE_PATH=C:\Users\eduardo.de.mello\Downloads\node-v24.18.0-win-x64\node-v24.18.0-win-x64
set NPM_PATH=%NODE_PATH%\npm.cmd

echo Verificando Node.js em: %NODE_PATH%
if not exist "%NODE_PATH%\node.exe" (
    echo ERRO: node.exe nao encontrado em %NODE_PATH%
    echo.
    echo Por favor, verifique se o caminho esta correto:
    echo C:\Users\eduardo.de.mello\Downloads\node-v24.18.0-win-x64\node-v24.18.0-win-x64
    pause
    exit /b 1
)

echo Node.js encontrado!
echo.

echo Verificando npm...
if not exist "%NPM_PATH%" (
    echo AVISO: npm.cmd nao encontrado, tentando npm...
    set NPM_PATH=%NODE_PATH%\npm
)

echo Adicionando ao PATH temporariamente...
set PATH=%NODE_PATH%;%PATH%

echo.
echo Testando Node.js...
"%NODE_PATH%\node.exe" --version
if errorlevel 1 (
    echo ERRO: Node.js nao funciona
    pause
    exit /b 1
)

echo.
echo Testando npm...
call "%NPM_PATH%" --version
if errorlevel 1 (
    echo ERRO: npm nao funciona
    pause
    exit /b 1
)

echo.
echo ========================================
echo Tudo configurado! Iniciando GestaoPsi...
echo ========================================
echo.
echo Acesse: http://localhost:3000
echo Pressione Ctrl+C para parar
echo.

call "%NPM_PATH%" run dev