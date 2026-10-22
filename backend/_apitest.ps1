$base = "http://localhost:8081"
$RND = Get-Random -Minimum 10000 -Maximum 99999

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
    $msg = $_.Exception.Message
    if ($_.Exception.Response) {
      $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
      $msg = $reader.ReadToEnd()
    }
    return @{ ok = $false; data = $msg }
  }
}

Write-Output "=== 1. LOGIN ADMIN ==="
$admin = Call POST "/api/auth/login" @{ email = "admin@wareflow.com"; password = "Admin@123" } $null
if (-not $admin.ok) { Write-Output ("FAIL: " + $admin.data); exit 1 }
$adminToken = $admin.data.accessToken
Write-Output ("OK token=" + $adminToken.Substring(0,30) + "...")

Write-Output "=== 2. LOGIN OWNER ==="
$owner = Call POST "/api/auth/login" @{ email = "owner@wareflow.com"; password = "Owner@123" } $null
if (-not $owner.ok) { Write-Output ("FAIL: " + $owner.data); exit 1 }
$ownerToken = $owner.data.accessToken
Write-Output "OK"

Write-Output "=== 3. GET /api/me (owner) ==="
$me = Call GET "/api/me" $null $ownerToken
Write-Output ($me.data | ConvertTo-Json -Depth 5 -Compress)

Write-Output "=== 4. ADMIN khong duoc vao /api/products (expect 403) ==="
$r = Call GET "/api/products" $null $adminToken
Write-Output ("ok=" + $r.ok + " -> " + ($r.data | Out-String))

Write-Output "=== 5. OWNER khong duoc vao /api/users (expect 403) ==="
$r = Call GET "/api/users" $null $ownerToken
Write-Output ("ok=" + $r.ok + " -> " + ($r.data | Out-String))

Write-Output "=== 6. Admin lay danh sach users ==="
$r = Call GET "/api/users?size=5" $null $adminToken
Write-Output ($r.data | ConvertTo-Json -Depth 5 -Compress)

Write-Output "=== 7. Owner lay danh sach products ==="
$r = Call GET "/api/products" $null $ownerToken
Write-Output ("total=" + $r.data.totalElements)
$r.data.content | ForEach-Object { Write-Output ("  " + $_.sku + " | " + $_.name + " | stock=" + $_.stockQuantity + " | min=" + $_.minStock + " | low=" + $_.lowStock) }

Write-Output "=== 8. ADMIN tao supplier + category ==="
$r = Call POST "/api/suppliers" @{ name = "NCC Test $RND"; email = "t@t.com"; phone = "0900" } $adminToken
Write-Output ("supplier: " + ($r.data | ConvertTo-Json -Compress))
$supplierId = $r.data.id
$r = Call POST "/api/categories" @{ name = "Danh muc test $RND"; description = "mo ta" } $adminToken
Write-Output ("category: " + ($r.data | ConvertTo-Json -Compress))
$categoryId = $r.data.id

Write-Output "=== 9. ADMIN tao user ==="
$r = Call POST "/api/users" @{ email = "user$RND@wareflow.com"; fullName = "Nhan vien test"; password = "Test@123"; role = "WAREHOUSE_OWNER" } $adminToken
Write-Output ("user: " + ($r.data | ConvertTo-Json -Compress))
$userId = $r.data.id

Write-Output "=== 10. Khoa user ==="
$r = Call PATCH "/api/users/$userId/status" @{ status = "LOCKED" } $adminToken
Write-Output ("status: " + $r.data.status)
$r = Call PATCH "/api/users/$userId/status" @{ status = "ACTIVE" } $adminToken
Write-Output ("status: " + $r.data.status)

Write-Output "=== 11. OWNER tao product ==="
$r = Call POST "/api/products" @{ sku = "TEST$RND"; name = "San pham test"; categoryId = $categoryId; unit = "Cai"; price = 100000; stockQuantity = 10; minStock = 3 } $ownerToken
Write-Output ("product: " + ($r.data | ConvertTo-Json -Compress))
$productId = $r.data.id

Write-Output "=== 12. Tao phieu nhap DRAFT ==="
$r = Call POST "/api/receipts" @{ supplierId = $supplierId; items = @(@{ productId = $productId; quantity = 20 }) } $ownerToken
Write-Output ("receipt: id=" + $r.data.id + " no=" + $r.data.receiptNo + " status=" + $r.data.status)
$receiptId = $r.data.id

Write-Output "=== 13. Kiem tra ton truoc khi confirm nhap ==="
$r = Call GET "/api/products/$productId" $null $ownerToken
Write-Output ("stock truoc = " + $r.data.stockQuantity)

Write-Output "=== 14. CONFIRM phieu nhap (W6: cong ton) ==="
$r = Call POST "/api/receipts/$receiptId/confirm" $null $ownerToken
Write-Output ("status = " + $r.data.status)
$r = Call GET "/api/products/$productId" $null $ownerToken
Write-Output ("stock sau = " + $r.data.stockQuantity)

