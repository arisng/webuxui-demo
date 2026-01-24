# Your first recording with SonicMemo

This tutorial teaches you how to set up the SonicMemo project locally, record a voice memo, and verify its offline persistence.

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- A modern web browser (Chrome or Edge recommended)
- Basic command line knowledge

## Step 1: Run the application

First, let's get the application running in development mode.

1. Open your terminal.
2. Navigate to the project root:
   ```bash
   cd demos/blazor-pwa-recording/src
   ```
3. Run the application:
   ```bash
   dotnet run
   ```
4. Open the URL provided in the terminal (usually `https://localhost:7111` or `http://localhost:5123`).

## Step 2: Record your first memo

1. On the home page, click the **Record** button.
2. Grant permission to use your microphone when prompted by the browser.
3. Speak into your microphone. You will see the visualizer or duration updating.
4. Click **Stop** to finish the recording.
5. Your recording will appear in the list below.

## Step 3: Test offline persistence

Now let's see the PWA's primary feature in action.

1. Keep the application open in your browser.
2. Go back to your terminal and stop the application by pressing `Ctrl+C`.
3. Refresh the page in your browser.
4. **Result**: Notice that the page fails to load. This is because we are in **Development mode**, and the service worker is configured to prioritize network requests for easier debugging.

## Step 4: Enable full PWA features

To experience the app as an end-user, we need to run the published version.

1. Run the automation script:
   ```bash
   ./../run-published.sh
   ```
2. Open `http://localhost:8080`.
3. Record another memo.
4. Close your browser tab.
5. Stop the script in your terminal (`Ctrl+C`).
6. Re-open your browser and go to `http://localhost:8080`.
7. **Result**: The app loads instantly even though the server is off! Your recordings are still there, persisted in the browser's IndexedDB.

## Next steps

- Explore [How to install the PWA on your phone](../../how-to/deploy/how-to-use-chrome-port-forwarding.md)
- Learn about the [Architecture behind the offline sync](../../explanation/offline-readiness.md)
