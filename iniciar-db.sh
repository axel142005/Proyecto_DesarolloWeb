#!/bin/bash
# Script para iniciar la base de datos en WSL
# Uso: wsl → bash iniciar-db.sh

echo "==============================================="
echo "🐘 Iniciando PostgreSQL en Docker"
echo "==============================================="

# Iniciar Docker si no está corriendo
sudo service docker start

# Verificar si el contenedor existe
if sudo docker ps -a --format '{{.Names}}' | grep -q "^inventario_db$"; then
    # Si existe, solo iniciarlo
    echo "Contenedor encontrado, iniciando..."
    sudo docker start inventario_db
else
    # Si no existe, crearlo
    echo "Creando nuevo contenedor..."
    sudo docker run --name inventario_db \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=postgres123 \
        -e POSTGRES_DB=inventario_db \
        -p 5432:5432 \
        -d postgres:15

    # Esperar a que inicie
    echo "Esperando que PostgreSQL esté listo..."
    sleep 5

    # Ejecutar el SQL
    echo "Creando tablas..."
    sudo docker exec -i inventario_db psql -U postgres -d inventario_db < /mnt/c/Users/Usertemp/Downloads/proyecto-final/proyecto-final/inventario-backend/database/init.sql
fi

echo ""
echo "✅ Base de datos lista en localhost:5432"
sudo docker ps --filter "name=inventario_db"
