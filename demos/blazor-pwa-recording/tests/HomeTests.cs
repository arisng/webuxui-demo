using Bunit;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using blazor_pwa_recording.Pages;
using blazor_pwa_recording.Services;
using blazor_pwa_recording.Models;
using blazor_pwa_recording.Components;

namespace blazor_pwa_recording.Tests;

public class HomeTests : BunitContext
{
    private readonly Mock<IAudioService> _audioServiceMock;

    public HomeTests()
    {
        _audioServiceMock = new Mock<IAudioService>();
        Services.AddSingleton(_audioServiceMock.Object);
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    [Fact]
    public void ClickDelete_ShowsConfirmationModal()
    {
        // Arrange
        var recordings = new List<RecordingModel>
        {
            new RecordingModel { Id = "1", DateTime = DateTime.Now, DurationMs = 5000 }
        };
        _audioServiceMock.Setup(s => s.GetRecordings()).ReturnsAsync(recordings);
        
        var cut = Render<Home>();

        // Act
        cut.Find(".delete-btn").Click();

        // Assert
        var modal = cut.FindComponent<ConfirmModal>();
        Assert.True(modal.Instance.IsVisible);
        Assert.Contains("Are you sure you want to delete this recording?", cut.Markup);
    }

    [Fact]
    public async Task ConfirmDelete_StopsPlaybackAndDeletes()
    {
        // Arrange
        var rec = new RecordingModel { Id = "1", DateTime = DateTime.Now, DurationMs = 5000, IsPlaying = true };
        var recordings = new List<RecordingModel> { rec };
        _audioServiceMock.Setup(s => s.GetRecordings()).ReturnsAsync(recordings);
        
        var cut = Render<Home>();

        // Act
        cut.Find(".delete-btn").Click();
        var modal = cut.FindComponent<ConfirmModal>();
        
        // Simulate clicking the confirm button in the modal
        await cut.InvokeAsync(() => modal.Instance.OnConfirmation.InvokeAsync(true));

        // Assert
        _audioServiceMock.Verify(s => s.StopPlayback(), Times.Once);
        _audioServiceMock.Verify(s => s.DeleteRecording("1"), Times.Once);
        Assert.DoesNotContain("recording-card", cut.Markup);
    }

    [Fact]
    public async Task CancelDelete_DoesNotDelete()
    {
        // Arrange
        var recordings = new List<RecordingModel>
        {
            new RecordingModel { Id = "1", DateTime = DateTime.Now, DurationMs = 5000 }
        };
        _audioServiceMock.Setup(s => s.GetRecordings()).ReturnsAsync(recordings);
        
        var cut = Render<Home>();

        // Act
        cut.Find(".delete-btn").Click();
        var modal = cut.FindComponent<ConfirmModal>();
        
        // Simulate clicking the cancel button in the modal
        await cut.InvokeAsync(() => modal.Instance.OnConfirmation.InvokeAsync(false));

        // Assert
        _audioServiceMock.Verify(s => s.DeleteRecording(It.IsAny<string>()), Times.Never);
        Assert.Contains("recording-card", cut.Markup);
    }
}
