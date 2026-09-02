@echo off
chcp 65001 >nul
setlocal

rem ============================================================
rem  Linkhub CC 1A - abre o site no navegador
rem
rem  Da dois cliques neste arquivo.
rem
rem  Por que nao da pra abrir o index.html direto: o site usa
rem  modulos ES, e o navegador bloqueia modulo carregado de
rem  file:// por politica de origem. A pagina ate abre, mas fica
rem  com todos os espacos vazios. Servido por HTTP funciona.
rem ============================================================

cd /d "%~dp0"

set PORTA=8000

rem ── Procura o Python ────────────────────────────────────────
set PY=
where py >nul 2>&1 && set PY=py -3
if not defined PY ( where python >nul 2>&1 && set PY=python )
if not defined PY ( where python3 >nul 2>&1 && set PY=python3 )

if not defined PY (
  echo.
  echo  Python nao encontrado neste computador.
  echo.
  echo  Instale em https://www.python.org/downloads/
  echo  marcando a caixa "Add Python to PATH" durante a instalacao.
  echo.
  echo  Alternativa sem instalar nada: abra a pasta no VS Code,
  echo  instale a extensao "Live Server" e clique em "Go Live".
  echo.
  pause
  exit /b 1
)

rem ── Se a porta estiver ocupada, tenta as seguintes ──────────
:procura_porta
netstat -ano | findstr /r /c:":%PORTA% .*LISTENING" >nul 2>&1
if not errorlevel 1 (
  set /a PORTA=%PORTA%+1
  if %PORTA% GTR 8020 (
    echo  Nao achei porta livre entre 8000 e 8020.
    pause
    exit /b 1
  )
  goto procura_porta
)

echo.
echo   Linkhub CC 1A
echo   ---------------------------------------------
echo   Servindo em  http://localhost:%PORTA%/
echo.
echo   O navegador vai abrir sozinho em instantes.
echo.
echo   Para testar outra data, acrescente na barra
echo   de endereco:  ?hoje=2026-10-13
echo.
echo   FECHE ESTA JANELA para desligar o site.
echo   ---------------------------------------------
echo.

rem Abre o navegador com um respiro para o servidor subir.
rem O ping no proprio computador serve de pausa: o "timeout" do
rem Windows recusa rodar quando a saida esta redirecionada.
start "" /b cmd /c "ping -n 3 127.0.0.1 >nul & start """" http://localhost:%PORTA%/"

%PY% -m http.server %PORTA% --bind 127.0.0.1

endlocal
