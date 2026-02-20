#!/usr/bin/env bash
set -euo pipefail

# Script para ajustar permissões do diretório de uploads
# Uso:
#   chmod +x backend-php/scripts/fix-uploads-permissions.sh
#   ./backend-php/scripts/fix-uploads-permissions.sh
#
# Variáveis opcionais:
#   UPLOAD_DIR="/caminho/para/uploads" WEB_USER="www-data" WEB_GROUP="www-data" ./backend-php/scripts/fix-uploads-permissions.sh

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
UPLOAD_DIR="${UPLOAD_DIR:-$ROOT_DIR/backend-php/uploads}"
WEB_USER="${WEB_USER:-www-data}"
WEB_GROUP="${WEB_GROUP:-www-data}"

if ! id "$WEB_USER" >/dev/null 2>&1; then
  if id "nginx" >/dev/null 2>&1; then
    WEB_USER="nginx"
    WEB_GROUP="nginx"
  fi
fi

echo "Ajustando permissões para: $UPLOAD_DIR"
echo "Usuário/grupo web: $WEB_USER:$WEB_GROUP"

if [ ! -d "$UPLOAD_DIR" ]; then
  echo "Diretório não encontrado. Criando: $UPLOAD_DIR"
  sudo mkdir -p "$UPLOAD_DIR"
fi

echo "Aplicando proprietário..."
sudo chown -R "$WEB_USER:$WEB_GROUP" "$UPLOAD_DIR"

echo "Aplicando permissões 775..."
sudo chmod -R 775 "$UPLOAD_DIR"

echo "OK: permissões de uploads ajustadas."
echo "Se necessário, reinicie o serviço web:"
echo "  sudo systemctl restart apache2"
echo "  sudo systemctl restart nginx"
