@echo off
echo ==========================================
echo    GYMCONNECT - Deploy com Docker
echo ==========================================
echo.

REM Verificar se Docker está instalado
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Docker nao esta instalado!
    echo Baixe em: https://www.docker.com/get-started
    pause
    exit /b 1
)

echo [1/5] Parando containers antigos...
docker-compose down

echo.
echo [2/5] Limpando builds antigos...
docker-compose build --no-cache

echo.
echo [3/5] Iniciando containers...
docker-compose up -d

echo.
echo [4/5] Aguardando servicos iniciarem...
timeout /t 15 /nobreak >nul

echo.
echo [5/5] Verificando status...
docker-compose ps

echo.
echo ==========================================
echo          Deploy Concluido!
echo ==========================================
echo.
echo  Frontend: http://localhost
echo  Backend:  http://localhost:8080
echo  MySQL:    localhost:3308
echo.
echo Para ver logs: docker-compose logs -f
echo Para parar:    docker-compose down
echo.
echo ==========================================
pause