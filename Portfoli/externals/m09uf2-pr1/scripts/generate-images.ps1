Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$outputDir = Join-Path $projectRoot 'public\images'

function New-Brush([string]$color) {
    return [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($color))
}

function Save-Jpeg([System.Drawing.Bitmap]$bitmap, [string]$path, [long]$quality) {
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
        Where-Object MimeType -eq 'image/jpeg'
    $encoder = [System.Drawing.Imaging.Encoder]::Quality
    $parameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
    $parameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new($encoder, $quality)
    $bitmap.Save($path, $codec, $parameters)
    $parameters.Dispose()
}

function Draw-Poster([int]$width, [int]$height, [string]$path, [ValidateSet('Jpeg', 'Png')] [string]$format) {
    $bitmap = [System.Drawing.Bitmap]::new($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $skyRect = [System.Drawing.Rectangle]::new(0, 0, $width, $height)
    $skyTop = [System.Drawing.ColorTranslator]::FromHtml('#10345f')
    $skyBottom = [System.Drawing.ColorTranslator]::FromHtml('#f0c36b')
    $skyBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new($skyRect, $skyTop, $skyBottom, 65)
    $graphics.FillRectangle($skyBrush, $skyRect)

    $sunColor = [System.Drawing.Color]::FromArgb(230, 255, 210, 122)
    $glowColor = [System.Drawing.Color]::FromArgb(50, 255, 210, 122)
    $sunBrush = [System.Drawing.SolidBrush]::new($sunColor)
    $glowBrush = [System.Drawing.SolidBrush]::new($glowColor)
    $sunSize = [Math]::Round($width * 0.17)
    $glowSize = [Math]::Round($width * 0.26)
    $sunX = [Math]::Round($width * 0.68)
    $sunY = [Math]::Round($height * 0.08)
    $graphics.FillEllipse($glowBrush, $sunX - ($glowSize / 2), $sunY - ($glowSize / 2), $glowSize, $glowSize)
    $graphics.FillEllipse($sunBrush, $sunX - ($sunSize / 2), $sunY - ($sunSize / 2), $sunSize, $sunSize)

    $mountainBackBrush = New-Brush '#1d3a43'
    $mountainMidBrush = New-Brush '#284c4f'
    $groundBrush = New-Brush '#17281d'

    $backPoints = @(
        [System.Drawing.PointF]::new(0, $height * 0.73),
        [System.Drawing.PointF]::new($width * 0.15, $height * 0.64),
        [System.Drawing.PointF]::new($width * 0.31, $height * 0.71),
        [System.Drawing.PointF]::new($width * 0.54, $height * 0.79),
        [System.Drawing.PointF]::new($width * 0.77, $height * 0.61),
        [System.Drawing.PointF]::new($width, $height * 0.74),
        [System.Drawing.PointF]::new($width, $height),
        [System.Drawing.PointF]::new(0, $height)
    )
    $graphics.FillPolygon($mountainBackBrush, $backPoints)

    $midPoints = @(
        [System.Drawing.PointF]::new(0, $height * 0.81),
        [System.Drawing.PointF]::new($width * 0.17, $height * 0.72),
        [System.Drawing.PointF]::new($width * 0.38, $height * 0.82),
        [System.Drawing.PointF]::new($width * 0.58, $height * 0.88),
        [System.Drawing.PointF]::new($width * 0.84, $height * 0.73),
        [System.Drawing.PointF]::new($width, $height * 0.82),
        [System.Drawing.PointF]::new($width, $height),
        [System.Drawing.PointF]::new(0, $height)
    )
    $graphics.FillPolygon($mountainMidBrush, $midPoints)

    $groundPoints = @(
        [System.Drawing.PointF]::new(0, $height * 0.88),
        [System.Drawing.PointF]::new($width * 0.18, $height * 0.82),
        [System.Drawing.PointF]::new($width * 0.41, $height * 0.89),
        [System.Drawing.PointF]::new($width * 0.67, $height * 0.95),
        [System.Drawing.PointF]::new($width * 0.91, $height * 0.84),
        [System.Drawing.PointF]::new($width, $height * 0.9),
        [System.Drawing.PointF]::new($width, $height),
        [System.Drawing.PointF]::new(0, $height)
    )
    $graphics.FillPolygon($groundBrush, $groundPoints)

    $cardX = [Math]::Round($width * 0.08)
    $cardY = [Math]::Round($height * 0.15)
    $cardW = [Math]::Round($width * 0.28)
    $cardH = [Math]::Round($height * 0.53)
    $cardRect = [System.Drawing.RectangleF]::new($cardX, $cardY, $cardW, $cardH)
    $cardBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(238, 245, 234, 216))
    $shadowBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(25, 0, 0, 0))
    $graphics.FillRectangle($shadowBrush, $cardX + 14, $cardY + 18, $cardW, $cardH)
    $graphics.FillRectangle($cardBrush, $cardRect)

    $innerBrush = New-Brush '#143040'
    $graphics.FillRectangle($innerBrush, $cardX + ($cardW * 0.07), $cardY + ($cardH * 0.05), $cardW * 0.86, $cardH * 0.9)

    $titleFont = [System.Drawing.Font]::new('Georgia', [Math]::Round($width * 0.025), [System.Drawing.FontStyle]::Bold)
    $bodyFont = [System.Drawing.Font]::new('Verdana', [Math]::Round($width * 0.013))
    $titleBrush = New-Brush '#f7f0e2'
    $bodyBrush = New-Brush '#d7dde1'
    $accentPen = [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml('#e8b75a'), [Math]::Max(3, $width * 0.002))

    $graphics.DrawString('MIRADES', $titleFont, $titleBrush, $cardX + ($cardW * 0.13), $cardY + ($cardH * 0.12))
    $graphics.DrawString('DE CAPVESPRE', $titleFont, $titleBrush, $cardX + ($cardW * 0.13), $cardY + ($cardH * 0.21))
    $graphics.DrawLine($accentPen, $cardX + ($cardW * 0.13), $cardY + ($cardH * 0.31), $cardX + ($cardW * 0.64), $cardY + ($cardH * 0.31))
    $graphics.DrawString('Projecte de rendiment web', $bodyFont, $bodyBrush, $cardX + ($cardW * 0.13), $cardY + ($cardH * 0.42))
    $graphics.DrawString('Formats, mida i temps de carrega', $bodyFont, $bodyBrush, $cardX + ($cardW * 0.13), $cardY + ($cardH * 0.49))

    $circleBrush = New-Brush '#e8b75a'
    $circleSize = [Math]::Round($cardW * 0.28)
    $circleX = $cardX + ($cardW * 0.49)
    $circleY = $cardY + ($cardH * 0.57)
    $graphics.FillEllipse($circleBrush, $circleX, $circleY, $circleSize, $circleSize)

    if ($format -eq 'Jpeg') {
        Save-Jpeg $bitmap $path 84
    }
    else {
        $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    }

    $accentPen.Dispose()
    $titleFont.Dispose()
    $bodyFont.Dispose()
    $titleBrush.Dispose()
    $bodyBrush.Dispose()
    $circleBrush.Dispose()
    $cardBrush.Dispose()
    $shadowBrush.Dispose()
    $innerBrush.Dispose()
    $groundBrush.Dispose()
    $mountainMidBrush.Dispose()
    $mountainBackBrush.Dispose()
    $sunBrush.Dispose()
    $glowBrush.Dispose()
    $skyBrush.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
}

Draw-Poster 1600 1066 (Join-Path $outputDir 'poster-landscape-1600.jpg') 'Jpeg'
Draw-Poster 800 533 (Join-Path $outputDir 'poster-landscape-800.jpg') 'Jpeg'
Draw-Poster 480 320 (Join-Path $outputDir 'poster-landscape-480.png') 'Png'
Draw-Poster 900 1200 (Join-Path $outputDir 'poster-portrait-900.jpg') 'Jpeg'
Draw-Poster 450 600 (Join-Path $outputDir 'poster-portrait-450.png') 'Png'
Write-Host 'Generated image variants in public/images.'
