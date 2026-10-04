param(
    [ValidateSet('Health','StartApi','StopApi','Audit','AuditRequest')]
    [string]$Action = 'Health',
    [string]$RequestId = ''
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
$ApiPath = Join-Path $Root 'demo\mock-api'
$VenvActivate = Join-Path $ApiPath '.venv\Scripts\Activate.ps1'
$BaseUrl = 'http://localhost:8000'

function Test-BonitaApi {
    try {
        $response = Invoke-RestMethod -Uri "$BaseUrl/health" -Method Get -TimeoutSec 3
        Write-Host "FastAPI ONLINE: $($response.status)" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host 'FastAPI OFFLINE' -ForegroundColor Red
        return $false
    }
}

switch ($Action) {
    'Health' {
        [void](Test-BonitaApi)
    }

    'StartApi' {
        if (Test-BonitaApi) {
            Write-Host 'No se inició otra instancia porque el puerto 8000 ya responde.' -ForegroundColor Yellow
            break
        }

        if (!(Test-Path $VenvActivate)) {
            throw "No existe el entorno virtual: $VenvActivate. Ejecuta primero scripts/start-local.ps1 -Install."
        }

        $command = @"
Set-Location '$ApiPath'
& '$VenvActivate'
uvicorn main:app --reload --port 8000
"@
        Start-Process powershell -ArgumentList '-NoExit', '-Command', $command
        Start-Sleep -Seconds 2
        [void](Test-BonitaApi)
    }

    'StopApi' {
        $connections = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue
        if (!$connections) {
            Write-Host 'No hay ningún proceso escuchando en el puerto 8000.' -ForegroundColor Yellow
            break
        }

        $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($processId in $pids) {
            Write-Host "Deteniendo PID $processId en puerto 8000..." -ForegroundColor Yellow
            Stop-Process -Id $processId -Force
        }
        Start-Sleep -Seconds 1
        [void](Test-BonitaApi)
    }

    'Audit' {
        if (!(Test-BonitaApi)) { break }
        Invoke-RestMethod -Uri "$BaseUrl/audit" -Method Get | Format-Table request_id,user_email,system,status,external_reference,provisioned_at -AutoSize
    }

    'AuditRequest' {
        if ([string]::IsNullOrWhiteSpace($RequestId)) {
            throw 'Usa -RequestId SA-XXXXXXXX para consultar un caso concreto.'
        }
        if (!(Test-BonitaApi)) { break }
        Invoke-RestMethod -Uri "$BaseUrl/audit/$RequestId" -Method Get | Format-List
    }
}
