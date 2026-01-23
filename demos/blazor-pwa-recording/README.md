# Blazor PWA Recording Demo

## Purpose

Showcase audio recording capabilities in a Progressive Web App using Blazor WebAssembly.

## Structure

- `src/`: Main Blazor application.
- `tests/`: xUnit unit tests.
- `blazor-pwa-recording.slnx`: Modern Solution File.

## Commands

- Build: `dotnet build blazor-pwa-recording.slnx`
- Run: `dotnet watch --project src/blazor-pwa-recording.csproj`
- Test: `dotnet test`

## Documentation

Using `diataxis` skill to structure documents in project's `.docs` folder.
In addition to the conventional folders defined in diataxis framework is our custom `issues` folder.

## Living Spec Workflow (MEP)

This project uses a **Minimal Evolvable Product (MEP)** spec as the living source of truth.
The MEP is kept in `.docs/issues/260122-blazor-recording-pwa-poc-mep.md` and is updated as features are delivered.

### How we evolve the MEP

- Pick a single feature from the MEP list.
- Create a dedicated issue spec in `.docs/issues/` for that feature.
- Implement the feature.
- Update the MEP with status + link to the issue + completion notes.
- Repeat for the next feature.

### Current spec files

- MEP (living spec): `.docs/issues/260122-blazor-recording-pwa-poc-mep.md`

