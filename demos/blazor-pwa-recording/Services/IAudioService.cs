using blazor_pwa_recording.Models;

namespace blazor_pwa_recording.Services;

public interface IAudioService
{
    Task StartRecording();
    Task<RecordingModel> StopRecording();
    Task<List<RecordingModel>> GetRecordings();
    Task DeleteRecording(string id);
    Task PlayRecording(string id);
    Task StopPlayback();
}