#!/bin/bash

set -e

API_PORT=3000
DASHBOARD_PORT=5173

echo "🔍 Verificando ADB..."

if ! command -v adb &> /dev/null; then
    echo "❌ adb no está instalado."
    exit 1
fi

echo "📱 Buscando dispositivo..."

DEVICE_COUNT=$(adb devices | grep -w "device" | wc -l)

if [ "$DEVICE_COUNT" -eq 0 ]; then
    echo "❌ No hay dispositivos conectados."
    echo "Ejecuta: adb devices"
    exit 1
fi

echo "✅ Dispositivo detectado."

echo "🔄 Configurando ADB Reverse..."

adb reverse tcp:$API_PORT tcp:$API_PORT
adb reverse tcp:$DASHBOARD_PORT tcp:$DASHBOARD_PORT

echo "✅ Puertos configurados:"
echo "   localhost:$API_PORT"
echo "   localhost:$DASHBOARD_PORT"

echo ""
echo "🚀 Iniciando Ionic Live Reload..."
echo ""

ionic cap run android -l --external