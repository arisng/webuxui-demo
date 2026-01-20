using Microsoft.JSInterop;
using blazor_pwa_recording.Models;

namespace blazor_pwa_recording.Services;

public class AudioService : IAudioService
{
    private readonly IJSRuntime _jsRuntime;

    public AudioService(IJSRuntime jsRuntime)
    {
        _jsRuntime = jsRuntime;
    }

    public event Action? PlaybackEnded;
    public event Action<string, double> PlaybackTimeUpdate;

    [JSInvokable]
    public void OnPlaybackEnded()
    {
        PlaybackEnded?.Invoke();
    }

    [JSInvokable]
    public void OnTimeUpdate(string id, double currentTime)
    {
        PlaybackTimeUpdate?.Invoke(id, currentTime);
    }

    public async Task StartRecording()
    {
        await _jsRuntime.InvokeAsync<object>("AudioApp.startRecording");
    }

    public async Task<RecordingModel> StopRecording()
    {
        return await _jsRuntime.InvokeAsync<RecordingModel>("AudioApp.stopRecording");
    }

    public async Task<List<RecordingModel>> GetRecordings()
    {
        return await _jsRuntime.InvokeAsync<List<RecordingModel>>("AudioApp.getRecordings");
    }

    public async Task DeleteRecording(string id)
    {
        await _jsRuntime.InvokeAsync<object>("AudioApp.deleteRecording", id);
    }

    public async Task PlayRecording(string id)
    {
        await _jsRuntime.InvokeAsync<object>("AudioApp.playRecording", id, DotNetObjectReference.Create(this));
    }

    public async Task StopPlayback()
    {
        await _jsRuntime.InvokeAsync<object>("AudioApp.stopPlayback");
    }
}