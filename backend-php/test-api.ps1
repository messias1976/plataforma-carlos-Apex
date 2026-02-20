# test-api.ps1 - Script para testar a API PHP no Windows

param(
    [string]$ApiUrl = "http://localhost:8000"
)

Write-Host "🧪 Testando API em: $ApiUrl" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# 1. Health Check
Write-Host "`n✓ 1. Health Check" -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$ApiUrl" -Method GET
    $response.Content | ConvertFrom-Json | ConvertTo-Json | Write-Host
} catch {
    Write-Host "Falha ao conectar: $_" -ForegroundColor Red
}

# 2. Registrar usuário
Write-Host "`n✓ 2. Registrar Usuário" -ForegroundColor Green
$timestamp = [int](New-TimeSpan -Start (Get-Date "01/01/1970")).TotalSeconds
$email = "teste$timestamp@example.com"

$body = @{
    email = $email
    password = "senha123"
    full_name = "Usuário Teste"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-WebRequest -Uri "$ApiUrl/auth/register" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $body
    
    $registerData = $registerResponse.Content | ConvertFrom-Json
    $registerData | ConvertTo-Json | Write-Host
    
    $token = $registerData.data.token
    Write-Host "Token: $token" -ForegroundColor Yellow
} catch {
    Write-Host "Erro ao registrar: $_" -ForegroundColor Red
}

# 3. Obter Profile
Write-Host "`n✓ 3. Obter Profile (com token)" -ForegroundColor Green
if ($token) {
    try {
        $profileResponse = Invoke-WebRequest -Uri "$ApiUrl/user/profile" `
            -Method GET `
            -Headers @{"Authorization"="Bearer $token"}
        
        $profileResponse.Content | ConvertFrom-Json | ConvertTo-Json | Write-Host
    } catch {
        Write-Host "Erro ao obter profile: $_" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  Não foi possível obter token" -ForegroundColor Yellow
}

# 4. Listar Subjects
Write-Host "`n✓ 4. Listar Subjects" -ForegroundColor Green
try {
    $subjectsResponse = Invoke-WebRequest -Uri "$ApiUrl/subjects" -Method GET
    $subjectsResponse.Content | ConvertFrom-Json | ConvertTo-Json | Write-Host
} catch {
    Write-Host "Erro ao listar subjects: $_" -ForegroundColor Red
}

# 5. Criar Subject
Write-Host "`n✓ 5. Criar Subject (com token)" -ForegroundColor Green
if ($token) {
    $subjectBody = @{
        title = "Matemática"
        description = "Assunto de Matemática"
    } | ConvertTo-Json
    
    try {
        $createResponse = Invoke-WebRequest -Uri "$ApiUrl/subjects" `
            -Method POST `
            -Headers @{
                "Content-Type"="application/json"
                "Authorization"="Bearer $token"
            } `
            -Body $subjectBody
        
        $createResponse.Content | ConvertFrom-Json | ConvertTo-Json | Write-Host
    } catch {
        Write-Host "Erro ao criar subject: $_" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  Não foi possível obter token" -ForegroundColor Yellow
}

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "✅ Testes concluídos!" -ForegroundColor Green
