<!DOCTYPE html>
<html>
<head>
    <title>Gerador de Hash de Senha</title>
    <style>
        body { font-family: Arial; padding: 20px; max-width: 600px; margin: 0 auto; }
        .result { background: #f0f0f0; padding: 15px; margin: 10px 0; border-radius: 5px; }
        code { background: #fff; padding: 5px; display: block; margin: 5px 0; word-break: break-all; }
        input { padding: 8px; margin: 5px 0; width: 300px; }
        button { padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer; }
    </style>
</head>
<body>
    <h1>Gerador de Hash BCrypt</h1>
    
    <?php
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $senha = $_POST['senha'] ?? '';
        if ($senha) {
            $hash = password_hash($senha, PASSWORD_BCRYPT);
            echo "<div class='result'>";
            echo "<strong>Senha:</strong> " . htmlspecialchars($senha) . "<br><br>";
            echo "<strong>Hash BCrypt:</strong><br>";
            echo "<code>" . htmlspecialchars($hash) . "</code>";
            echo "</div>";
        }
    }
    
    // Gerar hashes para as senhas padrão
    echo "<h2>Hashes para as senhas do sistema:</h2>";
    
    echo "<div class='result'>";
    echo "<strong>Admin (messias1976):</strong><br>";
    echo "<code>" . password_hash('messias1976', PASSWORD_BCRYPT) . "</code>";
    echo "</div>";
    
    echo "<div class='result'>";
    echo "<strong>Aluno (aluno123):</strong><br>";
    echo "<code>" . password_hash('aluno123', PASSWORD_BCRYPT) . "</code>";
    echo "</div>";
    ?>
    
    <h2>Gerar hash customizado:</h2>
    <form method="POST">
        <input type="text" name="senha" placeholder="Digite a senha" required>
        <button type="submit">Gerar Hash</button>
    </form>
    
    <hr>
    <h3>Instruções:</h3>
    <ol>
        <li>Copie os hashes gerados acima</li>
        <li>No phpMyAdmin, execute o UPDATE abaixo substituindo os hashes:</li>
    </ol>
    
    <div class='result'>
        <code>
-- Atualizar senha do admin<br>
UPDATE user_credentials SET password = 'COLE_O_HASH_AQUI' WHERE email = 'messiasmachado1976@gmail.com';<br><br>
-- Atualizar senha do aluno<br>
UPDATE user_credentials SET password = 'COLE_O_HASH_AQUI' WHERE email = 'aluno@teste.com';
        </code>
    </div>
</body>
</html>
