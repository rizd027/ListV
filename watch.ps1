# watch.ps1
# Script untuk memantau perubahan file dan push otomatis ke GitHub

$folder = Get-Location
$filter = '*.*' 
$fsw = New-Object IO.FileSystemWatcher $folder, $filter -Property @{
    IncludeSubdirectories = $true
    EnableRaisingEvents = $true
}

Write-Host "👀 Memantau perubahan di $folder..." -ForegroundColor Cyan
Write-Host "Tekan Ctrl+C untuk berhenti."

$action = {
    $path = $Event.SourceEventArgs.FullPath
    $changeType = $Event.SourceEventArgs.ChangeType
    $timestamp = Get-Date -Format "HH:mm:ss"
    
    # Abaikan folder .git dan node_modules
    if ($path -like "*\.git\*" -or $path -like "*\node_modules\*" -or $path -like "*\dist\*") {
        return
    }

    Write-Host "[$timestamp] Perubahan terdeteksi: $changeType pada $path" -ForegroundColor Yellow
    Write-Host "🚀 Melakukan Auto-Push..."
    
    npm run push
}

Register-ObjectEvent $fsw Changed -Action $action
Register-ObjectEvent $fsw Created -Action $action
Register-ObjectEvent $fsw Deleted -Action $action
Register-ObjectEvent $fsw Renamed -Action $action

while ($true) { Sleep 1 }
