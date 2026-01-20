namespace blazor_pwa_recording.Models;

public class RecordingModel
{
    public DateTime DateTime { get; set; }
    public double DurationMs { get; set; }
    public string? Id { get; set; }
    public bool IsPlaying { get; set; } = false;
    public double Progress { get; set; } = 0;
}