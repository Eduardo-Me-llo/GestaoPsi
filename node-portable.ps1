$NodePath = "C:\Users\eduardo.de.mello\Downloads\node-v24.18.0-win-x64\node-v24.18.0-win-x64"
$NodeExe = Join-Path $NodePath "node.exe"
$NpmCmd = Join-Path $NodePath "npm.cmd"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configurando Node.js Portatil" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se o Node.js existe
if (-not (Test-Path $NodeExe)) {
    Write-Host "✗ ERRO: node.exe nao encontrado em:" -ForegroundColor Red
    Write-Host "  $NodePath" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Por favor, verifique se o caminho esta correto." -ForegroundColor Yellow
    Write-Host "Caminho informado: $NodePath" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "✓ Node.js encontrado em: $NodePath" -ForegroundColor Green

# Verificar npm
if (-not (Test-Path $NpmCmd)) {
    Write-Host "⚠ AVISO: npm.cmd nao encontrado, procurando npm..." -ForegroundColor Yellow
    $NpmCmd = Join-Path $NodePath "npm"
}

# Adicionar ao PATH temporariamente
$env:Path = "$NodePath;$env:Path"

Write-Host ""
Write-Host "Testando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = & $NodeExe --version
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "✗ ERRO: Node.js nao funciona" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "Testando npm..." -ForegroundColor Yellow
try {
    $npmVersion = & $NpmCmd --version
    Write-Host "✓ npm: v$npmVersion" -ForegroundColor Green
}
catch {
    Write-Host "✗ ERRO: npm nao funciona" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Iniciando GestaoPsi..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Acesse: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Pressione Ctrl+C para parar" -ForegroundColor Yellow
Write-Host ""

# Executar o projeto
& $NpmCmd run dev