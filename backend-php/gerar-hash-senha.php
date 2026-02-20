<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Gerador de Hash BCrypt</title>
    <style>
        body { font-family: Arial; padding: 20px; max-width: 800px; margin: 0 auto; background: #f5f5f5; }
        .box { background: white; padding: 20px; margin: 10px 0; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1 { color: #333; }
        code { background: #f0f0f0; padding: 10px; display: block; margin: 10px 0; word-break: break-all; font-size: 12px; }
        .password { font-weight: bold; color: #007bff; }
        .hash { color: #28a745; }
    </style>
</head>
<body>
    <h1>🔐 Gerador de Hash BCrypt</h1>
    
    <?php
    // Hash para messias123
    $senha1 = 'messias123';
    $hash1 = password_hash($senha1, PASSWORD_BCRYPT);
    
    echo "<div class='box'>";
    echo "<h2>ADMIN</h2>";
    echo "<p><span class='password'>Senha:</span> " . htmlspecialchars($senha1) . "</p>";
    echo "<p><span class='hash'>Hash BCrypt:</span></p>";
    echo "<code>" . htmlspecialchars($hash1) . "</code>";
    echo "<p><strong>SQL para atualizar:</strong></p>";
    echo "<code>UPDATE user_credentials SET password = '" . $hash1 . "' WHERE email = 'messiasmachado1976@gmail.com';</code>";
    echo "</div>";
    
    // Hash para aluno123
    $senha2 = 'aluno123';
    $hash2 = password_hash($senha2, PASSWORD_BCRYPT);
    
    echo "<div class='box'>";
    echo "<h2>ALUNO</h2>";
    echo "<p><span class='password'>Senha:</span> " . htmlspecialchars($senha2) . "</p>";
    echo "<p><span class='hash'>Hash BCrypt:</span></p>";
    echo "<code>" . htmlspecialchars($hash2) . "</code>";
    echo "<p><strong>SQL para atualizar:</strong></p>";
    echo "<code>UPDATE user_credentials SET password = '" . $hash2 . "' WHERE email = 'aluno@teste.com';</code>";
    echo "</div>";
    
    echo "<div class='box' style='background: #fff3cd; border: 2px solid #ffc107;'>";
    echo "<h2>⚠️ INSTRUÇÕES</h2>";
    echo "<ol>";
    echo "<li>Copie os 2 comandos SQL acima</li>";
    echo "<li>Execute no phpMyAdmin</li>";
    echo "<li><strong>DELETE este arquivo do servidor IMEDIATAMENTE!</strong></li>";
    echo "</ol>";
    echo "</div>";
    ?>
</body>
</html>
