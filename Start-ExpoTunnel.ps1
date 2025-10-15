# Auto-generado: iniciar Expo en modo TUNNEL (con clear opcional)
param(
  [switch]\
)
Set-Location -LiteralPath 'C:\Users\riki_\Desktop\PROYECTOS\Aplicaciones\Zabdi\Prueba 2'

# Cerrar node/expo colgados (opcional)
taskkill /F /IM node.exe 2>
taskkill /F /IM expo-cli* 2>

# Instalar deps si falta node_modules
if (!(Test-Path -LiteralPath (Join-Path 'C:\Users\riki_\Desktop\PROYECTOS\Aplicaciones\Zabdi\Prueba 2' 'node_modules'))) {
  Write-Host 'Instalando dependencias...'
  npm install
}

# Preferimos npx para no depender de instalación global
if (\) {
  npx expo start --tunnel --clear
} else {
  npx expo start --tunnel
}