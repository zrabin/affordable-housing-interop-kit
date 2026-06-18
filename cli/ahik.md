# CLI: `ahik`

`ahik` is a command-line interface pattern for developers, operators, and synthetic workflow environments.

This file describes the reference command surface.

## Commands

### `ahik validate`

Validate an object against its schema.

```bash
ahik validate examples/application-packet.example.json
```

### `ahik workflow synthetic-application`

Run a full synthetic workflow.

```bash
ahik workflow synthetic-application
```

Expected steps:

1. create synthetic household
2. create application packet
3. validate packet
4. create missing-document request
5. append status event
6. print applicant summary
7. print audit trail

### `ahik schema list`

List available schemas.

```bash
ahik schema list
```

### `ahik mcp describe`

Print MCP tool definitions.

```bash
ahik mcp describe
```

### `ahik audit inspect`

Inspect a synthetic audit trail.

```bash
ahik audit inspect synthetic-data/audit-log.example.json
```
