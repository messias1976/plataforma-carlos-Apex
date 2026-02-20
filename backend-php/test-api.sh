#!/bin/bash
# test-api.sh - Script para testar a API PHP

API_URL="${1:-http://localhost:8000}"
echo "🧪 Testando API em: $API_URL"
echo "================================================"

# 1. Health Check
echo -e "\n✓ 1. Health Check"
curl -s "$API_URL" | jq . 2>/dev/null || echo "Falha ao conectar"

# 2. Registrar usuário
echo -e "\n✓ 2. Registrar Usuário"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"teste'$(date +%s)'@example.com",
    "password":"senha123",
    "full_name":"Usuário Teste"
  }')

echo "$REGISTER_RESPONSE" | jq .
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.token' 2>/dev/null)
echo "Token: $TOKEN"

# 3. Login
echo -e "\n✓ 3. Login"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"teste'$(date +%s)'@example.com",
    "password":"senha123"
  }')

echo "$LOGIN_RESPONSE" | jq .

# 4. Obter Profile
echo -e "\n✓ 4. Obter Profile (com token)"
if [ ! -z "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
  curl -s -X GET "$API_URL/user/profile" \
    -H "Authorization: Bearer $TOKEN" | jq .
else
  echo "⚠️  Não foi possível obter token"
fi

# 5. Listar Subjects
echo -e "\n✓ 5. Listar Subjects"
curl -s -X GET "$API_URL/subjects" | jq .

echo -e "\n================================================"
echo "✅ Testes concluídos!"
