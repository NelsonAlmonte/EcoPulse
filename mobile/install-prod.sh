#!/bin/bash

set -e

echo "🔧 Construyendo app Ionic..."
ionic build

echo "🔄 Copiando archivos al proyecto Android (Capacitor)..."
npx cap copy android

echo "📦 Compilando APK debug..."
cd android
./gradlew assembleDebug

APK_PATH="app/build/outputs/apk/debug/app-debug.apk"

if [ -f "$APK_PATH" ]; then
  echo "📱 Instalando APK en dispositivo..."
  adb install -r "$APK_PATH"
  echo "✅ Instalación completada con éxito."
else
  echo "❌ No se encontró el APK en $APK_PATH"
fi
