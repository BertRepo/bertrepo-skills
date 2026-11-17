# Local installer. Default destination is Claude Code; -Magpie stages in ~/.agents.
[CmdletBinding()]
param(
    [string[]]$Skill = @('frontend-dev-playbook'),
    [string]$SkillsDir,
    [switch]$Magpie,
    [string]$MagpieCommand = 'magpie',
    [switch]$Force
)
$ErrorActionPreference = 'Stop'
if (-not $SkillsDir) {
    $SkillsDir = if ($Magpie) { Join-Path $env:USERPROFILE '.agents\skills' } else { Join-Path $env:USERPROFILE '.claude\skills' }
}
if ($Magpie) {
    $null = Get-Command $MagpieCommand -ErrorAction Stop
    $SharedSkills = Join-Path $env:USERPROFILE '.agents\skills'
    if ([IO.Path]::GetFullPath($SkillsDir).TrimEnd('\') -ne [IO.Path]::GetFullPath($SharedSkills).TrimEnd('\')) {
        throw '-Magpie requires the standard ~/.agents/skills destination; omit -SkillsDir.'
    }
}
# Preflight all destinations before making changes.
foreach ($Name in $Skill) {
    if ($Name -notmatch '^[a-z0-9][a-z0-9-]*$') { throw "Invalid skill name: $Name" }
    $Source = Join-Path (Join-Path $PSScriptRoot 'skills') $Name
    if (-not (Test-Path (Join-Path $Source 'SKILL.md'))) { throw "Skill not found: $Name" }
    $Destination = Join-Path $SkillsDir $Name
    if ((Test-Path $Destination) -and -not $Force) { throw "Already exists: $Destination. Use -Force to back up and update." }
}
New-Item -ItemType Directory -Force -Path $SkillsDir | Out-Null
foreach ($Name in $Skill) {
    $Source = Join-Path (Join-Path $PSScriptRoot 'skills') $Name
    $Destination = Join-Path $SkillsDir $Name
    if (Test-Path $Destination) {
        # Back up outside the skill discovery directory; no file deletion required.
        $BackupRoot = Join-Path (Split-Path $SkillsDir -Parent) 'skill-backups'
        New-Item -ItemType Directory -Force -Path $BackupRoot | Out-Null
        $Backup = Join-Path $BackupRoot ("{0}-{1}" -f $Name, [guid]::NewGuid().ToString('N'))
        Copy-Item -LiteralPath $Destination -Destination $Backup -Recurse -Force
        Write-Host "Backup: $Backup"
    }
    New-Item -ItemType Directory -Force -Path $Destination | Out-Null
    Get-ChildItem -LiteralPath $Source -Force | Copy-Item -Destination $Destination -Recurse -Force
    Write-Host "Installed: $Name -> $Destination"
    if ($Magpie) {
        $MagpieExecutable = (Get-Command $MagpieCommand -ErrorAction Stop).Source
        $MagpieProcess = Start-Process -FilePath $MagpieExecutable -ArgumentList @('library', 'skill', 'hand-over', $Name) -NoNewWindow -Wait -PassThru
        if ($MagpieProcess.ExitCode -ne 0) { throw "Magpie hand-over failed ($($MagpieProcess.ExitCode)); inspect the CLI output for the current staged/library location." }
    }
}
Write-Host 'Open a new agent session to load updated skills. Magpie users: select receiving agents in Library.'
