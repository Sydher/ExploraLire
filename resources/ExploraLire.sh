#!/bin/bash

# Get the directory where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Path to the runner
RUNNER="$DIR/exploralire-runner"

# PID file to track the runner process
PID_FILE="/tmp/exploralire-runner.pid"

# Function to cleanup on exit
cleanup() {
    if [ -f "$PID_FILE" ]; then
        RUNNER_PID=$(cat "$PID_FILE")
        if ps -p "$RUNNER_PID" > /dev/null 2>&1; then
            kill "$RUNNER_PID"
            # Wait a bit and force kill if still running
            sleep 2
            if ps -p "$RUNNER_PID" > /dev/null 2>&1; then
                kill -9 "$RUNNER_PID"
            fi
        fi
        rm -f "$PID_FILE"
    fi
}

# Set trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Check if runner exists
if [ ! -f "$RUNNER" ]; then
    osascript -e 'display dialog "Le runner n'\''a pas été trouvé à l'\''emplacement attendu" buttons {"OK"} default button "OK" with icon stop'
    exit 1
fi

# Make sure runner is executable
chmod +x "$RUNNER"

# Start the runner in background and save its PID
"$RUNNER" > /tmp/exploralire-runner.log 2>&1 &
RUNNER_PID=$!
echo $RUNNER_PID > "$PID_FILE"

# Wait a bit for the runner to start
sleep 3

# Check if the runner is still running (didn't crash on startup)
if ! ps -p "$RUNNER_PID" > /dev/null 2>&1; then
    osascript -e 'display dialog "Le runner a rencontré une erreur au démarrage. Consultez /tmp/exploralire-runner.log pour plus de détails." buttons {"OK"} default button "OK" with icon stop'
    exit 1
fi

# Show a user-friendly dialog with AppleScript that stays open
osascript <<EOF &
set dialogButton to button returned of (display dialog "ExploraLire est en cours d'exécution !

Pour accéder à l'application, ouvrez votre navigateur à l'adresse :

http://localhost:8080

Fermez cette fenêtre pour arrêter ExploraLire." buttons {"Ouvrir le navigateur", "Quitter"} default button "Ouvrir le navigateur" with title "ExploraLire" giving up after 999999)

if dialogButton is "Ouvrir le navigateur" then
    open location "http://localhost:8080"

    -- Show the dialog again after opening the browser
    display dialog "ExploraLire est en cours d'exécution !

Pour accéder à l'application, ouvrez votre navigateur à l'adresse :

http://localhost:8080

Fermez cette fenêtre pour arrêter ExploraLire." buttons {"Quitter"} default button "Quitter" with title "ExploraLire" giving up after 999999
end if
EOF

DIALOG_PID=$!

# Wait for either the dialog or the runner to finish
wait $DIALOG_PID

# When dialog is closed, cleanup will be called automatically via trap
