Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Iniciando GestaoPsi - Sistema Local" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js encontrado: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "✗ ERRO: Node.js nao encontrado no PATH!" -ForegroundColor Red
    Write-Host "Instale o Node.js 18+ e adicione ao PATH." -ForegroundColor Yellow
    Write-Host "Acesse: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Verificar npm
try {
    $npmVersion = npm --version
    Write-Host "✓ npm encontrado: v$npmVersion" -ForegroundColor Green
}
catch {
    Write-Host "✗ ERRO: npm nao encontrado!" -ForegroundColor Red
    Write-Host "Certifique-se de que o Node.js foi instalado corretamente." -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""
Write-Host "Instalando dependencias..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ ERRO: Falha na instalacao das dependencias." -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""
Write-Host "✓ Dependencias instaladas com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "Iniciando servidor de desenvolvimento..." -ForegroundColor Cyan
Write-Host "Aplicacao disponivel em: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
Write-Host ""

# Executar em modo desenvolvimento
npm run dev