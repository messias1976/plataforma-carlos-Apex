<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Teste de Autenticação</title>
    <style>
        body { font-family: Arial; padding: 20px; max-width: 800px; margin: 0 auto; }
        .box { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #007bff; }
        .ok { border-left-color: #28a745; background: #f0fff4; }
        .error { border-left-color: #dc3545; background: #fff5f5; }
        code { background: white; padding: 5px; display: block; margin: 5px 0; }
    </style>
</head>
<body>
    <h1>🔍 Teste de Autenticação</h1>
    
    <?php
    // Simular as credenciais que você enviou
    $email_teste = 'messiasmachado1976@gmail.com';
    $senha_teste = 'messias123';
    
    // Hash que foi inserido no BD
    $hash_no_bd = '$2y$10$E7jJZjKX5O/yGYqKqCZO3eN5OqBqNp4Z8LJtKQ5vkZ0KQkNqKqKqK';
    
    // Testar se o hash é válido
    $teste1 = password_verify($senha_teste, $hash_no_bd);
    
    echo "<div class='box " . ($teste1 ? "ok" : "error") . "'>";
    echo "<h2>Teste 1: Password Verify com Hash do BD</h2>";
    echo "<p>Senha: " . $senha_teste . "</p>";
    echo "<p>Hash: " . substr($hash_no_bd, 0, 20) . "...</p>";
    echo "<p>Resultado: <strong>" . ($teste1 ? "✅ VÁLIDO" : "❌ INVÁLIDO") . "</strong></p>";
    echo "</div>";
    
    // Gerar novo hash para testar
    $novo_hash = password_hash($senha_teste, PASSWORD_BCRYPT);
    $teste2 = password_verify($senha_teste, $novo_hash);
    
    echo "<div class='box ok'>";
    echo "<h2>Teste 2: Novo Hash Gerado</h2>";
    echo "<p>Novo Hash:</p>";
    echo "<code>" . $novo_hash . "</code>";
    echo "<p>Password Verify: <strong>" . ($teste2 ? "✅ VÁLIDO" : "❌ INVÁLIDO") . "</strong></p>";
    echo "<p><strong>SQL para atualizar:</strong></p>";
    echo "<code>UPDATE user_credentials SET password = '" . $novo_hash . "' WHERE email = '" . $email_teste . "';</code>";
    echo "</div>";
    
    // Testar para o aluno também
    $email_aluno = 'aluno@teste.com';
    $senha_aluno = 'aluno123';
    $novo_hash_aluno = password_hash($senha_aluno, PASSWORD_BCRYPT);
    
    echo "<div class='box ok'>";
    echo "<h2>Aluno: Novo Hash Gerado</h2>";
    echo "<p>Email: " . $email_aluno . "</p>";
    echo "<p>Senha: " . $senha_aluno . "</p>";
    echo "<p>Novo Hash:</p>";
    echo "<code>" . $novo_hash_aluno . "</code>";
    echo "<p><strong>SQL para atualizar:</strong></p>";
    echo "<code>UPDATE user_credentials SET password = '" . $novo_hash_aluno . "' WHERE email = '" . $email_aluno . "';</code>";
    echo "</div>";
    ?>
    
    <div class='box' style='background: #fff3cd; border-left-color: #ffc107;'>
        <h2>⚠️ O QUE FAZER</h2>
        <ol>
            <li>Se Teste 1 está ❌ INVÁLIDO, use o SQL do Teste 2</li>
            <li>Copie os 2 comandos SQL acima</li>
            <li>Execute no phpMyAdmin</li>
            <li>DELETE este arquivo do servidor</li>
            <li>Teste login em https://apexestudos.com</li>
        </ol>
    </div>
</body>
</html>
