Write-Host "Procurando Node.js instalado..." -ForegroundColor Yellow

# Locais comuns onde o Node.js pode estar instalado
$possiblePaths = @(
    "C:\Program Files\nodejs",
    "C:\Program Files (x86)\nodejs", 
    "$env:USERPROFILE\AppData\Roaming\npm",
    "$env:USERPROFILE\AppData\Local\npm",
    "$env:LOCALAPPDATA\npm"
)

$foundNode = $false

foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $nodeExe = Join-Path $path "node.exe"
        $npmCmd = Join-Path $path "npm.cmd"
        
        if (Test-Path $nodeExe) {
            Write-Host "✓ Node.js encontrado em: $path" -ForegroundColor Green
            $nodePath = $path
            $foundNode = $true
            break
        }
    }
}

if (-not $foundNode) {
    Write-Host "✗ Node.js não encontrado nos locais comuns" -ForegroundColor Red
    Write-Host "Por favor, instale o Node.js 18+ de: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Durante a instalação, marque a opção 'Add to PATH'" -ForegroundColor Yellow
    pause
    exit 1
}

# Adicionar ao PATH temporariamente
$env:Path = "$nodePath;$env:Path"

Write-Host ""
Write-Host "Testando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Erro ao executar node --version" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "Testando npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Erro ao executar npm --version" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Node.js configurado com sucesso!" -ForegroundColor Green
Write-Host "Agora você pode executar:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Perguntar se quer executar o projeto
$choice = Read-Host "Deseja iniciar o projeto agora? (S/N)"
if ($choice -eq "S" -or $choice -eq "s") {
    Write-Host ""
    Write-Host "Iniciando GestaoPsi..." -ForegroundColor Cyan
    npm run dev
}