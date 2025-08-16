$coverage = dotnet reportgenerator -reports:coverage.cobertura.xml -reporttypes:TextSummary
$line = $coverage | Select-String "Line coverage:"
$coverageValue = [double]($line -split '\s+')[2].TrimEnd('%')

if ($coverageValue -lt 80) {
    Write-Error "Coverage failed: $coverageValue% is below 80% threshold"
    exit 1
}

Write-Host "Coverage passed: $coverageValue%"