Write-Output "=== 15. Confirm lai phieu da confirm (expect 400) ==="
$r = Call POST "/api/receipts/$receiptId/confirm" $null $ownerToken
Write-Output ("ok=" + $r.ok + " -> " + ($r.data | Out-String))

Write-Output "=== 16. Tao phieu xuat DRAFT vuot ton (W9) ==="
$r = Call POST "/api/issues" @{ receiverName = "Nguyen Van A"; receiverAddress = "Ha Noi"; items = @(@{ productId = $productId; quantity = 999 }) } $ownerToken
Write-Output ("issue: id=" + $r.data.id + " status=" + $r.data.status)
$issueId = $r.data.id

Write-Output "=== 17. CONFIRM phieu xuat vuot ton (expect 400, ton khong doi) ==="
$r = Call POST "/api/issues/$issueId/confirm" $null $ownerToken
Write-Output ("ok=" + $r.ok + " -> " + ($r.data | Out-String))
$r = Call GET "/api/products/$productId" $null $ownerToken
Write-Output ("stock van = " + $r.data.stockQuantity)

Write-Output "=== 18. Sua phieu xuat thanh so luong hop le ==="
$r = Call PUT "/api/issues/$issueId" @{ receiverName = "Nguyen Van A"; receiverAddress = "Ha Noi"; items = @(@{ productId = $productId; quantity = 5 }) } $ownerToken
Write-Output ("updated ok=" + $r.ok)

Write-Output "=== 19. CONFIRM phieu xuat (W10: tru ton) ==="
$r = Call POST "/api/issues/$issueId/confirm" $null $ownerToken
Write-Output ("status = " + $r.data.status)
$r = Call GET "/api/products/$productId" $null $ownerToken
Write-Output ("stock sau = " + $r.data.stockQuantity)

Write-Output "=== 20. Tao shipment tu issue CONFIRMED ==="
$r = Call POST "/api/shipments" @{ issueId = $issueId; carrierName = "Giao Hang Nhanh"; trackingNumber = "GHN123" } $ownerToken
Write-Output ("shipment: " + ($r.data | ConvertTo-Json -Compress))
$shipmentId = $r.data.id

Write-Output "=== 21. Shipment 1-1: tao shipment thu 2 cho cung issue (expect 400) ==="
$r = Call POST "/api/shipments" @{ issueId = $issueId } $ownerToken
Write-Output ("ok=" + $r.ok + " -> " + ($r.data | Out-String))

Write-Output "=== 22. Update shipment status PENDING -> SHIPPING ==="
$r = Call PATCH "/api/shipments/$shipmentId/status" @{ status = "SHIPPING"; note = "Da gui hang" } $ownerToken
Write-Output ("status = " + $r.data.status)

Write-Output "=== 23. Update shipment SHIPPING -> COMPLETED ==="
$r = Call PATCH "/api/shipments/$shipmentId/status" @{ status = "COMPLETED" } $ownerToken
Write-Output ("status = " + $r.data.status)

Write-Output "=== 24. Update shipment sai luong (COMPLETED -> SHIPPING, expect 400) ==="
$r = Call PATCH "/api/shipments/$shipmentId/status" @{ status = "SHIPPING" } $ownerToken
Write-Output ("ok=" + $r.ok + " -> " + ($r.data | Out-String))

Write-Output "=== 25. Shipment logs ==="
$r = Call GET "/api/shipments/$shipmentId/logs" $null $ownerToken
$r.data | ForEach-Object { Write-Output ("  " + $_.fromStatus + " -> " + $_.toStatus + " : " + $_.note) }

Write-Output "=== 26. Admin stats ==="
$r = Call GET "/api/admin/stats" $null $adminToken
Write-Output ($r.data | ConvertTo-Json -Compress)

Write-Output "=== 27. Low stock filter ==="
$r = Call GET "/api/products?lowStock=true" $null $ownerToken
Write-Output ("lowStock count = " + $r.data.totalElements)
$r.data.content | ForEach-Object { Write-Output ("  " + $_.name + " stock=" + $_.stockQuantity + " min=" + $_.minStock) }

Write-Output "=== 28. Khong co token (expect 401) ==="
$r = Call GET "/api/me" $null $null
Write-Output ("ok=" + $r.ok + " -> " + ($r.data | Out-String))

Write-Output "=== 29. Change password (owner) ==="
$r = Call PATCH "/api/me/password" @{ oldPassword = "Owner@123"; newPassword = "Owner@456" } $ownerToken
Write-Output ("ok=" + $r.ok)
$r = Call POST "/api/auth/login" @{ email = "owner@wareflow.com"; password = "Owner@456" } $null
Write-Output ("login voi MK moi ok=" + $r.ok)
$r = Call POST "/api/auth/login" @{ email = "owner@wareflow.com"; password = "Owner@123" } $null
Write-Output ("login voi MK cu ok=" + $r.ok)

Write-Output "=== 30. Update profile ==="
$r = Call PUT "/api/me" @{ fullName = "Chu kho v2"; email = "owner@wareflow.com" } $ownerToken
Write-Output ("fullName = " + $r.data.fullName)

Write-Output "=== ALL DONE ==="
