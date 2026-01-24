# How to use Chrome Port Forwarding for Mobile PWA Testing

This guide shows you how to use Chrome's Port Forwarding feature to test the Blazor PWA on an Android device as if it were running on `localhost`.

## When to use this guide

Use this guide when you want to test PWA features on a physical mobile device but don't want to set up HTTPS certificates. Chrome treats port-forwarded traffic as a **Secure Context**, enabling:
- Service Worker registration
- "Add to Home Screen" (A2HS)
- Media APIs (Camera/Microphone)
- Offline support

## Before you start

- An Android device with **Developer Options** and **USB Debugging** enabled
- A USB data cable
- Chrome browser installed on both your computer and Android device
- The Blazor PWA running locally on your computer (e.g., via `./run-published.sh`)

## Steps

### 1. Connect your device

1. Connect your Android device to your computer via USB.
2. If prompted on the device, allow **USB Debugging** access.

### 2. Configure Port Forwarding in Chrome

1. On your computer, open Chrome and navigate to: `chrome://inspect/#devices`
2. Ensure **Discover USB devices** is checked.
3. Click the **Port forwarding...** button.
4. Add a new rule:
   - **Port**: `8080` (or the port your app is running on)
   - **IP address and port**: `localhost:8080`
5. Check **Enable port forwarding** and click **Done**.

### 3. Access the app on Mobile

1. Open Chrome on your **Android device**.
2. Navigate to `http://localhost:8080`.
3. You should see a green circle indicator in the `chrome://inspect/#devices` tab on your computer, signifying the port is successfully forwarded.

### 4. Verify PWA status

1. On your mobile Chrome, wait for a few seconds.
2. Look for the "Add to Home Screen" prompt or check the browser menu for "Install App".
3. Check the **Application** tab in Remote DevTools to verify the Service Worker is active.

## Troubleshooting

**Problem: Port forwarding indicator is red or yellow**  
Solution: Ensure the local server is actually running on your computer at the specified port. Check if another application is using port 8080.

**Problem: Device not appearing in `chrome://inspect`**  
Solution: Check your USB cable (some are "charge only"). Ensure "USB Debugging" is enabled in Android Developer Options. You may need to install OEM USB drivers on Windows.

## Related guides

- [How to publish and run the Blazor PWA locally](./how-to-publish-and-run-locally.md)
- [How to debug with HTTPS](../debug-with-https.md)

## See also

- [Chrome DevTools: Remote Debugging Android Devices](https://developer.chrome.com/docs/devtools/remote-debugging/)
- [MDN: Secure Contexts](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts)
