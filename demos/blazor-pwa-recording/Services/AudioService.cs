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
        await _jsRuntime.InvokeAsync<object>("AudioApp.playRecording", id);
    }

    public async Task StopPlayback()
    {
        await _jsRuntime.InvokeAsync<object>("AudioApp.stopPlayback");
    }
}