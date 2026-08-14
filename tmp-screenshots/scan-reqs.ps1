$home = [IO.File]::ReadAllText('C:\Users\user\Desktop\Urlaubspanda\tmp-screenshots\req-homepage.txt')
$book = [IO.File]::ReadAllText('C:\Users\user\Desktop\Urlaubspanda\tmp-screenshots\req-booking.txt')

# Dump key section starts for homepage
$keys = @(
  'Beliebte Reiseziele','Homepage Filters','Filters must be reflected','Country Landing',
  'Filters by Destination','Deal','CTA','SEO','Open Graph','sitemap','robots','pagination',
  'review','Review','Share','sticky','Footer','Offer Detail'
)
Write-Output '==== HOMEPAGE DOC KEYS ===='
foreach ($k in $keys) {
  $i = $home.IndexOf($k)
  Write-Output ("$k => $i")
}
Write-Output ''
Write-Output '==== BOOKING DOC HEADINGS (sample chunks) ===='
# Find numbered sections / keywords
$bkeys = @(
  'Traveler','Zimmer','Nights','Calendar','Room category','Offer','Meal','Cancellation',
  'Sidebar','Mobile','Desktop','Price','Checkout','Payment','multi-room','Zimmer hinzufügen'
)
foreach ($k in $bkeys) {
  $i = $book.IndexOf($k)
  Write-Output ("$k => $i")
}

# Write middle and end samples
[IO.File]::WriteAllText('C:\Users\user\Desktop\Urlaubspanda\tmp-screenshots\req-home-mid.txt', $home.Substring(2000, [Math]::Min(4000, $home.Length-2000)))
[IO.File]::WriteAllText('C:\Users\user\Desktop\Urlaubspanda\tmp-screenshots\req-home-end.txt', $home.Substring([Math]::Max(0,$home.Length-3500)))
[IO.File]::WriteAllText('C:\Users\user\Desktop\Urlaubspanda\tmp-screenshots\req-book-start.txt', $book.Substring(0, [Math]::Min(4500, $book.Length)))
[IO.File]::WriteAllText('C:\Users\user\Desktop\Urlaubspanda\tmp-screenshots\req-book-mid.txt', $book.Substring(4500, [Math]::Min(4500, $book.Length-4500)))
Write-Output 'done'
