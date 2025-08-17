# Check if coverage file exists
$coverageFile = "coverage.cobertura.xml"
if (-not (Test-Path $coverageFile)) {
    Write-Error "Coverage file not found: $coverageFile"
    Write-Host "Searching for coverage files in the test results directory..."
    
    # Try to find the coverage file in common test result locations
    $testResultsDir = Get-ChildItem -Path "TestResults" -Directory -ErrorAction SilentlyContinue
    if ($testResultsDir) {
        $foundFile = Get-ChildItem -Path $testResultsDir.FullName -Filter "*coverage*.xml" -ErrorAction SilentlyContinue
        if ($foundFile) {
            $coverageFile = $foundFile.FullName
            Write-Host "Found coverage file: $coverageFile"
        }
    }
    
    if (-not (Test-Path $coverageFile)) {
        Write-Error "Coverage file not found in any location. Please ensure tests are run with coverage collection."
        exit 1
    }
}

# Generate coverage report
Write-Host "Generating coverage report from: $coverageFile"
$coverage = reportgenerator -reports:$coverageFile -reporttypes:TextSummary -targetdir:coverage-report

# Check if coverage report was generated
if (-not $coverage) {
    Write-Error "Failed to generate coverage report"
    exit 1
}

# Read the summary file directly
$summaryFile = "coverage-report\Summary.txt"
if (-not (Test-Path $summaryFile)) {
    Write-Error "Coverage summary file not found: $summaryFile"
    exit 1
}

$summaryContent = Get-Content -Path $summaryFile
Write-Host "Coverage report content:"
$summaryContent | ForEach-Object { Write-Host "  $_" }

# Extract coverage value using regex for more reliable parsing
$line = $summaryContent | Select-String "Line coverage:"
if (-not $line) {
    Write-Error "Could not find 'Line coverage:' in the report output"
    exit 1
}

try {
    # Use regex to extract the percentage value
    $match = [regex]::Match($line.Line, "Line coverage:\s+([\d.]+)%")
    if ($match.Success) {
        $coverageValue = [double]$match.Groups[1].Value
        Write-Host "Extracted coverage value: $coverageValue%"
    }
    else {
        Write-Error "Could not parse coverage percentage from line: $($line.Line)"
        exit 1
    }
}
catch {
    Write-Error "Failed to parse coverage value from line: $($line.Line)"
    Write-Host "Line content: $($line.Line)"
    exit 1
}

# Check coverage threshold
$threshold = 80
if ($coverageValue -lt $threshold) {
    Write-Error "Coverage failed: $coverageValue% is below $threshold% threshold"
    exit 1
}

Write-Host "Coverage passed: $coverageValue%"
