# Busca proceso por puerto y lo termina (ejecutar PowerShell como Administrador)
$port = 3000

try {
  $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction Stop
} catch {
  Write-Host "Get-NetTCPConnection no disponible o sin permisos. Ejecuta PowerShell como Administrador."
  exit 1
}

if (!$conns) {
  Write-Host "No hay procesos usando el puerto $port."
  exit 0
}

$ownerPids = $conns | Select-Object -ExpandProperty OwningProcess -Unique
foreach ($procId in $ownerPids) {
  try {
    Stop-Process -Id $procId -Force -ErrorAction Stop
    Write-Host "PID $procId detenido."
  } catch {
    Write-Host "No se pudo detener PID $procId. Ejecuta PowerShell como Administrador."
  }
}
