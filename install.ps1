# 一键安装:把本仓库的 skills 复制到 Claude Code skills 目录
param([string]$SkillsDir = "$env:USERPROFILE\.claude\skills")
New-Item -ItemType Directory -Force -Path $SkillsDir | Out-Null
Get-ChildItem "$PSScriptRoot\skills" -Directory | ForEach-Object {
  Copy-Item $_.FullName (Join-Path $SkillsDir $_.Name) -Recurse -Force
  Write-Host "✅ installed: $($_.Name)"
}
Write-Host "重启 Claude Code 会话后生效。"
