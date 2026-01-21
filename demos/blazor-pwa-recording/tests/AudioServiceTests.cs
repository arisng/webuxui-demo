using Xunit;
using Moq;
using Microsoft.JSInterop;
using blazor_pwa_recording.Services;
using blazor_pwa_recording.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace blazor_pwa_recording.Tests;

public class AudioServiceTests
{
    private readonly Mock<IJSRuntime> _jsRuntimeMock;
    private readonly AudioService _audioService;

    public AudioServiceTests()
    {
        _jsRuntimeMock = new Mock<IJSRuntime>();
        _audioService = new AudioService(_jsRuntimeMock.Object);
    }

    [Fact]
    public async Task StartRecording_CallsJsStartRecording()
    {
        // Arrange
        string calledIdentifier = null;
        _jsRuntimeMock.Setup(js => js.InvokeAsync<object>(It.IsAny<string>(), It.IsAny<object[]>()))
                      .Callback<string, object[]>((identifier, args) => calledIdentifier = identifier)
                      .ReturnsAsync((object)null);

        // Act
        await _audioService.StartRecording();

        // Assert
        Assert.Equal("AudioApp.startRecording", calledIdentifier);
    }

    [Fact]
    public async Task StopRecording_ReturnsRecordingModel()
    {
        // Arrange
        var expectedModel = new RecordingModel
        {
            Id = "test-id",
            DateTime = DateTime.Now,
            Duration = TimeSpan.FromSeconds(10)
        };
        _jsRuntimeMock.Setup(js => js.InvokeAsync<RecordingModel>("AudioApp.stopRecording", It.IsAny<object[]>()))
                      .ReturnsAsync(expectedModel);

        // Act
        var result = await _audioService.StopRecording();

        // Assert
        Assert.Equal(expectedModel.Id, result.Id);
        Assert.Equal(expectedModel.Duration, result.Duration);
        _jsRuntimeMock.Verify(js => js.InvokeAsync<RecordingModel>("AudioApp.stopRecording", It.IsAny<object[]>()), Times.Once);
    }

    [Fact]
    public async Task GetRecordings_ReturnsListOfRecordingModels()
    {
        // Arrange
        var expectedList = new List<RecordingModel>
        {
            new RecordingModel { Id = "1", DateTime = DateTime.Now, Duration = TimeSpan.FromSeconds(5) },
            new RecordingModel { Id = "2", DateTime = DateTime.Now, Duration = TimeSpan.FromSeconds(10) }
        };
        _jsRuntimeMock.Setup(js => js.InvokeAsync<List<RecordingModel>>("AudioApp.getRecordings", It.IsAny<object[]>()))
                      .ReturnsAsync(expectedList);

        // Act
        var result = await _audioService.GetRecordings();

        // Assert
        Assert.Equal(2, result.Count);
        Assert.Equal("1", result[0].Id);
        Assert.Equal("2", result[1].Id);
        _jsRuntimeMock.Verify(js => js.InvokeAsync<List<RecordingModel>>("AudioApp.getRecordings", It.IsAny<object[]>()), Times.Once);
    }

    [Fact]
    public async Task DeleteRecording_CallsJsDeleteRecording()
    {
        // Arrange
        var id = "test-id";
        string calledIdentifier = null;
        object[] calledArgs = null;
        _jsRuntimeMock.Setup(js => js.InvokeAsync<object>(It.IsAny<string>(), It.IsAny<object[]>()))
                      .Callback<string, object[]>((identifier, args) => { calledIdentifier = identifier; calledArgs = args; })
                      .ReturnsAsync((object)null);

        // Act
        await _audioService.DeleteRecording(id);

        // Assert
        Assert.Equal("AudioApp.deleteRecording", calledIdentifier);
        Assert.Equal(id, calledArgs[0]);
    }

    [Fact]
    public async Task PlayRecording_CallsJsPlayRecording()
    {
        // Arrange
        var id = "test-id";
        string calledIdentifier = null;
        object[] calledArgs = null;
        _jsRuntimeMock.Setup(js => js.InvokeAsync<object>(It.IsAny<string>(), It.IsAny<object[]>()))
            .Callback<string, object[]>((identifier, args) => { calledIdentifier = identifier; calledArgs = args; })
            .ReturnsAsync((object)null);

        // Act
        await _audioService.PlayRecording(id);

        // Assert
        Assert.Equal("AudioApp.playRecording", calledIdentifier);
        Assert.Equal(id, calledArgs[0]);
        Assert.IsType<DotNetObjectReference<AudioService>>(calledArgs[1]);
    }

    [Fact]
    public async Task StopPlayback_CallsJsStopPlayback()
    {
        // Arrange
        string calledIdentifier = null;
        _jsRuntimeMock.Setup(js => js.InvokeAsync<object>(It.IsAny<string>(), It.IsAny<object[]>()))
            .Callback<string, object[]>((identifier, args) => calledIdentifier = identifier)
            .ReturnsAsync((object)null);

        // Act
        await _audioService.StopPlayback();

        // Assert
        Assert.Equal("AudioApp.stopPlayback", calledIdentifier);
    }
}