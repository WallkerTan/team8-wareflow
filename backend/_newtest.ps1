$base = "http://localhost:8081"

function Call($method, $path, $body, $token) {
  $headers = @{ "Content-Type" = "application/json" }
  if ($token) { $headers["Authorization"] = "Bearer $token" }
  try {
    if ($body) {
      $r = Invoke-RestMethod -Uri "$base$path" -Method $method -Headers $headers -Body ($body | ConvertTo-Json -Depth 10) -TimeoutSec 20
    } else {
      $r = Invoke-RestMethod -Uri "$base$path" -Method $method -Headers $headers -TimeoutSec 20
    }
    return @{ ok = $true; data = $r }
  } catch {
    $code = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { 0 }
    $msg = $_.Exception.Message
    if ($_.Exception.Response) {
      $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
      $msg = $reader.ReadToEnd()
    }
    return @{ ok = $false; code = $code; data = $msg }
  }
}

$admin  = (Call POST "/api/auth/login" @{ email = "admin@wareflow.com"; password = "Admin@123" } $null).data
$owner  = (Call POST "/api/auth/login" @{ email = "owner@wareflow.com"; password = "Owner@456" } $null).data
$at = $admin.accessToken
$ot = $owner.accessToken
$ar = $admin.refreshToken
$or = $owner.refreshToken

Write-Output "=== A. OWNER doc suppliers (MONG DOI: 200) ==="
$r = Call GET "/api/suppliers" $null $ot
Write-Output ("ok=" + $r.ok + " code=" + $r.code + " count=" + $(if($r.ok){$r.data.Count}else{"-"}))
Write-Output ("raw=" + ($r.data | Out-String).Substring(0, [Math]::Min(200, ($r.data | Out-String).Length)))

Write-Output "=== B. OWNER doc categories (MONG DOI: 200) ==="
$r = Call GET "/api/categories" $null $ot
Write-Output ("ok=" + $r.ok + " code=" + $r.code + " count=" + $(if($r.ok){$r.data.Count}else{"-"}))

Write-Output "=== C. OWNER TAO supplier (MONG DOI: 403) ==="
$r = Call POST "/api/suppliers" @{ name = "x" } $ot
Write-Output ("ok=" + $r.ok + " code=" + $r.code)

Write-Output "=== D. OWNER XOA category (MONG DOI: 403) ==="
$r = Call DELETE "/api/categories/1" $null $ot
Write-Output ("ok=" + $r.ok + " code=" + $r.code)

Write-Output "=== E. ADMIN doc suppliers (MONG DOI: 200) ==="
$r = Call GET "/api/suppliers" $null $at
Write-Output ("ok=" + $r.ok + " code=" + $r.code)

Write-Output "=== F. POST /api/auth/logout voi token (MONG DOI: 204) ==="
$r = Call POST "/api/auth/logout" $null $ot
Write-Output ("ok=" + $r.ok + " code=" + $r.code)

Write-Output "=== G. POST /api/auth/logout khong token (MONG DOI: 401) ==="
$r = Call POST "/api/auth/logout" $null $null
Write-Output ("ok=" + $r.ok + " code=" + $r.code)

Write-Output "=== H. refresh voi REFRESH token (MONG DOI: 200) ==="
$r = Call POST "/api/auth/refresh?refreshToken=$or" $null $null
Write-Output ("ok=" + $r.ok + " code=" + $r.code)

Write-Output "=== I. refresh voi ACCESS token (MONG DOI: 401) ==="
$r = Call POST "/api/auth/refresh?refreshToken=$ot" $null $null
Write-Output ("ok=" + $r.ok + " code=" + $r.code + " msg=" + ($r.data | Out-String))

Write-Output "=== J. refresh voi chuoi rong (MONG DOI: 401) ==="
$r = Call POST "/api/auth/refresh?refreshToken=abc" $null $null
Write-Output ("ok=" + $r.ok + " code=" + $r.code)

Write-Output "=== K. PUT product doi stockQuantity truc tiep (MONG DOI: stock KHONG doi) ==="
$prod = (Call GET "/api/products?size=1" $null $ot).data.content[0]
$before = $prod.stockQuantity
Write-Output ("product id=" + $prod.id + " sku=" + $prod.sku + " stock truoc=" + $before)
$r = Call PUT ("/api/products/" + $prod.id) @{ sku = $prod.sku; name = $prod.name; minStock = $prod.minStock; stockQuantity = 99999 } $ot
Write-Output ("put ok=" + $r.ok)
$after = (Call GET ("/api/products/" + $prod.id) $null $ot).data.stockQuantity
Write-Output ("stock sau=" + $after + "  -> " + $(if($after -eq $before){"PASS (khong doi)"}else{"FAIL (bi doi)"}))
